import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Websites with high-quality design-focused images
const siteInspireWebsites = [
  {
    title: "Bruno Simon Portfolio",
    description: "Interactive 3D portfolio with playful animations and WebGL effects",
    url: "https://bruno-simon.com",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop&crop=center",
    author: "Bruno Simon",
    tags: ["3D", "Interactive", "Portfolio", "Animation", "Modern"]
  },
  {
    title: "Apple AirPods Pro",
    description: "Minimalist product showcase with smooth animations and clean typography",
    url: "https://www.apple.com/airpods-pro",
    imageUrl: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=1920&h=1080&fit=crop&crop=center",
    author: "Apple",
    tags: ["Minimalistic", "Modern", "Typography", "Animation", "Dark"]
  },
  {
    title: "Stripe Dashboard",
    description: "Clean financial dashboard with excellent UX and modern design patterns",
    url: "https://dashboard.stripe.com",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop&crop=center",
    author: "Stripe",
    tags: ["Modern", "Minimalistic", "Typography", "Dark", "Interactive"]
  },
  {
    title: "Framer",
    description: "Design and prototyping platform by Framer",
    url: "https://www.framer.com",
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1920&h=1080&fit=crop&crop=center",
    author: "Framer",
    tags: ["Animation", "Interactive", "Modern", "Typography", "3D"]
  },
  {
    title: "Linear App",
    description: "Beautiful project management tool with clean design and smooth interactions",
    url: "https://linear.app",
    imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1920&h=1080&fit=crop&crop=center",
    author: "Linear",
    tags: ["Modern", "Minimalistic", "Typography", "Dark", "Interactive"]
  },
  {
    title: "Vercel Design System",
    description: "Comprehensive design system with excellent documentation and examples",
    url: "https://vercel.com/design",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&h=1080&fit=crop&crop=center",
    author: "Vercel",
    tags: ["Modern", "Typography", "Minimalistic", "Dark", "Portfolio"]
  },
  {
    title: "Notion Homepage",
    description: "Clean workspace tool with excellent typography and user-friendly design",
    url: "https://www.notion.so",
    imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1920&h=1080&fit=crop&crop=center",
    author: "Notion",
    tags: ["Modern", "Typography", "Minimalistic", "Interactive", "Portfolio"]
  },
  {
    title: "Spotify Web Player",
    description: "Music streaming platform with dark theme and vibrant accent colors",
    url: "https://open.spotify.com",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop&crop=center",
    author: "Spotify",
    tags: ["Dark", "Colorful", "Interactive", "Modern", "Animation"]
  },
  {
    title: "GitHub Homepage",
    description: "Developer platform with clean design and excellent navigation",
    url: "https://github.com",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&h=1080&fit=crop&crop=center",
    author: "GitHub",
    tags: ["Modern", "Dark", "Typography", "Minimalistic", "Interactive"]
  },
  {
    title: "Figma Design Tool",
    description: "Collaborative design platform with modern interface and smooth interactions",
    url: "https://www.figma.com",
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1920&h=1080&fit=crop&crop=center",
    author: "Figma",
    tags: ["Modern", "Interactive", "Colorful", "Animation", "Typography"]
  },
  {
    title: "Netflix Interface",
    description: "Streaming platform with dark theme and engaging visual design",
    url: "https://www.netflix.com",
    imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1920&h=1080&fit=crop&crop=center",
    author: "Netflix",
    tags: ["Dark", "Interactive", "Modern", "Animation", "Colorful"]
  },
  {
    title: "Dribbble Design Community",
    description: "Creative community platform showcasing design work with vibrant visuals",
    url: "https://dribbble.com",
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1920&h=1080&fit=crop&crop=center",
    author: "Dribbble",
    tags: ["Colorful", "Modern", "Interactive", "Portfolio", "Typography"]
  },
  {
    title: "Behance Portfolio",
    description: "Creative portfolio platform with clean design and excellent image presentation",
    url: "https://www.behance.net",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop&crop=center",
    author: "Behance",
    tags: ["Portfolio", "Modern", "Typography", "Minimalistic", "Interactive"]
  },
  {
    title: "Medium Blog Platform",
    description: "Content platform with excellent typography and reading experience",
    url: "https://medium.com",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920&h=1080&fit=crop&crop=center",
    author: "Medium",
    tags: ["Typography", "Minimalistic", "Modern", "Dark", "Interactive"]
  },
  {
    title: "Airbnb Experience",
    description: "Travel platform with beautiful imagery and intuitive user interface",
    url: "https://www.airbnb.com",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop&crop=center",
    author: "Airbnb",
    tags: ["Modern", "Interactive", "Colorful", "Typography", "Animation"]
  }
]

async function addSiteInspireWebsites() {
  try {
    console.log('Adding SiteInspire-inspired websites...')

    for (const siteData of siteInspireWebsites) {
      // Create or find tags
      const tagPromises = siteData.tags.map(tagName =>
        prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName }
        })
      )
      
      const tags = await Promise.all(tagPromises)

      // Create the site
      const site = await prisma.site.create({
        data: {
          title: siteData.title,
          description: siteData.description,
          url: siteData.url,
          imageUrl: siteData.imageUrl,
          author: siteData.author,
          tags: {
            create: tags.map(tag => ({
              tag: { connect: { id: tag.id } }
            }))
          }
        }
      })

      console.log(`Added: ${site.title}`)
    }

    console.log('Successfully added all SiteInspire-inspired websites!')
  } catch (error) {
    console.error('Error adding websites:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addSiteInspireWebsites()
