import dns from 'node:dns/promises';
import net from 'node:net';

const PRIVATE_RANGES: Array<[string, number]> = [
  ['10.0.0.0', 8],
  ['172.16.0.0', 12],
  ['192.168.0.0', 16],
  ['127.0.0.0', 8],
  ['::1', 128],
  ['fc00::', 7],
  ['fe80::', 10],
];

function ipToBuffer(ip: string, v6 = false): Buffer {
  if (v6) {
    const parts = ip.split(':').map(h => parseInt(h || '0', 16));
    return Buffer.from(parts.flatMap(n => [n >> 8, n & 0xff]));
  }
  return Buffer.from(ip.split('.').map(n => parseInt(n, 10)));
}

function compareCidr(ip: Buffer, netw: Buffer, bits: number): boolean {
  const bytes = Math.floor(bits / 8);
  const rem = bits % 8;
  if (bytes && !ip.subarray(0, bytes).equals(netw.subarray(0, bytes))) return false;
  if (!rem) return true;
  const mask = 0xff << (8 - rem);
  return (ip[bytes] & mask) === (netw[bytes] & mask);
}

function inCidr(ip: string, [cidr, bits]: [string, number]): boolean {
  if (net.isIPv4(ip) && net.isIPv4(cidr)) {
    return compareCidr(ipToBuffer(ip), ipToBuffer(cidr), bits);
  }
  if (net.isIPv6(ip) && net.isIPv6(cidr)) {
    return compareCidr(ipToBuffer(ip, true), ipToBuffer(cidr, true), bits);
  }
  return false;
}

export async function assertPublicHttpUrl(urlStr: string): Promise<void> {
  const url = new URL(urlStr);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Invalid protocol');
  }
  try {
    const { address } = await dns.lookup(url.hostname, { all: false });
    for (const range of PRIVATE_RANGES) {
      if (inCidr(address, range)) {
        throw new Error('Private IP not allowed');
      }
    }
  } catch (err: any) {
    if (err.message.includes('not allowed')) throw err;
    throw new Error(`DNS lookup failed: ${err.message}`);
  }
}

