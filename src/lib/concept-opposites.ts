/**
 * Comprehensive Concept Opposites Mapping
 * 
 * Generated from:
 * - Manual opposite pairs (from generate_opposites.ts)
 * - Semantic opposites (from embeddings with similarity < -0.1)
 * - Gemini-generated opposites (from concept generation pipeline)
 * - OpenAI-generated opposites (from concept generation pipeline)
 * - Synced from seed_concepts.json
 * 
 * This mapping is used in:
 * - Search ranking: Penalizes images with opposite tags
 * - Tag validation: Filters false positives
 * 
 * This file is automatically synced from seed_concepts.json
 * to ensure it stays aligned with the source of truth.
 */

export const CONCEPT_OPPOSITES: Record<string, string[]> = {
  '2d': ['3d', 'depth', 'dimensional', 'dynamic', 'realistic', 'solid', 'tangible', 'voluminous'], // 2D
  '3d': ['2d'], // 3D
  'abandon': ['adopt', 'attachment', 'catering', 'cherish', 'childcare', 'commitment', 'connection', 'demand', 'embrace', 'engagement', 'hotels', 'inclusion', 'journey', 'ownership', 'presence', 'remain', 'support'], // abandon
  'abandonment': ['advertising', 'attachment', 'awareness', 'commitment', 'connection', 'engagement', 'focus', 'inclusion', 'presence', 'sustenance'], // abandonment
  'abnormal': ['normal', 'normalcy'], // abnormal
  'abound': ['deplete'], // abound
  'above': ['below', 'bottom', 'down', 'lower', 'under'], // above
  'abrupt': ['gradual'], // abrupt
  'absence': ['advertising', 'attachment', 'beacon', 'completion', 'earth', 'event', 'existence', 'fullness', 'gift', 'horology', 'imprint', 'ingredients', 'involvement', 'marketing', 'materials', 'merchandise', 'metaverse', 'might', 'museum', 'nucleus', 'peak', 'point', 'present', 'pressure', 'publishing', 'recruitment', 'summit'], // Absence
  'absent': ['appearing', 'attentive', 'available', 'aware', 'connected', 'engaged', 'engaged-presence', 'existent', 'involved', 'present'], // absent
  'absolute': ['partial'], // absolute
  'absorb': ['cast', 'emit', 'splash'], // absorb
  'absorbent': ['dry', 'emissive', 'glossy', 'hard', 'impermeable', 'repellent', 'sealed', 'slick', 'smooth'], // absorbent
  'absorption': ['emission', 'expulsion', 'reflectivity'], // Absorption
  'abstinence': ['consumption'], // abstinence
  'abstract': ['annotation', 'base', 'concreteness', 'depictive', 'earthiness', 'edutainment', 'engineering', 'figurative', 'foreground', 'hyperreal', 'obtainable', 'practical', 'roots', 'solidity', 'terrain', 'verbal'], // abstract
  'abstract-non-narrative': ['storyful'], // abstract-non-narrative
  'abstracted': ['specific'], // abstracted
  'absurdity': ['sense'], // Absurdity
  'abundance': ['depletion', 'deprivation', 'hunger', 'lack', 'reduction', 'scarcity', 'sparsity', 'starve', 'strife', 'thirst', 'vacuum'], // Abundance
  'abundant': ['barren', 'meager', 'mono', 'rare'], // abundant
  'abyss': ['summit'], // Abyss
  'academia': ['foolish', 'impractical', 'naive', 'primitive', 'vulgar'], // Academia
  'academic': ['childcare', 'edutainment'], // academic
  'acausal': ['consequence'], // acausal
  'accept': ['aspire', 'confront', 'deny', 'disagree', 'dislike', 'dismiss', 'doubt', 'neglect', 'refuse', 'reject', 'resign', 'uncertain'], // accept
  'acceptance': ['denial', 'disapproval', 'dismissal', 'doubting', 'exile', 'expulsion', 'negation', 'resistance', 'ridicule', 'shame', 'shunning'], // acceptance
  'accepting': ['rejecting'], // accepting
  'access': ['denial', 'deprivation', 'lock', 'obstacle'], // Access
  'accessible': ['arduous', 'complex', 'distant', 'guarded', 'premium', 'private'], // Accessible
  'accord': ['conflict'], // accord
  'accumulation': ['dissipation', 'obliteration', 'vacuum'], // Accumulation
  'accuracy': ['mismatch'], // accuracy
  'achievable': ['chaotic', 'elusive', 'impossible', 'inaccessible', 'random', 'unattainable', 'unclear', 'vague'], // achievable
  'achievement': ['failure'], // achievement
  'acknowledge': ['dismiss', 'disregard', 'forget', 'ignore'], // acknowledge
  'acknowledged': ['disregarded', 'ignored'], // acknowledged
  'acknowledgment': ['denial'], // acknowledgment
  'action': ['hesitation', 'passivity', 'sloth'], // Action
  'activating': ['dormant', 'inert', 'lethargic', 'lethargy', 'passive', 'quiet', 'sluggish', 'static', 'still'], // activating
  'active': ['aimless', 'bored', 'complacent', 'defeated', 'delay', 'delayed', 'disinterested', 'dormant', 'expire', 'frozen', 'glacial', 'halt', 'halted', 'hushing', 'idle', 'inactive', 'laziness', 'lazy', 'lethargic', 'null', 'obsolete', 'passive', 'passive-design', 'paused', 'quiet', 'reserved', 'resigned', 'rest', 'slack', 'slacker', 'sluggish', 'static', 'still', 'stop', 'stopped', 'tired', 'unmoved', 'vacancy', 'weary'], // active
  'activity': ['dormancy', 'idleness', 'passive', 'passivity', 'slowness'], // Activity
  'actual': ['fictional', 'retrofuturism'], // actual
  'adaptability': ['constancy', 'inflexibility', 'monotony', 'rigidity', 'sameness', 'stagnation', 'uniformity'], // Adaptability
  'adaptable': ['backward'], // adaptable
  'adaptation': ['fixation', 'premium', 'resistance'], // Adaptation
  'adding': ['erasing'], // adding
  'admiration': ['aversion', 'contempt', 'disdain', 'disregard', 'hate', 'indifference', 'neglect', 'ridicule', 'scorn'], // admiration
  'admire': ['contempt', 'despise', 'disdain', 'dislike', 'dismiss', 'disregard', 'neglect', 'reject', 'scorn', 'unfavor'], // Admire
  'admiring': ['apathy', 'contempt', 'disdain', 'disdainful', 'dismissal', 'indifference', 'neglect'], // admiring
  'adopt': ['abandon', 'discard', 'ignore', 'neglect', 'refuse', 'reject', 'resist', 'suppress'], // Adopt
  'adorned': ['bare', 'bare-heads', 'dull', 'lack', 'plain', 'simple', 'sparse'], // adorned
  'adult': ['childlike'], // adult
  'adult-services': ['childcare'], // adult-services
  'adulting': ['carefree', 'casual', 'childhood', 'fun', 'messy', 'naive', 'simple', 'spontaneous'], // adulting
  'advance': ['hinder', 'past', 'regress', 'retreat', 'stuck'], // advance
  'advanced': ['amateur', 'primitive'], // advanced
  'advancement': ['backward'], // Advancement
  'adventurous': ['boring', 'cautious', 'dull', 'mundane', 'predictable', 'routine', 'safe', 'static'], // Adventurous
  'advertising': ['abandonment', 'absence', 'disregard', 'distraction', 'ignored', 'invisibility', 'neglect', 'silence', 'unseen', 'void'], // Advertising
  'aerial': ['root', 'submerged'], // Aerial
  'aero': ['cluttered', 'dense', 'grounded', 'heavy', 'solid'], // Aero
  'aerodynamic': ['awkward', 'boxy', 'bulky', 'clunky', 'cumbersome', 'heavy', 'inefficient', 'rough', 'slow', 'stagnant', 'unwieldy'], // Aerodynamic
  'aerospace': ['marine'], // aerospace
  'aesthetic': ['grotesque'], // aesthetic
  'aesthetics': ['basic', 'blandness', 'chaos', 'clutter', 'disorder', 'dullness', 'functionality', 'gritty', 'messiness', 'practicality', 'ugliness', 'utility'], // Aesthetics
  'aether': ['chaos', 'dull', 'earth', 'gloom', 'heaviness', 'mundane', 'solid', 'sorrow', 'terrestrial'], // Aether
  'affected': ['unmoved'], // affected
  'affection': ['alienation', 'aversion', 'contempt', 'detachment', 'disdain', 'hostility', 'indifference', 'neglect', 'rejection', 'scorn', 'shunning'], // affection
  'affirm': ['deny', 'dismiss', 'disregard', 'doubt', 'erase', 'ignore', 'neglect', 'refute', 'reject', 'rejecting'], // Affirm
  'affirmation': ['doubting', 'negation'], // affirmation
  'affirmative': ['delay', 'disapproval', 'dismissive'], // affirmative
  'affluence': ['dirt'], // Affluence
  'aftermath': ['beginning', 'clear', 'fresh', 'intact', 'new', 'origin', 'pure', 'whole'], // Aftermath
  'aged': ['youthfulness'], // aged
  'agency': ['disempowerment', 'passivity'], // Agency
  'aggregate': ['dispersed', 'distinct', 'fragmented', 'individual', 'isolated', 'scattered', 'segregated', 'specific', 'unique'], // Aggregate
  'aggressive': ['calm', 'gentle', 'gentle-expression', 'passive', 'peaceful', 'quiet', 'serene', 'soft', 'subdued'], // aggressive
  'agitated': ['calm', 'chill', 'easy', 'gentle', 'mellow', 'peaceful', 'relaxed', 'serene', 'smooth', 'tranquil'], // agitated
  'agitation': ['calm', 'complacent-serenity', 'composure', 'ease', 'peace', 'quiet', 'relaxation', 'rest', 'serenity', 'stillness', 'tranquility'], // agitation
  'agony': ['bliss', 'calm', 'comfort', 'ease', 'happiness', 'joy', 'peace', 'serenity'], // agony
  'agree': ['resign'], // agree
  'agreeable': ['defiant'], // agreeable
  'agreement': ['conflict', 'contradiction', 'disapproval', 'disunity', 'resistance'], // agreement
  'agriculture': ['manufacturing'], // agriculture
  'aimless': ['active', 'aware', 'bright', 'clear', 'engaged', 'focused', 'intent', 'intentional', 'purposeful'], // aimless
  'airiness': ['density', 'heaviness', 'solid', 'weight', 'weightiness'], // airiness
  'airy': ['blocky', 'boxy', 'concrete', 'confining', 'constrict', 'viscous', 'weighty', 'wire'], // airy
  'alert': ['apathetic', 'blind', 'complacent', 'dormant', 'oblivious', 'shallow', 'sluggish', 'tired'], // alert
  'alien': ['common', 'earthiness', 'earthy', 'familiar', 'friendly', 'local', 'mundane', 'native', 'ordinary', 'terrestrial'], // alien
  'alienated': ['embraced', 'genuineness', 'user-centric'], // alienated
  'alienation': ['affection', 'attachment', 'belonging', 'closeness', 'connect', 'connection', 'embrace', 'engagement', 'fandom', 'humanism', 'inclusion', 'intimacy', 'togetherness', 'unity'], // alienation
  'align': ['chaos', 'disarray', 'disorder', 'disrupt', 'diverge', 'random', 'scatter', 'separate', 'split'], // Align
  'aligned': ['disparate', 'tangle'], // aligned
  'alignment': ['conflict', 'mismatch'], // Alignment
  'alive': ['dead', 'defeated', 'despairing', 'dormant', 'drained', 'dry', 'empty', 'glacial', 'haunting', 'hollow', 'inactive', 'lifeless', 'numb', 'shrivel', 'stagnant', 'vacancy', 'void', 'wilt'], // alive
  'alluring': ['bland', 'dull', 'garish', 'mundane', 'repulsive', 'tacky', 'unappealing', 'uninspiring'], // alluring
  'aloof': ['empathetic', 'engaged'], // Aloof
  'aloofness': ['attachment'], // aloofness
  'altered': ['untouched'], // altered
  'alternative': ['mainstream'], // alternative
  'altruism': ['greed'], // altruism
  'amateur': ['advanced', 'competent', 'expert', 'masterful', 'polished', 'professional', 'refined', 'skilled', 'technic', 'typecraft', 'watchmaking'], // amateur
  'ambiguity': ['annotation', 'calculation', 'context', 'definition', 'depiction', 'gesture', 'integrity', 'interpretation', 'meaning', 'objectivity', 'outlining', 'resolve', 'sense', 'statement'], // ambiguity
  'ambiguous': ['apparent', 'certain', 'charted', 'decisive', 'definite', 'distinct', 'exact', 'explicit', 'identified', 'instant', 'labeled', 'obvious', 'outward', 'practical', 'reachable', 'resolved', 'specific', 'straightforward', 'symbolism'], // ambiguous
  'ambition': ['laziness'], // Ambition
  'ambitious': ['slacker'], // ambitious
  'amorphous': ['formed'], // Amorphous
  'amplification': ['diminution', 'reduction'], // amplification
  'amplify': ['dampen', 'diminish', 'lessen', 'muffle', 'mute', 'quiet', 'reduce', 'shrink', 'subdue', 'suppress', 'weaken'], // amplify
  'amplifying': ['dimming', 'hushing', 'muting', 'suppressing'], // amplifying
  'amplitude': ['petiteness'], // amplitude
  'analog': ['fintech', 'metaverse', 'postdigital', 'technographic', 'xr'], // analog
  'analog-experience': ['automated'], // analog-experience
  'analogous': ['divergent'], // Analogous
  'analogue': ['edtech'], // analogue
  'analysis': ['fuzz'], // Analysis
  'analytics': ['chaos', 'disorder', 'guesswork', 'haphazard', 'ignorance', 'instinct', 'intuition', 'negligence', 'qualitative', 'randomness', 'subjective', 'subjectivity'], // Analytics
  'anarchic': ['coherent', 'conformist', 'controlled', 'disciplined', 'harmonious', 'orderly', 'regulated', 'stable', 'structured'], // anarchic
  'anarchy': ['ascendancy', 'command', 'consensus', 'consulting', 'dentistry', 'obedience', 'scholarship', 'sovereignty'], // anarchy
  'anchor': ['wander', 'waver'], // anchor
  'anchored': ['lost', 'mobility', 'shifting', 'unsettled', 'wandering'], // Anchored
  'anchoring': ['fleeing', 'forgetting'], // anchoring
  'ancient': ['contemporary', 'current', 'fresh', 'futurism', 'innovative', 'modern', 'new', 'novel', 'techno-futurism', 'trendy'], // ancient
  'angle': ['loop'], // angle
  'anguish': ['bliss', 'calm', 'comfort', 'ease', 'happiness', 'joy', 'pleasure', 'serenity', 'tranquility'], // anguish
  'angular': ['curvy', 'round'], // angular
  'angular-form': ['round'], // angular-form
  'angularity': ['curved', 'rounded', 'smooth', 'soft'], // Angularity
  'animated': ['apathetic', 'dispassionate', 'dullard', 'lifeless', 'static', 'unmoved'], // Animated
  'animation': ['boredom'], // animation
  'annotation': ['abstract', 'ambiguity', 'chaos', 'confusion', 'disconnection', 'implicit', 'undocumented', 'unlabeled'], // Annotation
  'annoyed': ['pleased'], // annoyed
  'anomaly': ['archetype', 'consistency', 'normalcy', 'order', 'predictability', 'regularity', 'routine', 'standard', 'uniformity'], // anomaly
  'anonymity': ['fame', 'milestone', 'premium', 'publicity', 'recognition'], // Anonymity
  'anonymous': ['famous', 'identified', 'known', 'premium'], // Anonymous
  'anti': ['calm', 'commercial-aesthetics', 'harmonious', 'orderly', 'pro', 'sane', 'structured'], // anti
  'anti-form': ['formed'], // anti-form
  'anticipation': ['disillusion', 'settled', 'sudden', 'surprise'], // Anticipation
  'antiquity': ['youthfulness'], // antiquity
  'anxiety': ['relaxation', 'safety'], // Anxiety
  'anxious': ['assured', 'calm', 'carefree', 'content', 'peaceful', 'reassuring', 'relaxed', 'secure', 'steady'], // anxious
  'apathetic': ['alert', 'animated', 'aspirant', 'empathetic', 'engaged', 'enthusiastic', 'excited', 'passionate', 'responsive', 'vibrant'], // apathetic
  'apathy': ['admiring', 'assertiveness', 'awakening', 'belief', 'cherishing', 'engage', 'exuberance', 'fandom', 'fervor', 'humanism', 'hype', 'kindness', 'participation', 'passion', 'respect', 'self-expression', 'stimulation', 'veneration', 'zeal'], // apathy
  'apex': ['base', 'common', 'dull', 'flat', 'lowly', 'naive', 'pit', 'plain', 'simplicity'], // Apex
  'apparel': ['jewelry'], // apparel
  'apparent': ['ambiguous', 'concealed', 'covert', 'fuzzy', 'hidden', 'indistinct', 'invisible', 'obscure', 'obscured', 'uncertain', 'vague'], // apparent
  'appealing': ['repellent', 'repelling'], // appealing
  'appear': ['disappear'], // appear
  'appearing': ['absent', 'disappearing', 'dormant', 'hiding', 'inactive', 'null', 'unseen', 'vanishing'], // appearing
  'applied': ['theoretical'], // applied
  'appreciate': ['aversion', 'disdain', 'dislike', 'dismiss', 'disregard', 'indifference', 'neglect', 'rejecting', 'scorn', 'unfavor'], // Appreciate
  'appreciated': ['unvalued'], // appreciated
  'appreciation': ['disapproval'], // appreciation
  'appreciative': ['dismissive'], // appreciative
  'approach': ['evade'], // approach
  'approval': ['chaos', 'critique', 'disapproval', 'dislike', 'displeasure', 'dissatisfaction', 'failure', 'instability', 'rejecting', 'rejection', 'scorn', 'shame', 'uncertainty', 'unpredictable'], // approval
  'aqueous': ['dry'], // Aqueous
  'arbitrary': ['coherent', 'consequence', 'deliberate', 'intentional', 'methodical', 'ordered', 'procedural', 'rational', 'structured', 'systematic', 'type'], // arbitrary
  'arcade': ['minimal', 'quiet', 'serene', 'static', 'subdued'], // Arcade
  'arch': ['collapse'], // Arch
  'archaic': ['current', 'fresh', 'minimal', 'modern', 'novel', 'simple', 'sleek', 'trendy'], // archaic
  'archetype': ['anomaly', 'variant'], // Archetype
  'archival': ['mutable'], // Archival
  'arduous': ['accessible', 'casual', 'convenience', 'easy', 'effortless', 'light', 'pleasant', 'simple', 'smooth'], // arduous
  'arid': ['fertile', 'foliage', 'oceanic'], // Arid
  'armored': ['bare', 'exposed', 'fragile', 'open', 'soft', 'undefended', 'vulnerability', 'vulnerable', 'weak'], // armored
  'arranged': ['disorderly'], // arranged
  'arrival': ['fleeing'], // arrival
  'arrive': ['disappear', 'wander'], // arrive
  'arrogant': ['humble'], // arrogant
  'art': ['banal', 'bland', 'commodity', 'dull', 'haphazard', 'lack', 'mundane'], // Art
  'artful': ['artless'], // artful
  'articulate': ['illiterate', 'nonverbal'], // articulate
  'artifact': ['current', 'dynamic', 'fluid', 'fresh', 'modern', 'novel', 'organic', 'synthetic', 'transient', 'vivid'], // Artifact
  'artifice': ['earth', 'genuineness'], // Artifice
  'artificial': ['authentic', 'bio', 'biomorphic', 'earthen', 'earthiness', 'genuine', 'genuineness', 'natural', 'real', 'terrain'], // artificial
  'artificiality': ['earthiness'], // artificiality
  'artisanal': ['factory', 'massproduced', 'technographic'], // Artisanal
  'artistic': ['commercial', 'mechanic', 'mechanical'], // Artistic
  'artistry': ['tacky'], // Artistry
  'artless': ['artful', 'complex', 'deliberate', 'detailed', 'intentional', 'refined', 'sophisticated', 'structured', 'utility-design'], // artless
  'artnouveau': ['techno-futurism'], // artnouveau
  'arts': ['engineering'], // arts
  'artsy': ['mainstream'], // artsy
  'ascend': ['descend', 'low', 'lower', 'plummet', 'plunge', 'regress'], // ascend
  'ascendancy': ['anarchy', 'chaos', 'collapse', 'decline', 'disorder', 'failure', 'fall', 'grounded', 'loss', 'submersion'], // Ascendancy
  'ascension': ['fall'], // Ascension
  'ascent': ['descent'], // Ascent
  'asleep': ['awake'], // asleep
  'aspirant': ['apathetic', 'defeated', 'heavy', 'resigned'], // Aspirant
  'aspiration': ['heavy', 'mediocre'], // Aspiration
  'aspire': ['accept', 'heavy', 'resign', 'settle'], // Aspire
  'assemble': ['disassemble', 'disband', 'discard', 'disperse', 'divide'], // assemble
  'assembly': ['dissipation'], // Assembly
  'assert': ['retreat', 'vacate', 'waver'], // assert
  'assertion': ['erasure', 'passivity', 'submission'], // Assertion
  'assertive': ['hesitant', 'passive', 'resigned', 'shy', 'subduing', 'timid', 'vacant'], // assertive
  'assertiveness': ['apathy', 'hesitation', 'indecision', 'insecurity', 'meekness', 'passivity', 'submissiveness', 'timidity', 'weakness'], // Assertiveness
  'assurance': ['doubt', 'doubting', 'risk', 'warning'], // assurance
  'assured': ['anxious', 'doubtful'], // assured
  'asymmetrical': ['balance', 'boxy', 'centered', 'centrality', 'symmetry'], // Asymmetrical
  'asymmetry': ['concentricity', 'rows'], // Asymmetry
  'asynchronous': ['synchronized'], // asynchronous
  'athlete': ['couch', 'inactive', 'lazy', 'lethargic', 'sluggish'], // Athlete
  'attach': ['detach'], // attach
  'attached': ['detached'], // attached
  'attachment': ['abandon', 'abandonment', 'absence', 'alienation', 'aloofness', 'detachment', 'disconnection', 'expulsion', 'indifference', 'neglect', 'separation', 'void'], // attachment
  'attack': ['retreat'], // attack
  'attention': ['disregard', 'negligence', 'sloppiness'], // Attention
  'attentive': ['absent', 'careless', 'distracted', 'oblivious', 'selfish'], // attentive
  'attract': ['regress'], // attract
  'attracting': ['disengaging', 'dull', 'invisible', 'repelling', 'repelling-hues'], // Attracting
  'attraction': ['aversion', 'boredom', 'detachment', 'disinterest', 'indifference', 'neglect', 'rejection', 'repulsion'], // attraction
  'attractive': ['bland', 'deterring', 'drab', 'dull', 'mundane', 'ordinary', 'repellent', 'repulsive', 'ugly', 'unappealing'], // attractive
  'attrition': ['recruitment'], // attrition
  'atypical': ['common'], // atypical
  'audacious': ['cautious'], // audacious
  'augmentation': ['depletion', 'diminution'], // Augmentation
  'authentic': ['artificial', 'deceptive', 'fabricated', 'facade', 'fake', 'false', 'falsehood', 'fraudulent', 'imperfect', 'insincere', 'pretentious', 'racket', 'simulacrum', 'simulated', 'superficial'], // authentic
  'authenticity': ['disguise', 'facade'], // Authenticity
  'authoritative': ['gentle', 'irreverent', 'muted', 'subtlety', 'text', 'type', 'unruly'], // Authoritative
  'authorship': ['premium'], // Authorship
  'automated': ['analog-experience', 'chaotic', 'human', 'imperfect', 'manual', 'natural', 'organic', 'random', 'spontaneous'], // Automated
  'automation': ['premium', 'recruitment', 'typecraft'], // Automation
  'automotive': ['manual', 'pedestrian'], // Automotive
  'autonomy': ['collectivism', 'dependence', 'submission'], // Autonomy
  'available': ['absent'], // available
  'avant-garde': ['classicism', 'retrofuturism'], // avant-garde
  'avatar': ['individual', 'premium', 'real'], // Avatar
  'average': ['elite', 'exceptional', 'uniqueness'], // average
  'aversion': ['admiration', 'affection', 'appreciate', 'attraction', 'demand', 'favor', 'pleasure', 'veneration'], // aversion
  'avoid': ['confront'], // avoid
  'awake': ['asleep', 'drowsy', 'night', 'unaware'], // Awake
  'awakening': ['apathy', 'delusion', 'dormancy', 'dullness', 'ignorance', 'inattention', 'sleeping', 'slumber', 'stagnation', 'unaware'], // Awakening
  'aware': ['absent', 'aimless', 'blind', 'clueless', 'complacent', 'distracted', 'fumble', 'illiterate', 'mindless', 'nowhere', 'oblivious', 'shallow'], // aware
  'awareness': ['abandonment', 'blackout', 'blindness', 'ignorance', 'negligence', 'oblivion', 'premium'], // Awareness
  'awe': ['heavy', 'playful'], // Awe
  'awkward': ['aerodynamic', 'clear', 'coherent', 'confident', 'coolness', 'familiar', 'graceful', 'harmonious', 'intentional', 'polished', 'skillful', 'smooth'], // awkward
  'awkwardness': ['clarity', 'confidence', 'ease', 'grace', 'harmony', 'poise', 'refinement', 'simplicity'], // awkwardness
  'axis': ['chaos', 'disorder', 'fluid', 'freeform', 'irregular', 'random', 'scattered', 'unstructured'], // Axis
  'background': ['foreground'], // background
  'backward': ['adaptable', 'advancement', 'behavioral', 'confident', 'ease', 'fluid', 'forward', 'progress', 'soft'], // backward
  'baked': ['unformed'], // Baked
  'bakery': ['bitter', 'chaotic', 'disorderly', 'dry', 'durables', 'harsh', 'mining', 'raw', 'savory', 'software', 'sour'], // Bakery
  'balance': ['asymmetrical', 'based', 'complication', 'conflict', 'disorder', 'turmoil'], // Balance
  'balanced': ['discordant', 'jarring', 'uneven'], // balanced
  'banal': ['art', 'bold', 'dynamic', 'exciting', 'expressive', 'innovative', 'original', 'stellar', 'unique', 'vibrant'], // banal
  'banality': ['gravitas'], // banality
  'bare': ['adorned', 'armored', 'cosmetics', 'covered', 'curtained', 'decorated', 'elaborate', 'eyewear', 'filled', 'full', 'garnish', 'plump', 'shielded', 'yielding'], // bare
  'bare-heads': ['adorned'], // bare-heads
  'bareheads': ['crowned'], // bareheads
  'barren': ['abundant', 'beverage', 'colorful', 'crowned', 'dynamic', 'fertile', 'flourishing', 'foliage', 'fullness', 'immerse', 'inviting', 'lush', 'oceanic', 'rich', 'richness', 'vibrant'], // barren
  'barter': ['payments'], // barter
  'base': ['abstract', 'apex', 'chaotic', 'dynamic', 'flexible', 'fluid', 'header', 'irregular', 'light', 'peak', 'soft', 'summit', 'vertex'], // base
  'based': ['balance', 'fluid', 'masonry', 'organic', 'serif', 'unfounded', 'wavering'], // Based
  'basic': ['aesthetics', 'boutique', 'cgi', 'complex', 'deeptech', 'edtech', 'elaborate', 'elite', 'exceptional', 'excessive', 'extraordinary', 'figurative', 'fintech', 'garnish', 'indulgent', 'lavish', 'macro', 'perfect', 'personalized', 'prime', 'retrofuturism', 'technographic', 'techwear', 'wealth', 'wearables', 'wrought', 'yachting'], // Basic
  'basic-bites': ['indulgent'], // basic-bites
  'basis': ['effects'], // basis
  'beacon': ['absence', 'darkness', 'shadow', 'void'], // Beacon
  'beat': ['chaos', 'disorder', 'random', 'rhythmlessness', 'silence', 'slow', 'soft', 'stagnant', 'static'], // beat
  'beauty': ['brutality', 'chaos', 'clutter', 'dullness', 'mess', 'ugliness'], // Beauty
  'becoming': ['ended'], // Becoming
  'beer': ['wine'], // beer
  'begin': ['closed', 'expire', 'finish'], // begin
  'beginning': ['aftermath', 'death', 'end', 'ended', 'endgame', 'final', 'finale', 'finish'], // Beginning
  'behavioral': ['backward', 'chaotic', 'disorderly', 'erratic', 'hardware', 'impulsive', 'irrational', 'mechanical', 'physical', 'random', 'spontaneous', 'tangible', 'unpredictable'], // Behavioral
  'being': ['nonexist'], // Being
  'belief': ['apathy', 'confusion', 'denial', 'disbelief', 'disillusion', 'disillusionment', 'doubt', 'indifference', 'skepticism', 'uncertainty'], // belief
  'believing': ['doubtful'], // believing
  'belonging': ['alienation', 'exile', 'forgetting'], // Belonging
  'below': ['above', 'high', 'skyward', 'top', 'up'], // below
  'beneath': ['upper'], // beneath
  'beneficial': ['worthless'], // beneficial
  'benefit': ['harm', 'warning'], // benefit
  'benevolence': ['malice'], // benevolence
  'benevolent': ['greed'], // benevolent
  'bespoke': ['generic', 'massproduced', 'premium'], // Bespoke
  'betrayal': ['cherishing'], // betrayal
  'beverage': ['barren', 'dry', 'dull', 'empty', 'equipment', 'inedible', 'solid', 'stale', 'toxin', 'void'], // Beverage
  'bias': ['objectivity'], // bias
  'bigness': ['petiteness'], // bigness
  'binary': ['diverse'], // Binary
  'bind': ['chaos', 'detach', 'disorder', 'fluid', 'free', 'loose', 'open', 'release', 'unbound'], // bind
  'binding': ['disband', 'free', 'liberation', 'loose', 'separate'], // binding
  'bio': ['artificial', 'dead', 'inorganic', 'mechanical', 'synthetic'], // Bio
  'biographical': ['imaginary'], // Biographical
  'biological': ['robotics'], // biological
  'biomorphic': ['artificial', 'geometric', 'mechanical', 'rigid', 'static', 'structured', 'synthetic'], // Biomorphic
  'biophilia': ['premium'], // Biophilia
  'biophilic': ['concrete'], // Biophilic
  'bistro': ['bland', 'chaotic', 'formal', 'impersonal', 'industrial', 'rigid', 'stale', 'stark', 'sterile', 'uninviting'], // Bistro
  'bitter': ['bakery', 'bright', 'cheerful', 'gentle', 'jubilant', 'smooth', 'soft', 'sweet', 'warm', 'wine'], // bitter
  'bizarre': ['familiar'], // bizarre
  'blackout': ['awareness', 'brightness', 'clarity', 'dawn', 'energy', 'illumination', 'light', 'radiance', 'vitality'], // Blackout
  'bland': ['alluring', 'art', 'attractive', 'bistro', 'bold', 'brilliant', 'captivating', 'colorful', 'dazzling', 'decorated', 'depictive', 'distinct', 'distinction', 'dynamic', 'exceptional', 'exciting', 'expressive', 'fierce', 'fiery', 'gleaming', 'graded', 'highlight', 'ignited', 'lively', 'macro', 'murals', 'personalized', 'phosphor', 'pleasant', 'rich', 'richness', 'shine', 'shiny', 'stimulating', 'storyful', 'sweet', 'symphonic', 'vibrant', 'vibration', 'zesty'], // bland
  'blandness': ['aesthetics'], // blandness
  'blank': ['filled', 'multi'], // Blank
  'blare': ['whisper'], // blare
  'blaring': ['calm', 'gentle', 'muted', 'peaceful', 'quiet', 'silent', 'soft', 'still', 'subdued'], // blaring
  'blasts': ['calm', 'gentle', 'muted', 'peaceful', 'quiet', 'soft', 'still', 'subdued', 'whispers'], // blasts
  'blatancy': ['discretion'], // blatancy
  'blatant': ['covert', 'discreet', 'hidden', 'mystery', 'nuanced', 'obscure', 'subtle', 'veiled'], // blatant
  'blazing': ['calm', 'cool', 'dimming', 'dull', 'faint', 'frosted-hue', 'mellow', 'pale', 'soft', 'subdued'], // blazing
  'bleak': ['bright', 'cheerful', 'colorful', 'foliage', 'inviting', 'lush', 'positive', 'rich', 'vibrant', 'vividness', 'warm'], // bleak
  'bleakness': ['brightness', 'color', 'fullness', 'joy', 'liveliness', 'richness', 'vibrance', 'vibrancy', 'warmth'], // bleakness
  'blend': ['divide', 'highlight', 'separate'], // blend
  'blended': ['chaotic', 'clashing', 'conflicting', 'contrasted', 'distinct', 'individual', 'pure', 'sharp', 'vivid'], // blended
  'blending': ['dividing', 'outlining'], // blending
  'blessing': ['misfortune'], // blessing
  'blight': ['brightness', 'flourish', 'nourish', 'prosperity', 'utopia', 'vitality'], // blight
  'blind': ['alert', 'aware', 'bright', 'clear', 'focused', 'led', 'luminous', 'sighted', 'sightful', 'visible'], // Blind
  'blinding': ['calm', 'dim', 'faint', 'gentle', 'muted', 'quiet', 'shading', 'soft', 'subtle'], // blinding
  'blindness': ['awareness', 'brightness', 'clarity', 'focus', 'insight', 'observation', 'perception', 'sight', 'vision'], // blindness
  'bliss': ['agony', 'anguish', 'heavy', 'pain', 'sorrow', 'torment'], // Bliss
  'blobby': ['clear', 'defined', 'firm', 'precise', 'sculpted', 'sharp', 'smooth', 'solid', 'structured'], // blobby
  'block': ['fringe', 'leak', 'spread', 'support'], // Block
  'blockage': ['catalyst'], // blockage
  'blockchain': ['centralized', 'confined', 'isolated', 'linear', 'restricted'], // Blockchain
  'blocky': ['airy', 'curved', 'dynamic', 'fluid', 'light', 'organic', 'smooth', 'soft', 'tubular'], // blocky
  'bloom': ['drown', 'shrivel', 'wilt', 'wither'], // Bloom
  'blooming': ['withering'], // blooming
  'blotchy': ['clean', 'clear', 'crisp-white', 'neat', 'precise', 'smooth', 'solid', 'uniform'], // blotchy
  'blunt': ['bright', 'clear', 'discretion', 'dynamic', 'engaging', 'expressive', 'intense', 'pointed', 'reflective', 'sharp', 'vibrant'], // blunt
  'blur': ['imprint'], // Blur
  'blurb': ['clarity', 'definition', 'focus', 'order', 'precision', 'sharpness', 'simplicity', 'structure', 'typesetting'], // blurb
  'blurred': ['visible'], // blurred
  'blurring': ['outlining'], // blurring
  'blurry': ['key'], // blurry
  'boiling': ['glacial'], // boiling
  'boisterous': ['calm', 'gentle', 'peaceful', 'quiet', 'reserved', 'soft', 'still', 'subdued', 'vulnerable-silence'], // boisterous
  'bokeh': ['bright', 'clear', 'crisp', 'defined', 'detailed', 'focused', 'sharp', 'vivid'], // Bokeh
  'bold': ['banal', 'bland', 'boring', 'cautious', 'drab', 'drain', 'dull', 'dullard', 'fading', 'faint', 'filtered', 'gentle', 'hesitant', 'hiding', 'humble', 'hushing', 'idle', 'introverted', 'lame', 'lethargic', 'mediocre', 'muffled', 'mundane', 'mute', 'neumorphic', 'pedestrian', 'plain', 'reserved', 'shy', 'stale', 'stifled', 'subduing', 'suppressed', 'tame', 'timid', 'washed', 'weak'], // Bold
  'bold-adventure': ['cautious'], // bold-adventure
  'boldness': ['hesitation'], // boldness
  'bond': ['split'], // Bond
  'bondage': ['escape', 'expansive-freedom', 'flexible', 'fluid', 'freedom', 'liberation', 'open', 'release', 'unbound'], // bondage
  'bore': ['colorful', 'delight', 'dynamic', 'engage', 'excite', 'lively', 'motivate', 'stimulate', 'vibrant'], // bore
  'bored': ['active', 'curious', 'dynamic', 'engaged', 'excited', 'fascinated', 'interested', 'pleased', 'stimulated', 'vibrant'], // bored
  'boredom': ['animation', 'attraction', 'curiosity', 'edutainment', 'engagement', 'enthusiasm', 'euphoria', 'excitement', 'fervor', 'hype', 'interest', 'joy', 'passion', 'stimulation', 'vibrancy', 'zeal'], // boredom
  'boring': ['adventurous', 'bold', 'captivating', 'colorful', 'dynamic', 'engaging', 'exciting', 'ingenuity', 'lively', 'stimulating', 'surprise', 'vibrant', 'whimsical-flow'], // Boring
  'botanical': ['mechanical'], // Botanical
  'bottom': ['above', 'peak', 'summit', 'top', 'unbounded', 'up', 'upper'], // bottom
  'bound': ['detached', 'free', 'freedom', 'freeness', 'independent', 'loose', 'loosen', 'mobility', 'open', 'released', 'unbound', 'unconfined', 'unfettered', 'unformed', 'unfounded', 'ungrounded'], // bound
  'bounded': ['chaos', 'endless', 'endlessness', 'expansion', 'fluid', 'freedom', 'infinity', 'limitless', 'open', 'unbounded', 'uninterrupted', 'vague'], // bounded
  'boundless': ['finite', 'limit', 'limitation', 'restricted'], // Boundless
  'boundless-exploration': ['limitation'], // boundless-exploration
  'bounty': ['deficiency', 'depletion', 'emptiness', 'lack', 'loss', 'poverty', 'scarcity', 'want'], // Bounty
  'boutique': ['basic', 'common', 'generic', 'industrial', 'mass', 'mass-market', 'monotonous', 'standard', 'uniform', 'wholesale'], // Boutique
  'boxy': ['aerodynamic', 'airy', 'asymmetrical', 'curvy', 'dynamic', 'fluid', 'light', 'organic', 'sphere'], // boxy
  'branding': ['unmark'], // Branding
  'brash': ['calm', 'cautious', 'gentle', 'muted', 'quiet', 'reserved', 'shy', 'simple', 'soft', 'subtle'], // brash
  'brave': ['hiding', 'timid'], // brave
  'brazen': ['discretion'], // brazen
  'break': ['build', 'connect', 'create', 'establish', 'fix', 'loop', 'repeat', 'restore', 'strengthen', 'synthesize', 'unite', 'weave'], // break
  'breakdown': ['clarity', 'coherence', 'harmony', 'resilience', 'serenity', 'stability', 'strength', 'unity', 'wholeness'], // breakdown
  'breeze': ['burden', 'chaos', 'heaviness', 'heavyweight', 'pressure', 'storm', 'stress', 'tension', 'weight'], // breeze
  'breezy': ['certain', 'confined', 'dark', 'fixed', 'gloomy', 'heavy', 'ponderous', 'stale', 'static'], // breezy
  'brevity': ['lengthy', 'rambling', 'verbosity'], // brevity
  'brief': ['eternal', 'lengthy', 'lingering', 'perpetual'], // brief
  'bright': ['aimless', 'bitter', 'bleak', 'blind', 'blunt', 'bokeh', 'cloudy', 'cold', 'cumbersome', 'despairing', 'dimming', 'dirt', 'dismal', 'dismissive', 'drag', 'drain', 'drained', 'dreary', 'dry', 'dull', 'dystopic', 'fall', 'foul', 'frayed', 'gothic', 'grim', 'grime', 'grungy', 'hushing', 'lethargic', 'matt', 'muddy', 'muffled', 'murky', 'mute', 'obscuring', 'ochre', 'opaque', 'patina', 'pessimistic', 'repellent', 'reserved', 'rusty', 'shrouded', 'sluggish', 'smoky', 'stale', 'weary'], // bright
  'brightness': ['blackout', 'bleakness', 'blight', 'blindness', 'coldness', 'darkness', 'dimness', 'dormancy', 'eclipse', 'filth', 'fog', 'nocturn', 'squalor'], // brightness
  'brilliant': ['bland', 'dark', 'drab', 'dull', 'faded', 'flat', 'muted', 'subdued', 'void-spectrum'], // Brilliant
  'brisk': ['slow'], // brisk
  'brittle': ['malleable', 'resilient', 'robust', 'steel', 'sturdy', 'supple'], // Brittle
  'broad': ['specific', 'thin'], // broad
  'broadening': ['narrowing'], // broadening
  'broken': ['cast', 'complete', 'dome', 'functional', 'intact', 'loop', 'solid', 'stable', 'unified', 'whole'], // broken
  'brushed': ['scratched'], // Brushed
  'brushstroke': ['clear', 'defined', 'digital', 'orderly', 'photographic', 'polished', 'precise', 'sharp', 'smooth', 'static', 'uniform'], // Brushstroke
  'brutal': ['calm', 'delicate', 'elegant', 'gentle', 'refined', 'smooth', 'soft', 'softness', 'subtle', 'sweet'], // brutal
  'brutalist': ['elegant', 'maximalist', 'traditional'], // Brutalist
  'brutality': ['beauty', 'elegance', 'gentleness', 'grace', 'harmony', 'lightness', 'serenity', 'softness'], // brutality
  'bubble': ['empty', 'flat', 'scatter', 'void', 'world'], // Bubble
  'build': ['break', 'collapse', 'damage', 'destroy', 'disassemble', 'erode', 'tear'], // build
  'building': ['destruction', 'dissolving', 'erasing', 'obliterating'], // building
  'bulge': ['flatten'], // bulge
  'bulk': ['petiteness'], // bulk
  'bulky': ['aerodynamic', 'petite', 'slender', 'thin'], // bulky
  'bump': ['even', 'flat', 'flatness', 'linear', 'plain', 'smooth', 'uniform'], // bump
  'bumpy': ['even', 'flat', 'plain', 'smooth', 'smoothness', 'steady', 'uniform'], // bumpy
  'burden': ['breeze', 'ease', 'flow', 'freedom', 'joy', 'levity', 'lightness', 'openness', 'pleasure', 'release', 'selfcare'], // burden
  'burdened': ['clear', 'easy', 'ethereal-lightness', 'free', 'light', 'open', 'pure', 'simple', 'unbound', 'unhurried'], // burdened
  'burdensome': ['carefree', 'easy', 'effortless', 'free', 'joyful', 'light', 'lightweight', 'simple', 'supportive', 'uplifting'], // burdensome
  'buried': ['overlook'], // buried
  'burnout': ['selfcare'], // burnout
  'burnt': ['calm', 'clear', 'cool', 'faint', 'frosted-blue', 'gentle', 'pale', 'soft', 'subtle'], // Burnt
  'business': ['non-profit'], // business
  'bustling': ['calm', 'desolate', 'dormant', 'inactive', 'lethargic', 'quiet', 'serene', 'sluggish', 'still'], // bustling
  'busy': ['lazy', 'leisurely', 'paused', 'rest', 'rural', 'simplify', 'untouched'], // busy
  'buzz': ['calm', 'empty', 'light', 'loose', 'quiet', 'silence', 'soft', 'still', 'void'], // buzz
  'cacophony': ['calm', 'clarity', 'harmony', 'melody', 'order', 'serenity', 'silence', 'unity', 'visual-monologue'], // cacophony
  'cage': ['freeness'], // cage
  'calculated': ['irrational'], // Calculated
  'calculated-precision': ['imprecise'], // calculated-precision
  'calculation': ['ambiguity', 'chaos', 'disorder', 'freedom', 'improvisation', 'instinct', 'intuition', 'random'], // calculation
  'callous': ['empathetic'], // callous
  'calm': ['aggressive', 'agitated', 'agitation', 'agony', 'anguish', 'anti', 'anxious', 'blaring', 'blasts', 'blazing', 'blinding', 'boisterous', 'brash', 'brutal', 'burnt', 'bustling', 'buzz', 'cacophony', 'chaotic', 'clamor', 'clatter', 'cluttered', 'confront', 'din', 'dragged', 'dramatic', 'energetic', 'erupt', 'exaggeration', 'explosive', 'fear', 'feral', 'fierce', 'fiery', 'frantic', 'frenzied', 'frenzy', 'frustration', 'garish', 'harried', 'harsh', 'hasty', 'heated', 'heavy', 'hustle', 'hype', 'ignite', 'intensify', 'jarring', 'joy', 'jumbled', 'loud', 'messy', 'molten', 'motorsport', 'murky', 'negation', 'noisy', 'overwrought', 'panic', 'plasma', 'postlude', 'racket', 'raucous', 'reckless', 'restless', 'risk', 'roars', 'roughness', 'rush', 'rushed', 'savage', 'scream', 'screaming', 'shouted', 'shouting', 'shouts', 'splash', 'staccato', 'steam', 'stimulation', 'storm', 'strenuous', 'stress', 'strident', 'struggle', 'sudden', 'tangle', 'tarnished', 'tense', 'thunders', 'tightened', 'torment', 'tumult', 'turbulence', 'turmoil', 'uneasy', 'unhinged', 'unruly', 'unsettled', 'unstable', 'unsteady', 'uproarious', 'urgent', 'volatile', 'war', 'warning', 'whirlwind', 'zesty'], // Calm
  'calmness': ['exuberance'], // calmness
  'camp': ['restrained', 'sober'], // Camp
  'camping': ['hotels'], // camping
  'candid': ['filtered', 'staged'], // Candid
  'candid-notation': ['curtained'], // candid-notation
  'capable': ['clumsy', 'inactive', 'incompetent', 'inept', 'limited', 'unable', 'unfit', 'weak'], // Capable
  'caps': ['flat', 'naked', 'plain'], // Caps
  'captivating': ['bland', 'boring', 'dull', 'lackluster', 'mundane', 'ordinary', 'repelling', 'repulsive', 'tame', 'unappealing'], // captivating
  'captivity': ['expansive-freedom', 'exploration', 'freedom', 'liberation', 'openness', 'release', 'spontaneity', 'uncertainty', 'variability'], // captivity
  'capture': ['disperse', 'evade', 'forget', 'led', 'rendering'], // Capture
  'cardiology': ['orthodontics'], // cardiology
  'care': ['cruelty', 'exploitation', 'malice', 'negligence', 'premium'], // Care
  'carefree': ['adulting', 'anxious', 'burdensome', 'cautious', 'grind', 'serious'], // carefree
  'careful': ['careless', 'hasty', 'negligent', 'reckless'], // careful
  'carefulness': ['sloppiness'], // carefulness
  'careless': ['attentive', 'careful', 'certain', 'considerate', 'deliberate', 'guarded', 'mindful', 'precise', 'premeditated', 'thoughtful'], // careless
  'carelessness': ['gravitas'], // carelessness
  'caring': ['selfish'], // caring
  'carousel': ['scroll', 'underline'], // Carousel
  'cast': ['absorb', 'broken', 'chaotic', 'discard', 'flexible', 'fluid', 'partial', 'soft', 'uncertain'], // cast
  'casual': ['adulting', 'arduous', 'ceremonial', 'formal', 'formality', 'grind', 'horology', 'impersonal', 'official', 'pretentious', 'stiff'], // Casual
  'casual-chaos': ['formality'], // casual-chaos
  'casual-chic': ['pretentious', 'stuffy'], // casual-chic
  'casual-collection': ['elite'], // casual-collection
  'catalyst': ['blockage', 'halt', 'impediment', 'inhibitor', 'obstruction', 'passive', 'resistance', 'stagnant', 'stagnation', 'static'], // Catalyst
  'catering': ['abandon', 'chaos', 'disorder', 'diy', 'lack', 'manufacturing', 'mess', 'neglect', 'restaurant', 'retail', 'scarcity', 'simple'], // Catering
  'caution': ['hasty', 'heavy', 'reckless'], // Caution
  'cautious': ['adventurous', 'audacious', 'bold', 'bold-adventure', 'brash', 'carefree', 'daring', 'fearless', 'impulsive', 'reckless'], // cautious
  'cease': ['remain', 'repeat'], // cease
  'celebrate': ['dismiss'], // celebrate
  'celebrated': ['ignored'], // celebrated
  'celebration': ['ridicule', 'shame', 'sorrow'], // Celebration
  'celebrity': ['unknown'], // Celebrity
  'cellular': ['centralized', 'fixed', 'simple', 'solid', 'stable', 'static', 'uniform'], // Cellular
  'centered': ['asymmetrical', 'distracted', 'editorial', 'music', 'offbeat', 'screen', 'ungrounded'], // Centered
  'central': ['peripheral', 'tangential'], // central
  'centrality': ['asymmetrical', 'disorder', 'editorial', 'screen'], // Centrality
  'centralized': ['blockchain', 'cellular', 'obscured', 'scroll', 'spread'], // Centralized
  'centric': ['scroll'], // Centric
  'cerebral': ['scatterbrained'], // Cerebral
  'ceremonial': ['casual'], // ceremonial
  'certain': ['ambiguous', 'breezy', 'careless', 'clatter', 'clueless', 'confused', 'corrupt', 'delay', 'delayed', 'doubtful', 'false', 'fictional', 'flighty', 'fugitive', 'fumble', 'hesitant', 'hollow', 'imaginary', 'imprecise', 'lost', 'nebulous', 'nowhere', 'peripheral', 'sealed', 'subjective', 'uncertain', 'uncertainty', 'unchanged', 'unfounded', 'unknown', 'unreliable', 'unsettled', 'unsteady', 'vacant', 'vague'], // certain
  'certainty': ['confusion', 'contradiction', 'deceit', 'denial', 'discomfort', 'doubt', 'doubting', 'falsehood', 'fluke', 'hesitation', 'ignorance', 'impotence', 'myth', 'paradox', 'risk', 'vacuum', 'waver', 'whirlwind'], // certainty
  'cgi': ['basic', 'handmade', 'imperfect', 'natural', 'organic', 'primitive', 'raw', 'rough', 'simple', 'unrefined'], // CGI
  'ch-teau-style': ['rebel'], // ch-teau-style
  'challenges': ['solutions'], // challenges
  'challenging': ['clear', 'easy', 'gentle', 'light', 'pleasant', 'simple', 'smooth', 'soft'], // Challenging
  'change': ['constancy', 'fixity'], // change
  'changeable': ['permanent', 'unchanging'], // changeable
  'changing': ['constant'], // changing
  'chaos': ['aesthetics', 'aether', 'align', 'analytics', 'annotation', 'approval', 'ascendancy', 'axis', 'beat', 'beauty', 'bind', 'bounded', 'breeze', 'calculation', 'catering', 'childcare', 'classicism', 'climate', 'cloistered', 'command', 'completion', 'composure', 'concentricity', 'conception', 'conquer', 'consensus', 'consequence', 'consolidate', 'constancy', 'constraint', 'consulting', 'context', 'convolution', 'corner', 'cubism', 'definition', 'dentistry', 'depiction', 'earth', 'eco-tech', 'ecosystem', 'edtech', 'edutainment', 'efficacy', 'engineering', 'fact', 'finality', 'fixation', 'fixity', 'fortitude', 'globe', 'grading', 'healthtech', 'horology', 'integrity', 'interpretation', 'logistics', 'lucidity', 'marketing', 'meaning', 'method', 'microcosm', 'minimize', 'modelling', 'monoculture', 'monopoly', 'mosaic', 'museum', 'normalcy', 'nucleus', 'obedience', 'order', 'outlining', 'payments', 'point', 'publishing', 'relaxation', 'resolve', 'restriction', 'richness', 'rows', 'safety', 'sameness', 'scholarship', 'selfcare', 'sense', 'settle', 'sightful', 'solidify', 'solutions', 'sparsity', 'stability', 'stratosphere', 'typecraft', 'unify', 'unison', 'utopia', 'vacuum', 'watches', 'watchmaking', 'whisper', 'winery'], // Chaos
  'chaotic': ['achievable', 'automated', 'bakery', 'base', 'behavioral', 'bistro', 'blended', 'calm', 'cast', 'charted', 'coherent', 'compliant', 'concentrated', 'concentricity', 'concreteness', 'constant', 'contained', 'cultivate', 'cultivated', 'decisive', 'deeptech', 'definite', 'deliberate', 'depictive', 'discretion', 'doctrinal', 'easy', 'enclosed', 'exact', 'factory', 'filtered', 'fintech', 'flawless', 'formality', 'formed', 'harmonic', 'hotels', 'hushing', 'intact', 'integrated', 'labeled', 'led', 'leisurely', 'level', 'logical', 'mechanic', 'mechanical', 'mellow', 'modelling', 'mono', 'neat', 'normal', 'obedient', 'parametric', 'peace', 'peaceful', 'perfect', 'planned', 'pleasant', 'practical', 'predefined', 'predetermined', 'predictable', 'premeditated', 'prime', 'procedural', 'rational', 'reassuring', 'regression', 'regulated', 'remote', 'reserved', 'resolved', 'rest', 'restrained', 'robotic', 'robotics', 'rooted', 'rural', 'sane', 'scheduled', 'scholarly', 'seamless', 'sequential', 'serene', 'serious', 'settled', 'simplify', 'simplifying', 'sober', 'solidity', 'spotless', 'square', 'stability', 'staged', 'steadfast', 'sterile', 'stoic', 'storyful', 'symbolism', 'symphonic', 'synchronized', 'tame', 'techno-futurism', 'technographic', 'techwear', 'unchanged', 'unhurried', 'unified', 'uninterrupted', 'wash', 'xr'], // Chaotic
  'chaotic-abundance': ['limit'], // chaotic-abundance
  'charge': ['retreat'], // charge
  'charity': ['malice'], // charity
  'charming': ['repelling'], // charming
  'charted': ['ambiguous', 'chaotic', 'disordered', 'fluid', 'improvised', 'random', 'uncertain', 'uncharted-terrain', 'vague'], // charted
  'cheap': ['elite', 'exclusive', 'expensive', 'lavish', 'luxury', 'opulent', 'premium', 'refined', 'sophisticated', 'wealth'], // cheap
  'cheer': ['heavy'], // Cheer
  'cheerful': ['bitter', 'bleak', 'dismal', 'drag', 'drain', 'dreary', 'gothic', 'grim', 'pessimistic', 'stern'], // cheerful
  'cheerfulness': ['dimness'], // cheerfulness
  'cherish': ['abandon', 'despise', 'disdain', 'dismiss', 'disregard', 'ignore', 'neglect', 'reject', 'scorn'], // cherish
  'cherished': ['disposable', 'forgotten'], // cherished
  'cherishing': ['apathy', 'betrayal', 'despair', 'detachment', 'disdain', 'disdainful', 'dismissive', 'indifferent', 'neglecting'], // cherishing
  'chiaroscuro': ['editorial', 'screen'], // Chiaroscuro
  'chic': ['frumpy', 'tacky'], // Chic
  'childcare': ['abandon', 'academic', 'adult-services', 'chaos', 'corporate', 'detachment', 'disorder', 'elderly-care', 'ignorance', 'indifference', 'neglect'], // Childcare
  'childhood': ['adulting'], // Childhood
  'childlike': ['adult', 'mature', 'serious', 'sophisticated'], // Childlike
  'chill': ['agitated', 'heat', 'melt', 'tense'], // Chill
  'chilled-contrast': ['heated'], // chilled-contrast
  'chore': ['hobby'], // chore
  'chronicle': ['premium', 'whirlwind'], // Chronicle
  'chronos': ['eternal', 'evanescent'], // Chronos
  'chunky': ['thin'], // Chunky
  'cinematography': ['led', 'photography', 'rendering'], // Cinematography
  'circle': ['corner', 'point'], // Circle
  'circuitous': ['direct', 'linear', 'linear-path', 'simple', 'straight'], // circuitous
  'circular': ['pointed'], // Circular
  'civilized': ['terrain'], // civilized
  'clamor': ['calm', 'clarity', 'harmony', 'order', 'serenity', 'silence', 'simplicity', 'stillness'], // clamor
  'clarify': ['muffle', 'vacate'], // clarify
  'clarifying': ['diluting'], // clarifying
  'clarity': ['awkwardness', 'blackout', 'blindness', 'blurb', 'breakdown', 'cacophony', 'clamor', 'complication', 'confusion', 'contradiction', 'darkness', 'deceit', 'denial', 'dimness', 'discomfort', 'disempowerment', 'disguise', 'disillusion', 'disorder', 'dream', 'eclipse', 'emission', 'erasure', 'filth', 'fog', 'foolishness', 'fuzz', 'fuzzy', 'guilt', 'hassle', 'heavy', 'idiosyncrasy', 'ignorance', 'imposition', 'impotence', 'impression', 'insignificance', 'interference', 'jumble', 'mess', 'mismatch', 'muddle', 'myth', 'narrowness', 'nocturn', 'obliteration', 'oblivion', 'obscurity', 'obsolescence', 'obstacle', 'paradox', 'pixelation', 'pollution', 'postlude', 'pressure', 'scribble', 'sloppiness', 'stupidity', 'superimposition', 'tumult', 'vacuum', 'verbosity'], // Clarity
  'clash': ['sameness'], // clash
  'clashing': ['blended', 'harmonic'], // clashing
  'classic': ['faddish', 'retrofuturism', 'streetwear'], // classic
  'classic-integrity': ['faddish'], // classic-integrity
  'classicism': ['avant-garde', 'chaos', 'disorder', 'eccentricity', 'experimentation', 'improvisation', 'irregularity', 'modernism', 'nihilism', 'novelty', 'randomness', 'unconventional'], // Classicism
  'classy': ['tacky'], // classy
  'clatter': ['calm', 'certain', 'cohesive', 'orderly', 'quiet', 'smooth', 'steady', 'understated-tranquility', 'unified'], // clatter
  'clean': ['blotchy', 'dirt', 'fussy', 'gothic', 'grime', 'grungy', 'impure', 'mess', 'messy', 'muddy', 'murky', 'ochre', 'patina', 'polluted', 'rusty', 'shifty', 'sloppy', 'smeared', 'splat', 'toxic', 'waste'], // clean
  'clean-cut': ['ragged'], // clean-cut
  'cleanliness': ['editorial', 'filth', 'fuzz', 'grime', 'ruin', 'screen', 'squalor'], // Cleanliness
  'clear': ['aftermath', 'aimless', 'awkward', 'blind', 'blobby', 'blotchy', 'blunt', 'bokeh', 'brushstroke', 'burdened', 'burnt', 'challenging', 'closed', 'cloudy', 'clueless', 'clumsy', 'cluttered', 'concealed', 'concealing', 'conflicted', 'confused', 'confusing', 'corrupt', 'crooked', 'crude', 'curtained', 'deceptive', 'despairing', 'dirt', 'doubtful', 'extraneous', 'false', 'flicker', 'flood', 'foolish', 'fraudulent', 'frayed', 'fugitive', 'fumble', 'fuzzy', 'grim', 'grime', 'harried', 'hesitant', 'illogical', 'illusory', 'imprecise', 'impure', 'incomplete', 'indistinct', 'intangible', 'interstitial', 'invisible', 'jumbled', 'labyrinthine', 'lost', 'masked', 'muddy', 'muffled', 'murky', 'nebulous', 'neumorphic', 'noisy', 'nowhere', 'numb', 'oblique', 'obscuring', 'opaque', 'pixelation', 'polluted', 'rambling', 'roughness', 'scatterbrained', 'scratched', 'scrawl', 'sealed', 'serpentine', 'shifty', 'shroud', 'shrouded', 'smeared', 'smoky', 'splash', 'splotchy', 'storm', 'strange', 'stuffy', 'subduing', 'suppressed', 'symbolic', 'tainted', 'tangle', 'toxic', 'twist', 'twisted', 'uncertain', 'unchanged', 'unfocused', 'unhinged', 'unknown', 'vague', 'veiled', 'veiling', 'viscous', 'wavering'], // Clear
  'climate': ['chaos', 'disorder', 'instability', 'randomness', 'rupture'], // Climate
  'climb': ['descend', 'plummet'], // climb
  'clinging': ['fleeing'], // clinging
  'cloak': ['uncover'], // cloak
  'cloistered': ['chaos', 'dispersed', 'exposed', 'free', 'isolated', 'open', 'open-top', 'public', 'scattered'], // Cloistered
  'closed': ['begin', 'clear', 'empty', 'expose', 'free', 'open', 'openness', 'start', 'unfold'], // closed
  'closeness': ['alienation', 'detachment', 'disconnection', 'distance', 'estrangement', 'isolation', 'loneliness', 'remoteness', 'separation'], // closeness
  'closing': ['connection', 'continuity', 'eternity', 'expansion', 'growth', 'opening', 'permanence', 'presence', 'unfolding'], // closing
  'cloudy': ['bright', 'clear', 'dry', 'gleaming', 'open', 'sharp', 'solid', 'sunny', 'vivid'], // cloudy
  'clueless': ['aware', 'certain', 'clear', 'expertise', 'focused', 'informed', 'insightful', 'knowledgeable', 'sharp'], // clueless
  'clumsy': ['capable', 'clear', 'elegant', 'flawless', 'fluid', 'graceful', 'polished', 'refined', 'simple', 'skillful', 'smooth', 'swift'], // clumsy
  'clunky': ['aerodynamic', 'elegant', 'fluid', 'graceful', 'light', 'nimble', 'refined', 'sleek', 'sleekness', 'smooth'], // clunky
  'cluster': ['disperse'], // cluster
  'clustering': ['editorial', 'screen', 'symmetry'], // Clustering
  'clutter': ['aesthetics', 'beauty', 'whisper'], // clutter
  'cluttered': ['aero', 'calm', 'clear', 'fintech', 'focused', 'minimal', 'minimalistic', 'neat', 'ordered', 'organized', 'simple', 'simplify', 'simplifying', 'uninterrupted', 'untouched'], // cluttered
  'coarse': ['supple', 'watchmaking', 'yielding'], // Coarse
  'cognition': ['premium'], // Cognition
  'cohere': ['collapse', 'separate'], // cohere
  'coherence': ['breakdown', 'confusion', 'contradiction', 'dissipation', 'mismatch', 'muddle', 'paradox'], // coherence
  'coherent': ['anarchic', 'arbitrary', 'awkward', 'chaotic', 'confused', 'confusing', 'disarrayed', 'disjoint', 'disjointed', 'disordered', 'disorderly', 'disorganized', 'fragmented', 'haphazard', 'illogical', 'impure', 'incoherent', 'interstitial', 'jumbled', 'postmodernism', 'random', 'scattered'], // coherent
  'cohesion': ['disorder', 'disunity', 'obliterating'], // Cohesion
  'cohesive': ['clatter', 'conflicted', 'deconstructivism', 'discordant', 'disjointed', 'disparate', 'dividing', 'divisive', 'jarring', 'scrap', 'segmented', 'sprawl', 'sprawled'], // cohesive
  'cold': ['bright', 'cozy', 'empathetic', 'fiery', 'fullness', 'heat', 'heated', 'hot', 'ignited', 'lively', 'molten', 'pillow', 'radiant', 'sunny', 'vivid', 'warm'], // cold
  'coldness': ['brightness', 'comfort', 'empathy', 'enthusiasm', 'intimacy', 'joy', 'life', 'passion', 'vibrancy', 'warmth'], // coldness
  'collaboration': ['monopoly'], // Collaboration
  'collaborative': ['detached', 'disjointed', 'exclusive', 'individual', 'isolated', 'isolating', 'isolationist', 'lonely', 'separate', 'solitary'], // collaborative
  'collage': ['led'], // Collage
  'collapse': ['arch', 'ascendancy', 'build', 'cohere', 'connect', 'expand', 'integrate', 'solidify', 'strength', 'strengthen', 'unify', 'victory'], // collapse
  'collect': ['disband', 'discard', 'isolate'], // collect
  'collective': ['divisive', 'individual'], // Collective
  'collectivism': ['autonomy', 'detachment', 'independence', 'individualism', 'isolation', 'self-reliance', 'solitude'], // Collectivism
  'color': ['bleakness'], // color
  'colorful': ['barren', 'bland', 'bleak', 'bore', 'boring', 'drab', 'drain', 'dry', 'dullard', 'insipid', 'lame', 'lifeless', 'monotonous', 'mute', 'nocturn', 'ordinary', 'sober', 'stale', 'tedious', 'unchanged'], // Colorful
  'colossal': ['diminutive', 'small', 'tiny'], // colossal
  'combine': ['detach', 'disassemble', 'divide', 'isolate', 'separate', 'split'], // combine
  'combined': ['segregated'], // combined
  'combining': ['dividing'], // combining
  'comfort': ['agony', 'anguish', 'coldness', 'discomfort', 'dissatisfaction', 'hassle', 'heavy', 'pain', 'panic', 'sorrow', 'strain', 'stress', 'struggle', 'torment', 'warning'], // Comfort
  'comfortable': ['numb', 'uneasy'], // comfortable
  'comic': ['stoic'], // Comic
  'command': ['anarchy', 'chaos', 'confusion', 'disarray', 'disorder', 'freedom', 'informality', 'instability', 'surrender'], // Command
  'commencement': ['finale'], // commencement
  'commercial': ['artistic', 'experimental', 'non-profit', 'nonprofit', 'residential'], // Commercial
  'commercial-aesthetics': ['anti'], // commercial-aesthetics
  'commercial-chic': ['grungy'], // commercial-chic
  'commit': ['resign', 'vacate', 'waver'], // commit
  'commitment': ['abandon', 'abandonment', 'freetime'], // commitment
  'commodity': ['art', 'deeptech', 'individual', 'rare', 'unique', 'watchmaking'], // Commodity
  'common': ['alien', 'apex', 'atypical', 'boutique', 'crowned', 'distinct', 'distinction', 'elite', 'exceptional', 'exclusive', 'exotic', 'extraordinary', 'fame', 'famous', 'gourmet', 'incomplete', 'individual', 'lofty', 'novel', 'personalized', 'prime', 'private', 'rare', 'singular', 'special', 'stellar', 'uncommon', 'unfamiliar', 'unique', 'uniqueness', 'vanguard', 'yachting'], // common
  'communal': ['isolating', 'premium'], // Communal
  'communication': ['premium'], // Communication
  'communicative': ['nonverbal'], // communicative
  'community': ['exile', 'premium'], // Community
  'compact': ['loosen', 'porous', 'sprawl', 'sprawled', 'spread'], // compact
  'compassion': ['cruelty', 'heavy', 'scorn'], // Compassion
  'competence': ['heavy', 'lost'], // Competence
  'competent': ['amateur'], // competent
  'competition': ['monopoly'], // competition
  'complacency': ['urgent', 'zeal'], // complacency
  'complacent': ['active', 'alert', 'aware', 'curious', 'dynamic', 'engaged', 'responsive', 'vigilant'], // complacent
  'complacent-serenity': ['agitation'], // complacent-serenity
  'complementary': ['disparate', 'saturation', 'tones'], // Complementary
  'complete': ['broken', 'disjointed', 'empty', 'flawed', 'folded', 'fracture', 'incomplete', 'lacking', 'leak', 'loading', 'missed', 'partial', 'scrap', 'tear', 'vacant', 'void'], // complete
  'complete-manifestation': ['incomplete', 'vacant'], // complete-manifestation
  'completeness': ['flaw', 'glimpse'], // completeness
  'completing': ['obliterating'], // completing
  'completion': ['absence', 'chaos', 'disarray', 'disruption', 'fragment', 'incompletion', 'neglect', 'void', 'yearning'], // completion
  'complex': ['accessible', 'artless', 'basic', 'easy', 'lightweight', 'mono', 'naive', 'null', 'obvious', 'plain', 'primitive', 'rudimentary', 'simple', 'simplify', 'single', 'straightforward', 'trivial'], // complex
  'complexity': ['flattening', 'fleshless', 'lucidity', 'minimize', 'monoculture', 'neat', 'sparsity'], // Complexity
  'compliance': ['resistance'], // compliance
  'compliant': ['chaotic', 'contrary', 'defiant', 'disorderly', 'nonconformist', 'rebellious', 'resistant', 'unruly'], // compliant
  'complicate': ['simplify'], // complicate
  'complicating': ['simplifying'], // complicating
  'complication': ['balance', 'clarity', 'ease', 'harmony', 'order', 'plainness', 'simplicity', 'simplification', 'solutions', 'unity'], // complication
  'composed': ['frantic', 'heavy'], // Composed
  'compositing': ['illustration', 'isolate', 'led', 'photography'], // Compositing
  'composition': ['contrast', 'design', 'display', 'docs', 'drawer', 'drop', 'effects', 'elegant', 'elements', 'experimental', 'fashion', 'font', 'fonts', 'header', 'image', 'interactions', 'interactive', 'light', 'like', 'loading', 'luxurious', 'magazine', 'measurement', 'menu', 'minimalistic', 'modal', 'modern', 'monospace', 'music', 'old', 'page', 'portfolio', 'product', 'random', 'sophisticated', 'space', 'spacious', 'states', 'static', 'timeline', 'ui', 'underline'], // Composition
  'composure': ['agitation', 'chaos', 'confusion', 'disorder', 'distress', 'panic', 'restlessness', 'turmoil', 'unrest'], // composure
  'compress': ['magnify'], // compress
  'compressed': ['unhurried'], // compressed
  'compressing': ['diffusing', 'expanding', 'freeing', 'loosening', 'releasing', 'spreading', 'unfolding'], // compressing
  'computational': ['improvised'], // Computational
  'computing': ['premium'], // Computing
  'conceal': ['uncover', 'unveiling'], // conceal
  'concealed': ['apparent', 'clear', 'exposed', 'manifest', 'obvious', 'open', 'publishing', 'revealed', 'transparency', 'visible'], // concealed
  'concealing': ['clear', 'displaying', 'exposing', 'obvious', 'open', 'revealing', 'showing', 'transparent'], // concealing
  'concealment': ['glimpse', 'self-expression', 'unveiling'], // concealment
  'concentrate': ['disperse'], // concentrate
  'concentrated': ['chaotic', 'diffuse', 'dispersed', 'dispersed-tone', 'distracted', 'loose', 'random', 'scattered', 'uncertain', 'vague'], // Concentrated
  'concentrating': ['diluting', 'dissolving'], // concentrating
  'concentration': ['dissipation'], // concentration
  'concentricity': ['asymmetry', 'chaos', 'chaotic', 'disorder', 'dispersed', 'divergence', 'eccentric', 'fragmentation', 'offset', 'randomness', 'scattering', 'separation'], // Concentricity
  'conception': ['chaos', 'disorder', 'disruption', 'emptiness', 'fragmentation', 'void'], // Conception
  'conceptual-formalism': ['wacky'], // conceptual-formalism
  'concise': ['extraneous', 'rambling'], // concise
  'conciseness': ['verbosity'], // conciseness
  'concord': ['contradiction', 'deceit', 'disunity', 'harmonic-clash'], // Concord
  'concrete': ['airy', 'biophilic', 'disembodiment', 'endless', 'flexible', 'fluid', 'freeform', 'imaginary', 'intangible', 'light', 'natural', 'organic', 'rural', 'soft', 'theoretical', 'vague'], // concrete
  'concreteness': ['abstract', 'chaotic', 'disjointed', 'fleeting', 'fluid', 'incoherent', 'indeterminate', 'liminality', 'vague'], // concreteness
  'condensed': ['serif'], // Condensed
  'confidence': ['awkwardness', 'discomfort', 'disillusion', 'distrust', 'doubt', 'doubting', 'fear', 'guilt', 'heavy', 'hesitation', 'shame'], // Confidence
  'confident': ['awkward', 'backward', 'confused', 'doubtful', 'gentle', 'hesitant', 'humble', 'muted', 'shy', 'timid', 'uncertain', 'understated', 'uneasy', 'vacant', 'vulnerable'], // Confident
  'confine': ['expand', 'freeness'], // confine
  'confined': ['blockchain', 'breezy', 'freeform', 'limitless', 'unbound', 'unconfined', 'unformed', 'unfounded', 'unhurried', 'unified', 'uninterrupted', 'unsteady', 'untamed', 'vast'], // confined
  'confinement': ['liberation'], // Confinement
  'confining': ['airy', 'expansive', 'fluid', 'free', 'liberated', 'open', 'unbound', 'unfolding', 'vast'], // confining
  'confirming': ['diluting'], // confirming
  'conflict': ['accord', 'agreement', 'alignment', 'balance', 'consensus', 'cooperation', 'harmony', 'peace', 'symbiosis', 'unify', 'unity'], // conflict
  'conflicted': ['clear', 'cohesive', 'direct', 'effortless', 'focused', 'harmonious', 'resolved', 'settled', 'simple', 'unified'], // conflicted
  'conflicting': ['blended', 'harmonic'], // conflicting
  'conform': ['disrupt', 'diverge', 'individual', 'innovate', 'nonconform', 'unique'], // conform
  'conformist': ['anarchic', 'defiant', 'rebel'], // conformist
  'conformity': ['counterculture', 'customization', 'idiosyncrasy', 'resistance', 'self-expression', 'uniqueness'], // conformity
  'confront': ['accept', 'avoid', 'calm', 'embrace', 'escape', 'evade', 'gentle', 'harmony', 'peace', 'retreat', 'surrender'], // confront
  'confused': ['certain', 'clear', 'coherent', 'confident', 'direct', 'focused', 'identified', 'literacy', 'logical', 'lucid', 'sane', 'simple', 'understood'], // confused
  'confusing': ['clear', 'coherent', 'defined', 'direct', 'focused', 'informative', 'organized', 'simple', 'simplifying', 'straightforward'], // confusing
  'confusion': ['annotation', 'belief', 'certainty', 'clarity', 'coherence', 'command', 'composure', 'definition', 'depiction', 'edutainment', 'efficacy', 'focus', 'fortitude', 'harmony', 'integrity', 'interpretation', 'lucidity', 'marketing', 'meaning', 'messaging', 'method', 'objectivity', 'order', 'outlining', 'resolve', 'scholarship', 'sense', 'simplicity', 'solutions', 'statement', 'understanding', 'visualization'], // confusion
  'conglomerating': ['dividing', 'isolating', 'simplifying'], // conglomerating
  'connect': ['alienation', 'break', 'collapse', 'detach', 'detachment', 'disassemble', 'disconnect', 'disunity', 'divide', 'division', 'estrangement', 'evade', 'isolate', 'isolation', 'separate', 'separation', 'split', 'tear'], // connect
  'connected': ['absent', 'detached', 'disjoint', 'disjointed', 'distant', 'divisive', 'fracture', 'segregated', 'tightened'], // connected
  'connecting': ['isolating'], // connecting
  'connection': ['abandon', 'abandonment', 'alienation', 'closing', 'detachment', 'exile', 'expulsion', 'heavy', 'negation', 'shunning'], // Connection
  'connectivity': ['premium'], // Connectivity
  'conquer': ['chaos', 'defeat', 'disorder', 'division', 'fail', 'fear', 'hesitation', 'uncertain', 'weakness'], // conquer
  'conscientious': ['premium'], // Conscientious
  'conscious': ['mindless', 'oblivious'], // Conscious
  'consensus': ['anarchy', 'chaos', 'conflict', 'counterculture', 'disagreement', 'dissent', 'disunity', 'diversity', 'indifference', 'subjectivity', 'uncertainty'], // consensus
  'consequence': ['acausal', 'arbitrary', 'chaos', 'disorder', 'impunity', 'random', 'uncertainty'], // Consequence
  'conservation': ['consumption', 'destruction', 'development', 'exploitation', 'neglect', 'waste'], // Conservation
  'conservative': ['vanguard'], // conservative
  'consider': ['dismiss', 'disregard'], // consider
  'considerate': ['careless', 'selfish'], // considerate
  'consideration': ['negligence'], // consideration
  'consistency': ['anomaly', 'contradiction', 'fluke', 'mismatch', 'paradox'], // consistency
  'consistent': ['discordant', 'disjointed', 'disparate', 'dragged', 'fickle', 'postlude', 'reactive', 'shaky', 'splotchy', 'uneven', 'unreliable', 'unstable', 'variable', 'volatile'], // consistent
  'consolidate': ['chaos', 'disperse', 'disunity', 'divide', 'fragment', 'loose', 'radial-break', 'scatter', 'separate'], // Consolidate
  'constancy': ['adaptability', 'change', 'chaos', 'disorder', 'fluctuation', 'flux', 'instability', 'transience', 'uncertainty', 'variability'], // constancy
  'constant': ['changing', 'chaotic', 'dynamic', 'evanescent', 'fickle', 'fleeting', 'flicker', 'fluid', 'folding', 'morph', 'mutable', 'random', 'shift', 'sudden', 'suddenness', 'tangential', 'uncertain', 'variable', 'variant', 'wavering'], // constant
  'constrain': ['expand'], // constrain
  'constrained': ['endlessness', 'freestyle', 'heavy', 'limitless', 'loose', 'unbound'], // Constrained
  'constraining': ['empowering'], // constraining
  'constraint': ['chaos', 'expansion', 'fluidity', 'freedom', 'freeness', 'freetime', 'liberty', 'openness', 'release', 'unbound'], // Constraint
  'constrict': ['airy', 'expand', 'flexible', 'fluid', 'free', 'loose', 'open', 'overflow', 'release', 'spacious'], // constrict
  'constricted': ['spread'], // constricted
  'construct': ['destroy', 'disassemble', 'erode', 'unravel'], // Construct
  'construction': ['destruction'], // construction
  'constructive': ['futile'], // constructive
  'constructivism': ['deconstructivism'], // constructivism
  'consulting': ['anarchy', 'chaos', 'disorder', 'ignorance', 'randomness'], // Consulting
  'consume': ['create', 'disperse', 'generate', 'gift', 'offer', 'produce', 'share', 'sustain'], // consume
  'consumption': ['abstinence', 'conservation', 'creation', 'frugality', 'production'], // Consumption
  'contain': ['emit', 'overflow', 'spill'], // contain
  'contained': ['chaotic', 'disordered', 'endlessness', 'erupt', 'expansive', 'fluid', 'free', 'loose', 'open', 'spread', 'unbounded', 'unconfined', 'unfolded'], // contained
  'containment': ['emission', 'spill'], // Containment
  'contemplation': ['heavy'], // Contemplation
  'contemplative': ['heavy'], // Contemplative
  'contemporary': ['ancient', 'historical', 'museum', 'retrofuturism'], // contemporary
  'contempt': ['admiration', 'admire', 'admiring', 'affection', 'favor', 'respect', 'veneration'], // contempt
  'content': ['anxious', 'frustration', 'restless', 'uneasy'], // content
  'contented': ['restless', 'uneasy'], // contented
  'contentment': ['displeasure', 'dissatisfaction', 'guilt', 'heavy', 'panic', 'shame'], // Contentment
  'context': ['ambiguity', 'chaos', 'disconnect', 'disorder', 'ignorance', 'narrative-absence', 'random', 'vacuum', 'void'], // context
  'continental': ['marine'], // continental
  'continuation': ['end', 'ended'], // continuation
  'continue': ['deadend'], // continue
  'continuity': ['closing', 'finality', 'fracture'], // Continuity
  'continuous': ['fracture', 'segmented', 'staccato', 'stopped'], // continuous
  'contract': ['expand'], // contract
  'contradiction': ['agreement', 'certainty', 'clarity', 'coherence', 'concord', 'consistency', 'harmony', 'simplicity', 'unity'], // Contradiction
  'contrary': ['compliant'], // contrary
  'contrast': ['composition', 'cool', 'cozy', 'display', 'docs', 'drawer', 'drop', 'effects', 'elegant', 'elements', 'experimental', 'fashion', 'font', 'fonts', 'header', 'image', 'interactions', 'interfacing', 'like', 'loading', 'luxurious', 'magazine', 'measurement', 'menu', 'minimalistic', 'minimize', 'modal', 'modern', 'monoculture', 'monospace', 'old', 'page', 'portfolio', 'product', 'sameness', 'sophisticated', 'space', 'spacious', 'states', 'timeline', 'ui', 'unison', 'unity'], // Contrast
  'contrasted': ['blended'], // contrasted
  'contrasting': ['neumorphic'], // contrasting
  'contrived': ['genuine'], // contrived
  'control': ['disempowerment', 'freeness', 'heavy', 'liberation', 'overflow', 'risk', 'sovereignty', 'submission'], // Control
  'controlled': ['anarchic', 'feral', 'fumbled', 'loose', 'postlude', 'splat', 'unruly', 'unstable', 'untamed'], // controlled
  'convenience': ['arduous', 'cumbersome', 'premium', 'tedious'], // Convenience
  'convention': ['invention'], // convention
  'conventional': ['improvised', 'informal', 'irreverent', 'offbeat', 'subjective', 'vanguard'], // conventional
  'conviction': ['doubt', 'doubting'], // conviction
  'convolution': ['chaos', 'disarray', 'disperse', 'fragment', 'loosen', 'scatter', 'separate', 'simplification', 'simplify'], // convolution
  'cool': ['blazing', 'burnt', 'contrast', 'cozy', 'cyberpunk', 'dramatic', 'duotone', 'energetic', 'fiery', 'food', 'friendly', 'gradient', 'heat', 'heated', 'ignite', 'intensify', 'inviting', 'melt', 'molten', 'monochromatic', 'monochrome', 'muted', 'neon', 'nonprofit', 'ochre', 'pastel', 'powerful', 'rainbow', 'saturation', 'sepia', 'sports', 'stale', 'startup', 'strict', 'travel', 'triadic', 'understated', 'vibrant', 'warm', 'welcoming'], // Cool
  'coolness': ['awkward', 'energetic', 'expressive', 'fervor', 'food', 'friendly', 'gradient', 'inviting', 'lame', 'monochromatic', 'monochrome', 'muted', 'neon', 'nonprofit', 'pastel', 'rainbow', 'sepia', 'sports', 'startup', 'strict', 'tones', 'travel', 'triadic', 'understated', 'vibrant', 'warm', 'welcoming'], // Coolness
  'cooperation': ['conflict', 'war'], // cooperation
  'copy': ['invention'], // copy
  'core': ['facade', 'husk'], // Core
  'corner': ['chaos', 'circle', 'disperse', 'edge', 'isolation', 'scatter', 'simplicity', 'uncertain', 'void'], // corner
  'corporate': ['childcare', 'media', 'non-profit', 'playful', 'text', 'type'], // Corporate
  'corrupt': ['certain', 'clear', 'honest', 'integrity', 'pure', 'purity', 'right', 'trustworthy', 'virtuous'], // corrupt
  'corruption': ['honesty', 'innocence', 'integrity', 'purity', 'trust'], // corruption
  'cosmetics': ['bare', 'essential', 'heavy', 'natural', 'plain', 'raw', 'rough', 'simple', 'unadorned', 'unrefined', 'utilitarian'], // Cosmetics
  'cosmic': ['petty'], // Cosmic
  'couch': ['athlete'], // couch
  'counterculture': ['conformity', 'consensus', 'mainstream', 'norms', 'orthodoxy', 'statusquo', 'tradition', 'uniformity'], // Counterculture
  'courage': ['fear'], // courage
  'courteous': ['rude'], // courteous
  'cover': ['uncover'], // cover
  'covered': ['bare', 'exposed', 'naked', 'open', 'revealed', 'untouched', 'visible'], // covered
  'covert': ['apparent', 'blatant', 'exhibition', 'exposed', 'obvious', 'open', 'overlook', 'overt', 'revealed', 'transparent', 'visible'], // covert
  'cowardice': ['valor'], // cowardice
  'cozy': ['cold', 'contrast', 'cool', 'cyberpunk', 'dramatic', 'duotone', 'expressive'], // Cozy
  'craft': ['deeptech', 'edtech', 'manufacturing', 'robotics'], // Craft
  'crafted': ['massproduced'], // crafted
  'craggy': ['even', 'polished', 'smooth', 'soft'], // Craggy
  'craving': ['heavy'], // Craving
  'crazy': ['sane'], // crazy
  'create': ['break', 'consume', 'damage', 'destroy', 'erode', 'finish'], // create
  'creating': ['erasing', 'obliterating'], // creating
  'creation': ['consumption', 'destruction', 'obliteration', 'ruin'], // Creation
  'creativity': ['drudgery', 'idleness'], // Creativity
  'crisp': ['bokeh', 'smoky', 'thaw', 'unfocused', 'viscous'], // Crisp
  'crisp-white': ['blotchy'], // crisp-white
  'critical': ['naive'], // critical
  'critique': ['approval', 'embrace', 'premium'], // Critique
  'crooked': ['clear', 'honest', 'integral', 'orderly', 'pure', 'simple', 'smooth', 'straight'], // crooked
  'crowded': ['rural', 'single', 'sparsity', 'vacancy'], // crowded
  'crowned': ['bareheads', 'barren', 'common', 'humble', 'ordinary', 'plain', 'simple', 'subdued', 'unadorned'], // crowned
  'crude': ['clear', 'delicate', 'dignity', 'elaborate', 'elegant', 'nuanced', 'polished', 'refined', 'sophisticated', 'subtle', 'yielding'], // crude
  'cruelty': ['care', 'compassion', 'empathy', 'gentleness', 'kindness', 'love', 'support', 'warmth'], // cruelty
  'crystalline': ['murky'], // Crystalline
  'cube': ['cylinder'], // cube
  'cubism': ['chaos', 'disorder', 'field', 'flatness', 'fluidity', 'literal', 'randomness', 'simplicity', 'spontaneity'], // Cubism
  'cultivate': ['chaotic', 'destroy', 'dismantle', 'ignore', 'neglect', 'random', 'uncertain', 'waste'], // Cultivate
  'cultivated': ['chaotic', 'disordered', 'neglected', 'raw', 'terrain', 'uncontrolled', 'unrefined', 'untamed', 'wild', 'wilderness'], // cultivated
  'cultivation': ['destruction'], // Cultivation
  'culture': ['premium', 'savage'], // Culture
  'cultured': ['vulgar'], // cultured
  'cumbersome': ['aerodynamic', 'bright', 'convenience', 'dynamic', 'easy', 'fluid', 'light', 'playful', 'simple', 'vivid'], // cumbersome
  'curation': ['design', 'illustration', 'led', 'synthesis'], // Curation
  'curatorial': ['premium'], // Curatorial
  'curiosity': ['boredom', 'disinterest', 'heavy'], // Curiosity
  'curious': ['bored', 'complacent', 'disinterested', 'heavy'], // Curious
  'current': ['ancient', 'archaic', 'artifact', 'historical', 'obsolete'], // current
  'curse': ['gift'], // curse
  'curtained': ['bare', 'candid-notation', 'clear', 'exposed', 'open', 'plain', 'revealed', 'transparent', 'visible'], // Curtained
  'curvature': ['editorial', 'flatten', 'harmony', 'symmetry', 'unity'], // Curvature
  'curved': ['angularity', 'blocky', 'square'], // curved
  'curvilinear-harmony': ['disarrayed'], // curvilinear-harmony
  'curvy': ['angular', 'boxy', 'even', 'flat', 'linear', 'narrow', 'rectangular', 'rigid', 'sharp', 'straight'], // curvy
  'customization': ['conformity', 'generic', 'impersonality', 'monotony', 'ordinariness', 'sameness', 'standardization', 'uniformity'], // Customization
  'cyanic': ['muddy'], // cyanic
  'cyberpunk': ['cool', 'cozy', 'warm'], // Cyberpunk
  'cycle': ['finality'], // Cycle
  'cylinder': ['cube', 'flat', 'hollow', 'plane', 'void'], // Cylinder
  'cynical': ['naive'], // cynical
  'cynicism': ['hopeful', 'naivety'], // cynicism
  'damage': ['build', 'create', 'enhance', 'nurture', 'repair', 'restore', 'skincare', 'strength', 'value', 'wholeness'], // damage
  'damaged': ['intact'], // damaged
  'dampen': ['amplify', 'motivate'], // dampen
  'danger': ['safety'], // danger
  'dangerous': ['healthy'], // dangerous
  'daring': ['cautious'], // daring
  'dark': ['breezy', 'brilliant', 'glare', 'highlight', 'light', 'ochre', 'phosphor', 'positive', 'shine', 'shiny', 'wash'], // Dark
  'darken': ['ignite'], // darken
  'darkness': ['beacon', 'brightness', 'clarity', 'glow', 'light', 'lightness', 'lucidity', 'luminance', 'morning', 'radiance', 'reflectivity', 'shine', 'vividness'], // darkness
  'dashboard': ['sprawl'], // Dashboard
  'data': ['premium'], // Data
  'dawn': ['blackout', 'dimness', 'dusk'], // Dawn
  'day': ['dusk', 'end', 'night', 'pause', 'rest', 'sleep', 'stagnation', 'stillness', 'void'], // Day
  'daylight': ['eclipse', 'nocturn'], // daylight
  'dazzling': ['bland', 'drab', 'dull', 'faded', 'flat', 'muted', 'plain', 'subdued-illumination', 'unremarkable'], // dazzling
  'dead': ['alive', 'bio', 'live', 'liveliness', 'phosphor', 'thrive'], // dead
  'deadend': ['continue', 'expansion', 'flow', 'journey', 'open', 'path', 'pathway', 'progress', 'rise'], // deadend
  'death': ['beginning', 'growth', 'hope', 'immortality', 'joy', 'life', 'light', 'rebirth', 'vitality'], // death
  'debt': ['payments', 'profit'], // debt
  'decay': ['development', 'renew', 'thrive'], // Decay
  'deceit': ['certainty', 'clarity', 'concord', 'honesty', 'integrity', 'sincerity', 'trust', 'truth', 'unity'], // deceit
  'decentralization': ['monopoly'], // Decentralization
  'deceptive': ['authentic', 'clear', 'genuine', 'honest', 'open', 'real', 'sincere', 'transparent', 'trustworthy'], // deceptive
  'decide': ['waver'], // decide
  'decisive': ['ambiguous', 'chaotic', 'delay', 'delayed', 'hesitant', 'indecisive', 'random', 'tentativeness', 'uncertain', 'unstable', 'vague'], // decisive
  'decisiveness': ['hesitation'], // decisiveness
  'decline': ['ascendancy', 'development', 'improvement', 'peak', 'raise', 'rise', 'soar', 'success', 'thrive'], // decline
  'deco': ['disjointed'], // Deco
  'deconstruct': ['integrate', 'synthesize'], // deconstruct
  'deconstructivism': ['cohesive', 'constructivism', 'harmony', 'integrated', 'minimalism', 'order', 'ordered', 'simple', 'stable', 'structuralism', 'traditional', 'uniform'], // Deconstructivism
  'deconstructivist': ['intact'], // Deconstructivist
  'decorated': ['bare', 'bland', 'dull', 'empty', 'minimal', 'plain', 'simple', 'unadorned', 'unadorned-truth', 'untouched'], // decorated
  'decrease': ['raise', 'rise'], // decrease
  'deemphasize': ['highlight'], // deemphasize
  'deep': ['shallow', 'superficial', 'weak'], // deep
  'deeptech': ['basic', 'chaotic', 'commodity', 'craft', 'disorderly', 'dull', 'low-tech', 'naive', 'ordinary', 'shallow', 'simple', 'traditional'], // DeepTech
  'default': ['typecraft'], // default
  'defeat': ['conquer', 'success', 'victory'], // defeat
  'defeated': ['active', 'alive', 'aspirant', 'empowered', 'hopeful', 'successful', 'triumphant', 'victorious', 'winning'], // defeated
  'defended': ['vulnerable'], // defended
  'defenseless': ['shielded'], // defenseless
  'defiance': ['heavy', 'obedience', 'submission'], // Defiance
  'defiant': ['agreeable', 'compliant', 'conformist', 'docile', 'obedient', 'passive', 'submissive', 'vulnerability', 'yielding'], // defiant
  'deficiency': ['bounty', 'excellence', 'might', 'wealth'], // deficiency
  'deficient': ['fertile', 'filled', 'fortified'], // deficient
  'deficit': ['produce', 'profit'], // deficit
  'define': ['vacate'], // define
  'defined': ['blobby', 'bokeh', 'brushstroke', 'confusing', 'disembodied', 'endless', 'endlessness', 'erased', 'faceless', 'freeform', 'freestyle', 'fuzzy', 'imprecise', 'impure', 'indistinct', 'interstitial', 'lost', 'muffled', 'nebulous', 'neumorphic', 'nowhere', 'obscuring', 'pixelation', 'scrap', 'scrawl', 'shifty', 'smeared', 'smoky', 'unfocused', 'unformed', 'unfounded', 'ungendered', 'ungrounded', 'unknown', 'unvalued', 'veiling'], // defined
  'defined-space': ['ungrounded'], // defined-space
  'definite': ['ambiguous', 'chaotic', 'disorderly', 'fictional', 'fluid', 'imaginary', 'intangible', 'interstitial', 'nebulous', 'random', 'uncertain', 'undefined', 'unstable', 'vague', 'wobbly'], // definite
  'definition': ['ambiguity', 'blurb', 'chaos', 'confusion', 'erasure', 'fog', 'fuzz', 'impression', 'indeterminacy', 'messiness', 'obscurity', 'vagueness'], // definition
  'delay': ['active', 'affirmative', 'certain', 'decisive', 'immediate', 'prompt', 'resolved', 'rush', 'urgency'], // delay
  'delayed': ['active', 'certain', 'decisive', 'immediate', 'instant', 'prompt', 'resolved', 'sudden', 'suddenness', 'urgent'], // delayed
  'deliberate': ['arbitrary', 'artless', 'careless', 'chaotic', 'erratic', 'frivolous', 'fumbled', 'hasty', 'improvised', 'impulsive', 'instinct', 'random', 'spontaneous', 'unplanned'], // Deliberate
  'deliberate-chaos': ['method'], // deliberate-chaos
  'deliberate-composition': ['unplanned'], // deliberate-composition
  'delicate': ['brutal', 'crude', 'garish', 'grotesque', 'resilient', 'thick', 'weighty'], // delicate
  'delight': ['bore', 'displeasure', 'dissatisfaction', 'pain', 'sorrow'], // delight
  'delusion': ['awakening'], // delusion
  'demand': ['abandon', 'aversion', 'disdain', 'disinterest', 'distraction', 'indifference', 'leisure', 'neglect', 'rejection'], // demand
  'demanding': ['easy', 'leisurely'], // demanding
  'demotivate': ['encourage'], // demotivate
  'denial': ['acceptance', 'access', 'acknowledgment', 'belief', 'certainty', 'clarity', 'faith', 'reality', 'truth'], // denial
  'dense': ['aero', 'foamy', 'hollow', 'lightweight', 'loosen', 'minimalistic', 'plasma', 'porous', 'simplify', 'spacious', 'sprawl', 'stratosphere', 'thin', 'translucency'], // Dense
  'density': ['airiness', 'sparsity'], // density
  'dentistry': ['anarchy', 'chaos', 'disorder', 'neglect', 'pain', 'wild'], // Dentistry
  'deny': ['accept', 'affirm'], // deny
  'depart': ['remain'], // depart
  'dependable': ['unreliable'], // dependable
  'dependence': ['autonomy', 'detachment', 'freedom', 'independence', 'liberty', 'self', 'solipsism', 'solitude', 'sovereignty'], // dependence
  'depiction': ['ambiguity', 'chaos', 'confusion', 'non-representation', 'vagueness'], // depiction
  'depictive': ['abstract', 'bland', 'chaotic', 'dull', 'indistinct', 'non-representational', 'random', 'simple', 'vague'], // depictive
  'deplete': ['abound', 'enhance', 'enrich', 'fill', 'increase', 'multiply', 'nourish', 'supply', 'surplus'], // deplete
  'depletion': ['abundance', 'augmentation', 'bounty', 'fullness', 'growth', 'ingredients', 'materials', 'plenty', 'richness', 'saturation', 'surplus', 'wealth'], // Depletion
  'depress': ['encourage'], // depress
  'depressed': ['raised'], // depressed
  'deprivation': ['abundance', 'access', 'expansion', 'freedom', 'growth', 'liberation', 'nourishment', 'prosperity', 'release', 'sustenance'], // deprivation
  'depth': ['2d', 'facade', 'flatten', 'flattening', 'fleshless', 'summit'], // depth
  'dermatology': ['orthodontics'], // dermatology
  'descend': ['ascend', 'climb', 'elevate', 'gain', 'increase', 'lift', 'rise', 'soar'], // descend
  'descent': ['ascent', 'elevation', 'near', 'rise', 'up'], // descent
  'desert': ['nautical'], // desert
  'deserted': ['hotels'], // deserted
  'design': ['composition', 'curation', 'detail', 'irrational', 'muddle', 'scribble', 'sloppiness'], // Design
  'desire': ['heavy'], // Desire
  'desktop': ['wearables'], // desktop
  'desolate': ['bustling', 'fertile'], // Desolate
  'desolation': ['flotilla'], // desolation
  'despair': ['cherishing', 'dream', 'euphoria', 'exuberance', 'fullness', 'hopeful', 'might', 'utopia'], // despair
  'despairing': ['alive', 'bright', 'clear', 'energized', 'hopeful', 'joyful', 'optimistic', 'uplifting', 'vibrant'], // despairing
  'despise': ['admire', 'cherish'], // despise
  'destroy': ['build', 'construct', 'create', 'cultivate', 'foster', 'harmony', 'nurturing', 'repair', 'restore', 'sculpt', 'unite'], // destroy
  'destruction': ['building', 'conservation', 'construction', 'creation', 'cultivation', 'development', 'growth', 'harmony', 'museum', 'produce', 'repair', 'unity', 'winery'], // destruction
  'detach': ['attach', 'bind', 'combine', 'connect', 'integrate', 'join', 'merge', 'unify'], // detach
  'detached': ['attached', 'bound', 'collaborative', 'connected', 'embraced', 'empathetic', 'engaged', 'immerse', 'immersed', 'integrated', 'interactive', 'involved', 'participatory', 'root', 'rooting', 'unified', 'user-centric'], // detached
  'detaching': ['rooting'], // detaching
  'detachment': ['affection', 'attachment', 'attraction', 'cherishing', 'childcare', 'closeness', 'collectivism', 'connect', 'connection', 'dependence', 'embrace', 'empathy', 'engage', 'engagement', 'envelopment', 'fandom', 'fervor', 'inclusion', 'interaction', 'intimacy', 'involvement', 'messaging', 'participation', 'passion', 'roots', 'self-expression', 'togetherness'], // Detachment
  'detail': ['design', 'erasure', 'illustration', 'led', 'painting', 'pixelation', 'synthesis', 'typography'], // Detail
  'detailed': ['artless', 'bokeh', 'pixelation', 'rudimentary'], // detailed
  'deteriorate': ['renew'], // deteriorate
  'deterioration': ['enhancement', 'flourishing', 'growth', 'improvement', 'prosperity', 'renewal', 'revival', 'strength', 'vitality'], // deterioration
  'determined': ['resigned'], // determined
  'deterring': ['attractive'], // deterring
  'detrimental': ['healthy'], // detrimental
  'devalue': ['valuing'], // devalue
  'develop': ['finish', 'past'], // develop
  'developer-centric': ['user-centric'], // developer-centric
  'development': ['conservation', 'decay', 'decline', 'destruction', 'ended', 'obsolete', 'stagnation'], // Development
  'devoid': ['fertile'], // devoid
  'diagonal': ['level'], // Diagonal
  'dialogue': ['disconnection', 'isolation', 'monologue', 'silence', 'solitude', 'stagnation'], // dialogue
  'difference': ['monoculture'], // difference
  'difficulty': ['success'], // difficulty
  'diffuse': ['concentrated', 'labeled', 'specific'], // diffuse
  'diffusing': ['compressing'], // diffusing
  'digital': ['brushstroke', 'freight', 'horology', 'illustration', 'led', 'painting', 'typography', 'winery'], // Digital
  'digital art': ['murals'], // digital art
  'digitization': ['premium'], // Digitization
  'dignity': ['crude', 'disgrace', 'humiliation', 'indecency', 'informality', 'shame', 'vulgarity'], // Dignity
  'diligence': ['negligence'], // diligence
  'diligent': ['laziness', 'negligent'], // diligent
  'diluting': ['clarifying', 'concentrating', 'confirming', 'embodying', 'enhancing', 'fortifying', 'intensifying', 'saturating', 'solidifying'], // diluting
  'dim': ['blinding', 'glare', 'gleaming', 'heat', 'highlight', 'ignite', 'phosphor', 'shine', 'visible', 'vividness'], // dim
  'dimension': ['flatten', 'flattening'], // dimension
  'dimensional': ['2d', 'flat'], // dimensional
  'diminish': ['amplify', 'expand', 'magnify', 'overpower', 'raise', 'rise'], // diminish
  'diminished': ['empowering', 'overlook'], // diminished
  'diminishing': ['emerging'], // diminishing
  'diminution': ['amplification', 'augmentation', 'enrichment', 'enthusiasm', 'expansion', 'fullness', 'intensification', 'presence', 'vitality'], // Diminution
  'diminutive': ['colossal', 'enormous', 'expansive', 'giant', 'huge', 'immense', 'massive', 'scale', 'vast'], // diminutive
  'dimming': ['amplifying', 'blazing', 'bright', 'flashy', 'glare', 'loud', 'radiant', 'shining', 'vivid'], // dimming
  'dimness': ['brightness', 'cheerfulness', 'clarity', 'dawn', 'lightness', 'liveliness', 'luminance', 'radiance', 'vibrancy'], // dimness
  'din': ['calm', 'harmony', 'order', 'peace', 'quiet', 'quietude', 'silence', 'stillness', 'tranquil'], // din
  'dip': ['peak'], // dip
  'direct': ['circuitous', 'conflicted', 'confused', 'confusing', 'filtered', 'heavy', 'interference', 'labyrinthine', 'oblique', 'symbolic', 'tangential', 'veiled', 'veiling'], // Direct
  'directness': ['editorial', 'idiosyncrasy', 'interference', 'obscured', 'twisted', 'vague'], // Directness
  'dirt': ['affluence', 'bright', 'clean', 'clear', 'eco-tech', 'fresh', 'polished', 'pure', 'refined', 'skincare', 'smooth'], // dirt
  'dirty': ['spotless'], // dirty
  'disagree': ['accept'], // disagree
  'disagreement': ['consensus'], // disagreement
  'disappear': ['appear', 'arrive', 'emerge', 'exist', 'manifest', 'materialize', 'presence', 'present', 'remain', 'surface'], // disappear
  'disappearing': ['appearing', 'emerging'], // disappearing
  'disappointment': ['hopeful'], // disappointment
  'disapproval': ['acceptance', 'affirmative', 'agreement', 'appreciation', 'approval', 'endorsement', 'favor', 'satisfaction', 'support'], // disapproval
  'disarray': ['align', 'command', 'completion', 'convolution', 'selfcare'], // disarray
  'disarrayed': ['coherent', 'curvilinear-harmony', 'harmonious', 'neat', 'orderly', 'organized', 'structured', 'systematic', 'tidy'], // disarrayed
  'disassemble': ['assemble', 'build', 'combine', 'connect', 'construct', 'form', 'gather', 'integrate', 'sculpt', 'unify'], // disassemble
  'disband': ['assemble', 'binding', 'collect', 'gather', 'manifesting', 'nexus', 'unite'], // disband
  'disbelief': ['belief'], // disbelief
  'discard': ['adopt', 'assemble', 'cast', 'collect', 'merchandise', 'organize', 'preserve', 'retain'], // discard
  'disciplined': ['anarchic', 'slacker'], // disciplined
  'disclosure': ['envelopment'], // disclosure
  'discomfort': ['certainty', 'clarity', 'comfort', 'confidence', 'ease', 'harmony', 'relaxation', 'serenity', 'tranquility'], // discomfort
  'disconnect': ['connect', 'context', 'engage', 'integrate', 'interlink', 'unite'], // Disconnect
  'disconnected': ['integrated', 'user-centric', 'wearables'], // disconnected
  'disconnection': ['annotation', 'attachment', 'closeness', 'dialogue', 'embrace', 'fandom', 'fusion', 'interaction', 'interfacing', 'messaging', 'metaverse', 'togetherness'], // disconnection
  'discontent': ['pleased', 'satisfied', 'success'], // discontent
  'discord': ['harmony', 'unison'], // discord
  'discordant': ['balanced', 'cohesive', 'consistent', 'harmonic', 'harmonious', 'harmonious-blend', 'melodic', 'serene', 'symphonic', 'unified'], // discordant
  'discourage': ['encourage', 'expand', 'motivate', 'positive'], // discourage
  'discovery': ['oblivion'], // Discovery
  'discreet': ['blatant', 'obtrusive', 'overt'], // discreet
  'discretion': ['blatancy', 'blunt', 'brazen', 'chaotic', 'exposed', 'indiscretion', 'loud', 'obvious', 'obviousness', 'outspoken', 'reckless', 'transparency'], // Discretion
  'disdain': ['admiration', 'admire', 'admiring', 'affection', 'appreciate', 'cherish', 'cherishing', 'demand', 'favor', 'fervor', 'kindness', 'regard', 'sightful', 'veneration'], // disdain
  'disdainful': ['admiring', 'cherishing', 'valuing'], // disdainful
  'disembodied': ['defined', 'embodied', 'embodied-experience', 'solid', 'tangible'], // disembodied
  'disembodiment': ['concrete', 'embodiment', 'existing', 'material', 'presence', 'real', 'solid', 'tangible'], // disembodiment
  'disempowering': ['empowering'], // disempowering
  'disempowerment': ['agency', 'clarity', 'control', 'empowerment', 'presence', 'strength', 'unity', 'wholeness'], // disempowerment
  'disengage': ['engage'], // disengage
  'disengaged': ['engaged', 'immerse'], // disengaged
  'disengagement': ['involvement', 'participation'], // disengagement
  'disengaging': ['attracting'], // disengaging
  'disfavor': ['favor'], // disfavor
  'disgrace': ['dignity'], // disgrace
  'disguise': ['authenticity', 'clarity', 'gesture', 'honesty', 'identity', 'openness', 'representation', 'reveal', 'transparency', 'trust'], // disguise
  'disheveled': ['elegant', 'formal', 'neat', 'orderly', 'polished', 'refined', 'sleekness', 'structured', 'tidy'], // disheveled
  'dishonesty': ['integrity', 'sincerity'], // dishonesty
  'disillusion': ['anticipation', 'belief', 'clarity', 'confidence', 'faith', 'hope', 'reality', 'satisfaction', 'truth'], // disillusion
  'disillusionment': ['belief'], // disillusionment
  'disinterest': ['attraction', 'curiosity', 'demand', 'engage', 'engagement', 'enthusiasm', 'excitement', 'fandom', 'fascination', 'fervor', 'fixation', 'interest', 'involvement', 'marketing', 'need', 'participation', 'passion', 'recruitment', 'zeal'], // disinterest
  'disinterested': ['active', 'curious', 'engaged', 'enthusiastic', 'interested', 'invested', 'involved', 'passionate'], // disinterested
  'disjoint': ['coherent', 'connected', 'empathetic', 'engaged', 'harmonious', 'inclusive', 'integrate', 'interested', 'intertwined', 'merged', 'passionate'], // disjoint
  'disjointed': ['coherent', 'cohesive', 'collaborative', 'complete', 'concreteness', 'connected', 'consistent', 'deco', 'flowing', 'harmonious', 'integrated', 'seamless', 'smooth', 'superimposition', 'synchronized', 'unified'], // disjointed
  'dislike': ['accept', 'admire', 'appreciate', 'approval', 'embrace', 'enjoy', 'favor', 'like', 'support'], // dislike
  'dismal': ['bright', 'cheerful', 'euphoric', 'hopeful', 'joyful', 'lively', 'radiant', 'uplifting', 'vibrant'], // dismal
  'dismantle': ['cultivate', 'sculpt'], // dismantle
  'dismiss': ['accept', 'acknowledge', 'admire', 'affirm', 'appreciate', 'celebrate', 'cherish', 'consider', 'embrace', 'encourage', 'engage', 'grasp', 'like', 'regard', 'support', 'value', 'valuing', 'welcome'], // dismiss
  'dismissal': ['acceptance', 'admiring', 'embrace', 'engagement', 'favor', 'inclusion', 'recognition', 'recruitment', 'respect', 'veneration'], // dismissal
  'dismissed': ['embraced'], // dismissed
  'dismissive': ['affirmative', 'appreciative', 'bright', 'cherishing', 'engaged', 'expansive', 'inclusive', 'receptive', 'valued', 'vivid'], // dismissive
  'disobedience': ['obedience'], // disobedience
  'disobedient': ['obedient'], // disobedient
  'disorder': ['aesthetics', 'align', 'analytics', 'ascendancy', 'axis', 'balance', 'beat', 'bind', 'calculation', 'catering', 'centrality', 'childcare', 'clarity', 'classicism', 'climate', 'cohesion', 'command', 'composure', 'concentricity', 'conception', 'conquer', 'consequence', 'constancy', 'consulting', 'context', 'cubism', 'dentistry', 'ecosystem', 'edtech', 'efficacy', 'engineering', 'fortitude', 'freight', 'grading', 'harmony', 'healthtech', 'horology', 'integrity', 'marketing', 'method', 'modelling', 'monopoly', 'mosaic', 'museum', 'normalcy', 'nourishment', 'nucleus', 'order', 'organization', 'outlining', 'payments', 'resolve', 'rows', 'scholarship', 'sense', 'settle', 'sightful', 'solutions', 'stability', 'structure', 'typecraft', 'unify', 'unity', 'utopia', 'watches', 'watchmaking'], // disorder
  'disordered': ['charted', 'coherent', 'contained', 'cultivated', 'doctrinal', 'exact', 'formed', 'intact', 'level', 'logical', 'planned', 'practical', 'procedural', 'resolved', 'scheduled', 'sequential', 'settled', 'simplifying', 'solidity'], // disordered
  'disorderly': ['arranged', 'bakery', 'behavioral', 'coherent', 'compliant', 'deeptech', 'definite', 'formality', 'functionalist', 'harmonic', 'methodical', 'modelling', 'neat', 'orderly', 'organized', 'rational', 'regulated', 'remote', 'structured', 'systematic', 'tame', 'unified'], // disorderly
  'disorganized': ['coherent', 'methodical', 'neat', 'orderly', 'organized', 'pragmatic-visuals', 'structured', 'systematic', 'tidy'], // disorganized
  'disparate': ['aligned', 'cohesive', 'complementary', 'consistent', 'harmonious', 'integrated', 'matched', 'similar', 'uniform'], // disparate
  'dispassionate': ['animated', 'emotional', 'engaged', 'expressive', 'intense', 'involved', 'passionate', 'sensory', 'vibrant'], // dispassionate
  'dispersal': ['editorial', 'encasement', 'envelopment', 'fixation', 'fusion', 'harmony', 'roots'], // Dispersal
  'disperse': ['assemble', 'capture', 'cluster', 'concentrate', 'consolidate', 'consume', 'convolution', 'corner', 'gather', 'imprint', 'integrate', 'manifesting', 'point', 'synthesize'], // disperse
  'dispersed': ['aggregate', 'cloistered', 'concentrated', 'concentricity', 'merged', 'regression', 'unified'], // Dispersed
  'dispersed-tone': ['concentrated'], // dispersed-tone
  'dispersing': ['rooting'], // dispersing
  'dispersion': ['editorial', 'harmony'], // Dispersion
  'display': ['composition', 'contrast', 'hide', 'shroud'], // Display
  'displaying': ['concealing', 'hiding'], // displaying
  'displeased': ['pleased', 'satisfied'], // displeased
  'displeasure': ['approval', 'contentment', 'delight', 'harmony', 'joy', 'pleasure', 'satisfaction', 'unity'], // displeasure
  'disposable': ['cherished', 'durable', 'enduring', 'essential', 'heritage-craft', 'permanent', 'sustainable', 'timeless', 'valued', 'watchmaking'], // disposable
  'disregard': ['acknowledge', 'admiration', 'admire', 'advertising', 'affirm', 'appreciate', 'attention', 'cherish', 'consider', 'engrave', 'focus', 'inquiry', 'milestone', 'promotion', 'publishing', 'recognition', 'regard', 'respect', 'statement', 'value', 'valuing'], // disregard
  'disregarded': ['acknowledged', 'embraced', 'emphasized', 'focused', 'highlighted', 'identified', 'noted', 'organized', 'presented', 'profit-driven', 'valued'], // disregarded
  'disrespect': ['respect'], // disrespect
  'disrupt': ['align', 'conform', 'harmonize', 'integrate', 'loop', 'render', 'repeat', 'settle', 'stabilize', 'standardize', 'unify'], // disrupt
  'disrupted': ['uninterrupted'], // disrupted
  'disruption': ['completion', 'conception', 'stability'], // Disruption
  'dissatisfaction': ['approval', 'comfort', 'contentment', 'delight', 'happiness', 'joy', 'pleasure', 'satisfaction'], // dissatisfaction
  'dissatisfied': ['pleased', 'satisfied', 'settled'], // dissatisfied
  'dissent': ['consensus'], // dissent
  'dissipate': ['manifesting'], // dissipate
  'dissipation': ['accumulation', 'assembly', 'coherence', 'concentration', 'fixation', 'focus', 'harmony', 'integration', 'solidarity', 'unity'], // dissipation
  'dissolution': ['ecosystem'], // dissolution
  'dissolve': ['imprint', 'solidify', 'synthesize'], // dissolve
  'dissolving': ['building', 'concentrating', 'enhancing', 'focusing', 'intensifying', 'sculpting', 'solidifying', 'strengthening', 'uniting'], // dissolving
  'dissonance': ['museum', 'unify', 'unison'], // dissonance
  'dissonant': ['harmonic', 'symphonic'], // dissonant
  'dissuade': ['encourage'], // dissuade
  'distance': ['closeness', 'embrace', 'intimacy', 'proximity', 'togetherness', 'unity'], // distance
  'distant': ['accessible', 'connected', 'empathetic', 'engaged', 'experiential', 'familiar', 'foreground', 'immerse', 'intimate', 'near', 'obtainable', 'present', 'visible', 'warm'], // distant
  'distinct': ['aggregate', 'ambiguous', 'bland', 'blended', 'common', 'faceless', 'false', 'generic', 'indistinct', 'interstitial', 'merged', 'muffled', 'nebulous', 'pedestrian', 'sameness', 'smeared', 'subduing', 'unfocused', 'vague'], // Distinct
  'distinction': ['bland', 'common', 'indistinct', 'overlapping', 'uniform'], // distinction
  'distinctive': ['ordinary'], // distinctive
  'distinctness': ['indistinct'], // Distinctness
  'distortion': ['integrity', 'objectivity'], // Distortion
  'distracted': ['attentive', 'aware', 'centered', 'concentrated', 'engaged', 'focused', 'intent', 'mindful', 'observant'], // distracted
  'distraction': ['advertising', 'demand', 'edutainment', 'heavy'], // Distraction
  'distress': ['composure', 'flawless', 'polished', 'pristine', 'smooth', 'well-being'], // Distress
  'distressed': ['fresh', 'neat', 'orderly', 'perfect', 'polished', 'pristine', 'refined', 'smooth'], // Distressed
  'distributed': ['unified'], // Distributed
  'distribution': ['editorial', 'harmony'], // Distribution
  'distrust': ['confidence', 'faith', 'honesty', 'interest', 'like', 'openness', 'sincerity', 'transparency', 'trust'], // distrust
  'disunity': ['agreement', 'cohesion', 'concord', 'connect', 'consensus', 'consolidate', 'fusion', 'harmony', 'solidarity', 'synergy', 'togetherness', 'unity'], // disunity
  'diurnus': ['nocturn'], // diurnus
  'diverge': ['align', 'conform', 'integrate'], // diverge
  'divergence': ['concentricity'], // Divergence
  'divergent': ['analogous', 'normalcy'], // divergent
  'diverse': ['binary', 'homogeneous', 'mono', 'monochrome', 'monotonous', 'repetitive', 'similar', 'uniform'], // Diverse
  'diversity': ['consensus', 'minimize', 'monoculture', 'monopoly', 'sameness'], // Diversity
  'divide': ['assemble', 'blend', 'combine', 'connect', 'consolidate', 'harmonize', 'integrate', 'interlink', 'merge', 'synthesis', 'synthesize', 'unify', 'unite'], // divide
  'divided': ['integrated', 'shared', 'unified', 'united', 'whole'], // divided
  'dividing': ['blending', 'cohesive', 'combining', 'conglomerating', 'harmonizing', 'integrating', 'merging', 'uniting', 'whole'], // dividing
  'division': ['connect', 'conquer', 'fusion', 'interfacing', 'togetherness', 'unison'], // division
  'divisive': ['cohesive', 'collective', 'connected', 'harmonious', 'inclusive', 'inclusivity', 'integrated', 'unifying', 'whole'], // divisive
  'diy': ['catering'], // diy
  'docile': ['defiant', 'rebel'], // docile
  'docs': ['composition', 'contrast', 'messy'], // Docs
  'doctrinal': ['chaotic', 'disordered', 'flexible', 'fluid', 'informal', 'informal-inquiry', 'open', 'random', 'spontaneous'], // doctrinal
  'dogma': ['interpretation'], // dogma
  'dome': ['broken'], // Dome
  'domestic': ['nautical', 'premium'], // Domestic
  'domesticated': ['feral'], // domesticated
  'dominance': ['editorial', 'harmony', 'humble', 'submission'], // Dominance
  'dominant': ['peripheral'], // dominant
  'donation': ['payments'], // donation
  'dormancy': ['activity', 'awakening', 'brightness', 'energy', 'flourish', 'growth', 'life', 'movement', 'pulse', 'vitality'], // dormancy
  'dormant': ['activating', 'active', 'alert', 'alive', 'appearing', 'bustling', 'dynamic', 'energized', 'energy', 'flourishing', 'moving', 'vibrant'], // dormant
  'dot': ['wave'], // Dot
  'doubt': ['accept', 'affirm', 'assurance', 'belief', 'certainty', 'confidence', 'conviction', 'faith', 'hopeful', 'security', 'trust', 'valor'], // doubt
  'doubtful': ['assured', 'believing', 'certain', 'clear', 'confident', 'positive', 'reassuring', 'robust', 'secure', 'trusting'], // doubtful
  'doubting': ['acceptance', 'affirmation', 'assurance', 'certainty', 'confidence', 'conviction', 'faith', 'skyward', 'trust'], // doubting
  'douse': ['ignite'], // douse
  'down': ['above', 'rise', 'top', 'up'], // down
  'downcast': ['elevated', 'engaged', 'enthusiastic', 'excited', 'harmonious', 'joyful', 'passionate', 'upbeat', 'vibrant'], // downcast
  'drab': ['attractive', 'bold', 'brilliant', 'colorful', 'dazzling', 'dynamic', 'fullness', 'highlight', 'liveliness', 'lively', 'radiant', 'rich', 'stimulating', 'vibrant', 'vividness'], // drab
  'drag': ['bright', 'cheerful', 'dynamic', 'energize', 'exciting', 'lift', 'lively', 'uplift', 'vibrant'], // drag
  'dragged': ['calm', 'consistent', 'easy', 'free', 'gentle', 'predictable', 'smooth', 'steady', 'uplift'], // dragged
  'drain': ['bold', 'bright', 'cheerful', 'colorful', 'lively', 'radiant', 'rich', 'saturation', 'vibrant'], // drain
  'drained': ['alive', 'bright', 'dynamic', 'energetic', 'energized', 'full', 'lively', 'rich', 'vibrant'], // drained
  'draining': ['energizing', 'enriching', 'exciting', 'invigorating', 'refreshing', 'stimulating', 'uplifting', 'vibrant'], // draining
  'dramatic': ['calm', 'cool', 'cozy', 'harmony', 'play', 'warm'], // Dramatic
  'drawer': ['composition', 'contrast'], // Drawer
  'drawing': ['erased', 'illustration', 'led'], // Drawing
  'dream': ['clarity', 'despair', 'dullness', 'fact', 'failure', 'reality', 'stagnation'], // dream
  'dreamlike': ['led'], // Dreamlike
  'dreariness': ['exuberance'], // dreariness
  'dreary': ['bright', 'cheerful', 'jovial', 'joyful', 'lively', 'radiant', 'uplifted', 'uplifting-contrast', 'vibrant'], // dreary
  'drift': ['root'], // Drift
  'drifting': ['rooting'], // drifting
  'drive': ['heavy', 'idleness', 'passivity', 'rest', 'sloth'], // Drive
  'driven': ['laziness', 'lazy', 'slack', 'slacker'], // Driven
  'drop': ['composition', 'contrast', 'peak', 'raise', 'rise', 'soar'], // Drop
  'dropped': ['raised'], // dropped
  'drought': ['produce', 'profit'], // drought
  'drown': ['bloom', 'expand', 'float', 'rise', 'shine', 'surge', 'thrive', 'uplift'], // drown
  'drowsy': ['awake'], // drowsy
  'drudgery': ['creativity', 'dynamism', 'energy', 'excitement', 'freedom', 'hobby', 'joy', 'leisure', 'playfulness', 'vibrancy'], // drudgery
  'dry': ['absorbent', 'alive', 'aqueous', 'bakery', 'beverage', 'bright', 'cloudy', 'colorful', 'dynamic', 'flood', 'foliage', 'lush', 'muddy', 'oceanic', 'plump', 'rich', 'splash', 'steam', 'sweet', 'symphonic', 'vibrant', 'viscous', 'wet'], // dry
  'dull': ['adorned', 'adventurous', 'aether', 'alluring', 'apex', 'art', 'attracting', 'attractive', 'beverage', 'blazing', 'bold', 'bright', 'brilliant', 'captivating', 'dazzling', 'decorated', 'deeptech', 'depictive', 'dynamic', 'elaborate', 'exceptional', 'exciting', 'extraordinary', 'fiery', 'flamboyant', 'flashy', 'flawless', 'glare', 'gleaming', 'graded', 'heated', 'highlight', 'ignited', 'ingenuity', 'intensify', 'kaleidoscopic', 'lavish', 'liveliness', 'lively', 'macro', 'murals', 'novel', 'perfect', 'phosphor', 'pleasant', 'propulsive', 'rich', 'scholarly', 'shine', 'shiny', 'stellar', 'stimulating', 'storyful', 'striking', 'thrive', 'thunders', 'unleash', 'uproarious', 'vibrant', 'vibration', 'vividness', 'volatile', 'wearables', 'xr', 'yachting', 'youthfulness', 'zesty'], // dull
  'dullard': ['animated', 'bold', 'colorful', 'dynamic', 'engaging', 'exciting', 'intellect', 'lively', 'vibrant'], // dullard
  'dullness': ['aesthetics', 'awakening', 'beauty', 'dream', 'edutainment', 'euphoria', 'exuberance', 'hype', 'liveliness', 'might', 'reflectivity', 'richness', 'stimulation', 'zeal'], // dullness
  'duotone': ['cool', 'cozy', 'harmony', 'key', 'play'], // Duotone
  'duplicity': ['sincerity'], // duplicity
  'durable': ['disposable'], // durable
  'durables': ['bakery'], // durables
  'dusk': ['dawn', 'day', 'light', 'morning', 'sunrise'], // Dusk
  'duty': ['freetime', 'hobby'], // duty
  'dwelling': ['vacate'], // Dwelling
  'dynamic': ['2d', 'artifact', 'banal', 'barren', 'base', 'bland', 'blocky', 'blunt', 'bore', 'bored', 'boring', 'boxy', 'complacent', 'constant', 'cumbersome', 'dormant', 'drab', 'drag', 'drained', 'dry', 'dull', 'dullard', 'faceless', 'frozen', 'glacial', 'halt', 'halted', 'hushing', 'idle', 'insipid', 'introverted', 'lame', 'lazy', 'lethargic', 'lifeless', 'mediocre', 'mono', 'monotonous', 'mundane', 'null', 'ordinary', 'passive', 'paused', 'pedestrian', 'plain', 'regression', 'repetitive', 'reserved', 'slack', 'slacker', 'sluggish', 'staged', 'stale', 'stiff', 'stifled', 'stilted', 'stopped', 'stuck', 'stuffy', 'subduing', 'suppressed', 'tedious', 'timid', 'tired', 'unchanged', 'unchanging', 'unmoved', 'vacancy', 'weak', 'weary'], // dynamic
  'dynamism': ['drudgery', 'editorial', 'harmony'], // Dynamism
  'dysfunction': ['efficacy'], // dysfunction
  'dystopia': ['utopia'], // dystopia
  'dystopic': ['bright', 'hopeful', 'ideal', 'joyful', 'optimistic', 'peaceful', 'positive', 'utopian', 'utopic'], // dystopic
  'earnest': ['heavy', 'insincere', 'silly', 'superficial'], // Earnest
  'earth': ['absence', 'aether', 'artifice', 'chaos', 'ether', 'futility', 'sky', 'stratosphere', 'unreality', 'void'], // earth
  'earthbound': ['stellar'], // earthbound
  'earthen': ['artificial', 'emerald', 'energetic', 'hues', 'indigo', 'iridescent', 'key', 'limited', 'nocturne', 'palette', 'pop', 'primary', 'shadow', 'silver', 'stark', 'varied'], // Earthen
  'earthiness': ['abstract', 'alien', 'artificial', 'artificiality', 'otherworldly', 'sterile', 'synthetic'], // Earthiness
  'earthly': ['stellar'], // earthly
  'earthy': ['alien'], // earthy
  'ease': ['agitation', 'agony', 'anguish', 'awkwardness', 'backward', 'burden', 'complication', 'discomfort', 'frustration', 'grind', 'guilt', 'hassle', 'heavy', 'imposition', 'narrowness', 'obstacle', 'pain', 'panic', 'strain', 'stress', 'strife', 'struggle', 'torment', 'warning', 'weight'], // Ease
  'easy': ['agitated', 'arduous', 'burdened', 'burdensome', 'challenging', 'chaotic', 'complex', 'cumbersome', 'demanding', 'dragged', 'hard', 'harried', 'intense', 'laborious', 'stern', 'stiff', 'stilted', 'strange', 'strenuous', 'stressful', 'tense', 'tightened', 'uneasy'], // easy
  'eccentric': ['concentricity', 'mainstream', 'normal'], // eccentric
  'eccentricity': ['classicism'], // eccentricity
  'eclectic': ['editorial', 'harmony', 'monotonous', 'predictable'], // Eclectic
  'eclipse': ['brightness', 'clarity', 'daylight', 'exposure', 'light', 'origin', 'radiance', 'shine', 'visibility'], // Eclipse
  'eco-tech': ['chaos', 'dirt', 'fossil', 'heavy', 'obsolete', 'pollute', 'polluting', 'toxic', 'unsustainable', 'waste', 'wasteful'], // Eco-tech
  'ecology': ['pollution', 'premium'], // Ecology
  'ecosystem': ['chaos', 'disorder', 'dissolution', 'fragmentation', 'isolation'], // Ecosystem
  'edge': ['corner', 'editorial', 'harmony'], // Edge
  'edgy': ['sweet'], // edgy
  'editorial': ['centered', 'centrality', 'chiaroscuro', 'cleanliness', 'clustering', 'curvature', 'directness', 'dispersal', 'dispersion', 'distribution', 'dominance', 'dynamism', 'eclectic', 'edge', 'focus', 'geometry', 'grace', 'intricate', 'linearity', 'luminosity', 'monumental', 'negative', 'ornamentation', 'perspective', 'polish', 'portrait', 'simplicity', 'simplification', 'sleekness', 'softness', 'spatial', 'spontaneity', 'tension', 'texture', 'unbounded', 'uniformity', 'variety'], // Editorial
  'edtech': ['analogue', 'basic', 'chaos', 'craft', 'disorder', 'ignorance', 'industrial', 'manual', 'obsolete', 'traditional'], // EdTech
  'educated': ['illiterate'], // educated
  'education': ['stupidity'], // Education
  'edutainment': ['abstract', 'academic', 'boredom', 'chaos', 'confusion', 'distraction', 'dullness', 'ignorance', 'neglect', 'professional', 'pure entertainment'], // Edutainment
  'eerie': ['heavy', 'sane'], // Eerie
  'effective': ['futile', 'impractical', 'pointless'], // effective
  'effects': ['basis', 'composition', 'contrast'], // Effects
  'efficacy': ['chaos', 'confusion', 'disorder', 'dysfunction', 'emptiness', 'failure', 'ineffectiveness', 'inefficacy', 'inefficiency', 'waste'], // Efficacy
  'efficiency': ['sloppiness'], // Efficiency
  'efficient': ['impractical', 'wasteful'], // efficient
  'effort': ['idleness'], // effort
  'effortful': ['imperfect'], // effortful
  'effortless': ['arduous', 'burdensome', 'conflicted', 'heavy', 'strenuous'], // Effortless
  'elaborate': ['bare', 'basic', 'crude', 'dull', 'minimal', 'plain', 'rudimentary', 'simple', 'sparse', 'stoic'], // elaborate
  'elderly-care': ['childcare'], // elderly-care
  'electrified': ['heavy', 'unmoved'], // Electrified
  'electronics': ['jewelry'], // electronics
  'elegance': ['brutality', 'filth', 'squalor'], // elegance
  'elegant': ['brutal', 'brutalist', 'clumsy', 'clunky', 'composition', 'contrast', 'crude', 'disheveled', 'faddish', 'frumpy', 'fussy', 'gaudy', 'gritty', 'grotesque', 'grungy', 'janky', 'ragged', 'scrappy', 'shabby', 'sloppy', 'streetwear', 'tacky', 'vulgar', 'wacky'], // Elegant
  'elements': ['composition', 'contrast'], // Elements
  'elevate': ['descend', 'low', 'lower', 'plummet', 'plunge', 'regress'], // elevate
  'elevated': ['downcast', 'lower', 'petty', 'trivial'], // Elevated
  'elevation': ['descent', 'flattening', 'plummet'], // Elevation
  'elite': ['average', 'basic', 'casual-collection', 'cheap', 'common', 'inferior', 'mediocre', 'ordinary', 'simple', 'subpar'], // Elite
  'elusive': ['achievable', 'obtainable'], // elusive
  'emanation': ['ice', 'suppression'], // Emanation
  'embodied': ['disembodied'], // embodied
  'embodied-experience': ['disembodied'], // embodied-experience
  'embodiment': ['disembodiment'], // Embodiment
  'embodying': ['diluting'], // embodying
  'embrace': ['abandon', 'alienation', 'confront', 'critique', 'detachment', 'disconnection', 'dislike', 'dismiss', 'dismissal', 'distance', 'evade', 'expulsion', 'isolation', 'reject', 'rejecting', 'resign', 'separation', 'shunning', 'solitude'], // embrace
  'embraced': ['alienated', 'detached', 'dismissed', 'disregarded', 'excluded', 'ignored', 'neglected', 'rejected', 'repelled'], // embraced
  'embracing': ['fleeing', 'rejecting', 'shunning', 'withholding'], // embracing
  'emerald': ['earthen', 'energetic', 'hues', 'indigo', 'iridescent', 'limited', 'nocturne', 'palette', 'pop', 'primary', 'shadow', 'silver', 'stark', 'varied'], // Emerald
  'emerge': ['disappear', 'hide', 'past'], // emerge
  'emergence': ['ended', 'endgame', 'suppression'], // Emergence
  'emerging': ['diminishing', 'disappearing', 'fading', 'vanishing'], // emerging
  'emission': ['absorption', 'clarity', 'containment', 'inhalation', 'purity', 'retention'], // Emission
  'emissive': ['absorbent'], // Emissive
  'emit': ['absorb', 'contain', 'restrict', 'suppress'], // emit
  'emotion': ['objectivity'], // Emotion
  'emotional': ['dispassionate', 'rational', 'stoic'], // emotional
  'emotional-design': ['rational'], // emotional-design
  'emotionalist': ['logical'], // emotionalist
  'empathetic': ['aloof', 'apathetic', 'callous', 'cold', 'detached', 'disjoint', 'distant', 'harsh', 'indifferent', 'selfish', 'unfeeling'], // Empathetic
  'empathy': ['coldness', 'cruelty', 'detachment'], // Empathy
  'emphasis': ['erasure'], // emphasis
  'emphasize': ['forget', 'ignore', 'minimize'], // emphasize
  'emphasized': ['disregarded'], // emphasized
  'emphasizing': ['muting', 'suppressing'], // emphasizing
  'empirical': ['theoretical'], // empirical
  'empowered': ['defeated', 'heavy', 'suppressed', 'weakened'], // Empowered
  'empowering': ['constraining', 'diminished', 'disempowering', 'helpless', 'ineffective', 'oppressive', 'powerless', 'restricting', 'stifling', 'submissive', 'weak'], // Empowering
  'empowerment': ['disempowerment'], // Empowerment
  'emptiness': ['bounty', 'conception', 'efficacy', 'euphoria', 'flotilla', 'fullness', 'gravitas', 'ingredients', 'materials', 'microcosm', 'might', 'narrowness', 'need', 'nourishment', 'pressure', 'richness', 'sense', 'success'], // emptiness
  'empty': ['alive', 'beverage', 'bubble', 'buzz', 'closed', 'complete', 'decorated', 'fertile', 'filled', 'flood', 'freight', 'full', 'genuineness', 'humble', 'meaning', 'merchandise', 'mosaic', 'murals', 'skillful', 'unleash'], // Empty
  'encasement': ['dispersal', 'exposure', 'freedom', 'openness', 'transparency'], // Encasement
  'enclosed': ['chaotic', 'exposed', 'fluid', 'free', 'open', 'open-top', 'scattered', 'unbound'], // Enclosed
  'encourage': ['demotivate', 'depress', 'discourage', 'dismiss', 'dissuade', 'hinder', 'neglect', 'stifle'], // encourage
  'end': ['beginning', 'continuation', 'day', 'genesis', 'growth', 'immortality', 'inception', 'life', 'loop', 'open', 'repeat', 'rise', 'start'], // end
  'ended': ['becoming', 'beginning', 'continuation', 'development', 'emergence', 'expansion', 'flourish', 'growth', 'start'], // ended
  'endgame': ['beginning', 'emergence', 'exploration', 'growth', 'introduction', 'journey', 'prelude', 'start', 'unfolding'], // Endgame
  'endless': ['bounded', 'concrete', 'defined', 'finite', 'fixed', 'limit', 'limited', 'momentary', 'restrictive', 'temporal', 'temporary'], // endless
  'endlessness': ['bounded', 'constrained', 'contained', 'defined', 'finite', 'limited', 'momentary', 'mortality', 'temporary'], // endlessness
  'endorsement': ['disapproval'], // endorsement
  'endurance': ['fleeing'], // Endurance
  'enduring': ['disposable', 'evanescent', 'fleeting', 'folding', 'momentary', 'mutable', 'temporary'], // Enduring
  'energetic': ['calm', 'cool', 'coolness', 'drained', 'earthen', 'emerald', 'laziness', 'lazy', 'lethargic', 'lifeless', 'monotonous', 'passive', 'peace', 'peaceful', 'rest', 'serene', 'sluggish', 'timid'], // Energetic
  'energize': ['drag'], // energize
  'energized': ['despairing', 'dormant', 'drained', 'tired', 'weary'], // energized
  'energizing': ['draining', 'tiring'], // energizing
  'energy': ['blackout', 'dormancy', 'dormant', 'drudgery', 'sloth', 'sluggish'], // Energy
  'engage': ['apathy', 'bore', 'detachment', 'disconnect', 'disengage', 'disinterest', 'dismiss', 'escape', 'evade', 'halt', 'ignore', 'indifference', 'neglect', 'retreat', 'vacate'], // engage
  'engaged': ['absent', 'aimless', 'aloof', 'apathetic', 'bored', 'complacent', 'detached', 'disengaged', 'disinterested', 'disjoint', 'dismissive', 'dispassionate', 'distant', 'distracted', 'downcast', 'idle', 'indifferent', 'laziness', 'mindless', 'oblivious', 'passive', 'resigned', 'shallow', 'slacker', 'uninvolved', 'unmoved'], // engaged
  'engaged-presence': ['absent'], // engaged-presence
  'engagement': ['abandon', 'abandonment', 'alienation', 'boredom', 'detachment', 'disinterest', 'dismissal', 'heavy', 'idleness', 'negation', 'negligence', 'passivity', 'shunning'], // Engagement
  'engaging': ['blunt', 'boring', 'dullard', 'insipid', 'isolating', 'lame', 'repellent', 'repelling', 'tedious', 'tiring'], // engaging
  'engineering': ['abstract', 'arts', 'chaos', 'disorder', 'humanities', 'improvisation', 'instability', 'mess', 'randomness', 'services', 'spontaneity'], // Engineering
  'engrave': ['disregard', 'erase', 'fade', 'ignore', 'neglect', 'obliterate', 'remove', 'simplify'], // Engrave
  'enhance': ['damage', 'deplete', 'erode', 'hinder', 'muffle', 'shrink'], // enhance
  'enhanced': ['erased'], // enhanced
  'enhancement': ['deterioration'], // enhancement
  'enhancing': ['diluting', 'dissolving', 'erasing'], // enhancing
  'enigmatic': ['straightforward'], // Enigmatic
  'enjoy': ['dislike'], // enjoy
  'enlightenment': ['ignorance'], // enlightenment
  'enormous': ['diminutive', 'tiny'], // enormous
  'enrich': ['deplete'], // enrich
  'enriching': ['draining'], // enriching
  'enrichment': ['diminution'], // enrichment
  'enter': ['evade'], // enter
  'enthusiasm': ['boredom', 'coldness', 'diminution', 'disinterest'], // enthusiasm
  'enthusiastic': ['apathetic', 'disinterested', 'downcast', 'lazy'], // enthusiastic
  'enticing': ['repelling'], // enticing
  'entire': ['partial'], // entire
  'envelop': ['strip', 'uncover', 'unveiling'], // Envelop
  'envelopment': ['detachment', 'disclosure', 'dispersal', 'exposure', 'freedom', 'isolation', 'openness', 'release', 'scattering', 'separation'], // Envelopment
  'ephemera': ['horology'], // ephemera
  'ephemeral': ['lingering', 'museum', 'permanent', 'perpetual', 'publishing', 'root', 'rooting'], // Ephemeral
  'ephemerality': ['perpetuity'], // ephemerality
  'epic': ['small'], // Epic
  'equality': ['inferior'], // equality
  'equipment': ['beverage'], // equipment
  'erase': ['affirm', 'engrave', 'imprint', 'sculpt'], // erase
  'erased': ['defined', 'drawing', 'enhanced', 'expressed', 'filled', 'highlighted', 'marked', 'present', 'visible'], // erased
  'erasing': ['adding', 'building', 'creating', 'enhancing', 'filling', 'layering', 'sculpting'], // erasing
  'erasure': ['assertion', 'clarity', 'definition', 'detail', 'emphasis', 'expression', 'painting', 'presence', 'visibility'], // erasure
  'ergonomic': ['restrictive'], // Ergonomic
  'erode': ['build', 'construct', 'create', 'enhance', 'expand', 'preserve', 'restore', 'solid', 'strengthen'], // erode
  'erratic': ['behavioral', 'deliberate', 'predictable'], // erratic
  'erupt': ['calm', 'contained', 'gentle', 'peaceful', 'quiet', 'smooth', 'still', 'subdue', 'subdued'], // Erupt
  'escape': ['bondage', 'confront', 'engage', 'immerse', 'remain', 'stuck'], // Escape
  'escapism': ['premium'], // Escapism
  'essence': ['facade', 'husk'], // essence
  'essential': ['cosmetics', 'disposable', 'extraneous', 'insignificant', 'irrelevant', 'obsolescence', 'obsolete', 'pointless', 'useless', 'worthless'], // essential
  'essentialism': ['excess'], // Essentialism
  'essentials': ['merchandise'], // essentials
  'establish': ['break'], // establish
  'established': ['unfounded', 'unvalued'], // established
  'estate': ['layout', 'serif'], // Estate
  'estrangement': ['closeness', 'connect'], // estrangement
  'eternal': ['brief', 'chronos', 'finite', 'fleeting', 'limited', 'momentary', 'perishable', 'temporary', 'transient'], // Eternal
  'eternal-now': ['fugitive'], // eternal-now
  'eternity': ['closing', 'fleeting', 'moment', 'mortality', 'temporary', 'transient'], // eternity
  'ether': ['earth'], // ether
  'ethereal-lightness': ['burdened'], // ethereal-lightness
  'euphoria': ['boredom', 'despair', 'dullness', 'emptiness', 'gloom', 'misery', 'sadness', 'sorrow', 'unhappiness'], // Euphoria
  'euphoric': ['dismal', 'heavy'], // Euphoric
  'european': ['exotic', 'premium'], // European
  'evade': ['approach', 'capture', 'confront', 'connect', 'embrace', 'engage', 'enter', 'expose', 'reveal'], // evade
  'evanescent': ['chronos', 'constant', 'enduring', 'fixed', 'immovable', 'lasting', 'permanent', 'solid', 'stable'], // Evanescent
  'even': ['bump', 'bumpy', 'craggy', 'curvy', 'oblique', 'splotchy', 'uneven', 'wavy'], // even
  'evening': ['morning'], // Evening
  'event': ['absence', 'monotony', 'silence', 'stagnation', 'void'], // Event
  'everyday': ['exceptional', 'extraordinary', 'rare', 'unique'], // everyday
  'everyday-eats': ['uncommon'], // everyday-eats
  'everyday-practicality': ['fictional'], // everyday-practicality
  'evidence': ['myth'], // evidence
  'evident': ['invisible', 'uncertain'], // evident
  'evolution': ['regression'], // Evolution
  'evolve': ['regress'], // Evolve
  'evolving': ['unchanged', 'unchanging'], // evolving
  'exact': ['ambiguous', 'chaotic', 'disordered', 'imprecise', 'imprecision', 'inexact', 'loose', 'postlude', 'random', 'vague'], // exact
  'exactness': ['impression'], // exactness
  'exaggeration': ['calm', 'focus', 'minimalism', 'order', 'restraint', 'simplicity', 'subtlety', 'understatement'], // exaggeration
  'excellence': ['deficiency', 'failure', 'inferiority', 'mediocrity', 'ordinariness'], // Excellence
  'exceptional': ['average', 'basic', 'bland', 'common', 'dull', 'everyday', 'mediocre', 'ordinary', 'pedestrian', 'unremarkable'], // exceptional
  'excess': ['essentialism', 'minimalism', 'moderation', 'plain', 'restraint', 'scarcity', 'simplicity', 'subdued'], // excess
  'excessive': ['basic', 'minimal', 'minimalistic', 'modest', 'ordinary', 'plain', 'simple', 'sparse', 'subdued'], // excessive
  'excite': ['bore', 'heavy'], // Excite
  'excited': ['apathetic', 'bored', 'downcast', 'numb'], // excited
  'excitement': ['boredom', 'disinterest', 'drudgery', 'heavy'], // Excitement
  'exciting': ['banal', 'bland', 'boring', 'drag', 'draining', 'dull', 'dullard', 'insipid', 'lame', 'lifeless', 'mediocre', 'monotonous', 'mundane', 'repetitive', 'stale', 'tedious', 'tiring'], // exciting
  'exclude': ['integrate'], // exclude
  'excluded': ['embraced', 'immerse'], // excluded
  'exclusive': ['cheap', 'collaborative', 'common', 'peripheral', 'public', 'ubiquitous'], // exclusive
  'exhibition': ['covert', 'illustration', 'led', 'private'], // Exhibition
  'exile': ['acceptance', 'belonging', 'community', 'connection', 'homecoming', 'inclusion', 'integration', 'sanctuary', 'unity'], // exile
  'exist': ['disappear', 'nonexist'], // exist
  'existence': ['absence', 'nonexist', 'nothing', 'obliteration', 'oblivion', 'void'], // existence
  'existent': ['absent'], // existent
  'existing': ['disembodiment', 'imaginary'], // existing
  'exit': ['remain'], // exit
  'exotic': ['common', 'european', 'familiar', 'mundane', 'ordinary', 'plain', 'predictable', 'simple', 'standard'], // exotic
  'expand': ['collapse', 'confine', 'constrain', 'constrict', 'contract', 'diminish', 'discourage', 'drown', 'erode', 'limit', 'plunge', 'reduce', 'regress', 'restrict', 'shrink', 'shrivel', 'thaw', 'wither'], // expand
  'expanded': ['folded'], // expanded
  'expanding': ['compressing', 'narrowing'], // expanding
  'expanse': ['narrowness'], // Expanse
  'expansion': ['bounded', 'closing', 'constraint', 'deadend', 'deprivation', 'diminution', 'ended', 'limitation', 'minimize', 'narrowing', 'narrowness', 'negation', 'reduction', 'restriction', 'suppression'], // Expansion
  'expansive': ['confining', 'contained', 'diminutive', 'dismissive', 'finite', 'limit', 'restrictive', 'small'], // expansive
  'expansive-freedom': ['bondage', 'captivity', 'restriction'], // expansive-freedom
  'expansiveness': ['petiteness'], // expansiveness
  'expected': ['offbeat'], // expected
  'expensive': ['cheap'], // expensive
  'experience': ['naivety'], // Experience
  'experiences': ['merchandise'], // experiences
  'experiential': ['distant', 'theoretical'], // Experiential
  'experimental': ['commercial', 'composition', 'contrast', 'mainstream', 'mundane'], // Experimental
  'experimentation': ['classicism'], // experimentation
  'expert': ['amateur'], // expert
  'expertise': ['clueless'], // Expertise
  'expire': ['active', 'begin', 'fresh', 'live', 'present', 'renew', 'start', 'sustain', 'vibrant'], // expire
  'explicit': ['ambiguous', 'general', 'subtext', 'uncertain', 'unclear', 'vague'], // explicit
  'exploitation': ['care', 'conservation', 'freedom', 'inclusion', 'nurture', 'philanthropy', 'support', 'unity'], // exploitation
  'exploration': ['captivity', 'endgame'], // exploration
  'explosive': ['calm', 'gentle', 'muted-emotion', 'peaceful', 'quiet', 'smooth', 'stable', 'static', 'subdued'], // explosive
  'expose': ['closed', 'evade', 'hide', 'lock', 'muffle', 'shroud', 'whisper'], // expose
  'exposed': ['armored', 'cloistered', 'concealed', 'covered', 'covert', 'curtained', 'discretion', 'enclosed', 'fortified', 'guarded', 'invisible', 'masked', 'obscuring', 'private', 'sealed', 'shielded', 'shrouded', 'veiled', 'veiling'], // exposed
  'exposing': ['concealing', 'hiding'], // exposing
  'exposure': ['eclipse', 'encasement', 'envelopment', 'hiding', 'safety', 'shield'], // Exposure
  'express': ['muffle'], // express
  'expressed': ['erased', 'suppressed'], // expressed
  'expressing': ['suppressing', 'withholding'], // expressing
  'expression': ['erasure', 'suppression'], // Expression
  'expressive': ['banal', 'bland', 'blunt', 'coolness', 'cozy', 'dispassionate', 'hushing', 'impersonal', 'introverted', 'nonverbal', 'reserved', 'stifled', 'stoic'], // Expressive
  'expulsion': ['absorption', 'acceptance', 'attachment', 'connection', 'embrace', 'inclusion', 'integration', 'reception', 'welcome'], // expulsion
  'exterior': ['interior'], // exterior
  'external': ['hidden', 'internal', 'intimate', 'introspective', 'inward', 'local', 'personal', 'private', 'subjective'], // external
  'extinguish': ['ignite'], // extinguish
  'extinguished': ['ignited'], // extinguished
  'extraneous': ['clear', 'concise', 'essential', 'focused', 'fundamental', 'integral', 'necessary', 'simple', 'tight'], // extraneous
  'extraordinary': ['basic', 'common', 'dull', 'everyday', 'mundane', 'normal', 'ordinary', 'pedestrian', 'standard', 'typical'], // extraordinary
  'extravagant': ['meager', 'sober'], // extravagant
  'extroverted': ['introverted', 'shy'], // extroverted
  'exuberance': ['apathy', 'calmness', 'despair', 'dreariness', 'dullness', 'gloom', 'indifference', 'melancholy', 'monotony', 'restraint', 'sadness', 'subtlety'], // Exuberance
  'exuberant': ['meager', 'restrained'], // exuberant
  'eyewear': ['bare', 'internal', 'natural'], // Eyewear
  'fable': ['fixed', 'literal', 'reality', 'rigid', 'serious', 'stale', 'truth'], // fable
  'fabric': ['wire'], // Fabric
  'fabricated': ['authentic', 'genuine', 'natural', 'real', 'simple', 'spontaneous', 'unadorned-truth'], // fabricated
  'facade': ['authentic', 'authenticity', 'core', 'depth', 'essence', 'genuine', 'inner', 'reality', 'substance', 'transparency', 'truth'], // Facade
  'face': ['fleshless'], // face
  'faceless': ['defined', 'distinct', 'dynamic', 'fleshy', 'fresh', 'identity', 'personable', 'sensible', 'vivid'], // faceless
  'facilitate': ['hinder'], // facilitate
  'fact': ['chaos', 'dream', 'false', 'falsehood', 'fantasy', 'fiction', 'illusion', 'impression', 'interpretation', 'lie', 'myth', 'unreal'], // fact
  'factory': ['artisanal', 'chaotic', 'freeform', 'handcrafted', 'handmade', 'natural', 'organic', 'spontaneous', 'unique', 'winery'], // factory
  'factual': ['fictional', 'imaginary'], // factual
  'faddish': ['classic', 'classic-integrity', 'elegant', 'serious', 'sophisticated', 'stable', 'subdued', 'timeless', 'traditional'], // faddish
  'fade': ['engrave', 'highlight', 'intensify', 'overpower', 'remain'], // fade
  'faded': ['brilliant', 'dazzling', 'fiery', 'gleaming', 'ignited', 'vividness'], // faded
  'fading': ['bold', 'emerging', 'intense', 'saturating', 'sharp', 'vivid'], // fading
  'fail': ['conquer', 'thrive'], // fail
  'failure': ['achievement', 'approval', 'ascendancy', 'dream', 'efficacy', 'excellence', 'fulfillment', 'gain', 'improvement', 'milestone', 'payments', 'produce', 'profit', 'prosperity', 'recognition', 'recruitment', 'satisfied', 'solutions', 'strength', 'success', 'triumph', 'utopia', 'victory'], // failure
  'faint': ['blazing', 'blinding', 'bold', 'burnt', 'foreground', 'glare', 'imprint', 'intense', 'loud', 'strident', 'striking', 'visible', 'vivid'], // faint
  'faith': ['denial', 'disillusion', 'distrust', 'doubt', 'doubting'], // faith
  'fake': ['authentic', 'genuine', 'genuineness', 'honest', 'original', 'real', 'sincere', 'true', 'valid'], // fake
  'fall': ['ascendancy', 'ascension', 'bright', 'full', 'life', 'prosperity', 'raise', 'rise', 'soar', 'spring'], // fall
  'false': ['authentic', 'certain', 'clear', 'distinct', 'fact', 'genuine', 'genuineness', 'honest', 'real', 'true', 'unveiled-truth', 'visible'], // false
  'falsehood': ['authentic', 'certainty', 'fact', 'genuine', 'reality', 'sincere', 'sincerity', 'truth', 'veracity'], // falsehood
  'fame': ['anonymity', 'common', 'isolation', 'neglect', 'obscurity', 'ordinary', 'simple', 'unnoticed'], // fame
  'familiar': ['alien', 'awkward', 'bizarre', 'distant', 'exotic', 'foreign', 'forgotten', 'frontier', 'fugitive', 'novel', 'strange', 'surprise', 'uncommon', 'unfamiliar', 'unhinged', 'unknown'], // familiar
  'familiarity': ['foreign', 'heavy', 'idiosyncrasy', 'strange'], // Familiarity
  'famous': ['anonymous', 'common', 'forgotten', 'ignored', 'insignificant', 'obscure', 'ordinary', 'unknown', 'unnoticed'], // famous
  'fandom': ['alienation', 'apathy', 'detachment', 'disconnection', 'disinterest', 'indifference', 'isolation', 'neglect'], // Fandom
  'fantasy': ['fact', 'hyperreal', 'normalcy', 'reality'], // Fantasy
  'fascinated': ['bored'], // fascinated
  'fascination': ['disinterest'], // fascination
  'fashion': ['composition', 'contrast', 'practical'], // Fashion
  'fast': ['slow', 'unhurried'], // fast
  'fast-food': ['healthy'], // fast-food
  'favor': ['aversion', 'contempt', 'disapproval', 'disdain', 'disfavor', 'dislike', 'dismissal', 'indifference', 'neglect', 'rejecting', 'rejection', 'unfavor'], // Favor
  'fear': ['calm', 'confidence', 'conquer', 'courage', 'hopeful', 'joy', 'peace', 'safety', 'trust', 'valor'], // fear
  'fearful': ['reassuring'], // fearful
  'fearless': ['cautious'], // fearless
  'feather': ['heavyweight'], // feather
  'feathery': ['weighty'], // feathery
  'feed': ['starve'], // feed
  'feral': ['calm', 'controlled', 'domesticated', 'gentle', 'orderly', 'peaceful', 'refined', 'structured', 'tame'], // feral
  'fertile': ['arid', 'barren', 'deficient', 'desolate', 'devoid', 'empty', 'lacking', 'poor', 'sterile'], // fertile
  'fervent': ['stoic'], // fervent
  'fervor': ['apathy', 'boredom', 'coolness', 'detachment', 'disdain', 'disinterest', 'indifference'], // fervor
  'fibrous': ['fluid', 'layered', 'metallic', 'scrolling', 'soft', 'synthetic', 'transparent'], // Fibrous
  'fickle': ['consistent', 'constant', 'fixed', 'loyal', 'predictable', 'reliability', 'reliable', 'stable', 'steadfast', 'steady'], // fickle
  'fiction': ['fact'], // fiction
  'fictional': ['actual', 'certain', 'definite', 'everyday-practicality', 'factual', 'genuine', 'literal', 'real', 'true'], // fictional
  'field': ['cubism'], // Field
  'fierce': ['bland', 'calm', 'gentle', 'gentle-hue', 'quiet', 'soft', 'subtle', 'tame', 'weak'], // Fierce
  'fiery': ['bland', 'calm', 'cold', 'cool', 'dull', 'faded', 'icy-palette', 'neutral', 'soft', 'subdued'], // fiery
  'figurative': ['abstract', 'basic', 'flat', 'formless', 'geometric', 'literal', 'non-representational', 'plain', 'raw', 'rough', 'simple'], // Figurative
  'fill': ['deplete'], // fill
  'filled': ['bare', 'blank', 'deficient', 'empty', 'erased', 'hollow', 'lacking', 'null', 'porous', 'sparse', 'thin', 'vacancy', 'vacant', 'void'], // filled
  'filling': ['erasing', 'narrowing'], // filling
  'filmic': ['illustration', 'led'], // Filmic
  'filtered': ['bold', 'candid', 'chaotic', 'direct', 'harsh', 'intense', 'raw', 'unfiltered', 'vivid'], // filtered
  'filtering': ['flood', 'illustration', 'led', 'overflow'], // Filtering
  'filth': ['brightness', 'clarity', 'cleanliness', 'elegance', 'freshness', 'neatness', 'order', 'purity', 'simplicity'], // filth
  'final': ['beginning', 'initial', 'ongoing', 'open', 'sketching', 'start'], // final
  'finale': ['beginning', 'commencement', 'initiation', 'introduction', 'launch', 'opening', 'prelude', 'premiere', 'start'], // Finale
  'finality': ['chaos', 'continuity', 'cycle', 'flux', 'freedom', 'infinity', 'openness', 'uncertainty', 'variability'], // finality
  'finance': ['gift', 'hobby', 'media'], // Finance
  'fine': ['janky', 'roughness', 'thick'], // Fine
  'fine art': ['murals'], // fine art
  'finish': ['begin', 'beginning', 'create', 'develop', 'generate', 'grow', 'initiate', 'open', 'start'], // finish
  'finished': ['incomplete', 'loading', 'ongoing', 'open', 'unfinished'], // finished
  'finite': ['boundless', 'endless', 'endlessness', 'eternal', 'expansive', 'globe', 'infinite', 'limitless', 'loop', 'nebula', 'perpetual', 'perpetuity', 'unlimited', 'vast'], // finite
  'finitude': ['immortality'], // finitude
  'fintech': ['analog', 'basic', 'chaotic', 'cluttered', 'legacy', 'manual', 'simple', 'static', 'traditional'], // Fintech
  'fire': ['frost', 'ice', 'water'], // Fire
  'firm': ['blobby', 'flexibility', 'hesitant', 'impotence', 'leak', 'malleable', 'melt', 'wavering', 'wobbly'], // firm
  'fit': ['frumpy'], // fit
  'fix': ['break'], // fix
  'fixation': ['adaptation', 'chaos', 'disinterest', 'dispersal', 'dissipation', 'freedom', 'neglect', 'release', 'unfocus'], // fixation
  'fixed': ['breezy', 'cellular', 'endless', 'evanescent', 'fable', 'fickle', 'fleeting', 'flexibility', 'flicker', 'flighty', 'folding', 'freeform', 'freestyle', 'hover', 'improvised', 'loose', 'loosen', 'malleable', 'mobile', 'mobility', 'mutable', 'parametric', 'plasma', 'reactive', 'serpentine', 'shift', 'shifting', 'spill', 'subjective', 'uncertain', 'unconfined', 'undulating', 'ungrounded', 'unsettled', 'unstable', 'unsteady', 'vague', 'variable', 'variant', 'wandering', 'wavering', 'wobbly', 'yachting'], // fixed
  'fixed-horizon': ['variable'], // fixed-horizon
  'fixity': ['change', 'chaos', 'fluid', 'flux', 'mobility', 'random', 'shifting', 'transformation', 'uncertainty', 'vague'], // fixity
  'flamboyant': ['dull', 'modest', 'mute', 'neutral', 'ordinary', 'plain', 'reserved', 'simple', 'subdued', 'unadorned'], // flamboyant
  'flashy': ['dimming', 'dull', 'muted', 'plain', 'simple', 'steady', 'subtle', 'understated'], // flashy
  'flat': ['apex', 'brilliant', 'bubble', 'bump', 'bumpy', 'caps', 'curvy', 'cylinder', 'dazzling', 'dimensional', 'figurative', 'foamy', 'folded', 'full', 'fuzzy', 'globe', 'graded', 'grading', 'kaleidoscopic', 'layered', 'liveliness', 'macro', 'neumorphic', 'oblique', 'phosphor', 'plump', 'pointed', 'raised', 'round', 'shine', 'shiny', 'splash', 'stimulating', 'storyful', 'strata', 'stratosphere', 'summit', 'terrain', 'textured', 'thunders', 'twist', 'twisted', 'undulating', 'veiling', 'vertex', 'vibration', 'volume', 'wave', 'wavy', 'xr', 'zesty'], // flat
  'flat-plane': ['raised'], // flat-plane
  'flatness': ['bump', 'cubism', 'raise'], // Flatness
  'flatten': ['bulge', 'curvature', 'depth', 'dimension', 'magnify', 'rise', 'sculpt', 'stack', 'volume'], // flatten
  'flattening': ['complexity', 'depth', 'dimension', 'elevation', 'layering', 'richness', 'sculpting', 'texture', 'volume'], // flattening
  'flavorful': ['insipid'], // flavorful
  'flaw': ['completeness', 'flawless', 'integrity', 'perfection', 'portfolio'], // flaw
  'flawed': ['complete', 'flawless', 'perfect', 'polished', 'prime', 'pristine', 'retouching', 'solid', 'spotless', 'stable'], // flawed
  'flawless': ['chaotic', 'clumsy', 'distress', 'dull', 'flaw', 'flawed', 'imperfect', 'imperfection', 'messy', 'rough', 'ugly'], // flawless
  'fleeing': ['anchoring', 'arrival', 'clinging', 'embracing', 'endurance', 'holding', 'presence', 'settling', 'staying'], // fleeing
  'fleeting': ['concreteness', 'constant', 'enduring', 'eternal', 'eternity', 'fixed', 'lasting', 'lingering', 'monumental', 'permanent', 'perpetual', 'perpetuity', 'stable', 'static', 'timeless'], // fleeting
  'fleshless': ['complexity', 'depth', 'face', 'fleshy', 'psyche', 'richness', 'substance', 'volume', 'wisdom'], // fleshless
  'fleshy': ['faceless', 'fleshless'], // fleshy
  'flexibility': ['firm', 'fixed', 'immobility', 'inflexibility', 'inflexible', 'restriction', 'rigidity', 'solid', 'stability', 'static', 'stiff', 'stiffness'], // Flexibility
  'flexible': ['base', 'bondage', 'cast', 'concrete', 'constrict', 'doctrinal', 'halted', 'predefined', 'restrained', 'restricted', 'restrictive', 'steel', 'stern', 'stiff', 'wire'], // flexible
  'flicker': ['clear', 'constant', 'fixed', 'smooth', 'solid', 'stable', 'steady', 'uniform', 'uniform-brightness'], // flicker
  'flighty': ['certain', 'fixed', 'focused', 'grounded', 'grounding', 'serious', 'solid', 'stable', 'steady'], // flighty
  'flippant': ['intense', 'serious', 'solemn', 'solemnity', 'weighted'], // flippant
  'float': ['drown', 'plummet', 'plunge', 'weight'], // Float
  'floating': ['root', 'rooting'], // floating
  'flood': ['clear', 'dry', 'empty', 'filtering', 'light', 'low', 'minimal', 'solid', 'still'], // flood
  'flora': ['steel'], // Flora
  'flotilla': ['desolation', 'emptiness', 'isolation', 'monotony', 'singularity', 'solitude', 'stagnation', 'stillness', 'void'], // Flotilla
  'flourish': ['blight', 'dormancy', 'ended', 'harm', 'ruin', 'shrivel', 'wilt', 'wither'], // Flourish
  'flourishing': ['barren', 'deterioration', 'dormant', 'tarnished', 'withering'], // flourishing
  'flow': ['burden', 'deadend', 'halt', 'hassle', 'interference', 'modularity', 'obstacle', 'pressure', 'stop', 'strain', 'strife', 'stuck', 'suppression'], // Flow
  'flowing': ['disjointed', 'frozen', 'halted', 'narrowing', 'stilted', 'stopped'], // flowing
  'fluctuation': ['constancy'], // fluctuation
  'fluid': ['artifact', 'axis', 'backward', 'base', 'based', 'bind', 'blocky', 'bondage', 'bounded', 'boxy', 'cast', 'charted', 'clumsy', 'clunky', 'concrete', 'concreteness', 'confining', 'constant', 'constrict', 'contained', 'cumbersome', 'definite', 'doctrinal', 'enclosed', 'fibrous', 'fixity', 'frozen', 'glacial', 'grid', 'janky', 'layered', 'mechanic', 'mechanical', 'metallic', 'pixelation', 'predefined', 'predetermined', 'regression', 'resolved', 'restrictive', 'robotic', 'rooted', 'rows', 'scrolling', 'segmented', 'single', 'soft', 'solidify', 'solidifying', 'solidity', 'square', 'staccato', 'staged', 'steel', 'stiff', 'stilted', 'stopped', 'stuffy', 'synthetic', 'tightened', 'transparent', 'unchanging', 'viscous', 'weighty', 'wire'], // Fluid
  'fluidity': ['constraint', 'cubism', 'imposition'], // fluidity
  'fluke': ['certainty', 'consistency', 'predictability', 'principle', 'reliability', 'solid', 'stability', 'uniformity'], // fluke
  'flux': ['constancy', 'finality', 'fixity', 'stability'], // Flux
  'foamy': ['dense', 'flat', 'smooth', 'solid', 'stiff'], // Foamy
  'focus': ['abandonment', 'blindness', 'blurb', 'confusion', 'disregard', 'dissipation', 'editorial', 'exaggeration', 'fog', 'foolishness', 'forget', 'harmony', 'idleness', 'ignore', 'muddle', 'negligence', 'overflow', 'sloppiness', 'sloth', 'vacate', 'wander', 'waver'], // Focus
  'focused': ['aimless', 'blind', 'bokeh', 'clueless', 'cluttered', 'conflicted', 'confused', 'confusing', 'disregarded', 'distracted', 'extraneous', 'flighty', 'fumbled', 'imprecise', 'impure', 'interstitial', 'nebulous', 'negligent', 'noisy', 'oblivious', 'obscuring', 'peripheral', 'rambling', 'restless', 'scatterbrained', 'scrawl', 'slack', 'slacker', 'smeared', 'splat', 'sprawled', 'spread', 'tangential', 'unfocused', 'wandering'], // Focused
  'focusing': ['dissolving'], // focusing
  'fog': ['brightness', 'clarity', 'definition', 'focus', 'insight', 'lightness', 'openness', 'transparency', 'vividness'], // fog
  'folded': ['complete', 'expanded', 'flat', 'open', 'smooth', 'unfolded', 'whole'], // folded
  'folding': ['constant', 'enduring', 'fixed', 'permanent', 'solid', 'stable', 'static', 'unfolding'], // folding
  'foliage': ['arid', 'barren', 'bleak', 'dry', 'sterile'], // Foliage
  'font': ['composition', 'contrast', 'scribble'], // Font
  'fonts': ['composition', 'contrast'], // Fonts
  'food': ['cool', 'coolness', 'hunger', 'scarcity', 'waste'], // Food
  'foolish': ['academia', 'clear', 'intelligent', 'prudent', 'rational', 'sensible', 'thoughtful', 'wise'], // foolish
  'foolishness': ['clarity', 'focus', 'intelligence', 'knowledge', 'logic', 'meaning', 'purpose', 'sense', 'wisdom'], // foolishness
  'footer': ['prime', 'upper'], // footer
  'for': ['non-profit'], // for
  'for-profit': ['non-profit'], // for-profit
  'force': ['weakness'], // Force
  'forceful': ['passive'], // forceful
  'foreground': ['abstract', 'background', 'distant', 'faint', 'hidden', 'invisible', 'subtle', 'vague'], // foreground
  'foreign': ['familiar', 'familiarity', 'home', 'local', 'native'], // foreign
  'forget': ['acknowledge', 'capture', 'emphasize', 'focus', 'grasp', 'highlight', 'notice', 'present', 'recognize', 'remember', 'retain'], // forget
  'forgettable': ['impactful', 'meaningful', 'memorable', 'mundane-spectacle', 'notable', 'significant', 'striking', 'vivid'], // forgettable
  'forgetting': ['anchoring', 'belonging', 'holding', 'remembering', 'remembrance'], // forgetting
  'forgotten': ['cherished', 'familiar', 'famous', 'icon', 'known', 'notable', 'present', 'remembered', 'visible'], // forgotten
  'form': ['disassemble'], // form
  'formal': ['bistro', 'casual', 'disheveled', 'freeform', 'freestyle', 'informal', 'irreverent', 'silly', 'streetwear'], // formal
  'formality': ['casual', 'casual-chaos', 'chaotic', 'disorderly', 'informal', 'messy', 'relaxed', 'scribble', 'spontaneous', 'wild', 'youthfulness'], // Formality
  'formed': ['amorphous', 'anti-form', 'chaotic', 'disordered', 'haphazard', 'messy', 'random', 'unconfined', 'undefined', 'unformed', 'unstructured', 'untamed', 'unvalued'], // Formed
  'forming': ['obliterating'], // forming
  'formless': ['figurative'], // Formless
  'formulated-limits': ['unconfined'], // formulated-limits
  'fortified': ['deficient', 'exposed', 'fragile', 'open', 'uncertain', 'unstable', 'vulnerable', 'vulnerable-space', 'weak', 'weakened'], // fortified
  'fortifying': ['diluting'], // fortifying
  'fortitude': ['chaos', 'confusion', 'disorder', 'indecision', 'instability', 'uncertainty', 'vulnerability', 'weakness'], // fortitude
  'fortune': ['misfortune'], // fortune
  'forward': ['backward'], // Forward
  'fossil': ['eco-tech'], // fossil
  'foster': ['destroy'], // foster
  'foul': ['bright', 'fresh', 'freshness', 'friendly', 'generous', 'inviting', 'pure', 'rich', 'vibrant'], // foul
  'found': ['lost', 'nowhere'], // found
  'founded': ['unfounded'], // founded
  'fracture': ['complete', 'connected', 'continuity', 'continuous', 'intact', 'smooth', 'solid', 'unified', 'whole'], // Fracture
  'fractured-harmony': ['unison'], // fractured-harmony
  'fragile': ['armored', 'fortified', 'freight', 'humble', 'resilient', 'robust', 'sturdy', 'thick'], // fragile
  'fragility': ['shield', 'solidity', 'strength'], // Fragility
  'fragment': ['completion', 'consolidate', 'convolution', 'integrate', 'mosaic', 'nucleus', 'synthesize', 'unify', 'unite', 'whole'], // Fragment
  'fragmentation': ['concentricity', 'conception', 'ecosystem', 'fusion', 'unison'], // Fragmentation
  'fragmented': ['aggregate', 'coherent', 'globe', 'intact', 'integrated', 'integrity', 'level', 'main', 'regression', 'seamless', 'shared', 'synchronized', 'unified', 'uninterrupted', 'united'], // fragmented
  'fragmented-tones': ['harmonic'], // fragmented-tones
  'fragmented-visions': ['synchronized'], // fragmented-visions
  'frantic': ['calm', 'composed', 'leisurely', 'peaceful', 'quiet', 'serene', 'steady', 'tranquil'], // frantic
  'fraudulence': ['sincerity'], // fraudulence
  'fraudulent': ['authentic', 'clear', 'genuine', 'honest', 'open', 'reliable', 'transparent', 'trustworthy'], // fraudulent
  'frayed': ['bright', 'clear', 'fresh', 'marble', 'neat', 'sharp', 'smooth', 'solid', 'vivid'], // frayed
  'free': ['bind', 'binding', 'bound', 'burdened', 'burdensome', 'cloistered', 'closed', 'confining', 'constrict', 'contained', 'dragged', 'enclosed', 'guarded', 'lock', 'mechanical', 'merchandise', 'payments', 'predetermined', 'regulated', 'restrained', 'restricted', 'restrictive', 'rooted', 'sealed', 'stilted', 'stuck', 'suppressed', 'tame', 'withholding'], // free
  'freed': ['stifled'], // freed
  'freedom': ['bondage', 'bound', 'bounded', 'burden', 'calculation', 'captivity', 'command', 'constraint', 'dependence', 'deprivation', 'drudgery', 'encasement', 'envelopment', 'exploitation', 'finality', 'fixation', 'guilt', 'heavy', 'imposition', 'inferior', 'limit', 'limitation', 'monopoly', 'narrowness', 'obedience', 'obstacle', 'pressure', 'restriction', 'shroud', 'strain', 'strife', 'submission', 'suppression', 'warning'], // Freedom
  'freeform': ['axis', 'concrete', 'confined', 'defined', 'factory', 'fixed', 'formal', 'grid', 'mechanic', 'ordered', 'rigid', 'strict', 'structured'], // Freeform
  'freeing': ['compressing', 'suppressing'], // freeing
  'freeness': ['bound', 'cage', 'confine', 'constraint', 'control', 'limit', 'prison', 'restriction', 'weightiness'], // freeness
  'freestyle': ['constrained', 'defined', 'fixed', 'formal', 'menu', 'orderly', 'precise', 'rigid', 'structured'], // freestyle
  'freetime': ['commitment', 'constraint', 'duty', 'industry', 'obligation', 'routine', 'schedule', 'task', 'work'], // freetime
  'freeze': ['ignite', 'melt', 'thaw'], // Freeze
  'freight': ['digital', 'disorder', 'empty', 'fragile', 'lightweight', 'local', 'passenger', 'service'], // Freight
  'frenzied': ['calm', 'peaceful', 'serene', 'sober', 'stately', 'tranquil'], // frenzied
  'frenzy': ['calm', 'ordered', 'quiet', 'serene', 'still', 'tranquil'], // frenzy
  'frequent': ['rare'], // frequent
  'fresh': ['aftermath', 'ancient', 'archaic', 'artifact', 'dirt', 'distressed', 'expire', 'faceless', 'foul', 'frayed', 'grime', 'grungy', 'muddy', 'patina', 'polluted', 'rusty', 'shallow', 'stale', 'stop', 'stuffy', 'tainted', 'tedious', 'toxic', 'weary', 'wilt'], // fresh
  'freshness': ['filth', 'foul', 'obsolescence', 'pollution'], // Freshness
  'friction': ['relaxation'], // friction
  'friendly': ['alien', 'cool', 'coolness', 'foul', 'harsh', 'impersonal'], // Friendly
  'fringe': ['block'], // fringe
  'frivolity': ['gravitas'], // frivolity
  'frivolous': ['deliberate', 'functionalism', 'intentional', 'meaningful', 'profound', 'serious', 'sober', 'sophisticated', 'substantial', 'thoughtful'], // frivolous
  'frontier': ['familiar'], // Frontier
  'frost': ['fire', 'heat', 'melt', 'warm', 'warmth'], // frost
  'frosted-blue': ['burnt'], // frosted-blue
  'frosted-hue': ['blazing'], // frosted-hue
  'frozen': ['active', 'dynamic', 'flowing', 'fluid', 'hot', 'liquid', 'molten', 'soft', 'video', 'vivid'], // frozen
  'frugal': ['indulgent', 'lavish'], // frugal
  'frugality': ['consumption'], // frugality
  'fruitful': ['futile'], // fruitful
  'frumpy': ['chic', 'elegant', 'fit', 'polished', 'refined', 'sleek', 'stylish', 'trim'], // frumpy
  'frustrated': ['pleased'], // frustrated
  'frustration': ['calm', 'content', 'ease', 'happiness', 'joy', 'pleasure', 'satisfaction', 'solutions'], // frustration
  'fugitive': ['certain', 'clear', 'eternal-now', 'familiar', 'known', 'safe', 'settled', 'stable', 'visible'], // fugitive
  'fulfillment': ['failure'], // Fulfillment
  'full': ['bare', 'drained', 'empty', 'fall', 'flat', 'hollow', 'incomplete', 'lack', 'leak', 'partial', 'ragged', 'sparse', 'starve', 'thin', 'vacant', 'void', 'withholding'], // full
  'full-realization': ['partial'], // full-realization
  'full-scale': ['miniature'], // full-scale
  'fullness': ['absence', 'barren', 'bleakness', 'cold', 'depletion', 'despair', 'diminution', 'drab', 'emptiness', 'hunger', 'husk', 'lack', 'scarcity', 'sparse', 'sparsity', 'thirst', 'vacuum', 'void'], // fullness
  'fumble': ['aware', 'certain', 'clear', 'grasp', 'principle'], // fumble
  'fumbled': ['controlled', 'deliberate', 'focused', 'mastered', 'mastery', 'orderly', 'planned', 'precise', 'successful'], // fumbled
  'fun': ['adulting'], // fun
  'functional': ['broken', 'impractical', 'pointless', 'theoretical', 'useless'], // functional
  'functionalism': ['frivolous'], // Functionalism
  'functionalist': ['disorderly'], // Functionalist
  'functionality': ['aesthetics'], // functionality
  'fundamental': ['extraneous'], // fundamental
  'funny': ['serious'], // funny
  'fusion': ['disconnection', 'dispersal', 'disunity', 'division', 'fragmentation', 'isolation', 'segregation', 'separation'], // Fusion
  'fussy': ['clean', 'elegant', 'refined', 'simple', 'simplicity', 'sleek', 'smooth', 'streamlined', 'subtle'], // fussy
  'futile': ['constructive', 'effective', 'fruitful', 'impactful', 'meaningful', 'purposeful', 'significant', 'utility', 'valuable'], // futile
  'futility': ['earth', 'growth', 'hope', 'horology', 'joy', 'life', 'purpose', 'strength', 'success', 'vitality'], // futility
  'future': ['past', 'roots'], // Future
  'futurism': ['ancient', 'futurist', 'glassmorphism', 'neumorphism'], // futurism
  'futurist': ['futurism', 'glassmorphism', 'neumorphism'], // futurist
  'futuristic': ['historical', 'retro', 'vintage'], // Futuristic
  'fuzz': ['analysis', 'clarity', 'cleanliness', 'definition', 'order', 'precision', 'sharpness', 'simplicity', 'structure'], // fuzz
  'fuzzy': ['apparent', 'clarity', 'clear', 'defined', 'flat', 'precise', 'sharp', 'simple', 'smooth'], // fuzzy
  'gain': ['descend', 'failure', 'plummet'], // gain
  'game': ['illustration', 'led'], // Game
  'gamification': ['professional'], // Gamification
  'gaming': ['professional'], // Gaming
  'gap': ['loop', 'point'], // gap
  'gargantuan': ['tiny'], // gargantuan
  'garish': ['alluring', 'calm', 'delicate', 'gentle', 'muted', 'pale', 'sober', 'soft', 'subtle', 'understated'], // garish
  'garnish': ['bare', 'basic', 'muted', 'ordinary', 'plain', 'simple', 'sparse-elegance', 'subtle', 'unadorned'], // garnish
  'gaseous': ['viscous'], // gaseous
  'gather': ['disassemble', 'disband', 'disperse', 'isolate'], // gather
  'gathering': ['premium'], // Gathering
  'gaudy': ['elegant', 'modest', 'plain', 'refined', 'simple', 'subtle', 'tasteful', 'understated'], // gaudy
  'gender': ['ungendered'], // Gender
  'gendered': ['unconfined', 'ungendered'], // gendered
  'general': ['explicit', 'labeled', 'specific'], // general
  'generate': ['consume', 'finish'], // generate
  'generation': ['illustration', 'led', 'null'], // Generation
  'generative': ['illustration', 'led', 'predefined', 'typecraft'], // Generative
  'generic': ['bespoke', 'boutique', 'customization', 'distinct', 'personalized', 'singular', 'typecraft', 'unique', 'uniqueness'], // generic
  'generosity': ['greed'], // generosity
  'generous': ['foul', 'meager', 'selfish'], // generous
  'genesis': ['end'], // Genesis
  'gentle': ['aggressive', 'agitated', 'authoritative', 'bitter', 'blaring', 'blasts', 'blinding', 'boisterous', 'bold', 'brash', 'brutal', 'burnt', 'challenging', 'confident', 'confront', 'dragged', 'erupt', 'explosive', 'feral', 'fierce', 'garish', 'glossy', 'gritty', 'hard', 'harsh', 'heated', 'jarring', 'loud', 'motorsport', 'powerful', 'raucous', 'roughness', 'rude', 'savage', 'screaming', 'shouted', 'staccato', 'stern', 'strenuous', 'strident', 'tense', 'thunders', 'tightened', 'unruly', 'uproarious', 'y2k'], // Gentle
  'gentle-expression': ['aggressive', 'rude'], // gentle-expression
  'gentle-hue': ['fierce', 'harried'], // gentle-hue
  'gentle-influence': ['overpower'], // gentle-influence
  'gentleness': ['brutality', 'cruelty'], // gentleness
  'genuine': ['artificial', 'contrived', 'deceptive', 'fabricated', 'facade', 'fake', 'false', 'falsehood', 'fictional', 'fraudulent', 'imperfect', 'insincere', 'manipulation', 'phony', 'pretentious', 'racket', 'sham', 'simulacrum', 'simulated', 'staged', 'superficial'], // Genuine
  'genuineness': ['alienated', 'artifice', 'artificial', 'empty', 'fake', 'false', 'insecure', 'superficial', 'vague'], // genuineness
  'geometric': ['biomorphic', 'figurative', 'organic'], // Geometric
  'geometry': ['editorial', 'harmony'], // Geometry
  'germination': ['wither'], // Germination
  'gesture': ['ambiguity', 'disguise', 'inactivity', 'indirectness', 'obscurity', 'passivity', 'silence', 'subtlety', 'text'], // gesture
  'giant': ['diminutive'], // giant
  'gift': ['absence', 'consume', 'curse', 'finance', 'loss', 'void'], // gift
  'gigantic': ['miniature'], // gigantic
  'giving': ['withholding'], // giving
  'glacial': ['active', 'alive', 'boiling', 'dynamic', 'fluid', 'heated', 'hot', 'vibrant', 'warm', 'warmth'], // Glacial
  'glare': ['dark', 'dim', 'dimming', 'dull', 'faint', 'muted', 'shadow', 'soft'], // Glare
  'glassmorphism': ['futurism', 'futurist', 'maximalist', 'traditional'], // Glassmorphism
  'gleaming': ['bland', 'cloudy', 'dim', 'dull', 'faded', 'matte', 'muddy', 'opaque', 'sepia'], // gleaming
  'glimpse': ['completeness', 'concealment', 'obscurity', 'panorama', 'wholeness'], // Glimpse
  'glitch': ['perfect', 'seamless'], // Glitch
  'globalism': ['localism'], // globalism
  'globalization': ['localism'], // Globalization
  'globe': ['chaos', 'finite', 'flat', 'fragmented', 'infinite', 'isolated', 'linear', 'local', 'nothing', 'static', 'void'], // Globe
  'gloom': ['aether', 'euphoria', 'exuberance'], // Gloom
  'gloomy': ['breezy', 'jovial', 'pleasant', 'positive'], // gloomy
  'glossy': ['absorbent', 'gentle', 'matt', 'scrolling'], // Glossy
  'glow': ['darkness'], // glow
  'go': ['stop'], // go
  'goodness': ['malice'], // goodness
  'gothic': ['bright', 'cheerful', 'clean', 'light', 'modern', 'playful', 'simple', 'soft', 'techno-futurism'], // Gothic
  'gourmet': ['common'], // Gourmet
  'grace': ['awkwardness', 'brutality', 'editorial', 'harmony'], // Grace
  'graceful': ['awkward', 'clumsy', 'clunky', 'grotesque', 'janky', 'vulgar'], // graceful
  'gracious': ['rude'], // gracious
  'graded': ['bland', 'dull', 'flat', 'monochrome', 'plain', 'simplistic', 'static', 'uniform'], // Graded
  'gradient': ['cool', 'coolness'], // Gradient
  'grading': ['chaos', 'disorder', 'flat', 'random', 'uniform'], // Grading
  'gradual': ['abrupt', 'immediate', 'instant', 'jarring', 'rapid', 'speed', 'sudden', 'suddenness'], // gradual
  'graffiti': ['illustration', 'led'], // Graffiti
  'grain': ['wine'], // grain
  'grainy': ['overlapping', 'scrolling', 'y2k'], // Grainy
  'grand': ['petite', 'petty', 'small'], // grand
  'grandeur': ['intimacy', 'microcosm', 'petiteness'], // Grandeur
  'grandiose': ['miniature'], // grandiose
  'graphics': ['illustration', 'led'], // Graphics
  'grasp': ['dismiss', 'forget', 'fumble', 'neglect', 'release', 'surrender'], // grasp
  'grave': ['silly'], // grave
  'gravitas': ['banality', 'carelessness', 'emptiness', 'frivolity', 'insignificance', 'lightness', 'playfulness', 'silliness', 'triviality'], // Gravitas
  'gravity': ['levity'], // Gravity
  'greed': ['altruism', 'benevolent', 'generosity', 'humble', 'modest', 'non-profit', 'nonprofit', 'sacrifice', 'selfless', 'sharing'], // greed
  'grid': ['fluid', 'freeform', 'masonry', 'organic'], // Grid
  'grim': ['bright', 'cheerful', 'clear', 'humor', 'joyful', 'light', 'radiant', 'uplifted', 'vivid'], // grim
  'grime': ['bright', 'clean', 'cleanliness', 'clear', 'fresh', 'polished', 'pure', 'refined', 'smooth'], // grime
  'grind': ['carefree', 'casual', 'ease', 'leisure', 'relaxed', 'rest', 'simple', 'spontaneity'], // grind
  'gritty': ['aesthetics', 'elegant', 'gentle', 'sterile'], // Gritty
  'groovy': ['stiff'], // Groovy
  'grotesque': ['aesthetic', 'delicate', 'elegant', 'graceful', 'harmonious', 'polished', 'refined', 'smooth'], // Grotesque
  'ground': ['stratosphere'], // ground
  'grounded': ['aero', 'ascendancy', 'flighty', 'hover', 'lofty', 'sprawled', 'stellar', 'ungrounded', 'unhinged'], // Grounded
  'grounding': ['flighty'], // Grounding
  'group': ['individual'], // group
  'grow': ['finish', 'shrink', 'thaw', 'wilt', 'wither'], // grow
  'growing': ['narrowing', 'withering'], // growing
  'growth': ['closing', 'death', 'depletion', 'deprivation', 'destruction', 'deterioration', 'dormancy', 'end', 'ended', 'endgame', 'futility', 'limitation', 'reduction', 'shrink', 'suppression', 'withering'], // Growth
  'grungy': ['bright', 'clean', 'commercial-chic', 'elegant', 'fresh', 'polished', 'refined', 'simple', 'smooth'], // grungy
  'guarded': ['accessible', 'careless', 'exposed', 'free', 'open', 'openness', 'revealed', 'unprotected', 'vulnerable'], // guarded
  'guesswork': ['analytics'], // guesswork
  'guilt': ['clarity', 'confidence', 'contentment', 'ease', 'freedom', 'innocence', 'serenity', 'trust'], // guilt
  'gym': ['idleness', 'indulgence', 'laziness', 'leisure', 'passive', 'relaxation', 'rest', 'retirement', 'sedentary', 'sloth', 'stillness'], // Gym
  'halt': ['active', 'catalyst', 'dynamic', 'engage', 'flow', 'manifesting', 'move', 'progress', 'repeat', 'scroll', 'thrive', 'vibrant'], // halt
  'halted': ['active', 'dynamic', 'flexible', 'flowing', 'scrolling', 'shiny', 'smooth', 'soft', 'vibrant'], // halted
  'hand-drawn': ['technographic'], // hand-drawn
  'handcrafted': ['factory', 'mechanic'], // handcrafted
  'handcrafted-goods': ['massproduced'], // handcrafted-goods
  'handmade': ['cgi', 'factory'], // handmade
  'haphazard': ['analytics', 'art', 'coherent', 'formed', 'intentional', 'level', 'method', 'methodical', 'modelling', 'neat', 'orderly', 'planned', 'precise', 'premeditated', 'procedural', 'rational', 'sequential', 'structured', 'systematic'], // haphazard
  'happiness': ['agony', 'anguish', 'dissatisfaction', 'frustration', 'misfortune', 'pain', 'sorrow'], // happiness
  'hard': ['absorbent', 'easy', 'gentle', 'malleable', 'matte', 'melt', 'pillow', 'soft', 'supple', 'yielding'], // Hard
  'harden': ['thaw'], // harden
  'hardship': ['well-being'], // hardship
  'hardware': ['behavioral'], // hardware
  'harm': ['benefit', 'flourish', 'heal', 'healthcare', 'healthtech', 'nurture', 'restore', 'skincare', 'support', 'thrive', 'uplift'], // harm
  'harmful': ['healthy'], // harmful
  'harmonic': ['chaotic', 'clashing', 'conflicting', 'discordant', 'disorderly', 'dissonant', 'fragmented-tones', 'jarring', 'messy'], // Harmonic
  'harmonic-clash': ['concord'], // harmonic-clash
  'harmonious': ['anarchic', 'anti', 'awkward', 'conflicted', 'disarrayed', 'discordant', 'disjoint', 'disjointed', 'disparate', 'divisive', 'downcast', 'grotesque', 'jarring', 'jumbled', 'segregated', 'uneven'], // harmonious
  'harmonious-blend': ['discordant'], // harmonious-blend
  'harmonious-order': ['tumult'], // harmonious-order
  'harmonize': ['disrupt', 'divide'], // harmonize
  'harmonizing': ['dividing'], // harmonizing
  'harmony': ['awkwardness', 'breakdown', 'brutality', 'cacophony', 'clamor', 'complication', 'conflict', 'confront', 'confusion', 'contradiction', 'curvature', 'deconstructivism', 'destroy', 'destruction', 'din', 'discomfort', 'discord', 'disorder', 'dispersal', 'dispersion', 'displeasure', 'dissipation', 'distribution', 'disunity', 'dominance', 'dramatic', 'duotone', 'dynamism', 'eclectic', 'edge', 'focus', 'geometry', 'grace', 'hassle', 'inferior', 'intricate', 'jumble', 'linearity', 'luminosity', 'mess', 'mismatch', 'monumental', 'negative', 'ornamentation', 'perspective', 'polish', 'pollution', 'portrait', 'simplicity', 'simplification', 'sleekness', 'softness', 'spatial', 'split', 'spontaneity', 'squalor', 'stress', 'strife', 'struggle', 'tension', 'texture', 'torment', 'tumult', 'turmoil', 'unbounded', 'uniformity', 'unruly', 'variety', 'war'], // Harmony
  'harried': ['calm', 'clear', 'easy', 'gentle-hue', 'orderly', 'relaxed', 'serene', 'smooth', 'steady'], // Harried
  'harsh': ['bakery', 'calm', 'empathetic', 'filtered', 'friendly', 'gentle', 'mellow', 'mild', 'neumorphic', 'peaceful', 'pleasant', 'smooth', 'soft', 'softness', 'supple', 'sweet', 'warm', 'wash', 'yielding'], // harsh
  'hassle': ['clarity', 'comfort', 'ease', 'flow', 'harmony', 'simplicity', 'smoothness', 'tranquility'], // hassle
  'haste': ['slowness'], // haste
  'hasty': ['calm', 'careful', 'caution', 'deliberate', 'intentional', 'lingering', 'measured', 'slow', 'steady', 'thoughtful', 'unhurried'], // hasty
  'hate': ['admiration'], // hate
  'hatred': ['kindness', 'respect'], // hatred
  'haunting': ['alive'], // Haunting
  'header': ['base', 'composition', 'contrast', 'tail', 'under'], // Header
  'heal': ['harm', 'tear'], // heal
  'healthcare': ['harm'], // Healthcare
  'healthtech': ['chaos', 'disorder', 'harm', 'inefficiency', 'neglect'], // HealthTech
  'healthy': ['dangerous', 'detrimental', 'fast-food', 'harmful', 'indulgent', 'poor', 'processed', 'sickly', 'toxic', 'unhealthy', 'weak'], // Healthy
  'heart': ['husk'], // heart
  'heat': ['chill', 'cold', 'cool', 'dim', 'frost', 'ice', 'liquid', 'soft', 'wet'], // heat
  'heated': ['calm', 'chilled-contrast', 'cold', 'cool', 'dull', 'gentle', 'glacial', 'neutral', 'peaceful', 'soft'], // heated
  'heaviness': ['aether', 'airiness', 'breeze', 'lucidity'], // heaviness
  'heavy': ['aero', 'aerodynamic', 'aspirant', 'aspiration', 'aspire', 'awe', 'bliss', 'breezy', 'calm', 'caution', 'cheer', 'clarity', 'comfort', 'compassion', 'competence', 'composed', 'confidence', 'connection', 'constrained', 'contemplation', 'contemplative', 'contentment', 'control', 'cosmetics', 'craving', 'curiosity', 'curious', 'defiance', 'desire', 'direct', 'distraction', 'drive', 'earnest', 'ease', 'eco-tech', 'eerie', 'effortless', 'electrified', 'empowered', 'engagement', 'euphoric', 'excite', 'excitement', 'familiarity', 'freedom', 'humor', 'inquiry', 'inspiration', 'inspire', 'intellect', 'intensity', 'intent', 'intrigue', 'introspection', 'introspective', 'isolated', 'kinetic', 'light', 'lightness', 'lightweight', 'merriment', 'mirth', 'mystery', 'mystique', 'nostalgia', 'overload', 'peace', 'peaceful', 'petite', 'poised', 'potency', 'propulsive', 'prudence', 'reassurance', 'rebellious', 'reflective', 'refreshing', 'relax', 'reliability', 'retro', 'reverence', 'secure', 'serene', 'serenity', 'sincere', 'slender', 'social', 'stately', 'stratosphere', 'surge', 'suspense', 'swift', 'systemic', 'thin', 'thoughtful', 'thrill', 'transit', 'translucency', 'triumph', 'uplift', 'urgency', 'vintage', 'visceral', 'watches', 'welcome', 'whimsy', 'wonder', 'zest'], // Heavy
  'heavyweight': ['breeze', 'feather'], // heavyweight
  'hectic': ['leisurely'], // hectic
  'helpless': ['empowering'], // helpless
  'heritage': ['invention', 'premium', 'techwear'], // Heritage
  'heritage-craft': ['disposable'], // heritage-craft
  'hesitant': ['assertive', 'bold', 'certain', 'clear', 'confident', 'decisive', 'firm', 'unwavering'], // hesitant
  'hesitation': ['action', 'assertiveness', 'boldness', 'certainty', 'confidence', 'conquer', 'decisiveness', 'readiness', 'valor'], // hesitation
  'hidden': ['apparent', 'blatant', 'external', 'foreground', 'honest', 'identified', 'known', 'obvious', 'overlook', 'overt', 'premium', 'present', 'public', 'visible'], // Hidden
  'hide': ['display', 'emerge', 'expose', 'highlight', 'illustrate', 'reveal', 'show', 'uncover', 'unveiling'], // hide
  'hiding': ['appearing', 'bold', 'brave', 'displaying', 'exposing', 'exposure', 'open', 'revealing', 'showing', 'visible'], // hiding
  'high': ['below', 'hollow', 'low'], // high
  'higher': ['lower', 'under'], // higher
  'highlight': ['bland', 'blend', 'dark', 'deemphasize', 'dim', 'drab', 'dull', 'fade', 'forget', 'hide', 'ignore', 'obscure', 'shadow', 'subdue'], // Highlight
  'highlighted': ['disregarded', 'erased'], // highlighted
  'highlighting': ['muting', 'obscuring', 'subduing', 'suppressing'], // highlighting
  'hinder': ['advance', 'encourage', 'enhance', 'facilitate', 'inspire', 'liberate', 'nurture', 'promote', 'support', 'uplift'], // hinder
  'historical': ['contemporary', 'current', 'futuristic', 'instant', 'modern', 'new', 'novel', 'presentism', 'trendy'], // Historical
  'hobby': ['chore', 'drudgery', 'duty', 'finance', 'obligation', 'routine', 'task', 'work'], // hobby
  'hold': ['letgo', 'loose', 'release', 'scroll', 'spill', 'unfold', 'yield'], // hold
  'holding': ['fleeing', 'forgetting'], // holding
  'hollow': ['alive', 'certain', 'cylinder', 'dense', 'filled', 'full', 'high', 'sincere', 'solid'], // Hollow
  'home': ['foreign', 'hotels'], // home
  'homecoming': ['exile'], // homecoming
  'homely': ['impersonal'], // Homely
  'homeware': ['jewelry'], // homeware
  'homogeneity': ['mismatch', 'uniqueness'], // homogeneity
  'homogeneous': ['diverse', 'hybrid'], // homogeneous
  'honest': ['corrupt', 'crooked', 'deceptive', 'fake', 'false', 'fraudulent', 'hidden', 'insincere', 'misleading', 'obscure', 'shifty'], // Honest
  'honesty': ['corruption', 'deceit', 'disguise', 'distrust', 'malice'], // honesty
  'honor': ['shame'], // honor
  'hope': ['death', 'disillusion', 'futility', 'pain', 'pessimism', 'playful', 'sorrow'], // Hope
  'hopeful': ['cynicism', 'defeated', 'despair', 'despairing', 'disappointment', 'dismal', 'doubt', 'dystopic', 'fear', 'hopelessness', 'ominous', 'pessimism', 'pessimistic', 'resigned', 'uncertainty'], // hopeful
  'hopelessness': ['hopeful'], // hopelessness
  'horizontal': ['vertex'], // horizontal
  'horology': ['absence', 'casual', 'chaos', 'digital', 'disorder', 'ephemera', 'futility', 'imprecision', 'inefficiency', 'informal', 'instability', 'randomness'], // Horology
  'hostel': ['hotels'], // hostel
  'hostile': ['reassuring'], // hostile
  'hostility': ['affection', 'kindness'], // hostility
  'hot': ['cold', 'frozen', 'glacial'], // hot
  'hotels': ['abandon', 'camping', 'chaotic', 'deserted', 'home', 'hostel', 'industrial', 'office', 'residential', 'retail', 'unwelcoming', 'vacancy'], // Hotels
  'hover': ['fixed', 'grounded', 'plunge', 'quiet', 'settled', 'stationary', 'still', 'submerge'], // hover
  'hues': ['earthen', 'emerald'], // Hues
  'huge': ['diminutive', 'miniature', 'small', 'tiny'], // huge
  'human': ['automated', 'impersonal', 'robotic', 'robotics'], // human
  'humanism': ['alienation', 'apathy', 'indifference', 'inhumanity', 'selfishness'], // Humanism
  'humanist': ['robotic'], // Humanist
  'humanities': ['engineering'], // humanities
  'humble': ['arrogant', 'bold', 'confident', 'crowned', 'dominance', 'empty', 'fragile', 'greed', 'loud', 'ostentatious', 'pretentious', 'soft', 'wealth'], // humble
  'humiliation': ['dignity'], // humiliation
  'humility': ['success'], // humility
  'humor': ['grim', 'heavy'], // Humor
  'hunger': ['abundance', 'food', 'fullness', 'luxury', 'plenty', 'richness', 'satisfaction', 'surplus', 'wealth'], // hunger
  'hurry': ['sloth'], // hurry
  'hushed': ['shouted', 'shouts'], // hushed
  'hushing': ['active', 'amplifying', 'bold', 'bright', 'chaotic', 'dynamic', 'expressive', 'loud', 'vivid'], // hushing
  'husk': ['core', 'essence', 'fullness', 'heart', 'psyche', 'richness', 'substance', 'thrive', 'vitality'], // husk
  'hustle': ['calm', 'leisure', 'rest', 'rural-serenity', 'still'], // hustle
  'hybrid': ['homogeneous', 'monolithic', 'pure', 'simple', 'single', 'singular', 'uniform'], // Hybrid
  'hydrate': ['shrivel'], // hydrate
  'hype': ['apathy', 'boredom', 'calm', 'dullness', 'indifference'], // Hype
  'hyperreal': ['abstract', 'fantasy', 'imperfect', 'surreal', 'vague'], // Hyperreal
  'hypocrisy': ['sincerity'], // hypocrisy
  'ice': ['emanation', 'fire', 'heat'], // Ice
  'icon': ['forgotten', 'premium'], // Icon
  'iconography': ['illustration', 'led'], // Iconography
  'icy-palette': ['fiery'], // icy-palette
  'ideal': ['dystopic', 'imperfect'], // Ideal
  'identified': ['ambiguous', 'anonymous', 'confused', 'disregarded', 'hidden', 'ignored', 'uncertain', 'unknown', 'vague'], // identified
  'identity': ['disguise', 'faceless', 'masked', 'oblivion'], // Identity
  'idiosyncrasy': ['clarity', 'conformity', 'directness', 'familiarity', 'ordinariness', 'predictability', 'simplicity', 'standardization', 'uniformity'], // idiosyncrasy
  'idle': ['active', 'bold', 'dynamic', 'engaged', 'intense', 'lively', 'sports', 'stimulating', 'vibrant'], // idle
  'idleness': ['activity', 'creativity', 'drive', 'effort', 'engagement', 'focus', 'gym', 'productivity', 'purpose', 'pursuit'], // idleness
  'idyll': ['squalor'], // Idyll
  'ignite': ['calm', 'cool', 'darken', 'dim', 'douse', 'extinguish', 'freeze', 'inertia', 'quench'], // ignite
  'ignited': ['bland', 'cold', 'dull', 'extinguished', 'faded', 'muted', 'plain', 'subdued', 'unlit'], // Ignited
  'ignorance': ['analytics', 'awakening', 'awareness', 'certainty', 'childcare', 'clarity', 'consulting', 'context', 'edtech', 'edutainment', 'enlightenment', 'inquiry', 'insight', 'interpretation', 'involvement', 'knowledge', 'messaging', 'museum', 'publishing', 'scholarship', 'typecraft', 'understanding', 'watches', 'wisdom'], // ignorance
  'ignorant': ['scholarly', 'sightful'], // ignorant
  'ignore': ['acknowledge', 'adopt', 'affirm', 'cherish', 'cultivate', 'emphasize', 'engage', 'engrave', 'focus', 'highlight', 'notice', 'observe', 'overlook', 'recognize', 'regard', 'support', 'underline', 'valuing'], // ignore
  'ignored': ['acknowledged', 'advertising', 'celebrated', 'embraced', 'famous', 'identified', 'included', 'known', 'noticed', 'recognized', 'seen', 'status', 'valued'], // ignored
  'illiterate': ['articulate', 'aware', 'educated', 'informed', 'knowledgeable', 'literacy', 'literate', 'logical', 'precise'], // illiterate
  'illness': ['well-being'], // illness
  'illogical': ['clear', 'coherent', 'logical', 'orderly', 'pragmatic-visuals'], // illogical
  'illuminated': ['obscuring'], // illuminated
  'illumination': ['blackout'], // Illumination
  'illusion': ['fact', 'reality'], // Illusion
  'illusory': ['clear', 'obvious', 'real', 'tangible', 'truth'], // illusory
  'illustrate': ['hide'], // illustrate
  'illustration': ['compositing', 'curation', 'detail', 'digital', 'drawing', 'exhibition', 'filmic', 'filtering', 'game', 'generation', 'generative', 'graffiti', 'graphics', 'iconography', 'imaging', 'interface', 'isometric', 'lens', 'manipulation', 'masking', 'modeling', 'photoreal', 'photorealistic', 'process', 'projection', 'render', 'retouching', 'schematic', 'shading', 'simulation', 'sketching', 'staging', 'styling', 'typeset', 'typesetting', 'ui-ux', 'vector', 'video', 'volumetrics', 'web'], // Illustration
  'image': ['composition', 'contrast'], // Image
  'imaginary': ['biographical', 'certain', 'concrete', 'definite', 'existing', 'factual', 'literal', 'practical', 'real'], // imaginary
  'imaging': ['illustration', 'invisible', 'led', 'negligent'], // Imaging
  'imitation': ['invention'], // imitation
  'immediate': ['delay', 'delayed', 'gradual', 'post-process', 'scheduled', 'slow'], // Immediate
  'immense': ['diminutive', 'small', 'tiny'], // immense
  'immensity': ['insignificance', 'petiteness'], // Immensity
  'immerse': ['barren', 'detached', 'disengaged', 'distant', 'escape', 'excluded', 'isolated', 'shallow', 'superficial'], // immerse
  'immersed': ['detached'], // immersed
  'immersion': ['premium'], // Immersion
  'immobile': ['mobile', 'shift', 'wearables'], // immobile
  'immobility': ['flexibility', 'mobility'], // immobility
  'immortality': ['death', 'end', 'finitude', 'mortality'], // immortality
  'immovable': ['evanescent'], // immovable
  'immutable': ['mutable'], // immutable
  'impactful': ['forgettable', 'futile', 'irrelevant', 'pointless', 'worthless'], // impactful
  'impediment': ['catalyst'], // impediment
  'imperfect': ['authentic', 'automated', 'cgi', 'effortful', 'flawless', 'genuine', 'hyperreal', 'ideal', 'intact', 'neat', 'perfect', 'pure', 'refined', 'spotless'], // imperfect
  'imperfection': ['flawless'], // Imperfection
  'impermeable': ['absorbent', 'porous'], // impermeable
  'impersonal': ['bistro', 'casual', 'expressive', 'friendly', 'homely', 'human', 'intimate', 'personal', 'personalized', 'unique', 'user-centric', 'warmth'], // impersonal
  'impersonality': ['customization', 'intimacy'], // impersonality
  'implicit': ['annotation'], // implicit
  'importance': ['insignificance'], // importance
  'important': ['insignificant', 'irrelevant', 'petty', 'trivial', 'worthless'], // important
  'imposition': ['clarity', 'ease', 'fluidity', 'freedom', 'liberation', 'lightness', 'purity', 'simplicity', 'spontaneity'], // Imposition
  'impossible': ['achievable', 'obtainable', 'reachable'], // impossible
  'impotence': ['certainty', 'clarity', 'firm', 'potency', 'power', 'purity', 'solid', 'strength', 'vitality'], // impotence
  'impractical': ['academia', 'effective', 'efficient', 'functional', 'practical', 'realistic', 'sensible', 'usable', 'viable'], // impractical
  'imprecise': ['calculated-precision', 'certain', 'clear', 'defined', 'exact', 'focused', 'precise', 'prime', 'seamless', 'sharp', 'specific'], // imprecise
  'imprecision': ['exact', 'horology', 'watchmaking'], // imprecision
  'impression': ['clarity', 'definition', 'exactness', 'fact', 'passion', 'photoreal', 'precision', 'reality', 'truth'], // impression
  'imprint': ['absence', 'blur', 'disperse', 'dissolve', 'erase', 'faint', 'scatter', 'vague', 'void'], // Imprint
  'impromptu-display': ['premeditated'], // impromptu-display
  'impromptu-gathering': ['scheduled'], // impromptu-gathering
  'improvement': ['decline', 'deterioration', 'failure', 'regression', 'stagnation'], // Improvement
  'improvisation': ['calculation', 'classicism', 'engineering', 'method', 'outlining'], // improvisation
  'improvised': ['charted', 'computational', 'conventional', 'deliberate', 'fixed', 'mechanic', 'modelling', 'planned', 'precise', 'predefined', 'procedural', 'standard', 'structured', 'uniform'], // improvised
  'impulsive': ['behavioral', 'cautious', 'deliberate', 'planned', 'premeditated', 'rational'], // impulsive
  'impunity': ['consequence'], // impunity
  'impure': ['clean', 'clear', 'coherent', 'defined', 'focused', 'intentional', 'pure', 'structured'], // impure
  'inaccessible': ['achievable', 'obtainable', 'reachable'], // inaccessible
  'inaccuracy': ['watchmaking'], // inaccuracy
  'inactive': ['active', 'alive', 'appearing', 'athlete', 'bustling', 'capable', 'live', 'swift', 'vibration'], // inactive
  'inactivity': ['gesture', 'stimulation', 'watches'], // inactivity
  'inanimate': ['wearables'], // inanimate
  'inattention': ['awakening'], // inattention
  'inception': ['end'], // inception
  'included': ['ignored'], // included
  'inclusion': ['abandon', 'abandonment', 'alienation', 'detachment', 'dismissal', 'exile', 'exploitation', 'expulsion', 'premium', 'shunning'], // Inclusion
  'inclusive': ['disjoint', 'dismissive', 'divisive', 'isolating', 'segregated', 'selfish'], // inclusive
  'inclusivity': ['divisive'], // Inclusivity
  'incoherence': ['integrity'], // incoherence
  'incoherent': ['coherent', 'concreteness'], // incoherent
  'incompetence': ['skillful'], // incompetence
  'incompetent': ['capable', 'skillful'], // incompetent
  'incomplete': ['clear', 'common', 'complete', 'complete-manifestation', 'finished', 'full', 'intact', 'simple', 'whole'], // incomplete
  'incompletion': ['completion'], // incompletion
  'inconsistency': ['resolve'], // inconsistency
  'inconsistent': ['seamless'], // inconsistent
  'increase': ['deplete', 'descend', 'plummet', 'reduction', 'shrink'], // increase
  'indecency': ['dignity'], // indecency
  'indecision': ['assertiveness', 'fortitude', 'resolve'], // indecision
  'indecisive': ['decisive', 'resolved'], // indecisive
  'independence': ['collectivism', 'dependence', 'obedience', 'premium', 'submission'], // Independence
  'independent': ['bound', 'obedient'], // independent
  'indeterminacy': ['definition'], // indeterminacy
  'indeterminate': ['concreteness', 'reachable'], // indeterminate
  'indifference': ['admiration', 'admiring', 'affection', 'appreciate', 'attachment', 'attraction', 'belief', 'childcare', 'consensus', 'demand', 'engage', 'exuberance', 'fandom', 'favor', 'fervor', 'humanism', 'hype', 'intimacy', 'involvement', 'kindness', 'marketing', 'participation', 'passion', 'recognition', 'respect', 'veneration', 'zeal'], // indifference
  'indifferent': ['cherishing', 'empathetic', 'engaged'], // indifferent
  'indigo': ['earthen', 'emerald', 'washed'], // Indigo
  'indirect': ['straightforward'], // indirect
  'indirectness': ['gesture'], // indirectness
  'indiscretion': ['discretion'], // indiscretion
  'indistinct': ['apparent', 'clear', 'defined', 'depictive', 'distinct', 'distinction', 'distinctness', 'specific', 'vivid'], // indistinct
  'individual': ['aggregate', 'avatar', 'blended', 'collaborative', 'collective', 'commodity', 'common', 'conform', 'group', 'massproduced', 'unified'], // individual
  'individualism': ['collectivism', 'premium'], // Individualism
  'individuality': ['monoculture'], // individuality
  'indulgence': ['gym'], // indulgence
  'indulgent': ['basic', 'basic-bites', 'frugal', 'healthy', 'minimal', 'modest', 'plain', 'simple', 'sparse', 'subdued'], // indulgent
  'industrial': ['bistro', 'boutique', 'edtech', 'hotels', 'residential', 'rural', 'yachting'], // Industrial
  'industry': ['freetime'], // Industry
  'inedible': ['beverage'], // inedible
  'ineffective': ['empowering', 'practical'], // ineffective
  'ineffectiveness': ['efficacy'], // ineffectiveness
  'inefficacy': ['efficacy'], // inefficacy
  'inefficiency': ['efficacy', 'healthtech', 'horology', 'solutions'], // inefficiency
  'inefficient': ['aerodynamic'], // inefficient
  'inept': ['capable'], // inept
  'inert': ['activating'], // inert
  'inertia': ['ignite'], // inertia
  'inexact': ['exact'], // inexact
  'inferior': ['elite', 'equality', 'freedom', 'harmony', 'justice', 'kindness', 'prestige', 'prime', 'prosperity', 'superior', 'uplift'], // inferior
  'inferiority': ['excellence'], // inferiority
  'infinite': ['finite', 'globe', 'limit'], // Infinite
  'infinity': ['bounded', 'finality', 'limitation', 'microcosm', 'temporary'], // Infinity
  'inflate': ['shrink'], // inflate
  'inflexibility': ['adaptability', 'flexibility'], // inflexibility
  'inflexible': ['flexibility', 'malleable'], // inflexible
  'influence': ['premium'], // Influence
  'influential': ['insignificant'], // influential
  'informal': ['conventional', 'doctrinal', 'formal', 'formality', 'horology', 'official', 'rigid', 'serious', 'solidify', 'stiff', 'structured', 'techwear', 'traditional'], // Informal
  'informal-inquiry': ['doctrinal'], // informal-inquiry
  'informal-knowledge': ['scholarly'], // informal-knowledge
  'informality': ['command', 'dignity'], // informality
  'informative': ['confusing'], // Informative
  'informed': ['clueless', 'illiterate'], // informed
  'infrastructure': ['premium'], // Infrastructure
  'ingenuity': ['boring', 'dull', 'lazy', 'mundane', 'stupid'], // Ingenuity
  'ingredients': ['absence', 'depletion', 'emptiness', 'void', 'waste'], // Ingredients
  'inhalation': ['emission'], // inhalation
  'inhibition': ['self-expression'], // inhibition
  'inhibitor': ['catalyst'], // inhibitor
  'inhumanity': ['humanism'], // inhumanity
  'initial': ['final'], // initial
  'initiate': ['finish'], // initiate
  'initiation': ['finale'], // initiation
  'initiative': ['passivity', 'sloth'], // initiative
  'inland': ['marine', 'nautical'], // inland
  'inner': ['facade'], // inner
  'innocence': ['corruption', 'guilt', 'malice'], // Innocence
  'innovate': ['conform', 'repeat'], // Innovate
  'innovative': ['ancient', 'banal', 'mediocre', 'mundane', 'obsolete', 'pedestrian', 'primitive', 'repetitive', 'tainted'], // Innovative
  'inorganic': ['bio'], // inorganic
  'inquiry': ['disregard', 'heavy', 'ignorance'], // Inquiry
  'insecure': ['genuineness', 'robust', 'settled'], // insecure
  'insecurity': ['assertiveness', 'strength', 'success', 'valor'], // insecurity
  'insight': ['blindness', 'fog', 'ignorance', 'stupidity'], // Insight
  'insightful': ['clueless'], // insightful
  'insignificance': ['clarity', 'gravitas', 'immensity', 'importance', 'meaning', 'prominence', 'relevance', 'significance', 'value'], // insignificance
  'insignificant': ['essential', 'famous', 'important', 'influential', 'monumental', 'notable', 'prominent', 'remarkable', 'significant', 'vast', 'vital'], // insignificant
  'insincere': ['authentic', 'earnest', 'genuine', 'honest', 'open', 'real', 'sincere', 'transparent', 'true', 'trustworthy'], // insincere
  'insincerity': ['sincerity'], // insincerity
  'insipid': ['colorful', 'dynamic', 'engaging', 'exciting', 'flavorful', 'rich', 'stimulating', 'value', 'vibrant'], // insipid
  'inspiration': ['heavy'], // Inspiration
  'inspire': ['heavy', 'hinder'], // Inspire
  'instability': ['approval', 'climate', 'command', 'constancy', 'engineering', 'fortitude', 'horology', 'settle', 'stability'], // instability
  'installed': ['wearables'], // installed
  'instant': ['ambiguous', 'delayed', 'gradual', 'historical', 'lengthy', 'lingering', 'loading', 'slow', 'uncertain'], // instant
  'instant-delivery': ['lingering', 'unhurried'], // instant-delivery
  'instinct': ['analytics', 'calculation', 'deliberate', 'predetermined'], // Instinct
  'intact': ['aftermath', 'broken', 'chaotic', 'damaged', 'deconstructivist', 'disordered', 'fracture', 'fragmented', 'imperfect', 'incomplete', 'leak', 'scattered', 'scratched'], // intact
  'intactness': ['obliteration'], // intactness
  'intangible': ['clear', 'concrete', 'definite', 'literal', 'material', 'physicality', 'solid', 'substantial', 'tangible'], // Intangible
  'integral': ['crooked', 'extraneous'], // integral
  'integrate': ['collapse', 'deconstruct', 'detach', 'disassemble', 'disconnect', 'disjoint', 'disperse', 'disrupt', 'diverge', 'divide', 'exclude', 'fragment', 'scatter', 'separate', 'split', 'vacate'], // Integrate
  'integrated': ['chaotic', 'deconstructivism', 'detached', 'disconnected', 'disjointed', 'disparate', 'divided', 'divisive', 'fragmented', 'isolated', 'modular', 'scattered', 'segmented', 'segregated', 'separate'], // Integrated
  'integrating': ['dividing', 'isolating', 'obliterating'], // integrating
  'integration': ['dissipation', 'exile', 'expulsion', 'negation'], // Integration
  'integrity': ['ambiguity', 'chaos', 'confusion', 'corrupt', 'corruption', 'deceit', 'dishonesty', 'disorder', 'distortion', 'flaw', 'fragmented', 'incoherence', 'ruin', 'separation'], // integrity
  'intellect': ['dullard', 'heavy'], // Intellect
  'intellectual property': ['merchandise'], // intellectual property
  'intelligence': ['foolishness', 'stupidity'], // Intelligence
  'intelligent': ['foolish', 'silly'], // intelligent
  'intense': ['blunt', 'dispassionate', 'easy', 'fading', 'faint', 'filtered', 'flippant', 'idle', 'leisurely', 'mellow', 'mute', 'paused', 'shallow', 'slack', 'washed', 'weak'], // intense
  'intensification': ['diminution', 'reduction'], // intensification
  'intensify': ['calm', 'cool', 'dull', 'fade', 'lessen', 'reduce', 'subdue', 'subside', 'weaken'], // intensify
  'intensifying': ['diluting', 'dissolving', 'subduing'], // intensifying
  'intensity': ['heavy', 'levity'], // Intensity
  'intent': ['aimless', 'distracted', 'heavy'], // Intent
  'intention': ['negligence'], // intention
  'intentional': ['aimless', 'arbitrary', 'artless', 'awkward', 'frivolous', 'haphazard', 'hasty', 'impure', 'massproduced', 'negligent', 'unplanned'], // Intentional
  'interaction': ['detachment', 'disconnection', 'isolation', 'monologue', 'separation', 'silence', 'solitude'], // interaction
  'interactions': ['composition', 'contrast'], // Interactions
  'interactive': ['composition', 'detached', 'isolating', 'static'], // Interactive
  'interconnection': ['segregated'], // Interconnection
  'interest': ['boredom', 'disinterest', 'distrust'], // interest
  'interested': ['bored', 'disinterested', 'disjoint'], // interested
  'interface': ['illustration', 'led'], // Interface
  'interfacing': ['contrast', 'disconnection', 'division', 'isolation', 'separation'], // Interfacing
  'interference': ['clarity', 'direct', 'directness', 'flow', 'openness', 'unimpeded'], // Interference
  'interior': ['exterior', 'landscape', 'urban'], // Interior
  'interlink': ['disconnect', 'divide', 'isolate', 'separate', 'split'], // Interlink
  'internal': ['external', 'eyewear'], // internal
  'interpretation': ['ambiguity', 'chaos', 'confusion', 'dogma', 'fact', 'ignorance', 'literalism', 'obscurity'], // Interpretation
  'interrupted': ['uninterrupted', 'untamed'], // Interrupted
  'interstitial': ['clear', 'coherent', 'defined', 'definite', 'distinct', 'focused', 'personal', 'practical', 'solid', 'specific'], // Interstitial
  'intertwined': ['disjoint'], // Intertwined
  'interwoven': ['separate'], // Interwoven
  'intimacy': ['alienation', 'coldness', 'detachment', 'distance', 'grandeur', 'impersonality', 'indifference', 'isolation', 'loneliness', 'separation'], // Intimacy
  'intimate': ['distant', 'external', 'impersonal'], // Intimate
  'intricacy': ['rudimentary'], // intricacy
  'intricate': ['editorial', 'harmony', 'lightweight', 'rudimentary', 'simplify', 'simplifying'], // Intricate
  'intrigue': ['heavy', 'obvious'], // Intrigue
  'introduction': ['endgame', 'finale'], // introduction
  'introspection': ['heavy', 'outward', 'shallow'], // Introspection
  'introspective': ['external', 'heavy', 'obtrusive'], // Introspective
  'introverted': ['bold', 'dynamic', 'expressive', 'extroverted', 'loud', 'outgoing', 'performative', 'social', 'vibrant'], // introverted
  'intuition': ['analytics', 'calculation'], // intuition
  'intuitive': ['theoretical'], // intuitive
  'invade': ['retreat'], // invade
  'invention': ['convention', 'copy', 'heritage', 'imitation', 'repetition', 'routine', 'stagnation', 'tradition', 'uniformity'], // invention
  'invested': ['disinterested'], // invested
  'invigorated': ['weakened', 'weary'], // invigorated
  'invigorating': ['draining', 'tiring'], // invigorating
  'invisibility': ['advertising', 'materials', 'statement'], // invisibility
  'invisible': ['apparent', 'attracting', 'clear', 'evident', 'exposed', 'foreground', 'imaging', 'manifest', 'murals', 'obvious', 'showy', 'visible'], // invisible
  'invitation': ['warning'], // invitation
  'invite': ['lock'], // invite
  'inviting': ['barren', 'bleak', 'cool', 'coolness', 'foul', 'repellent', 'repelling'], // Inviting
  'involved': ['absent', 'detached', 'disinterested', 'dispassionate'], // involved
  'involvement': ['absence', 'detachment', 'disengagement', 'disinterest', 'ignorance', 'indifference', 'neglect', 'passive', 'unintentional'], // involvement
  'inward': ['external', 'outward'], // inward
  'iridescent': ['earthen', 'emerald', 'matt', 'opaque'], // Iridescent
  'irrational': ['behavioral', 'calculated', 'design', 'logical', 'practical', 'rational', 'realistic', 'sane', 'sensible'], // irrational
  'irrationality': ['sense'], // irrationality
  'irregular': ['axis', 'base', 'mainstream', 'normal', 'normalcy', 'rows', 'scheduled', 'sequential'], // irregular
  'irregularity': ['classicism'], // irregularity
  'irrelevant': ['essential', 'impactful', 'important', 'meaningful', 'necessary', 'relevance', 'relevant', 'significant', 'valuable'], // irrelevant
  'irreverence': ['veneration'], // irreverence
  'irreverent': ['authoritative', 'conventional', 'formal', 'respectful', 'reverent', 'serious', 'sincere', 'solemn', 'traditional'], // Irreverent
  'isolate': ['collect', 'combine', 'compositing', 'connect', 'gather', 'interlink', 'join', 'merge', 'share', 'synthesize', 'unite'], // isolate
  'isolated': ['aggregate', 'blockchain', 'cloistered', 'collaborative', 'globe', 'heavy', 'immerse', 'integrated', 'merged', 'public', 'shared', 'symphonic', 'synchronized', 'ubiquitous', 'unified', 'united', 'user-centric'], // Isolated
  'isolating': ['collaborative', 'communal', 'conglomerating', 'connecting', 'engaging', 'inclusive', 'integrating', 'interactive', 'visible'], // isolating
  'isolation': ['closeness', 'collectivism', 'connect', 'corner', 'dialogue', 'ecosystem', 'embrace', 'envelopment', 'fame', 'fandom', 'flotilla', 'fusion', 'interaction', 'interfacing', 'intimacy', 'logistics', 'metaverse', 'microcosm', 'participation', 'premium', 'superimposition', 'togetherness', 'unison'], // Isolation
  'isolationist': ['collaborative'], // isolationist
  'isometric': ['illustration'], // Isometric
  'jaded': ['naive'], // jaded
  'jagged': ['round'], // Jagged
  'janky': ['elegant', 'fine', 'fluid', 'graceful', 'polished', 'refined', 'sleek', 'smooth', 'subtle'], // janky
  'jarring': ['balanced', 'calm', 'cohesive', 'gentle', 'gradual', 'harmonic', 'harmonious', 'neumorphism', 'pleasant', 'seamless', 'smooth', 'soothing', 'subtle'], // jarring
  'jewelry': ['apparel', 'electronics', 'homeware', 'tools', 'utilitarian'], // Jewelry
  'join': ['detach', 'isolate', 'resign', 'separate', 'split'], // join
  'journey': ['abandon', 'deadend', 'endgame'], // Journey
  'jovial': ['dreary', 'gloomy', 'sad', 'solemn', 'sorrowful'], // jovial
  'joy': ['agony', 'anguish', 'bleakness', 'boredom', 'burden', 'calm', 'coldness', 'death', 'displeasure', 'dissatisfaction', 'drudgery', 'fear', 'frustration', 'futility', 'misfortune', 'pain', 'peaceful', 'pessimism', 'serene', 'shame', 'sorrow', 'strain', 'stress', 'strife', 'struggle', 'torment', 'vintage'], // Joy
  'joyful': ['burdensome', 'despairing', 'dismal', 'downcast', 'dreary', 'dystopic', 'grim', 'pessimistic', 'resigned'], // joyful
  'jubilant': ['bitter'], // jubilant
  'jumble': ['clarity', 'harmony', 'layout', 'neatness', 'order', 'simplicity', 'smoothness', 'structure', 'uniformity'], // jumble
  'jumbled': ['calm', 'clear', 'coherent', 'harmonious', 'linearity', 'neat', 'ordered', 'simple', 'structured'], // jumbled
  'justice': ['inferior'], // justice
  'kaleidoscope': ['monochrome-palette'], // kaleidoscope
  'kaleidoscopic': ['dull', 'flat', 'linear', 'monochrome', 'monotony', 'quiet', 'simple', 'static', 'uniform'], // kaleidoscopic
  'key': ['blurry', 'duotone', 'earthen', 'muffled'], // key
  'kind': ['rude', 'savage'], // kind
  'kindness': ['apathy', 'cruelty', 'disdain', 'hatred', 'hostility', 'indifference', 'inferior', 'malice', 'neglect', 'ridicule', 'scorn'], // kindness
  'kinetic': ['heavy'], // Kinetic
  'knowledge': ['foolishness', 'ignorance', 'naivety', 'premium'], // Knowledge
  'knowledgeable': ['clueless', 'illiterate'], // knowledgeable
  'known': ['anonymous', 'forgotten', 'fugitive', 'hidden', 'ignored', 'neglected', 'obscure', 'unfamiliar', 'unknown'], // known
  'labeled': ['ambiguous', 'chaotic', 'diffuse', 'general', 'non-textual', 'random', 'uncertain', 'unlabeled', 'vague'], // labeled
  'laborious': ['easy'], // laborious
  'labyrinthine': ['clear', 'direct', 'linear', 'obvious', 'plain', 'simple', 'simplistic', 'static', 'straight'], // labyrinthine
  'lack': ['abundance', 'adorned', 'art', 'bounty', 'catering', 'full', 'fullness', 'materials', 'merchandise', 'might', 'need', 'plenty', 'richness', 'saturation', 'unleash', 'vibrancy', 'wealth'], // lack
  'lacking': ['complete', 'fertile', 'filled'], // lacking
  'lackluster': ['captivating', 'watches'], // lackluster
  'lame': ['bold', 'colorful', 'coolness', 'dynamic', 'engaging', 'exciting', 'lively', 'stimulating', 'vibrant'], // lame
  'land': ['marine', 'nautical', 'oceanic', 'soar', 'yachting'], // land
  'land-based': ['marine'], // land-based
  'landscape': ['interior'], // landscape
  'language': ['premium'], // Language
  'languid': ['propulsive'], // languid
  'large': ['miniature', 'petite', 'small'], // large
  'lasting': ['evanescent', 'fleeting', 'momentary'], // lasting
  'launch': ['finale', 'stop'], // launch
  'lavish': ['basic', 'cheap', 'dull', 'frugal', 'meager', 'modest', 'plain', 'simple', 'sparse', 'sparsity', 'unadorned'], // lavish
  'layered': ['fibrous', 'flat', 'fluid', 'null', 'simplify'], // Layered
  'layering': ['erasing', 'flattening', 'simplify', 'unify'], // Layering
  'layoffs': ['recruitment'], // layoffs
  'layout': ['estate', 'jumble', 'text'], // Layout
  'laziness': ['active', 'ambition', 'diligent', 'driven', 'energetic', 'engaged', 'gym', 'motivated', 'productive', 'zeal'], // laziness
  'lazy': ['active', 'athlete', 'busy', 'driven', 'dynamic', 'energetic', 'enthusiastic', 'ingenuity', 'motivated', 'vibrant'], // lazy
  'leak': ['block', 'complete', 'firm', 'full', 'intact', 'seal', 'secure', 'solid'], // leak
  'lean': ['plump'], // lean
  'leave': ['remain'], // leave
  'led': ['blind', 'capture', 'chaotic', 'cinematography', 'collage', 'compositing', 'curation', 'detail', 'digital', 'drawing', 'dreamlike', 'exhibition', 'filmic', 'filtering', 'game', 'generation', 'generative', 'graffiti', 'graphics', 'iconography', 'imaging', 'interface', 'lens', 'manipulation', 'masking', 'modeling', 'photoreal', 'photorealistic', 'process', 'projection', 'render', 'retouching', 'schematic', 'shading', 'simulation', 'sketching', 'staging', 'styling', 'typeset', 'typesetting', 'typographic', 'ui-ux', 'vector', 'video', 'volumetrics', 'web'], // Led
  'legacy': ['fintech'], // Legacy
  'leisure': ['demand', 'drudgery', 'grind', 'gym', 'hustle', 'motorsport', 'rush', 'stress'], // Leisure
  'leisurely': ['busy', 'chaotic', 'demanding', 'frantic', 'hectic', 'intense', 'speed', 'stressful', 'urgent'], // leisurely
  'leisurely-flow': ['rushed', 'staccato'], // leisurely-flow
  'lengthy': ['brevity', 'brief', 'instant', 'quick', 'short'], // lengthy
  'lens': ['illustration', 'led'], // Lens
  'lessen': ['amplify', 'intensify', 'magnify', 'overpower'], // lessen
  'letgo': ['hold'], // letgo
  'lethargic': ['activating', 'active', 'athlete', 'bold', 'bright', 'bustling', 'dynamic', 'energetic', 'lively', 'stimulating', 'swift', 'vibrant'], // lethargic
  'lethargy': ['activating', 'zeal', 'zesty'], // lethargy
  'level': ['chaotic', 'diagonal', 'disordered', 'fragmented', 'haphazard', 'raised', 'random', 'scattered', 'uneven'], // level
  'levity': ['burden', 'gravity', 'intensity', 'restraint', 'seriousness', 'sorrow', 'tension', 'weight', 'weightiness'], // levity
  'liberate': ['hinder'], // liberate
  'liberated': ['confining'], // liberated
  'liberating': ['suppressing'], // liberating
  'liberation': ['binding', 'bondage', 'captivity', 'confinement', 'control', 'deprivation', 'imposition', 'limitation', 'oppression', 'restriction', 'subjugation', 'suppression'], // Liberation
  'liberty': ['constraint', 'dependence', 'restriction'], // liberty
  'lie': ['fact'], // lie
  'life': ['coldness', 'death', 'dormancy', 'end', 'fall', 'futility', 'nonexist'], // Life
  'lifeless': ['alive', 'animated', 'colorful', 'dynamic', 'energetic', 'exciting', 'liveliness', 'lively', 'stimulating', 'vibrant', 'vibration', 'vital', 'zest'], // lifeless
  'lift': ['descend', 'drag', 'plunge'], // lift
  'light': ['arduous', 'base', 'blackout', 'blocky', 'boxy', 'burdened', 'burdensome', 'buzz', 'challenging', 'clunky', 'composition', 'concrete', 'cumbersome', 'dark', 'darkness', 'death', 'dusk', 'eclipse', 'flood', 'gothic', 'grim', 'heavy', 'obscured', 'pain', 'pessimism', 'pessimistic', 'serious', 'stern', 'stiff', 'strenuous', 'sturdy', 'thick', 'viscous', 'weight', 'weighty', 'wire'], // Light
  'lighten': ['plunge'], // lighten
  'lightness': ['brutality', 'burden', 'darkness', 'dimness', 'fog', 'gravitas', 'heavy', 'imposition', 'pressure', 'strain'], // Lightness
  'lightweight': ['burdensome', 'complex', 'dense', 'freight', 'heavy', 'intricate', 'monolithic-depth', 'robust', 'solid', 'strenuous'], // lightweight
  'like': ['composition', 'contrast', 'dislike', 'dismiss', 'distrust'], // Like
  'limbo': ['resolve'], // Limbo
  'liminality': ['concreteness'], // Liminality
  'limit': ['boundless', 'chaotic-abundance', 'endless', 'expand', 'expansive', 'freedom', 'freeness', 'infinite', 'limitless', 'overflow', 'unlimited', 'vast'], // Limit
  'limitation': ['boundless', 'boundless-exploration', 'expansion', 'freedom', 'growth', 'infinity', 'liberation', 'limitless', 'openness', 'possibility'], // Limitation
  'limited': ['capable', 'earthen', 'emerald', 'endless', 'endlessness', 'eternal', 'limitless', 'restless', 'ubiquitous', 'unbound', 'unconfined', 'vast'], // Limited
  'limitless': ['bounded', 'confined', 'constrained', 'finite', 'limit', 'limitation', 'limited', 'narrowed', 'restricted', 'shroud', 'stifled'], // limitless
  'line': ['loop'], // Line
  'linear': ['blockchain', 'bump', 'circuitous', 'curvy', 'globe', 'kaleidoscopic', 'labyrinthine', 'loop', 'oblique', 'round', 'serpentine', 'tangential', 'twist', 'twisted', 'wavy'], // linear
  'linear-path': ['circuitous'], // linear-path
  'linearity': ['editorial', 'harmony', 'jumbled'], // Linearity
  'lingering': ['brief', 'ephemeral', 'fleeting', 'hasty', 'instant', 'instant-delivery', 'momentary', 'quick', 'transient'], // lingering
  'liquefying': ['solidifying'], // liquefying
  'liquid': ['frozen', 'heat'], // Liquid
  'literacy': ['confused', 'illiterate', 'premium'], // Literacy
  'literal': ['cubism', 'fable', 'fictional', 'figurative', 'imaginary', 'intangible', 'oblique', 'symbolic', 'symbolism'], // literal
  'literal-interpretation': ['symbolic'], // literal-interpretation
  'literalism': ['interpretation'], // literalism
  'literate': ['illiterate'], // literate
  'live': ['dead', 'expire', 'inactive', 'memorial', 'past', 'stagnant', 'still'], // live
  'liveliness': ['bleakness', 'dead', 'dimness', 'drab', 'dull', 'dullness', 'flat', 'lifeless', 'mundane', 'quiet', 'still'], // Liveliness
  'lively': ['bland', 'bore', 'boring', 'cold', 'dismal', 'drab', 'drag', 'drain', 'drained', 'dreary', 'dull', 'dullard', 'idle', 'lame', 'lethargic', 'lifeless', 'monotonous', 'plain', 'sluggish', 'sober', 'stale', 'sterile', 'stifled', 'stuffy', 'tedious', 'tired', 'weary', 'withering'], // lively
  'loading': ['complete', 'composition', 'contrast', 'finished', 'instant'], // Loading
  'local': ['alien', 'external', 'foreign', 'freight', 'globe', 'premium', 'remote'], // Local
  'localism': ['globalism', 'globalization', 'monotony', 'standardization', 'uniformity'], // localism
  'lock': ['access', 'expose', 'free', 'invite', 'loose', 'open', 'release', 'scroll', 'unblock'], // lock
  'lofty': ['common', 'grounded', 'lowly', 'mundane', 'ordinary', 'simple'], // lofty
  'logic': ['foolishness', 'myth', 'paradox'], // Logic
  'logical': ['chaotic', 'confused', 'disordered', 'emotionalist', 'illiterate', 'illogical', 'irrational', 'random', 'unfocused', 'vague'], // logical
  'logistics': ['chaos', 'isolation', 'residential', 'stagnation', 'waste'], // Logistics
  'loneliness': ['closeness', 'intimacy', 'togetherness'], // loneliness
  'lonely': ['collaborative', 'shared'], // lonely
  'loop': ['angle', 'break', 'broken', 'disrupt', 'end', 'finite', 'gap', 'line', 'linear', 'sharp', 'static', 'stop'], // Loop
  'loose': ['bind', 'binding', 'bound', 'buzz', 'concentrated', 'consolidate', 'constrained', 'constrict', 'contained', 'controlled', 'exact', 'fixed', 'hold', 'lock', 'narrow', 'restrained', 'restrictive', 'rigid', 'root', 'rooted', 'serious', 'stiff', 'strict', 'sturdy', 'tense', 'tight', 'wire'], // loose
  'loosen': ['bound', 'compact', 'convolution', 'dense', 'fixed', 'narrow', 'rigid', 'stack', 'structured', 'tight'], // loosen
  'loosened': ['tightened'], // loosened
  'loosening': ['compressing'], // loosening
  'lore': ['premium'], // Lore
  'loss': ['ascendancy', 'bounty', 'gift', 'merchandise', 'payments', 'peak', 'present', 'produce', 'profit', 'recruitment', 'victory'], // loss
  'lost': ['anchored', 'certain', 'clear', 'competence', 'defined', 'found', 'present', 'secure', 'stable'], // lost
  'loud': ['calm', 'dimming', 'discretion', 'faint', 'gentle', 'humble', 'hushing', 'introverted', 'muffle', 'muffled', 'mute', 'muted', 'muting', 'pale', 'paused', 'quiet', 'reserved', 'shy', 'soft', 'subduing', 'subtle', 'timid', 'whisper'], // loud
  'love': ['cruelty', 'malice'], // love
  'low': ['ascend', 'elevate', 'flood', 'high', 'premium', 'rise', 'stratosphere', 'summit', 'superior', 'top', 'up', 'vertex'], // low
  'low-tech': ['deeptech'], // low-tech
  'lower': ['above', 'ascend', 'elevate', 'elevated', 'higher', 'peak', 'raise', 'rise', 'top', 'up', 'upper'], // lower
  'lowered': ['raised'], // lowered
  'lowly': ['apex', 'lofty'], // lowly
  'loyal': ['fickle'], // loyal
  'lucid': ['confused'], // lucid
  'lucidity': ['chaos', 'complexity', 'confusion', 'darkness', 'heaviness', 'mist', 'muddiness', 'obscurity', 'vagueness'], // lucidity
  'luck': ['misfortune'], // luck
  'luminance': ['darkness', 'dimness', 'nocturn'], // Luminance
  'luminosity': ['editorial', 'harmony'], // Luminosity
  'luminous': ['blind', 'matt', 'repellent', 'rusty'], // luminous
  'lush': ['barren', 'bleak', 'dry', 'shrivel'], // lush
  'lush-abundance': ['meager'], // lush-abundance
  'luxe': ['shabby'], // Luxe
  'luxurious': ['composition', 'contrast', 'shabby'], // Luxurious
  'luxury': ['cheap', 'hunger'], // luxury
  'machinery': ['watches'], // machinery
  'macro': ['basic', 'bland', 'dull', 'flat', 'micro', 'simple', 'subtle', 'vague'], // Macro
  'macrocosm': ['microcosm'], // macrocosm
  'magazine': ['composition', 'contrast'], // Magazine
  'magnify': ['compress', 'diminish', 'flatten', 'lessen', 'minimize', 'reduce', 'shrink', 'simplify'], // Magnify
  'main': ['fragmented', 'marginal', 'minor', 'peripheral', 'scattered', 'secondary', 'sidebar', 'subordinate'], // main
  'mainstream': ['alternative', 'artsy', 'counterculture', 'eccentric', 'experimental', 'irregular', 'niche', 'obscure', 'offbeat', 'uncommon'], // mainstream
  'malice': ['benevolence', 'care', 'charity', 'goodness', 'honesty', 'innocence', 'kindness', 'love', 'trust'], // malice
  'malleable': ['brittle', 'firm', 'fixed', 'hard', 'inflexible', 'rigid', 'solid', 'stiff', 'unyielding'], // malleable
  'manifest': ['concealed', 'disappear', 'invisible'], // manifest
  'manifestation': ['negation'], // Manifestation
  'manifesting': ['disband', 'disperse', 'dissipate', 'halt', 'neglect', 'repel', 'suppress', 'vanishing', 'void'], // manifesting
  'manipulation': ['genuine', 'illustration', 'led'], // Manipulation
  'manual': ['automated', 'automotive', 'edtech', 'fintech', 'postdigital', 'robotics', 'technographic', 'xr'], // manual
  'manual-labor': ['motorsport'], // manual-labor
  'manufacturing': ['agriculture', 'catering', 'craft', 'retail', 'service'], // Manufacturing
  'marble': ['frayed'], // Marble
  'marginal': ['main'], // marginal
  'marine': ['aerospace', 'continental', 'inland', 'land', 'land-based', 'terrestrial', 'urban'], // Marine
  'marked': ['erased'], // marked
  'marketing': ['absence', 'chaos', 'confusion', 'disinterest', 'disorder', 'indifference', 'neglect', 'operations', 'research', 'secrecy', 'silence'], // Marketing
  'mask': ['uncover', 'unveiling'], // mask
  'masked': ['clear', 'exposed', 'identity', 'overlook', 'revealed', 'unveiled', 'visible'], // masked
  'masking': ['illustration', 'led', 'unveiling'], // Masking
  'masonry': ['based', 'grid'], // Masonry
  'mass': ['boutique', 'petiteness', 'point', 'watchmaking', 'yachting'], // Mass
  'mass-market': ['boutique'], // mass-market
  'massing': ['outlining'], // massing
  'massive': ['diminutive', 'miniature', 'petite', 'small', 'thin', 'tiny'], // massive
  'massproduced': ['artisanal', 'bespoke', 'crafted', 'handcrafted-goods', 'individual', 'intentional', 'personal', 'specific', 'unique'], // massproduced
  'mastered': ['fumbled'], // mastered
  'masterful': ['amateur'], // masterful
  'mastery': ['fumbled'], // Mastery
  'matched': ['disparate'], // matched
  'material': ['disembodiment', 'intangible', 'metaverse'], // material
  'materialize': ['disappear'], // materialize
  'materials': ['absence', 'depletion', 'emptiness', 'invisibility', 'lack', 'nothing', 'scarcity', 'void'], // Materials
  'matt': ['bright', 'glossy', 'iridescent', 'luminous', 'phosphor', 'polished', 'reflective', 'shiny', 'smooth', 'vivid'], // matt
  'matte': ['gleaming', 'hard', 'reflectivity', 'scrolling', 'shiny'], // Matte
  'mature': ['childlike'], // mature
  'maturity': ['youthfulness'], // maturity
  'maximalist': ['brutalist', 'glassmorphism', 'minimal', 'minimalistic'], // Maximalist
  'maximize': ['minimize'], // maximize
  'meager': ['abundant', 'extravagant', 'exuberant', 'generous', 'lavish', 'lush-abundance', 'opulent', 'plentiful', 'rich'], // Meager
  'meaning': ['ambiguity', 'chaos', 'confusion', 'empty', 'foolishness', 'insignificance', 'narrative-absence', 'nonsense', 'trivial', 'vague'], // meaning
  'meaningful': ['forgettable', 'frivolous', 'futile', 'irrelevant', 'petty', 'pointless', 'superficial', 'trivial', 'useless', 'worthless'], // meaningful
  'measured': ['hasty'], // measured
  'measurement': ['composition', 'contrast'], // Measurement
  'mechanic': ['artistic', 'chaotic', 'fluid', 'freeform', 'handcrafted', 'improvised', 'natural', 'organic', 'spontaneous'], // mechanic
  'mechanical': ['artistic', 'behavioral', 'bio', 'biomorphic', 'botanical', 'chaotic', 'fluid', 'free', 'natural', 'organic', 'soft', 'spontaneous'], // mechanical
  'media': ['corporate', 'finance'], // Media
  'mediocre': ['aspiration', 'bold', 'dynamic', 'elite', 'exceptional', 'exciting', 'innovative', 'original', 'unique', 'vibrant'], // mediocre
  'mediocrity': ['excellence'], // mediocrity
  'meekness': ['assertiveness'], // meekness
  'melancholy': ['exuberance', 'playful', 'whimsical'], // Melancholy
  'mellow': ['agitated', 'blazing', 'chaotic', 'harsh', 'intense', 'strident', 'tense'], // Mellow
  'melodic': ['discordant'], // melodic
  'melody': ['cacophony'], // Melody
  'melt': ['chill', 'cool', 'firm', 'freeze', 'frost', 'hard', 'solid', 'solidify', 'stiff', 'still'], // melt
  'melting': ['solidifying'], // melting
  'memorable': ['forgettable'], // memorable
  'memorial': ['live'], // Memorial
  'memory': ['oblivion'], // Memory
  'menu': ['composition', 'contrast', 'freestyle'], // Menu
  'merchandise': ['absence', 'discard', 'empty', 'essentials', 'experiences', 'free', 'intellectual property', 'lack', 'loss', 'services', 'spare', 'void'], // Merchandise
  'merge': ['detach', 'divide', 'isolate', 'separate', 'split'], // merge
  'merged': ['disjoint', 'dispersed', 'distinct', 'isolated', 'separate'], // merged
  'merging': ['dividing'], // merging
  'merriment': ['heavy'], // Merriment
  'mesh': ['serif'], // Mesh
  'mess': ['beauty', 'catering', 'clarity', 'clean', 'engineering', 'harmony', 'method', 'neat', 'order', 'outlining', 'portfolio', 'sightful', 'simplicity', 'structure', 'tidy', 'typecraft', 'whisper'], // mess
  'messaging': ['confusion', 'detachment', 'disconnection', 'ignorance', 'silence'], // Messaging
  'messiness': ['aesthetics', 'definition'], // messiness
  'messy': ['adulting', 'calm', 'clean', 'docs', 'flawless', 'formality', 'formed', 'harmonic', 'neat', 'orderly', 'organized', 'perfect', 'precise', 'prime', 'scholarly', 'simplifying', 'spotless', 'steadfast', 'sterile', 'structured', 'tidy', 'untouched', 'wash'], // messy
  'metallic': ['fibrous', 'fluid'], // Metallic
  'metaverse': ['absence', 'analog', 'disconnection', 'isolation', 'material', 'onsite', 'physical', 'realism', 'simplicity', 'solidity', 'stagnation', 'tangibility'], // Metaverse
  'method': ['chaos', 'confusion', 'deliberate-chaos', 'disorder', 'haphazard', 'improvisation', 'mess', 'random', 'spontaneity'], // method
  'methodical': ['arbitrary', 'disorderly', 'disorganized', 'haphazard', 'random', 'scatterbrained', 'scrawl', 'unplanned'], // Methodical
  'meticulous': ['negligent'], // meticulous
  'metropolitan': ['rural'], // metropolitan
  'micro': ['macro', 'vast'], // Micro
  'microcosm': ['chaos', 'emptiness', 'grandeur', 'infinity', 'isolation', 'macrocosm', 'simplicity', 'stagnation', 'uniformity', 'vastness', 'void'], // Microcosm
  'might': ['absence', 'deficiency', 'despair', 'dullness', 'emptiness', 'lack', 'perceived-weakness', 'sadness', 'void', 'weakness'], // might
  'mild': ['harsh'], // mild
  'milestone': ['anonymity', 'disregard', 'failure', 'neglect', 'obscurity'], // Milestone
  'mindful': ['careless', 'distracted', 'mindless', 'oblivious'], // mindful
  'mindless': ['aware', 'conscious', 'engaged', 'mindful', 'thoughtful'], // mindless
  'miniature': ['full-scale', 'gigantic', 'grandiose', 'huge', 'large', 'massive', 'monumental'], // Miniature
  'minimal': ['arcade', 'archaic', 'cluttered', 'decorated', 'elaborate', 'excessive', 'flood', 'indulgent', 'maximalist', 'overwrought'], // Minimal
  'minimalism': ['deconstructivism', 'exaggeration', 'excess'], // Minimalism
  'minimalistic': ['cluttered', 'composition', 'contrast', 'dense', 'excessive', 'maximalist'], // Minimalistic
  'minimize': ['chaos', 'complexity', 'contrast', 'diversity', 'emphasize', 'expansion', 'magnify', 'maximize', 'overline', 'variety'], // minimize
  'mining': ['bakery', 'winery'], // mining
  'minor': ['main'], // minor
  'minuscule': ['vast'], // minuscule
  'mirth': ['heavy', 'weight'], // Mirth
  'misery': ['euphoria', 'pleasure', 'well-being'], // misery
  'misfortune': ['blessing', 'fortune', 'happiness', 'joy', 'luck', 'prosperity', 'serendipity', 'success', 'wealth'], // misfortune
  'misleading': ['honest'], // misleading
  'mismatch': ['accuracy', 'alignment', 'clarity', 'coherence', 'consistency', 'harmony', 'homogeneity', 'precision', 'sameness', 'unity'], // mismatch
  'missed': ['complete'], // missed
  'mist': ['lucidity'], // Mist
  'mixed': ['mono'], // mixed
  'mobile': ['fixed', 'immobile', 'rigid', 'settled', 'static', 'stationary', 'still', 'unmoving'], // Mobile
  'mobility': ['anchored', 'bound', 'fixed', 'fixity', 'immobility', 'rigid', 'stability', 'stagnation', 'stasis', 'static', 'stationary'], // Mobility
  'mockery': ['respect', 'sincerity', 'support'], // mockery
  'modal': ['composition', 'contrast'], // Modal
  'modeling': ['illustration', 'led'], // Modeling
  'modelling': ['chaos', 'chaotic', 'disorder', 'disorderly', 'haphazard', 'improvised', 'random', 'rough', 'spontaneous', 'unstructured'], // Modelling
  'moderation': ['excess'], // moderation
  'modern': ['ancient', 'archaic', 'artifact', 'composition', 'contrast', 'gothic', 'historical', 'obsolete', 'primitive', 'retro', 'rural', 'traditional', 'vintage'], // Modern
  'modernism': ['classicism'], // modernism
  'modernity': ['obsolescence', 'youth'], // Modernity
  'modest': ['excessive', 'flamboyant', 'gaudy', 'greed', 'indulgent', 'lavish', 'pretentious'], // modest
  'modular': ['integrated'], // Modular
  'modularity': ['flow'], // Modularity
  'molten': ['calm', 'cold', 'cool', 'frozen', 'solid', 'stable', 'stagnant', 'still'], // Molten
  'moment': ['eternity'], // Moment
  'momentary': ['endless', 'endlessness', 'enduring', 'eternal', 'lasting', 'lingering', 'perpetual', 'perpetuity', 'timeless'], // momentary
  'mono': ['abundant', 'chaotic', 'complex', 'diverse', 'dynamic', 'mixed', 'poly', 'varied'], // mono
  'monochromatic': ['cool', 'coolness'], // Monochromatic
  'monochrome': ['cool', 'coolness', 'diverse', 'graded', 'kaleidoscopic', 'murals', 'vibrant'], // Monochrome
  'monochrome-palette': ['kaleidoscope'], // monochrome-palette
  'monoculture': ['chaos', 'complexity', 'contrast', 'difference', 'diversity', 'individuality', 'uniqueness', 'variety'], // monoculture
  'monolith': ['strata'], // monolith
  'monolithic': ['hybrid', 'segmented', 'variable'], // Monolithic
  'monolithic-depth': ['lightweight'], // monolithic-depth
  'monologue': ['dialogue', 'interaction'], // monologue
  'monopoly': ['chaos', 'collaboration', 'competition', 'decentralization', 'disorder', 'diversity', 'freedom', 'openness', 'variety'], // monopoly
  'monospace': ['composition', 'contrast'], // Monospace
  'monotonous': ['boutique', 'colorful', 'diverse', 'dynamic', 'eclectic', 'energetic', 'exciting', 'lively', 'reactive', 'stimulating', 'variant', 'varied', 'vibrant'], // monotonous
  'monotony': ['adaptability', 'customization', 'event', 'exuberance', 'flotilla', 'kaleidoscopic', 'localism', 'passion'], // monotony
  'monumental': ['editorial', 'fleeting', 'harmony', 'insignificant', 'miniature', 'petite', 'trivial'], // Monumental
  'morning': ['darkness', 'dusk', 'evening', 'night', 'sleep'], // morning
  'morph': ['constant'], // Morph
  'mortality': ['endlessness', 'eternity', 'immortality', 'perpetuity'], // Mortality
  'mosaic': ['chaos', 'disorder', 'empty', 'fragment', 'simple', 'singular', 'singular-style', 'uniform', 'void'], // mosaic
  'motion': ['slowness', 'stuck'], // motion
  'motivate': ['bore', 'dampen', 'discourage', 'stagnate'], // motivate
  'motivated': ['laziness', 'lazy'], // motivated
  'motorsport': ['calm', 'gentle', 'leisure', 'manual-labor', 'mundane', 'pedestrian', 'quiet', 'simple', 'slow', 'slow-paced', 'static'], // Motorsport
  'move': ['halt', 'stop'], // move
  'moved': ['unmoved'], // moved
  'movement': ['dormancy'], // Movement
  'moving': ['dormant', 'paused', 'stopped'], // moving
  'muddiness': ['lucidity'], // muddiness
  'muddle': ['clarity', 'coherence', 'design', 'focus', 'order', 'precision', 'shape', 'simplicity', 'structure'], // muddle
  'muddy': ['bright', 'clean', 'clear', 'cyanic', 'dry', 'fresh', 'gleaming', 'neat', 'pure', 'smooth'], // muddy
  'muffle': ['amplify', 'clarify', 'enhance', 'expose', 'express', 'loud', 'project', 'reveal', 'signal'], // muffle
  'muffled': ['bold', 'bright', 'clear', 'defined', 'distinct', 'key', 'loud', 'sharp', 'vivid'], // muffled
  'multi': ['blank', 'plain', 'simple', 'single', 'singular-tone', 'solo', 'uniform'], // multi
  'multiple': ['single'], // multiple
  'multiply': ['deplete'], // multiply
  'mundane': ['adventurous', 'aether', 'alien', 'alluring', 'art', 'attractive', 'bold', 'captivating', 'dynamic', 'exciting', 'exotic', 'experimental', 'extraordinary', 'ingenuity', 'innovative', 'liveliness', 'lofty', 'motorsport', 'personalized', 'propulsive', 'retrofuturism', 'roars', 'stellar', 'surprise', 'symbolic', 'techno-futurism', 'unique', 'uniqueness', 'vanguard', 'vibrant', 'xr', 'yachting', 'zesty'], // mundane
  'mundane-spectacle': ['forgettable'], // mundane-spectacle
  'murals': ['bland', 'digital art', 'dull', 'empty', 'fine art', 'invisible', 'monochrome', 'plain', 'sculpture', 'silent', 'small-scale art', 'sterile'], // Murals
  'murky': ['bright', 'calm', 'clean', 'clear', 'crystalline', 'serene', 'smooth', 'stable', 'tranquil'], // murky
  'museum': ['absence', 'chaos', 'contemporary', 'destruction', 'disorder', 'dissonance', 'ephemeral', 'ignorance', 'neglect', 'retail', 'void'], // Museum
  'music': ['centered', 'composition'], // Music
  'mutable': ['archival', 'constant', 'enduring', 'fixed', 'immutable', 'permanent', 'rigid', 'stable', 'steady', 'unchanging'], // mutable
  'mute': ['amplify', 'bold', 'bright', 'colorful', 'flamboyant', 'intense', 'loud', 'overpower', 'tones', 'unleash', 'vibrant', 'vivid'], // mute
  'muted': ['authoritative', 'blaring', 'blasts', 'blinding', 'brash', 'brilliant', 'confident', 'cool', 'coolness', 'dazzling', 'flashy', 'garish', 'garnish', 'glare', 'ignited', 'loud', 'neon', 'overt', 'screaming', 'shine', 'shouted', 'strident', 'vibrant', 'vibration'], // Muted
  'muted-ambiance': ['strident'], // muted-ambiance
  'muted-emotion': ['explosive'], // muted-emotion
  'muting': ['amplifying', 'emphasizing', 'highlighting', 'loud'], // muting
  'mysterious': ['obvious'], // Mysterious
  'mystery': ['blatant', 'heavy'], // Mystery
  'mystique': ['heavy'], // Mystique
  'myth': ['certainty', 'clarity', 'evidence', 'fact', 'logic', 'reality', 'reason', 'truth'], // myth
  'naive': ['academia', 'adulting', 'apex', 'complex', 'critical', 'cynical', 'deeptech', 'jaded', 'pragmatic', 'skeptical', 'sophisticated', 'worldly'], // naive
  'naivety': ['cynicism', 'experience', 'knowledge', 'pragmatism', 'realism', 'scholarship', 'skepticism', 'sophistication', 'wisdom', 'worldliness'], // naivety
  'naked': ['caps', 'covered', 'shield', 'shielded'], // naked
  'narrative-absence': ['context', 'meaning'], // narrative-absence
  'narrow': ['curvy', 'loose', 'loosen', 'vast'], // narrow
  'narrowed': ['limitless'], // narrowed
  'narrowing': ['broadening', 'expanding', 'expansion', 'filling', 'flowing', 'growing', 'opening', 'stretching', 'unfolding'], // Narrowing
  'narrowness': ['clarity', 'ease', 'emptiness', 'expanse', 'expansion', 'freedom', 'openness', 'vastness', 'width'], // narrowness
  'native': ['alien', 'foreign'], // native
  'natural': ['artificial', 'automated', 'cgi', 'concrete', 'cosmetics', 'eyewear', 'fabricated', 'factory', 'mechanic', 'mechanical', 'polluted', 'post-process', 'pretentious', 'racket', 'robotic', 'robotics', 'simulated', 'staged', 'steel', 'stilted', 'techno-futurism', 'technographic', 'techwear', 'toxic', 'wire', 'wrought'], // natural
  'natural-flow': ['stilted'], // natural-flow
  'naturalism': ['premium', 'regulated'], // Naturalism
  'nature': ['pollution'], // Nature
  'nautical': ['desert', 'domestic', 'inland', 'land', 'urban'], // Nautical
  'near': ['descent', 'distant'], // near
  'neat': ['blotchy', 'chaotic', 'cluttered', 'complexity', 'disarrayed', 'disheveled', 'disorderly', 'disorganized', 'distressed', 'frayed', 'haphazard', 'imperfect', 'jumbled', 'mess', 'messy', 'muddy', 'ragged', 'random', 'rough', 'scrappy', 'scratched', 'scrawl', 'shabby', 'sloppy', 'spill', 'splat', 'splotchy', 'sprawl', 'sprawled', 'tangle', 'wash'], // neat
  'neatness': ['filth', 'jumble', 'scribble', 'sloppiness', 'squalor'], // neatness
  'nebula': ['finite'], // Nebula
  'nebulous': ['certain', 'clear', 'defined', 'definite', 'distinct', 'focused', 'precise', 'sharp', 'typographic'], // nebulous
  'necessary': ['extraneous', 'irrelevant'], // necessary
  'need': ['disinterest', 'emptiness', 'lack', 'privilege', 'sufficiency', 'surplus', 'want'], // need
  'negation': ['acceptance', 'affirmation', 'calm', 'connection', 'engagement', 'expansion', 'integration', 'manifestation', 'reassurance'], // negation
  'negative': ['editorial', 'harmony', 'positive'], // Negative
  'neglect': ['accept', 'admiration', 'admire', 'admiring', 'adopt', 'advertising', 'affection', 'affirm', 'appreciate', 'attachment', 'attraction', 'catering', 'cherish', 'childcare', 'completion', 'conservation', 'cultivate', 'demand', 'dentistry', 'edutainment', 'encourage', 'engage', 'engrave', 'fame', 'fandom', 'favor', 'fixation', 'grasp', 'healthtech', 'involvement', 'kindness', 'manifesting', 'marketing', 'milestone', 'museum', 'participation', 'present', 'produce', 'promotion', 'publishing', 'recognition', 'recruitment', 'regard', 'respect', 'selfcare', 'sightful', 'skincare', 'support', 'utopia', 'valuing', 'veneration', 'watchmaking'], // neglect
  'neglected': ['cultivated', 'embraced', 'known'], // neglected
  'neglectful': ['user-centric'], // neglectful
  'neglecting': ['cherishing'], // neglecting
  'negligence': ['analytics', 'attention', 'awareness', 'care', 'consideration', 'diligence', 'engagement', 'focus', 'intention', 'remembrance'], // negligence
  'negligent': ['careful', 'diligent', 'focused', 'imaging', 'intentional', 'meticulous', 'orderly', 'structured', 'thorough'], // negligent
  'neon': ['cool', 'coolness', 'muted', 'pastel'], // Neon
  'neumorphic': ['bold', 'clear', 'contrasting', 'defined', 'flat', 'harsh', 'rigid', 'sharp', 'solid', 'vibrant'], // Neumorphic
  'neumorphism': ['futurism', 'futurist', 'jarring'], // Neumorphism
  'neurodiversity': ['premium'], // Neurodiversity
  'neutral': ['fiery', 'flamboyant', 'heated', 'ochre', 'statement'], // neutral
  'new': ['aftermath', 'ancient', 'historical', 'patina', 'rusty'], // New
  'nexus': ['disband'], // Nexus
  'niche': ['mainstream', 'ubiquitous'], // niche
  'night': ['awake', 'day', 'morning', 'seed', 'sun'], // Night
  'nihilism': ['classicism'], // nihilism
  'nimble': ['clunky'], // nimble
  'noble': ['petty'], // noble
  'nocturn': ['brightness', 'clarity', 'colorful', 'daylight', 'diurnus', 'luminance', 'radiance', 'transparency', 'vivid'], // nocturn
  'nocturne': ['earthen', 'emerald'], // Nocturne
  'noise': ['whisper'], // noise
  'noisy': ['calm', 'clear', 'focused', 'objective', 'quiet', 'serene', 'simple', 'subdued'], // noisy
  'non-alcoholic': ['wine'], // non-alcoholic
  'non-monetary': ['payments'], // non-monetary
  'non-profit': ['business', 'commercial', 'corporate', 'for', 'for-profit', 'greed', 'profit', 'selfish', 'wealth'], // Non-profit
  'non-representation': ['depiction', 'symbolism'], // non-representation
  'non-representational': ['depictive', 'figurative'], // non-representational
  'non-textual': ['labeled', 'verbal'], // non-textual
  'non-visual': ['sightful'], // non-visual
  'nonconform': ['conform'], // nonconform
  'nonconformist': ['compliant'], // nonconformist
  'nonexist': ['being', 'exist', 'existence', 'life', 'presence', 'reality', 'substance', 'vitality'], // nonexist
  'nonprofit': ['commercial', 'cool', 'coolness', 'greed', 'profit', 'wealth'], // Nonprofit
  'nonsense': ['meaning', 'sense'], // nonsense
  'nonverbal': ['articulate', 'communicative', 'expressive', 'spoken', 'textuality', 'verbal', 'vocal'], // nonverbal
  'normal': ['abnormal', 'chaotic', 'eccentric', 'extraordinary', 'irregular', 'odd', 'strange', 'surrealist-vision', 'unusual', 'wild'], // normal
  'normalcy': ['abnormal', 'anomaly', 'chaos', 'disorder', 'divergent', 'fantasy', 'irregular', 'peculiar', 'risk', 'unusual'], // normalcy
  'norms': ['counterculture'], // norms
  'nostalgia': ['heavy', 'nowhere', 'playful', 'present'], // Nostalgia
  'notable': ['forgettable', 'forgotten', 'insignificant'], // notable
  'noted': ['disregarded'], // noted
  'nothing': ['existence', 'globe', 'materials'], // nothing
  'notice': ['forget', 'ignore'], // notice
  'noticed': ['ignored'], // noticed
  'nourish': ['blight', 'deplete', 'starve'], // Nourish
  'nourishment': ['deprivation', 'disorder', 'emptiness', 'starvation', 'waste'], // Nourishment
  'novel': ['ancient', 'archaic', 'artifact', 'common', 'dull', 'familiar', 'historical', 'old', 'ordinary', 'repetitive', 'stale', 'standard', 'tainted', 'traditional'], // Novel
  'novelty': ['classicism', 'obsolescence', 'premium', 'roots'], // Novelty
  'now': ['past'], // now
  'nowhere': ['aware', 'certain', 'clear', 'defined', 'found', 'nostalgia', 'present', 'somewhere', 'visible'], // nowhere
  'nuanced': ['blatant', 'crude', 'rudimentary'], // nuanced
  'nucleus': ['absence', 'chaos', 'disorder', 'fragment', 'periphery', 'scatter', 'void'], // nucleus
  'null': ['active', 'appearing', 'complex', 'dynamic', 'filled', 'generation', 'layered', 'rich', 'structured', 'vibrant'], // Null
  'numb': ['alive', 'clear', 'comfortable', 'excited', 'perceptive', 'pure', 'sensitive', 'sharp', 'vivid'], // numb
  'nurture': ['damage', 'exploitation', 'harm', 'hinder'], // Nurture
  'nurturing': ['destroy', 'selfish'], // Nurturing
  'obedience': ['anarchy', 'chaos', 'defiance', 'disobedience', 'freedom', 'independence', 'rebellion', 'resistance'], // obedience
  'obedient': ['chaotic', 'defiant', 'disobedient', 'independent', 'rebel', 'rebellious', 'uncontrolled', 'unruly', 'wild'], // obedient
  'objective': ['noisy', 'subjective'], // objective
  'objectivist': ['subjective'], // objectivist
  'objectivity': ['ambiguity', 'bias', 'confusion', 'distortion', 'emotion', 'opinion', 'partiality', 'subjectivity'], // objectivity
  'obligation': ['freetime', 'hobby'], // obligation
  'oblique': ['clear', 'direct', 'even', 'flat', 'linear', 'literal', 'simple', 'straight', 'uniform'], // Oblique
  'obliterate': ['engrave'], // obliterate
  'obliterating': ['building', 'cohesion', 'completing', 'creating', 'forming', 'integrating', 'sculpting', 'solidifying', 'uniting'], // obliterating
  'obliteration': ['accumulation', 'clarity', 'creation', 'existence', 'intactness', 'presence', 'rebirth', 'unity', 'wholeness'], // obliteration
  'oblivion': ['awareness', 'clarity', 'discovery', 'existence', 'identity', 'memory', 'presence', 'significance'], // oblivion
  'oblivious': ['alert', 'attentive', 'aware', 'conscious', 'engaged', 'focused', 'mindful', 'perceptive', 'present'], // oblivious
  'obscure': ['apparent', 'blatant', 'famous', 'highlight', 'honest', 'known', 'mainstream', 'overt', 'straightforward', 'uncover', 'unveiling', 'visible'], // obscure
  'obscured': ['apparent', 'centralized', 'directness', 'light', 'visible'], // Obscured
  'obscuring': ['bright', 'clear', 'defined', 'exposed', 'focused', 'highlighting', 'illuminated', 'revealing', 'visible'], // obscuring
  'obscurity': ['clarity', 'definition', 'fame', 'gesture', 'glimpse', 'interpretation', 'lucidity', 'milestone', 'publicity', 'recognition', 'revelation', 'statement', 'transparency', 'unveiling', 'visibility'], // Obscurity
  'observant': ['distracted'], // observant
  'observation': ['blindness'], // Observation
  'observe': ['ignore'], // observe
  'obsolescence': ['clarity', 'essential', 'freshness', 'modernity', 'novelty', 'redefinition', 'relevance', 'utility', 'vitality'], // obsolescence
  'obsolete': ['active', 'current', 'development', 'eco-tech', 'edtech', 'essential', 'innovative', 'modern', 'relevance', 'relevant', 'timely', 'vibrant', 'wearables'], // obsolete
  'obstacle': ['access', 'clarity', 'ease', 'flow', 'freedom', 'openness', 'path', 'pathway', 'solutions', 'support'], // obstacle
  'obstacles': ['solutions'], // obstacles
  'obstruction': ['catalyst'], // obstruction
  'obtainable': ['abstract', 'distant', 'elusive', 'impossible', 'inaccessible', 'remote', 'unattainable', 'unreachable'], // obtainable
  'obtrusive': ['discreet', 'introspective', 'quiet', 'soft', 'subtle'], // obtrusive
  'obvious': ['ambiguous', 'complex', 'concealed', 'concealing', 'covert', 'discretion', 'hidden', 'illusory', 'intrigue', 'invisible', 'labyrinthine', 'mysterious', 'strange', 'subtle', 'symbolic', 'uncertain', 'unclear', 'unknown'], // obvious
  'obviousness': ['discretion'], // obviousness
  'occupied': ['vacancy', 'vacant'], // occupied
  'occupy': ['vacate'], // occupy
  'oceanic': ['arid', 'barren', 'dry', 'land', 'stale'], // Oceanic
  'ochre': ['bright', 'clean', 'cool', 'dark', 'neutral', 'pale', 'soft', 'vivid'], // Ochre
  'odd': ['normal'], // odd
  'offbeat': ['centered', 'conventional', 'expected', 'mainstream', 'ordinary', 'predictable', 'standard', 'traditional', 'uniform'], // offbeat
  'offer': ['consume'], // offer
  'office': ['hotels', 'residential'], // office
  'official': ['casual', 'informal'], // official
  'offset': ['concentricity'], // offset
  'old': ['composition', 'contrast', 'novel', 'renew', 'youthfulness'], // Old
  'ominous': ['hopeful'], // Ominous
  'ongoing': ['final', 'finished'], // ongoing
  'onsite': ['metaverse'], // onsite
  'opacity': ['reflectivity'], // opacity
  'opaque': ['bright', 'clear', 'gleaming', 'iridescent', 'phosphor', 'porous', 'translucency', 'transparent', 'visible'], // opaque
  'open': ['armored', 'bind', 'bondage', 'bound', 'bounded', 'burdened', 'cloistered', 'closed', 'cloudy', 'concealed', 'concealing', 'confining', 'constrict', 'contained', 'covered', 'covert', 'curtained', 'deadend', 'deceptive', 'doctrinal', 'enclosed', 'end', 'final', 'finish', 'finished', 'folded', 'fortified', 'fraudulent', 'guarded', 'hiding', 'insincere', 'lock', 'predefined', 'predetermined', 'private', 'restricted', 'restrictive', 'sealed', 'shielded', 'shroud', 'shrouded', 'shy', 'stopped', 'stuffy', 'suppressed', 'veiled', 'withholding'], // open
  'open-crowns': ['veiled'], // open-crowns
  'open-top': ['cloistered', 'enclosed', 'sealed'], // open-top
  'opening': ['closing', 'finale', 'narrowing'], // opening
  'openness': ['burden', 'captivity', 'closed', 'constraint', 'disguise', 'distrust', 'encasement', 'envelopment', 'finality', 'fog', 'guarded', 'interference', 'limitation', 'monopoly', 'narrowness', 'obstacle', 'restriction', 'shield'], // Openness
  'operations': ['marketing'], // operations
  'ophthalmology': ['orthodontics'], // ophthalmology
  'opinion': ['objectivity'], // opinion
  'oppose': ['support'], // oppose
  'oppression': ['liberation'], // oppression
  'oppressive': ['empowering'], // oppressive
  'optimism': ['pessimism'], // Optimism
  'optimistic': ['despairing', 'dystopic', 'pessimistic'], // Optimistic
  'opulent': ['cheap', 'meager'], // opulent
  'order': ['anomaly', 'blurb', 'cacophony', 'chaos', 'clamor', 'complication', 'confusion', 'deconstructivism', 'din', 'disorder', 'exaggeration', 'filth', 'fuzz', 'jumble', 'mess', 'muddle', 'overflow', 'paradox', 'racket', 'scribble', 'sloppiness', 'squalor', 'tangle', 'tumult', 'turbulence', 'turmoil', 'war', 'whirlwind'], // Order
  'ordered': ['arbitrary', 'cluttered', 'deconstructivism', 'freeform', 'frenzy', 'jumbled', 'rambling', 'random', 'terrain', 'untamed'], // ordered
  'orderly': ['anarchic', 'anti', 'brushstroke', 'clatter', 'crooked', 'disarrayed', 'disheveled', 'disorderly', 'disorganized', 'distressed', 'feral', 'freestyle', 'fumbled', 'haphazard', 'harried', 'illogical', 'messy', 'negligent', 'ragged', 'raucous', 'rebel', 'reckless', 'scrap', 'scrappy', 'scrawl', 'shabby', 'shifty', 'sloppy', 'spill', 'splat', 'sprawl', 'squiggly', 'twisted', 'unruly', 'unsteady'], // orderly
  'ordinariness': ['customization', 'excellence', 'idiosyncrasy'], // ordinariness
  'ordinary': ['alien', 'attractive', 'captivating', 'colorful', 'crowned', 'deeptech', 'distinctive', 'dynamic', 'elite', 'exceptional', 'excessive', 'exotic', 'extraordinary', 'fame', 'famous', 'flamboyant', 'garnish', 'lofty', 'novel', 'offbeat', 'propulsive', 'rare', 'remarkable', 'retrofuturism', 'roars', 'singular', 'stellar', 'surrealism', 'symbolic', 'uncommon', 'unfamiliar', 'unhinged', 'unique', 'uniqueness', 'vanguard', 'vivid', 'xr'], // ordinary
  'organic': ['artifact', 'automated', 'based', 'blocky', 'boxy', 'cgi', 'concrete', 'factory', 'geometric', 'grid', 'mechanic', 'mechanical', 'polluted', 'robotic', 'robotics', 'staged', 'steel', 'sterile', 'technographic'], // Organic
  'organization': ['disorder'], // organization
  'organize': ['discard'], // organize
  'organized': ['cluttered', 'confusing', 'disarrayed', 'disorderly', 'disorganized', 'disregarded', 'messy', 'scatterbrained', 'shifty', 'sprawl', 'sprawled', 'unformed', 'unplanned'], // organized
  'origin': ['aftermath', 'eclipse'], // Origin
  'original': ['banal', 'fake', 'mediocre', 'simulacrum', 'tainted'], // original
  'ornamentation': ['editorial', 'harmony'], // Ornamentation
  'ornate': ['plain'], // ornate
  'orthodontics': ['cardiology', 'dermatology', 'ophthalmology', 'podiatry'], // Orthodontics
  'orthodoxy': ['counterculture'], // orthodoxy
  'ostentatious': ['humble'], // ostentatious
  'otherworldly': ['earthiness'], // otherworldly
  'outgoing': ['introverted', 'shy'], // outgoing
  'outlining': ['ambiguity', 'blending', 'blurring', 'chaos', 'confusion', 'disorder', 'improvisation', 'massing', 'mess', 'random', 'shading', 'spontaneity'], // Outlining
  'outspoken': ['discretion'], // outspoken
  'outward': ['ambiguous', 'introspection', 'inward', 'sensitive', 'soft', 'uncertain', 'vague'], // outward
  'over': ['under'], // over
  'overflow': ['constrict', 'contain', 'control', 'filtering', 'focus', 'limit', 'order', 'restrict', 'scarcity', 'steady'], // overflow
  'overlapping': ['distinction', 'grainy'], // Overlapping
  'overline': ['minimize'], // overline
  'overload': ['heavy'], // Overload
  'overlook': ['buried', 'covert', 'diminished', 'hidden', 'ignore', 'masked', 'regard', 'subtle', 'under', 'underline', 'valuing'], // overlook
  'overpower': ['diminish', 'fade', 'gentle-influence', 'lessen', 'mute', 'reduce', 'soften', 'subdue', 'weaken'], // overpower
  'oversized': ['petite'], // oversized
  'overt': ['covert', 'discreet', 'hidden', 'muted', 'obscure', 'quiet', 'reserved', 'subtextual', 'subtle'], // overt
  'overwhelm': ['selfcare'], // overwhelm
  'overwhelming': ['simplifying'], // overwhelming
  'overwrought': ['calm', 'minimal', 'plain', 'quiet', 'simple', 'simplistic', 'soft', 'subtle', 'understated'], // overwrought
  'ownership': ['abandon'], // ownership
  'page': ['composition', 'contrast'], // Page
  'pain': ['bliss', 'comfort', 'delight', 'dentistry', 'ease', 'happiness', 'hope', 'joy', 'light', 'pleasure', 'satisfied', 'selfcare', 'well-being', 'wellbeing'], // pain
  'painting': ['detail', 'digital', 'erasure'], // Painting
  'pale': ['blazing', 'burnt', 'garish', 'loud', 'ochre'], // pale
  'palette': ['earthen', 'emerald'], // Palette
  'panic': ['calm', 'comfort', 'composure', 'contentment', 'ease', 'peace', 'relaxation', 'serenity', 'tranquility'], // panic
  'panorama': ['glimpse'], // panorama
  'paradox': ['certainty', 'clarity', 'coherence', 'consistency', 'logic', 'order', 'simplicity', 'truth', 'uniformity'], // Paradox
  'parametric': ['chaotic', 'fixed', 'random', 'rigid', 'simple'], // Parametric
  'part': ['whole'], // part
  'partial': ['absolute', 'cast', 'complete', 'entire', 'full', 'full-realization', 'solid', 'total', 'unified', 'whole'], // partial
  'partiality': ['objectivity'], // partiality
  'participation': ['apathy', 'detachment', 'disengagement', 'disinterest', 'indifference', 'isolation', 'neglect', 'passivity', 'rejection'], // participation
  'participatory': ['detached'], // participatory
  'passenger': ['freight'], // passenger
  'passion': ['apathy', 'boredom', 'coldness', 'detachment', 'disinterest', 'impression', 'indifference', 'monotony', 'passivity', 'stagnation'], // passion
  'passionate': ['apathetic', 'disinterested', 'disjoint', 'dispassionate', 'downcast', 'resigned', 'stoic'], // passionate
  'passive': ['activating', 'active', 'activity', 'aggressive', 'assertive', 'catalyst', 'defiant', 'dynamic', 'energetic', 'engaged', 'forceful', 'gym', 'involvement', 'present', 'propulsive', 'reactive', 'rebel', 'statement', 'vibrant'], // passive
  'passive-design': ['active'], // passive-design
  'passivity': ['action', 'activity', 'agency', 'assertion', 'assertiveness', 'drive', 'engagement', 'gesture', 'initiative', 'participation', 'passion', 'stimulation'], // passivity
  'past': ['advance', 'develop', 'emerge', 'future', 'live', 'now', 'present', 'progress', 'retrofuturism'], // past
  'pastel': ['cool', 'coolness', 'neon', 'vibrant'], // Pastel
  'path': ['deadend', 'obstacle'], // path
  'pathway': ['deadend', 'obstacle'], // Pathway
  'patina': ['bright', 'clean', 'fresh', 'new', 'plain', 'shiny', 'smooth', 'solid'], // Patina
  'pause': ['day', 'premium', 'repeat', 'rush'], // Pause
  'paused': ['active', 'busy', 'dynamic', 'intense', 'loud', 'moving', 'scrolling', 'urgent', 'vibrant'], // paused
  'payments': ['barter', 'chaos', 'debt', 'disorder', 'donation', 'failure', 'free', 'loss', 'non-monetary', 'poverty', 'receipts', 'void'], // Payments
  'peace': ['agitation', 'agony', 'chaotic', 'conflict', 'confront', 'din', 'energetic', 'fear', 'heavy', 'panic', 'playful', 'scream', 'shouting', 'storm', 'stress', 'strife', 'struggle', 'torment', 'turbulence', 'turmoil', 'war'], // Peace
  'peaceful': ['aggressive', 'agitated', 'anxious', 'blaring', 'blasts', 'boisterous', 'chaotic', 'dystopic', 'energetic', 'erupt', 'explosive', 'feral', 'frantic', 'frenzied', 'harsh', 'heated', 'heavy', 'joy', 'raucous', 'screaming', 'strenuous', 'uneasy', 'unruly', 'unsettled'], // Peaceful
  'peak': ['absence', 'base', 'bottom', 'decline', 'dip', 'drop', 'loss', 'lower', 'pit', 'void'], // Peak
  'peculiar': ['normalcy'], // peculiar
  'pedestrian': ['automotive', 'bold', 'distinct', 'dynamic', 'exceptional', 'extraordinary', 'innovative', 'motorsport', 'unique', 'vibrant'], // pedestrian
  'penetration': ['shield'], // Penetration
  'perceived-weakness': ['might', 'valor'], // perceived-weakness
  'perception': ['blindness'], // Perception
  'perceptive': ['numb', 'oblivious'], // Perceptive
  'perfect': ['basic', 'chaotic', 'distressed', 'dull', 'flawed', 'glitch', 'imperfect', 'messy', 'rough', 'scratched', 'subpar'], // perfect
  'perfection': ['flaw'], // perfection
  'performative': ['introverted'], // Performative
  'peripheral': ['central', 'certain', 'dominant', 'exclusive', 'focused', 'main', 'primary', 'singular'], // peripheral
  'periphery': ['nucleus'], // periphery
  'perishable': ['eternal'], // perishable
  'permanence': ['closing'], // permanence
  'permanent': ['changeable', 'disposable', 'ephemeral', 'evanescent', 'fleeting', 'folding', 'mutable', 'tangential', 'temporary', 'transient', 'unstable'], // permanent
  'perpetual': ['brief', 'ephemeral', 'finite', 'fleeting', 'momentary', 'temporary', 'transient', 'transitory-experience', 'volatile'], // perpetual
  'perpetuity': ['ephemerality', 'finite', 'fleeting', 'momentary', 'mortality', 'temporary', 'transience', 'unstable', 'vanishing'], // perpetuity
  'persist': ['resign'], // persist
  'persistence': ['suddenness'], // Persistence
  'personable': ['faceless'], // personable
  'personal': ['external', 'impersonal', 'interstitial', 'massproduced'], // personal
  'personalization': ['premium'], // Personalization
  'personalized': ['basic', 'bland', 'common', 'generic', 'impersonal', 'mundane', 'standard', 'uniform'], // Personalized
  'perspective': ['editorial', 'harmony'], // Perspective
  'pessimism': ['hope', 'hopeful', 'joy', 'light', 'optimism'], // pessimism
  'pessimistic': ['bright', 'cheerful', 'hopeful', 'joyful', 'light', 'optimistic', 'positive', 'upbeat'], // pessimistic
  'petite': ['bulky', 'grand', 'heavy', 'large', 'massive', 'monumental', 'oversized'], // petite
  'petiteness': ['amplitude', 'bigness', 'bulk', 'expansiveness', 'grandeur', 'immensity', 'mass', 'vastness'], // petiteness
  'petty': ['cosmic', 'elevated', 'grand', 'important', 'meaningful', 'noble', 'significant', 'valuable', 'vast'], // petty
  'philanthropy': ['exploitation', 'premium', 'selfish'], // Philanthropy
  'phony': ['genuine'], // phony
  'phosphor': ['bland', 'dark', 'dead', 'dim', 'dull', 'flat', 'matt', 'opaque', 'unlit'], // Phosphor
  'photographic': ['brushstroke'], // photographic
  'photography': ['cinematography', 'compositing'], // Photography
  'photoreal': ['illustration', 'impression', 'led'], // Photoreal
  'photorealistic': ['illustration', 'led'], // Photorealistic
  'physical': ['behavioral', 'metaverse', 'xr'], // physical
  'physicality': ['intangible'], // physicality
  'piece': ['whole'], // piece
  'pillow': ['cold', 'hard', 'rough', 'stiff', 'uncomfortable'], // Pillow
  'pit': ['apex', 'peak', 'vertex'], // pit
  'pixelation': ['clarity', 'clear', 'defined', 'detail', 'detailed', 'fluid', 'polished', 'realism', 'realistic', 'sharp', 'smooth', 'smoothness'], // Pixelation
  'plain': ['adorned', 'apex', 'bold', 'bump', 'bumpy', 'caps', 'complex', 'cosmetics', 'crowned', 'curtained', 'dazzling', 'decorated', 'dynamic', 'elaborate', 'excess', 'excessive', 'exotic', 'figurative', 'flamboyant', 'flashy', 'garnish', 'gaudy', 'graded', 'ignited', 'indulgent', 'labyrinthine', 'lavish', 'lively', 'multi', 'murals', 'ornate', 'overwrought', 'patina', 'plump', 'rich', 'scaly', 'statement', 'strange', 'sweet', 'symbolic', 'textured', 'twisted', 'unique', 'variant', 'veiled', 'vibrant', 'wave', 'wavy', 'wrought', 'yielding'], // plain
  'plainness': ['complication'], // plainness
  'plane': ['cylinder'], // plane
  'planned': ['chaotic', 'disordered', 'fumbled', 'haphazard', 'improvised', 'impulsive', 'postlude', 'random', 'spontaneity', 'spontaneous', 'unplanned', 'unpredictable'], // planned
  'plasma': ['calm', 'dense', 'fixed', 'quiet', 'solid', 'stable', 'static', 'still'], // Plasma
  'play': ['dramatic', 'duotone', 'serious'], // Play
  'playful': ['awe', 'corporate', 'cumbersome', 'gothic', 'hope', 'melancholy', 'nostalgia', 'peace', 'professional', 'serenity', 'serious', 'shy', 'stern', 'stiff', 'wonder'], // Playful
  'playfulness': ['drudgery', 'gravitas'], // playfulness
  'pleasant': ['arduous', 'bland', 'challenging', 'chaotic', 'dull', 'gloomy', 'harsh', 'jarring', 'repelling-hues', 'ugly', 'unpleasant'], // Pleasant
  'pleased': ['annoyed', 'bored', 'discontent', 'displeased', 'dissatisfied', 'frustrated', 'sad', 'unhappy'], // pleased
  'pleasure': ['anguish', 'aversion', 'burden', 'displeasure', 'dissatisfaction', 'frustration', 'misery', 'pain', 'sorrow'], // Pleasure
  'plentiful': ['meager', 'rare'], // plentiful
  'plenty': ['depletion', 'hunger', 'lack', 'scarcity', 'starve'], // plenty
  'plummet': ['ascend', 'climb', 'elevate', 'elevation', 'float', 'gain', 'increase', 'rise', 'soar', 'surge'], // plummet
  'plump': ['bare', 'dry', 'flat', 'lean', 'plain', 'skeletal', 'slim', 'smooth', 'thin'], // plump
  'plunge': ['ascend', 'elevate', 'expand', 'float', 'hover', 'lift', 'lighten', 'rise'], // plunge
  'plural': ['singular'], // plural
  'podiatry': ['orthodontics'], // podiatry
  'point': ['absence', 'chaos', 'circle', 'disperse', 'gap', 'mass', 'spread', 'void'], // point
  'pointed': ['blunt', 'circular', 'flat', 'round', 'rounded', 'smooth', 'soft', 'wide'], // pointed
  'pointless': ['effective', 'essential', 'functional', 'impactful', 'meaningful', 'purposeful', 'significant', 'utility-driven', 'valuable'], // pointless
  'poise': ['awkwardness'], // poise
  'poised': ['heavy', 'shaky'], // Poised
  'polish': ['editorial', 'harmony'], // Polish
  'polished': ['amateur', 'awkward', 'brushstroke', 'clumsy', 'craggy', 'crude', 'dirt', 'disheveled', 'distress', 'distressed', 'flawed', 'frumpy', 'grime', 'grotesque', 'grungy', 'janky', 'matt', 'pixelation', 'ragged', 'roughness', 'rudimentary', 'rusty', 'scrappy', 'scratched', 'shabby', 'shaky', 'sloppy', 'splotchy', 'tacky', 'tarnished', 'vulgar'], // polished
  'polite': ['rude'], // polite
  'pollute': ['eco-tech'], // pollute
  'polluted': ['clean', 'clear', 'fresh', 'natural', 'organic', 'pristine', 'pure', 'purity', 'untouched'], // polluted
  'polluting': ['eco-tech'], // polluting
  'pollution': ['clarity', 'ecology', 'freshness', 'harmony', 'nature', 'purity', 'serenity', 'vitality', 'wholeness'], // pollution
  'poly': ['mono', 'single'], // poly
  'ponderous': ['breezy', 'swift'], // Ponderous
  'poor': ['fertile', 'healthy'], // poor
  'pop': ['earthen', 'emerald'], // Pop
  'popularity': ['scholarship'], // popularity
  'populated': ['vacancy'], // populated
  'porous': ['compact', 'dense', 'filled', 'impermeable', 'opaque', 'rigid', 'solid', 'stiff', 'thick', 'tight'], // Porous
  'portfolio': ['composition', 'contrast', 'flaw', 'mess'], // Portfolio
  'portrait': ['editorial', 'harmony'], // Portrait
  'positive': ['bleak', 'dark', 'discourage', 'doubtful', 'dystopic', 'gloomy', 'negative', 'pessimistic', 'sad'], // positive
  'possibility': ['limitation'], // Possibility
  'post-process': ['immediate', 'natural', 'raw', 'simple', 'unrefined'], // Post-process
  'postdigital': ['analog', 'manual', 'simple', 'static', 'traditional'], // Postdigital
  'posthuman': ['premium'], // Posthuman
  'postlude': ['calm', 'clarity', 'consistent', 'controlled', 'exact', 'planned', 'prelude', 'stable'], // Postlude
  'postmodernism': ['coherent'], // Postmodernism
  'potency': ['heavy', 'impotence', 'vacancy', 'weakness'], // Potency
  'poverty': ['bounty', 'payments', 'profit', 'richness', 'wealth', 'winery'], // poverty
  'power': ['impotence', 'weakness'], // Power
  'powerful': ['cool', 'gentle', 'weak'], // Powerful
  'powerless': ['empowering', 'strength'], // powerless
  'practical': ['abstract', 'ambiguous', 'chaotic', 'disordered', 'fashion', 'imaginary', 'impractical', 'ineffective', 'interstitial', 'irrational', 'random', 'theoretical', 'vague', 'wasteful'], // practical
  'practical-function': ['useless'], // practical-function
  'practicality': ['aesthetics'], // practicality
  'pragmatic': ['naive', 'retrofuturism'], // pragmatic
  'pragmatic-visuals': ['disorganized', 'illogical'], // pragmatic-visuals
  'pragmatism': ['naivety'], // pragmatism
  'precise': ['blobby', 'blotchy', 'brushstroke', 'careless', 'freestyle', 'fumbled', 'fuzzy', 'haphazard', 'illiterate', 'imprecise', 'improvised', 'messy', 'nebulous', 'regress', 'scrawl', 'sloppy', 'smeared', 'splat', 'unfocused', 'vague'], // precise
  'precision': ['blurb', 'fuzz', 'impression', 'mismatch', 'muddle', 'scribble', 'sloppiness'], // precision
  'predefined': ['chaotic', 'flexible', 'fluid', 'generative', 'improvised', 'open', 'random', 'spontaneous', 'variable'], // predefined
  'predetermined': ['chaotic', 'fluid', 'free', 'instinct', 'open', 'random', 'spontaneous', 'unpredictable', 'variable'], // predetermined
  'predictability': ['anomaly', 'fluke', 'idiosyncrasy', 'risk', 'whirlwind'], // predictability
  'predictable': ['adventurous', 'chaotic', 'dragged', 'eclectic', 'erratic', 'exotic', 'fickle', 'offbeat', 'random', 'reactive', 'spontaneous', 'squiggly', 'subjective', 'surprise', 'surprising', 'uncommon', 'unhinged', 'unplanned', 'unpredictable', 'unreliable', 'unusual', 'variable', 'volatile', 'wild'], // predictable
  'prelude': ['endgame', 'finale', 'postlude'], // Prelude
  'premeditated': ['careless', 'chaotic', 'haphazard', 'impromptu-display', 'impulsive', 'random', 'spontaneous', 'unplanned'], // premeditated
  'premiere': ['finale'], // premiere
  'premium': ['accessible', 'adaptation', 'anonymity', 'anonymous', 'authorship', 'automation', 'avatar', 'awareness', 'bespoke', 'biophilia', 'care', 'cheap', 'chronicle', 'cognition', 'communal', 'communication', 'community', 'computing', 'connectivity', 'conscientious', 'convenience', 'critique', 'culture', 'curatorial', 'data', 'digitization', 'domestic', 'ecology', 'escapism', 'european', 'gathering', 'heritage', 'hidden', 'icon', 'immersion', 'inclusion', 'independence', 'individualism', 'influence', 'infrastructure', 'isolation', 'knowledge', 'language', 'literacy', 'local', 'lore', 'low', 'naturalism', 'neurodiversity', 'novelty', 'pause', 'personalization', 'philanthropy', 'posthuman', 'privacy', 'readiness', 'refinement', 'representation', 'scrappy', 'status', 'subversion', 'surveillance', 'survival', 'sustain', 'sustainability', 'synergy', 'technology', 'text', 'utility', 'visibility', 'wanderlust', 'welfare'], // Premium
  'presence': ['abandon', 'abandonment', 'closing', 'diminution', 'disappear', 'disembodiment', 'disempowerment', 'erasure', 'fleeing', 'nonexist', 'obliteration', 'oblivion', 'vacuum'], // Presence
  'present': ['absence', 'absent', 'disappear', 'distant', 'erased', 'expire', 'forget', 'forgotten', 'hidden', 'loss', 'lost', 'neglect', 'nostalgia', 'nowhere', 'oblivious', 'passive', 'past', 'shadow', 'unknown', 'vacant', 'void'], // present
  'presented': ['disregarded'], // presented
  'presentism': ['historical'], // presentism
  'preserve': ['discard', 'erode'], // Preserve
  'pressure': ['absence', 'breeze', 'clarity', 'emptiness', 'flow', 'freedom', 'lightness', 'release', 'relief', 'smooth'], // pressure
  'prestige': ['inferior'], // Prestige
  'pretend': ['real'], // pretend
  'pretense': ['sincerity'], // pretense
  'pretentious': ['authentic', 'casual', 'casual-chic', 'genuine', 'humble', 'modest', 'natural', 'simple', 'unassuming'], // pretentious
  'pride': ['shame'], // pride
  'primary': ['earthen', 'emerald', 'peripheral', 'tangential'], // Primary
  'prime': ['basic', 'chaotic', 'common', 'flawed', 'footer', 'imprecise', 'inferior', 'messy', 'random'], // Prime
  'primitive': ['academia', 'advanced', 'cgi', 'complex', 'innovative', 'modern', 'refined', 'sophisticated', 'techno-futurism', 'technographic', 'techwear'], // primitive
  'principle': ['fluke', 'fumble'], // Principle
  'prison': ['freeness'], // prison
  'pristine': ['distress', 'distressed', 'flawed', 'polluted', 'scrappy', 'shabby', 'tainted', 'tarnished'], // Pristine
  'privacy': ['premium', 'publicity'], // Privacy
  'private': ['accessible', 'common', 'exhibition', 'exposed', 'external', 'open', 'public', 'publishing', 'shared', 'transparent', 'visible'], // private
  'privilege': ['need'], // Privilege
  'pro': ['anti'], // pro
  'problems': ['solutions'], // problems
  'procedural': ['arbitrary', 'chaotic', 'disordered', 'haphazard', 'improvised', 'random', 'spontaneous', 'unstructured'], // Procedural
  'process': ['illustration', 'led'], // Process
  'processed': ['healthy'], // processed
  'produce': ['consume', 'deficit', 'destruction', 'drought', 'failure', 'loss', 'neglect', 'scarcity', 'waste'], // Produce
  'product': ['composition', 'contrast'], // Product
  'product-centric': ['user-centric'], // product-centric
  'production': ['consumption'], // production
  'productive': ['laziness', 'slacker'], // productive
  'productivity': ['idleness', 'slacker'], // Productivity
  'professional': ['amateur', 'edutainment', 'gamification', 'gaming', 'playful', 'wellbeing'], // Professional
  'profit': ['debt', 'deficit', 'drought', 'failure', 'loss', 'non-profit', 'nonprofit', 'poverty', 'scarcity', 'waste'], // profit
  'profit-driven': ['disregarded', 'unvalued'], // profit-driven
  'profound': ['frivolous', 'superficial', 'trivial'], // Profound
  'progress': ['backward', 'deadend', 'halt', 'past', 'regress', 'stuck'], // Progress
  'progression': ['regression'], // progression
  'project': ['muffle'], // project
  'projection': ['illustration', 'led', 'retreat'], // Projection
  'proliferation': ['reduction'], // proliferation
  'prominence': ['insignificance'], // prominence
  'prominent': ['insignificant'], // prominent
  'promote': ['hinder'], // promote
  'promotion': ['disregard', 'neglect', 'recession', 'silence', 'suppression'], // Promotion
  'prompt': ['delay', 'delayed'], // prompt
  'propulsive': ['dull', 'heavy', 'languid', 'mundane', 'ordinary', 'passive', 'simple', 'slow', 'stagnant', 'static'], // Propulsive
  'prosper': ['wilt', 'wither'], // prosper
  'prospering': ['withering'], // prospering
  'prosperity': ['blight', 'deprivation', 'deterioration', 'failure', 'fall', 'inferior', 'misfortune', 'ruin', 'sorrow', 'struggle'], // Prosperity
  'protected': ['tarnished', 'vulnerable'], // protected
  'proximity': ['distance'], // proximity
  'prudence': ['heavy'], // Prudence
  'prudent': ['foolish'], // prudent
  'psyche': ['fleshless', 'husk', 'shell'], // Psyche
  'public': ['cloistered', 'exclusive', 'hidden', 'isolated', 'private', 'secret', 'solitary'], // public
  'publicity': ['anonymity', 'obscurity', 'privacy', 'secrecy'], // publicity
  'publishing': ['absence', 'chaos', 'concealed', 'disregard', 'ephemeral', 'ignorance', 'neglect', 'private', 'raw', 'silence', 'unwritten', 'void'], // Publishing
  'pulse': ['dormancy'], // Pulse
  'pure': ['aftermath', 'blended', 'burdened', 'corrupt', 'crooked', 'dirt', 'foul', 'grime', 'hybrid', 'imperfect', 'impure', 'muddy', 'numb', 'polluted', 'sealed', 'smoky', 'tainted', 'toxic'], // Pure
  'pure entertainment': ['edutainment'], // pure entertainment
  'purity': ['corrupt', 'corruption', 'emission', 'filth', 'imposition', 'impotence', 'polluted', 'pollution', 'ruin', 'squalor', 'vacuum'], // Purity
  'purpose': ['foolishness', 'futility', 'idleness'], // Purpose
  'purposeful': ['aimless', 'futile', 'pointless', 'useless', 'wasteful', 'worthless'], // purposeful
  'pursue': ['retreat'], // pursue
  'pursuit': ['idleness'], // Pursuit
  'qualitative': ['analytics'], // qualitative
  'quench': ['ignite'], // quench
  'quenched': ['thirst'], // quenched
  'quick': ['lengthy', 'lingering', 'slow'], // quick
  'quickness': ['slowness'], // quickness
  'quiet': ['activating', 'active', 'aggressive', 'agitation', 'amplify', 'arcade', 'blaring', 'blasts', 'blinding', 'boisterous', 'brash', 'bustling', 'buzz', 'clatter', 'din', 'erupt', 'explosive', 'fierce', 'frantic', 'frenzy', 'hover', 'kaleidoscopic', 'liveliness', 'loud', 'motorsport', 'noisy', 'obtrusive', 'overt', 'overwrought', 'plasma', 'racket', 'raucous', 'restless', 'screaming', 'shouted', 'shouting', 'shouts', 'splash', 'strident', 'tense', 'thunders', 'unleash', 'uproarious', 'vibration', 'volatile', 'zesty'], // quiet
  'quietude': ['din', 'racket'], // quietude
  'racket': ['authentic', 'calm', 'genuine', 'natural', 'order', 'quiet', 'quietude', 'silence', 'simple'], // racket
  'radial-break': ['consolidate'], // radial-break
  'radiance': ['blackout', 'darkness', 'dimness', 'eclipse', 'nocturn'], // Radiance
  'radiant': ['cold', 'dimming', 'dismal', 'drab', 'drain', 'dreary', 'grim', 'stifled', 'withering'], // radiant
  'radiate': ['wither'], // radiate
  'ragged': ['clean-cut', 'elegant', 'full', 'neat', 'orderly', 'polished', 'refined', 'rich', 'smooth'], // ragged
  'rainbow': ['cool', 'coolness'], // Rainbow
  'raise': ['decline', 'decrease', 'diminish', 'drop', 'fall', 'flatness', 'lower', 'reduce', 'sink'], // raise
  'raised': ['depressed', 'dropped', 'flat', 'flat-plane', 'level', 'lowered', 'recessed', 'stagnant', 'sunken'], // raised
  'rambling': ['brevity', 'clear', 'concise', 'focused', 'ordered'], // rambling
  'random': ['achievable', 'align', 'automated', 'axis', 'beat', 'behavioral', 'calculation', 'charted', 'coherent', 'composition', 'concentrated', 'consequence', 'constant', 'context', 'cultivate', 'decisive', 'definite', 'deliberate', 'depictive', 'doctrinal', 'exact', 'fixity', 'formed', 'grading', 'labeled', 'level', 'logical', 'method', 'methodical', 'modelling', 'neat', 'ordered', 'outlining', 'parametric', 'planned', 'practical', 'predefined', 'predetermined', 'predictable', 'premeditated', 'prime', 'procedural', 'rational', 'regression', 'regulated', 'repetitive', 'robotics', 'rows', 'scheduled', 'scholarly', 'sequential', 'serious', 'solidify', 'specific', 'square', 'steadfast', 'storyful', 'structured', 'symbolism', 'symphonic', 'synchronized', 'systematic', 'typecraft'], // random
  'randomness': ['analytics', 'classicism', 'climate', 'concentricity', 'consulting', 'cubism', 'engineering', 'horology', 'watchmaking'], // randomness
  'rapid': ['gradual', 'slow'], // rapid
  'rare': ['abundant', 'commodity', 'common', 'everyday', 'frequent', 'ordinary', 'plentiful', 'standard', 'typical', 'ubiquitous', 'usual'], // rare
  'rational': ['arbitrary', 'chaotic', 'disorderly', 'emotional', 'emotional-design', 'foolish', 'haphazard', 'impulsive', 'irrational', 'random', 'unpredictable'], // Rational
  'raucous': ['calm', 'gentle', 'orderly', 'peaceful', 'quiet', 'serene', 'soft', 'subdued', 'vulnerable-silence'], // raucous
  'raw': ['bakery', 'cgi', 'cosmetics', 'cultivated', 'figurative', 'filtered', 'post-process', 'publishing', 'shielded', 'staged', 'tame', 'watches', 'wrought'], // raw
  'reachable': ['ambiguous', 'impossible', 'inaccessible', 'indeterminate', 'remote', 'unattainable', 'unclear', 'unreachable', 'vague'], // reachable
  'reactive': ['consistent', 'fixed', 'monotonous', 'passive', 'predictable', 'stable', 'static', 'stoic', 'uniform', 'unresponsive'], // reactive
  'readiness': ['hesitation', 'premium'], // Readiness
  'real': ['artificial', 'avatar', 'deceptive', 'disembodiment', 'fabricated', 'fake', 'false', 'fictional', 'illusory', 'imaginary', 'insincere', 'pretend', 'simulacrum', 'simulated', 'superficial'], // real
  'realism': ['metaverse', 'naivety', 'pixelation'], // realism
  'realistic': ['2d', 'impractical', 'irrational', 'pixelation'], // realistic
  'reality': ['denial', 'disillusion', 'dream', 'fable', 'facade', 'falsehood', 'fantasy', 'illusion', 'impression', 'myth', 'nonexist', 'virtual'], // Reality
  'reason': ['myth'], // reason
  'reassurance': ['heavy', 'negation', 'warning'], // Reassurance
  'reassuring': ['anxious', 'chaotic', 'doubtful', 'fearful', 'hostile', 'tense', 'uncertain', 'unstable'], // Reassuring
  'rebel': ['ch-teau-style', 'conformist', 'docile', 'obedient', 'orderly', 'passive', 'submissive', 'traditional', 'uniform'], // rebel
  'rebellion': ['obedience', 'submission'], // Rebellion
  'rebellious': ['compliant', 'heavy', 'obedient'], // Rebellious
  'rebirth': ['death', 'obliteration'], // Rebirth
  'receipts': ['payments'], // receipts
  'reception': ['expulsion'], // reception
  'receptive': ['dismissive'], // receptive
  'recessed': ['raised'], // recessed
  'recession': ['promotion'], // recession
  'reckless': ['calm', 'careful', 'caution', 'cautious', 'discretion', 'orderly'], // reckless
  'recognition': ['anonymity', 'dismissal', 'disregard', 'failure', 'indifference', 'neglect', 'obscurity'], // recognition
  'recognize': ['forget', 'ignore'], // recognize
  'recognized': ['ignored', 'unvalued'], // recognized
  'recruitment': ['absence', 'attrition', 'automation', 'disinterest', 'dismissal', 'failure', 'layoffs', 'loss', 'neglect', 'rejection', 'retention', 'withdrawal'], // Recruitment
  'rectangle': ['twist'], // Rectangle
  'rectangular': ['curvy'], // Rectangular
  'redefinition': ['obsolescence'], // Redefinition
  'reduce': ['amplify', 'expand', 'intensify', 'magnify', 'overpower', 'raise'], // reduce
  'reduction': ['abundance', 'amplification', 'expansion', 'growth', 'increase', 'intensification', 'proliferation', 'surplus'], // Reduction
  'refine': ['regress'], // refine
  'refined': ['amateur', 'artless', 'brutal', 'cheap', 'clumsy', 'clunky', 'crude', 'dirt', 'disheveled', 'distressed', 'feral', 'frumpy', 'fussy', 'gaudy', 'grime', 'grotesque', 'grungy', 'imperfect', 'janky', 'primitive', 'ragged', 'rude', 'rudimentary', 'scrappy', 'scratched', 'shabby', 'sloppy', 'streetwear', 'tacky', 'vulgar'], // refined
  'refinement': ['awkwardness', 'premium'], // Refinement
  'reflective': ['blunt', 'heavy', 'matt'], // Reflective
  'reflectivity': ['absorption', 'darkness', 'dullness', 'matte', 'opacity'], // Reflectivity
  'refraction': ['unbroken'], // Refraction
  'refreshed': ['tired'], // refreshed
  'refreshing': ['draining', 'heavy', 'tiring'], // Refreshing
  'refuse': ['accept', 'adopt', 'yield'], // refuse
  'refute': ['affirm'], // refute
  'regard': ['disdain', 'dismiss', 'disregard', 'ignore', 'neglect', 'overlook', 'reject', 'scorn', 'snub'], // regard
  'regress': ['advance', 'ascend', 'attract', 'elevate', 'evolve', 'expand', 'precise', 'progress', 'refine'], // regress
  'regression': ['chaotic', 'dispersed', 'dynamic', 'evolution', 'fluid', 'fragmented', 'improvement', 'progression', 'random', 'unpredictable'], // regression
  'regular': ['uneven'], // regular
  'regularity': ['anomaly'], // regularity
  'regulated': ['anarchic', 'chaotic', 'disorderly', 'free', 'naturalism', 'random', 'spontaneous', 'unbounded', 'unruly', 'wild'], // regulated
  'reject': ['accept', 'admire', 'adopt', 'affirm', 'cherish', 'embrace', 'regard', 'support', 'valuing'], // reject
  'rejected': ['embraced'], // rejected
  'rejecting': ['accepting', 'affirm', 'appreciate', 'approval', 'embrace', 'embracing', 'favor', 'support', 'welcome'], // rejecting
  'rejection': ['affection', 'approval', 'attraction', 'demand', 'favor', 'participation', 'recruitment'], // rejection
  'relatable': ['unfamiliar'], // Relatable
  'relax': ['heavy'], // Relax
  'relaxation': ['agitation', 'anxiety', 'chaos', 'discomfort', 'friction', 'gym', 'panic', 'strain', 'stress', 'tension', 'turmoil'], // Relaxation
  'relaxed': ['agitated', 'anxious', 'formality', 'grind', 'harried', 'restless', 'rushed', 'strenuous', 'tense', 'tightened', 'uneasy'], // relaxed
  'release': ['bind', 'bondage', 'burden', 'captivity', 'constraint', 'constrict', 'deprivation', 'envelopment', 'fixation', 'grasp', 'hold', 'lock', 'pressure', 'strain', 'strife', 'stuck', 'suppression'], // release
  'released': ['bound', 'suppressed'], // released
  'releasing': ['compressing'], // releasing
  'relevance': ['insignificance', 'irrelevant', 'obsolescence', 'obsolete'], // Relevance
  'relevant': ['irrelevant', 'obsolete'], // relevant
  'reliability': ['fickle', 'fluke', 'heavy', 'unstable', 'volatile'], // Reliability
  'reliable': ['fickle', 'fraudulent', 'unreliable', 'unstable', 'useless'], // Reliable
  'relief': ['pressure'], // Relief
  'remain': ['abandon', 'cease', 'depart', 'disappear', 'escape', 'exit', 'fade', 'leave', 'vanish'], // remain
  'remarkable': ['insignificant', 'ordinary'], // remarkable
  'remember': ['forget'], // remember
  'remembered': ['forgotten'], // remembered
  'remembering': ['forgetting'], // remembering
  'remembrance': ['forgetting', 'negligence'], // Remembrance
  'remnant': ['whole'], // Remnant
  'remote': ['chaotic', 'disorderly', 'local', 'obtainable', 'reachable', 'uncertain', 'urban'], // remote
  'remoteness': ['closeness'], // remoteness
  'remove': ['engrave'], // remove
  'render': ['disrupt', 'illustration', 'led'], // Render
  'rendering': ['capture', 'cinematography'], // Rendering
  'renew': ['decay', 'deteriorate', 'expire', 'old', 'spent', 'stagnate', 'used', 'waste', 'worn'], // Renew
  'renewal': ['deterioration'], // Renewal
  'renewed': ['tarnished'], // renewed
  'repair': ['damage', 'destroy', 'destruction'], // repair
  'repeat': ['break', 'cease', 'disrupt', 'end', 'halt', 'innovate', 'pause', 'stop', 'vary'], // repeat
  'repel': ['manifesting'], // repel
  'repelled': ['embraced'], // repelled
  'repellent': ['absorbent', 'appealing', 'attractive', 'bright', 'engaging', 'inviting', 'luminous', 'vibrant', 'welcoming'], // repellent
  'repelling': ['appealing', 'attracting', 'captivating', 'charming', 'engaging', 'enticing', 'inviting', 'welcoming'], // repelling
  'repelling-hues': ['attracting', 'pleasant'], // repelling-hues
  'repetition': ['invention'], // Repetition
  'repetitive': ['diverse', 'dynamic', 'exciting', 'innovative', 'novel', 'random', 'singular', 'spontaneous', 'unique', 'varied', 'variety'], // repetitive
  'representation': ['disguise', 'premium'], // Representation
  'repulsion': ['attraction'], // repulsion
  'repulsive': ['alluring', 'attractive', 'captivating'], // repulsive
  'research': ['marketing'], // research
  'reserve': ['self-expression'], // reserve
  'reserved': ['active', 'boisterous', 'bold', 'brash', 'bright', 'chaotic', 'dynamic', 'expressive', 'flamboyant', 'loud', 'overt', 'silly', 'vivid'], // reserved
  'residential': ['commercial', 'hotels', 'industrial', 'logistics', 'office'], // Residential
  'resign': ['accept', 'agree', 'aspire', 'commit', 'embrace', 'join', 'persist', 'support', 'welcome'], // resign
  'resigned': ['active', 'aspirant', 'assertive', 'determined', 'engaged', 'hopeful', 'joyful', 'passionate', 'vibrant'], // resigned
  'resilience': ['breakdown', 'weakness'], // Resilience
  'resilient': ['brittle', 'delicate', 'fragile', 'sensitive', 'soft', 'unstable', 'vulnerable', 'weak'], // Resilient
  'resist': ['adopt', 'yield'], // resist
  'resistance': ['acceptance', 'adaptation', 'agreement', 'catalyst', 'compliance', 'conformity', 'obedience', 'submission', 'support', 'unity'], // resistance
  'resistant': ['compliant'], // resistant
  'resolve': ['ambiguity', 'chaos', 'confusion', 'disorder', 'inconsistency', 'indecision', 'limbo', 'uncertainty', 'vacillation'], // resolve
  'resolved': ['ambiguous', 'chaotic', 'conflicted', 'delay', 'delayed', 'disordered', 'fluid', 'indecisive', 'uncertain', 'unfinished-thought', 'unstable', 'vague'], // resolved
  'resource': ['waste'], // resource
  'resourceful': ['wasteful'], // resourceful
  'respect': ['apathy', 'contempt', 'dismissal', 'disregard', 'disrespect', 'hatred', 'indifference', 'mockery', 'neglect', 'ridicule', 'scorn'], // respect
  'respectful': ['irreverent', 'rude'], // respectful
  'responsive': ['apathetic', 'complacent', 'serif', 'unmoved'], // Responsive
  'rest': ['active', 'agitation', 'busy', 'chaotic', 'day', 'drive', 'energetic', 'grind', 'gym', 'hustle', 'rush', 'stimulation', 'work'], // rest
  'restaurant': ['catering'], // restaurant
  'restless': ['calm', 'content', 'contented', 'focused', 'limited', 'quiet', 'relaxed', 'settled', 'static'], // restless
  'restlessness': ['composure'], // restlessness
  'restore': ['break', 'damage', 'destroy', 'erode', 'harm', 'tear'], // restore
  'restrain': ['unleash'], // restrain
  'restrained': ['camp', 'chaotic', 'exuberant', 'flexible', 'free', 'loose', 'spontaneous', 'uninhibited', 'wild'], // restrained
  'restraint': ['exaggeration', 'excess', 'exuberance', 'levity'], // Restraint
  'restrict': ['emit', 'expand', 'overflow'], // restrict
  'restricted': ['blockchain', 'boundless', 'flexible', 'free', 'limitless', 'open', 'spontaneous', 'unbound', 'unbounded', 'uninterrupted', 'unrestricted', 'untamed'], // restricted
  'restricting': ['empowering'], // restricting
  'restriction': ['chaos', 'expansion', 'expansive-freedom', 'flexibility', 'freedom', 'freeness', 'liberation', 'liberty', 'openness', 'self-expression'], // restriction
  'restrictive': ['endless', 'ergonomic', 'expansive', 'flexible', 'fluid', 'free', 'loose', 'open', 'unbound', 'unrestricted'], // restrictive
  'retail': ['catering', 'hotels', 'manufacturing', 'museum'], // retail
  'retain': ['discard', 'forget'], // retain
  'retention': ['emission', 'recruitment'], // retention
  'retirement': ['gym'], // retirement
  'retouching': ['flawed', 'illustration', 'led', 'untamed'], // Retouching
  'retreat': ['advance', 'assert', 'attack', 'charge', 'confront', 'engage', 'invade', 'projection', 'pursue'], // Retreat
  'retro': ['futuristic', 'heavy', 'modern', 'techno-futurism'], // Retro
  'retrofuture': ['youth'], // Retrofuture
  'retrofuturism': ['actual', 'avant-garde', 'basic', 'classic', 'contemporary', 'mundane', 'ordinary', 'past', 'pragmatic', 'simple', 'static', 'traditional'], // Retrofuturism
  'reveal': ['disguise', 'evade', 'hide', 'muffle', 'shield', 'shroud'], // reveal
  'revealed': ['concealed', 'covered', 'covert', 'curtained', 'guarded', 'masked', 'sealed', 'shrouded', 'veiled'], // revealed
  'revealing': ['concealing', 'hiding', 'obscuring', 'suppressing', 'veiling', 'withholding'], // revealing
  'revelation': ['obscurity', 'veiling'], // Revelation
  'reverence': ['heavy', 'ridicule', 'scorn'], // Reverence
  'reverent': ['irreverent'], // reverent
  'revival': ['deterioration'], // revival
  'rhythmlessness': ['beat'], // rhythmlessness
  'rich': ['barren', 'bland', 'bleak', 'drab', 'drain', 'drained', 'dry', 'dull', 'foul', 'insipid', 'meager', 'null', 'plain', 'ragged', 'shallow', 'starve', 'sterile', 'superficial', 'trivial', 'weak'], // rich
  'richness': ['barren', 'bland', 'bleakness', 'chaos', 'depletion', 'dullness', 'emptiness', 'flattening', 'fleshless', 'hunger', 'husk', 'lack', 'poverty', 'scarcity', 'simple', 'sparsity', 'void'], // Richness
  'ridicule': ['acceptance', 'admiration', 'celebration', 'kindness', 'respect', 'reverence', 'support', 'understanding', 'validation'], // ridicule
  'right': ['corrupt'], // right
  'rigid': ['biomorphic', 'bistro', 'curvy', 'fable', 'freeform', 'freestyle', 'informal', 'loose', 'loosen', 'malleable', 'mobile', 'mobility', 'mutable', 'neumorphic', 'parametric', 'porous', 'serpentine', 'skillful', 'slack', 'supple', 'twist', 'undulating', 'wave', 'wavy', 'wobbly', 'yielding'], // rigid
  'rigidity': ['adaptability', 'flexibility'], // rigidity
  'rise': ['deadend', 'decline', 'decrease', 'descend', 'descent', 'diminish', 'down', 'drop', 'drown', 'end', 'fall', 'flatten', 'low', 'lower', 'plummet', 'plunge', 'sink', 'slump', 'stop'], // Rise
  'risk': ['assurance', 'calm', 'certainty', 'control', 'normalcy', 'predictability', 'safety', 'security', 'stability'], // Risk
  'roars': ['calm', 'mundane', 'ordinary', 'whispers'], // roars
  'robotic': ['chaotic', 'fluid', 'human', 'humanist', 'natural', 'organic', 'soft', 'spontaneous', 'warm'], // robotic
  'robotics': ['biological', 'chaotic', 'craft', 'human', 'manual', 'natural', 'organic', 'random', 'simple', 'slow', 'unstructured'], // Robotics
  'robust': ['brittle', 'doubtful', 'fragile', 'insecure', 'lightweight', 'shaky', 'uncertain', 'unstable', 'vulnerable', 'weak'], // Robust
  'root': ['aerial', 'detached', 'drift', 'ephemeral', 'floating', 'loose', 'shallow', 'surface', 'transient'], // root
  'rooted': ['chaotic', 'fluid', 'free', 'loose', 'shifting', 'transient', 'transit', 'unbound', 'ungrounded', 'vague', 'wild'], // rooted
  'rooting': ['detached', 'detaching', 'dispersing', 'drifting', 'ephemeral', 'floating', 'scattering'], // Rooting
  'roots': ['abstract', 'detachment', 'dispersal', 'future', 'novelty'], // Roots
  'rough': ['aerodynamic', 'cgi', 'cosmetics', 'figurative', 'flawless', 'modelling', 'neat', 'perfect', 'pillow', 'seamless', 'shiny', 'skincare', 'spotless', 'sterile', 'supple', 'sweet'], // rough
  'roughness': ['calm', 'clear', 'fine', 'gentle', 'polished', 'serene', 'simple', 'slick', 'smooth', 'smoothness', 'soft'], // Roughness
  'round': ['angular', 'angular-form', 'flat', 'jagged', 'linear', 'pointed', 'sharp', 'square', 'uneven'], // round
  'rounded': ['angularity', 'pointed'], // rounded
  'routine': ['adventurous', 'anomaly', 'freetime', 'hobby', 'invention', 'uncommon'], // routine
  'rows': ['asymmetry', 'chaos', 'disorder', 'fluid', 'irregular', 'random', 'scatter', 'scattered', 'vertical'], // Rows
  'rude': ['courteous', 'gentle', 'gentle-expression', 'gracious', 'kind', 'polite', 'refined', 'respectful'], // rude
  'rudimentary': ['complex', 'detailed', 'elaborate', 'intricacy', 'intricate', 'nuanced', 'polished', 'refined', 'sophisticated'], // rudimentary
  'ruin': ['cleanliness', 'creation', 'flourish', 'integrity', 'prosperity', 'purity', 'strength', 'vitality', 'wholeness'], // ruin
  'rupture': ['climate'], // Rupture
  'rural': ['busy', 'chaotic', 'concrete', 'crowded', 'industrial', 'metropolitan', 'modern', 'urban'], // rural
  'rural-serenity': ['hustle'], // rural-serenity
  'rush': ['calm', 'delay', 'leisure', 'pause', 'rest', 'slow', 'slowness', 'still'], // rush
  'rushed': ['calm', 'leisurely-flow', 'relaxed', 'slow', 'steady', 'unhurried'], // rushed
  'rustic': ['technographic', 'techwear'], // rustic
  'rusty': ['bright', 'clean', 'fresh', 'luminous', 'new', 'polished', 'sheen', 'smooth', 'vibrant'], // rusty
  'saas': ['text'], // SaaS
  'sacrifice': ['greed', 'selfcare'], // sacrifice
  'sad': ['jovial', 'pleased', 'positive'], // sad
  'sadness': ['euphoria', 'exuberance', 'might'], // sadness
  'safe': ['adventurous', 'fugitive', 'toxic'], // safe
  'safety': ['anxiety', 'chaos', 'danger', 'exposure', 'fear', 'risk', 'suspense', 'threat', 'uncertainty', 'vulnerability', 'warning'], // safety
  'sameness': ['adaptability', 'chaos', 'clash', 'contrast', 'customization', 'distinct', 'diversity', 'mismatch', 'variety', 'vivid'], // sameness
  'sanctuary': ['exile'], // Sanctuary
  'sane': ['anti', 'chaotic', 'confused', 'crazy', 'eerie', 'irrational', 'unhinged'], // sane
  'sans': ['serif'], // sans
  'satiate': ['starve'], // satiate
  'satiation': ['thirst'], // satiation
  'satisfaction': ['disapproval', 'disillusion', 'displeasure', 'dissatisfaction', 'frustration', 'hunger', 'thirst'], // satisfaction
  'satisfied': ['discontent', 'displeased', 'dissatisfied', 'failure', 'pain', 'unhappy'], // satisfied
  'saturated': ['washed'], // saturated
  'saturating': ['diluting', 'fading'], // saturating
  'saturation': ['complementary', 'cool', 'depletion', 'drain', 'lack', 'wash'], // Saturation
  'savage': ['calm', 'culture', 'gentle', 'kind', 'soft'], // savage
  'savory': ['bakery'], // savory
  'scale': ['diminutive', 'tiny'], // Scale
  'scaly': ['plain', 'simple', 'sleek', 'smooth', 'soft'], // Scaly
  'scarce': ['ubiquitous'], // scarce
  'scarcity': ['abundance', 'bounty', 'catering', 'excess', 'food', 'fullness', 'materials', 'overflow', 'plenty', 'produce', 'profit', 'richness', 'wealth'], // scarcity
  'scatter': ['align', 'bubble', 'consolidate', 'convolution', 'corner', 'imprint', 'integrate', 'nucleus', 'rows', 'synthesize', 'unite'], // Scatter
  'scatterbrained': ['cerebral', 'clear', 'focused', 'methodical', 'organized'], // scatterbrained
  'scattered': ['aggregate', 'axis', 'cloistered', 'coherent', 'concentrated', 'enclosed', 'intact', 'integrated', 'level', 'main', 'rows', 'sequential', 'unified', 'whole'], // scattered
  'scattering': ['concentricity', 'envelopment', 'rooting'], // scattering
  'schedule': ['freetime'], // schedule
  'scheduled': ['chaotic', 'disordered', 'immediate', 'impromptu-gathering', 'irregular', 'random', 'spontaneous', 'unplanned', 'unpredictable'], // scheduled
  'schematic': ['illustration', 'led', 'tangle'], // Schematic
  'scholarly': ['chaotic', 'dull', 'ignorant', 'informal-knowledge', 'messy', 'random', 'simple'], // scholarly
  'scholarship': ['anarchy', 'chaos', 'confusion', 'disorder', 'ignorance', 'naivety', 'popularity', 'simplicity', 'stupidity', 'superficiality'], // Scholarship
  'scorn': ['admiration', 'admire', 'affection', 'appreciate', 'approval', 'cherish', 'compassion', 'kindness', 'regard', 'respect', 'reverence', 'support', 'trust', 'veneration'], // scorn
  'scrap': ['cohesive', 'complete', 'defined', 'orderly', 'solid', 'structured', 'whole', 'wholeness'], // scrap
  'scrappy': ['elegant', 'neat', 'orderly', 'polished', 'premium', 'pristine', 'refined', 'sleek', 'smooth'], // scrappy
  'scratched': ['brushed', 'clear', 'intact', 'neat', 'perfect', 'polished', 'refined', 'smooth', 'unblemished'], // Scratched
  'scrawl': ['clear', 'defined', 'focused', 'methodical', 'neat', 'orderly', 'precise', 'structured', 'typeset'], // scrawl
  'scream': ['calm', 'peace', 'silence', 'whisper'], // scream
  'screaming': ['calm', 'gentle', 'muted', 'peaceful', 'quiet', 'soft', 'subdued', 'subtle-hues', 'whispering'], // screaming
  'screen': ['centered', 'centrality', 'chiaroscuro', 'cleanliness', 'clustering'], // Screen
  'scribble': ['clarity', 'design', 'font', 'formality', 'neatness', 'order', 'precision', 'structure', 'symmetry'], // scribble
  'scroll': ['carousel', 'centralized', 'centric', 'halt', 'hold', 'lock', 'stop'], // Scroll
  'scrolling': ['fibrous', 'fluid', 'glossy', 'grainy', 'halted', 'matte', 'paused', 'stopped'], // Scrolling
  'sculpt': ['destroy', 'disassemble', 'dismantle', 'erase', 'flatten'], // Sculpt
  'sculpted': ['blobby', 'sprawled'], // sculpted
  'sculpting': ['dissolving', 'erasing', 'flattening', 'obliterating'], // sculpting
  'sculpture': ['murals'], // sculpture
  'seal': ['leak'], // seal
  'sealed': ['absorbent', 'certain', 'clear', 'exposed', 'free', 'open', 'open-top', 'pure', 'revealed', 'visible'], // Sealed
  'seamless': ['chaotic', 'disjointed', 'fragmented', 'glitch', 'imprecise', 'inconsistent', 'jarring', 'rough', 'segmented', 'uneven'], // Seamless
  'seasons': ['unchanging'], // Seasons
  'secondary': ['main'], // secondary
  'secrecy': ['marketing', 'publicity', 'unveiling'], // secrecy
  'secret': ['public'], // secret
  'section': ['whole'], // section
  'secure': ['anxious', 'doubtful', 'heavy', 'leak', 'lost', 'shaky', 'spill', 'uneasy', 'ungrounded', 'unreliable', 'unsettled', 'unstable', 'unsteady', 'vulnerable', 'wavering'], // Secure
  'security': ['doubt', 'risk', 'warning'], // security
  'sedentary': ['gym'], // sedentary
  'seed': ['night'], // Seed
  'seen': ['ignored'], // seen
  'segmented': ['cohesive', 'continuous', 'fluid', 'integrated', 'monolithic', 'seamless', 'smooth', 'solid', 'unified', 'whole'], // Segmented
  'segregated': ['aggregate', 'combined', 'connected', 'harmonious', 'inclusive', 'integrated', 'interconnection', 'unified', 'whole'], // segregated
  'segregation': ['fusion', 'togetherness'], // segregation
  'self': ['dependence'], // self
  'self-expression': ['apathy', 'concealment', 'conformity', 'detachment', 'inhibition', 'reserve', 'restriction', 'silence', 'stagnation', 'suppression', 'uniformity'], // Self-expression
  'self-reliance': ['collectivism'], // self-reliance
  'selfcare': ['burden', 'burnout', 'chaos', 'disarray', 'neglect', 'overwhelm', 'pain', 'sacrifice', 'selflessness', 'stress', 'suffering'], // Selfcare
  'selfish': ['attentive', 'caring', 'considerate', 'empathetic', 'generous', 'inclusive', 'non-profit', 'nurturing', 'philanthropy', 'selfless', 'user-centric'], // selfish
  'selfishness': ['humanism'], // selfishness
  'selfless': ['greed', 'selfish'], // selfless
  'selflessness': ['selfcare'], // selflessness
  'sense': ['absurdity', 'ambiguity', 'chaos', 'confusion', 'disorder', 'emptiness', 'foolishness', 'irrationality', 'nonsense', 'vagueness'], // sense
  'sensible': ['faceless', 'foolish', 'impractical', 'irrational'], // sensible
  'sensitive': ['numb', 'outward', 'resilient'], // sensitive
  'sensory': ['dispassionate'], // sensory
  'sensory-grounded': ['theoretical'], // sensory-grounded
  'separate': ['align', 'binding', 'blend', 'cohere', 'collaborative', 'combine', 'connect', 'consolidate', 'convolution', 'integrate', 'integrated', 'interlink', 'interwoven', 'join', 'merge', 'merged', 'shared', 'synthesize', 'unify', 'unite', 'united'], // separate
  'separation': ['attachment', 'closeness', 'concentricity', 'connect', 'embrace', 'envelopment', 'fusion', 'integrity', 'interaction', 'interfacing', 'intimacy', 'superimposition', 'togetherness', 'unison'], // separation
  'sepia': ['cool', 'coolness', 'gleaming'], // Sepia
  'sequential': ['chaotic', 'disordered', 'haphazard', 'irregular', 'random', 'scattered', 'spontaneous', 'unstructured'], // Sequential
  'serendipity': ['misfortune'], // serendipity
  'serene': ['aggressive', 'agitated', 'arcade', 'bustling', 'chaotic', 'discordant', 'energetic', 'frantic', 'frenzied', 'frenzy', 'harried', 'heavy', 'joy', 'murky', 'noisy', 'raucous', 'roughness', 'uproarious'], // Serene
  'serenity': ['agitation', 'agony', 'anguish', 'breakdown', 'brutality', 'cacophony', 'clamor', 'discomfort', 'guilt', 'heavy', 'panic', 'playful', 'pollution', 'squalor', 'stimulation', 'stress', 'torment', 'tumult', 'turmoil', 'war'], // Serenity
  'serif': ['based', 'condensed', 'estate', 'mesh', 'responsive', 'sans', 'squiggly'], // Serif
  'serious': ['carefree', 'chaotic', 'childlike', 'fable', 'faddish', 'flighty', 'flippant', 'frivolous', 'funny', 'informal', 'irreverent', 'light', 'loose', 'play', 'playful', 'random', 'silly', 'wacky'], // serious
  'seriousness': ['levity', 'youthfulness'], // seriousness
  'serpentine': ['clear', 'fixed', 'linear', 'rigid', 'simple', 'stable', 'straight', 'straight-dynamics', 'uniform'], // serpentine
  'service': ['freight', 'manufacturing', 'winery'], // service
  'services': ['engineering', 'merchandise'], // services
  'setback': ['victory'], // setback
  'settle': ['aspire', 'chaos', 'disorder', 'disrupt', 'instability', 'soar', 'uncertainty', 'wander'], // settle
  'settled': ['anticipation', 'chaotic', 'conflicted', 'disordered', 'dissatisfied', 'fugitive', 'hover', 'insecure', 'mobile', 'restless', 'shifting', 'uncertain', 'unsettled', 'unstable', 'wandering'], // settled
  'settling': ['fleeing'], // settling
  'shabby': ['elegant', 'luxe', 'luxurious', 'neat', 'orderly', 'polished', 'pristine', 'refined', 'smooth'], // shabby
  'shade': ['shine'], // shade
  'shading': ['blinding', 'illustration', 'led', 'outlining'], // Shading
  'shadow': ['beacon', 'earthen', 'emerald', 'glare', 'highlight', 'present'], // Shadow
  'shakiness': ['stability'], // shakiness
  'shaky': ['consistent', 'poised', 'polished', 'robust', 'secure', 'simple', 'smooth', 'solid', 'stable', 'steady'], // shaky
  'shallow': ['alert', 'aware', 'deep', 'deeptech', 'engaged', 'fresh', 'immerse', 'intense', 'introspection', 'rich', 'root', 'vivid'], // shallow
  'sham': ['genuine'], // sham
  'shame': ['acceptance', 'approval', 'celebration', 'confidence', 'contentment', 'dignity', 'honor', 'joy', 'pride'], // shame
  'shape': ['muddle'], // Shape
  'shaped': ['unformed'], // shaped
  'share': ['consume', 'isolate'], // share
  'shared': ['divided', 'fragmented', 'isolated', 'lonely', 'private', 'separate', 'solitary'], // shared
  'sharing': ['greed', 'withholding'], // sharing
  'sharp': ['blended', 'blobby', 'blunt', 'bokeh', 'brushstroke', 'cloudy', 'clueless', 'curvy', 'fading', 'frayed', 'fuzzy', 'imprecise', 'loop', 'muffled', 'nebulous', 'neumorphic', 'numb', 'pixelation', 'round', 'smeared', 'supple', 'sweet', 'unfocused', 'veiling', 'wash'], // Sharp
  'sharpness': ['blurb', 'fuzz'], // sharpness
  'shatter': ['wholeness'], // shatter
  'sheen': ['rusty'], // Sheen
  'sheer': ['thick', 'weighty'], // Sheer
  'shell': ['psyche'], // shell
  'shelter': ['uncover'], // Shelter
  'shield': ['exposure', 'fragility', 'naked', 'openness', 'penetration', 'reveal', 'transparency', 'uncover', 'vulnerability', 'weakness'], // Shield
  'shielded': ['bare', 'defenseless', 'exposed', 'naked', 'open', 'raw', 'unprotected', 'vulnerability', 'vulnerable'], // shielded
  'shift': ['constant', 'fixed', 'immobile', 'stable', 'states', 'static', 'steady', 'unchanging', 'uniform'], // Shift
  'shifting': ['anchored', 'fixed', 'fixity', 'rooted', 'settled', 'solid', 'stable', 'static', 'steady', 'unchanging'], // shifting
  'shifty': ['clean', 'clear', 'defined', 'honest', 'orderly', 'organized', 'solid', 'stable', 'trustworthy'], // shifty
  'shine': ['bland', 'dark', 'darkness', 'dim', 'drown', 'dull', 'eclipse', 'flat', 'muted', 'shade'], // shine
  'shining': ['dimming'], // shining
  'shiny': ['bland', 'dark', 'dull', 'flat', 'halted', 'matt', 'matte', 'patina', 'rough'], // shiny
  'short': ['lengthy'], // short
  'shout': ['whisper'], // shout
  'shouted': ['calm', 'gentle', 'hushed', 'muted', 'quiet', 'soft', 'subdued', 'whispered', 'whispered-shades'], // shouted
  'shouting': ['calm', 'peace', 'quiet', 'silence', 'silent', 'still', 'whisper'], // shouting
  'shouts': ['calm', 'hushed', 'quiet', 'silence', 'soft', 'stillness', 'subdued', 'whispers'], // shouts
  'show': ['hide'], // show
  'showing': ['concealing', 'hiding'], // showing
  'showy': ['invisible'], // showy
  'shrink': ['amplify', 'enhance', 'expand', 'grow', 'growth', 'increase', 'inflate', 'magnify', 'stretch'], // shrink
  'shrivel': ['alive', 'bloom', 'expand', 'flourish', 'hydrate', 'lush', 'thrive', 'vibrant', 'vivid'], // shrivel
  'shroud': ['clear', 'display', 'expose', 'freedom', 'limitless', 'open', 'reveal', 'transparency', 'uncover', 'unveiling'], // shroud
  'shrouded': ['bright', 'clear', 'exposed', 'open', 'revealed', 'transparent', 'uncovered', 'visible'], // shrouded
  'shunning': ['acceptance', 'affection', 'connection', 'embrace', 'embracing', 'engagement', 'inclusion', 'unity', 'welcome'], // shunning
  'shy': ['assertive', 'bold', 'brash', 'confident', 'extroverted', 'loud', 'open', 'outgoing', 'playful'], // shy
  'sickly': ['healthy'], // sickly
  'sidebar': ['main'], // Sidebar
  'sight': ['blindness'], // sight
  'sighted': ['blind'], // sighted
  'sightful': ['blind', 'chaos', 'disdain', 'disorder', 'ignorant', 'mess', 'neglect', 'non-visual', 'vulgar'], // sightful
  'signal': ['muffle'], // Signal
  'significance': ['insignificance', 'oblivion'], // Significance
  'significant': ['forgettable', 'futile', 'insignificant', 'irrelevant', 'petty', 'pointless', 'trivial', 'useless', 'worthless'], // significant
  'silence': ['advertising', 'beat', 'buzz', 'cacophony', 'clamor', 'dialogue', 'din', 'event', 'gesture', 'interaction', 'marketing', 'messaging', 'promotion', 'publishing', 'racket', 'scream', 'self-expression', 'shouting', 'shouts', 'statement', 'stimulation'], // Silence
  'silent': ['blaring', 'murals', 'shouting', 'verbal'], // Silent
  'silliness': ['gravitas'], // silliness
  'silly': ['earnest', 'formal', 'grave', 'intelligent', 'reserved', 'serious', 'sober', 'solemn', 'stern'], // silly
  'silver': ['earthen', 'emerald'], // Silver
  'similar': ['disparate', 'diverse'], // similar
  'simple': ['adorned', 'adulting', 'archaic', 'arduous', 'brash', 'burdened', 'burdensome', 'catering', 'cellular', 'cgi', 'challenging', 'circuitous', 'clumsy', 'cluttered', 'complex', 'conflicted', 'confused', 'confusing', 'cosmetics', 'crooked', 'crowned', 'cumbersome', 'deconstructivism', 'decorated', 'deeptech', 'depictive', 'elaborate', 'elite', 'excessive', 'exotic', 'extraneous', 'fabricated', 'fame', 'figurative', 'fintech', 'flamboyant', 'flashy', 'fussy', 'fuzzy', 'garnish', 'gaudy', 'gothic', 'grind', 'grungy', 'hybrid', 'incomplete', 'indulgent', 'jumbled', 'kaleidoscopic', 'labyrinthine', 'lavish', 'lofty', 'macro', 'mosaic', 'motorsport', 'multi', 'noisy', 'oblique', 'overwrought', 'parametric', 'post-process', 'postdigital', 'pretentious', 'propulsive', 'racket', 'retrofuturism', 'richness', 'robotics', 'roughness', 'scaly', 'scholarly', 'serpentine', 'shaky', 'smoky', 'squiggly', 'storyful', 'strange', 'strata', 'strenuous', 'symbolic', 'symphonic', 'tangle', 'techno-futurism', 'technographic', 'theoretical', 'twist', 'twisted', 'unhinged', 'vanguard', 'variable', 'variant', 'veiled', 'veiling', 'viscous', 'wacky', 'wealth', 'wearables', 'wrought', 'xr', 'yachting'], // simple
  'simplicity': ['apex', 'awkwardness', 'blurb', 'clamor', 'complication', 'confusion', 'contradiction', 'corner', 'cubism', 'editorial', 'exaggeration', 'excess', 'filth', 'fussy', 'fuzz', 'harmony', 'hassle', 'idiosyncrasy', 'imposition', 'jumble', 'mess', 'metaverse', 'microcosm', 'muddle', 'paradox', 'scholarship', 'superimposition', 'tumult', 'typecraft', 'verbosity', 'watches', 'watchmaking'], // Simplicity
  'simplification': ['complication', 'convolution', 'editorial', 'harmony'], // Simplification
  'simplify': ['busy', 'chaotic', 'cluttered', 'complex', 'complicate', 'convolution', 'dense', 'engrave', 'intricate', 'layered', 'layering', 'magnify'], // simplify
  'simplifying': ['chaotic', 'cluttered', 'complicating', 'confusing', 'conglomerating', 'disordered', 'intricate', 'messy', 'overwhelming'], // simplifying
  'simplistic': ['graded', 'labyrinthine', 'overwrought'], // simplistic
  'simulacrum': ['authentic', 'genuine', 'original', 'real', 'truth'], // Simulacrum
  'simulated': ['authentic', 'genuine', 'natural', 'real'], // Simulated
  'simulation': ['illustration', 'led'], // Simulation
  'sincere': ['deceptive', 'fake', 'falsehood', 'heavy', 'hollow', 'insincere', 'irreverent'], // Sincere
  'sincerity': ['deceit', 'dishonesty', 'distrust', 'duplicity', 'falsehood', 'fraudulence', 'hypocrisy', 'insincerity', 'mockery', 'pretense'], // sincerity
  'single': ['complex', 'crowded', 'fluid', 'hybrid', 'multi', 'multiple', 'poly', 'strata'], // single
  'singular': ['common', 'generic', 'hybrid', 'mosaic', 'ordinary', 'peripheral', 'plural', 'repetitive', 'standard', 'typical', 'uniform', 'variety'], // singular
  'singular-style': ['mosaic'], // singular-style
  'singular-tone': ['multi'], // singular-tone
  'singularity': ['flotilla'], // Singularity
  'sink': ['raise', 'rise', 'soar', 'uplift'], // sink
  'skeletal': ['plump'], // Skeletal
  'skeptical': ['naive'], // skeptical
  'skepticism': ['belief', 'naivety'], // skepticism
  'sketching': ['final', 'illustration', 'led'], // Sketching
  'skeuomorphic': ['surreal'], // Skeuomorphic
  'skilled': ['amateur'], // skilled
  'skillful': ['awkward', 'clumsy', 'empty', 'incompetence', 'incompetent', 'rigid', 'stiff', 'unskilled', 'weak'], // skillful
  'skincare': ['damage', 'dirt', 'harm', 'neglect', 'rough'], // Skincare
  'sky': ['earth', 'terrain'], // Sky
  'skyward': ['below', 'doubting'], // Skyward
  'slack': ['active', 'driven', 'dynamic', 'focused', 'intense', 'rigid', 'strict', 'urgent'], // slack
  'slacker': ['active', 'ambitious', 'disciplined', 'driven', 'dynamic', 'engaged', 'focused', 'productive', 'productivity'], // slacker
  'sleek': ['archaic', 'clunky', 'frumpy', 'fussy', 'janky', 'scaly', 'scrappy'], // sleek
  'sleekness': ['clunky', 'disheveled', 'editorial', 'harmony'], // Sleekness
  'sleep': ['day', 'morning'], // sleep
  'sleeping': ['awakening'], // sleeping
  'slender': ['bulky', 'heavy', 'thick', 'wide'], // Slender
  'slick': ['absorbent', 'roughness'], // Slick
  'slim': ['plump', 'thick'], // slim
  'sloppiness': ['attention', 'carefulness', 'clarity', 'design', 'efficiency', 'focus', 'neatness', 'order', 'precision'], // sloppiness
  'sloppy': ['clean', 'elegant', 'neat', 'orderly', 'polished', 'precise', 'refined', 'structured'], // sloppy
  'sloth': ['action', 'drive', 'energy', 'focus', 'gym', 'hurry', 'initiative', 'speed', 'vigor'], // sloth
  'slow': ['aerodynamic', 'beat', 'brisk', 'fast', 'hasty', 'immediate', 'instant', 'motorsport', 'propulsive', 'quick', 'rapid', 'robotics', 'rush', 'rushed', 'sudden', 'swift', 'urgent', 'volatile'], // slow
  'slow-paced': ['motorsport'], // slow-paced
  'slowness': ['activity', 'haste', 'motion', 'quickness', 'rush', 'speed', 'urgency', 'velocity'], // slowness
  'sluggish': ['activating', 'active', 'alert', 'athlete', 'bright', 'bustling', 'dynamic', 'energetic', 'energy', 'lively', 'swift', 'vibrant'], // sluggish
  'slumber': ['awakening'], // slumber
  'slump': ['rise'], // slump
  'small': ['colossal', 'epic', 'expansive', 'grand', 'huge', 'immense', 'large', 'massive', 'vast'], // small
  'small-scale art': ['murals'], // small-scale art
  'smeared': ['clean', 'clear', 'defined', 'distinct', 'focused', 'precise', 'sharp', 'structured', 'typography'], // smeared
  'smoky': ['bright', 'clear', 'crisp', 'defined', 'pure', 'simple', 'smooth', 'solid', 'static'], // Smoky
  'smooth': ['absorbent', 'agitated', 'angularity', 'arduous', 'awkward', 'bitter', 'blobby', 'blocky', 'blotchy', 'brushstroke', 'brutal', 'bump', 'bumpy', 'challenging', 'clatter', 'clumsy', 'clunky', 'craggy', 'crooked', 'dirt', 'disjointed', 'distress', 'distressed', 'dragged', 'erupt', 'explosive', 'flicker', 'foamy', 'folded', 'fracture', 'frayed', 'fussy', 'fuzzy', 'grime', 'grotesque', 'grungy', 'halted', 'harried', 'harsh', 'janky', 'jarring', 'matt', 'muddy', 'murky', 'patina', 'pixelation', 'plump', 'pointed', 'pressure', 'ragged', 'roughness', 'rusty', 'scaly', 'scrappy', 'scratched', 'segmented', 'shabby', 'shaky', 'smoky', 'splat', 'splotchy', 'staccato', 'stilted', 'strenuous', 'stuffy', 'tangle', 'tense', 'terrain', 'tightened', 'twisted', 'uneven', 'unruly', 'viscous', 'wave', 'wire'], // smooth
  'smoothness': ['bumpy', 'hassle', 'jumble', 'pixelation', 'roughness', 'uneven'], // Smoothness
  'snub': ['regard'], // snub
  'soar': ['decline', 'descend', 'drop', 'fall', 'land', 'plummet', 'settle', 'sink'], // Soar
  'sober': ['camp', 'chaotic', 'colorful', 'extravagant', 'frenzied', 'frivolous', 'garish', 'lively', 'silly', 'vibrant', 'wild'], // sober
  'social': ['heavy', 'introverted'], // Social
  'soda': ['wine'], // soda
  'soft': ['aggressive', 'angularity', 'armored', 'backward', 'base', 'beat', 'bitter', 'blaring', 'blasts', 'blazing', 'blinding', 'blocky', 'boisterous', 'brash', 'brutal', 'burnt', 'buzz', 'cast', 'challenging', 'concrete', 'craggy', 'fibrous', 'fierce', 'fiery', 'fluid', 'frozen', 'garish', 'glare', 'gothic', 'halted', 'hard', 'harsh', 'heat', 'heated', 'humble', 'loud', 'mechanical', 'obtrusive', 'ochre', 'outward', 'overwrought', 'pointed', 'raucous', 'resilient', 'robotic', 'roughness', 'savage', 'scaly', 'screaming', 'shouted', 'shouts', 'solidity', 'steel', 'sterile', 'stern', 'stiff', 'strident', 'sturdy', 'tense', 'thunders', 'weight', 'weighty', 'wire'], // Soft
  'soften': ['overpower', 'solidify'], // soften
  'softness': ['brutal', 'brutality', 'editorial', 'harmony', 'harsh', 'strength'], // Softness
  'software': ['bakery', 'winery'], // software
  'solemn': ['flippant', 'irreverent', 'jovial', 'silly'], // Solemn
  'solemnity': ['flippant'], // solemnity
  'solid': ['2d', 'aero', 'aether', 'airiness', 'beverage', 'blobby', 'blotchy', 'broken', 'cellular', 'cloudy', 'disembodied', 'disembodiment', 'erode', 'evanescent', 'flawed', 'flexibility', 'flicker', 'flighty', 'flood', 'fluke', 'foamy', 'folding', 'fracture', 'frayed', 'hollow', 'impotence', 'intangible', 'interstitial', 'leak', 'lightweight', 'malleable', 'melt', 'molten', 'neumorphic', 'partial', 'patina', 'plasma', 'porous', 'scrap', 'segmented', 'shaky', 'shifting', 'shifty', 'smoky', 'spill', 'splash', 'splotchy', 'steam', 'strata', 'stratosphere', 'tear', 'thaw', 'translucency', 'undulating', 'unformed', 'unfounded', 'vague', 'viscous', 'wave', 'waver', 'wavering', 'wavy', 'wire', 'wobbly', 'y2k'], // Solid
  'solid-color': ['splotchy'], // solid-color
  'solidarity': ['dissipation', 'disunity'], // solidarity
  'solidify': ['chaos', 'collapse', 'dissolve', 'fluid', 'informal', 'melt', 'random', 'soften', 'vague'], // solidify
  'solidifying': ['diluting', 'dissolving', 'fluid', 'liquefying', 'melting', 'obliterating', 'vanishing'], // solidifying
  'solidity': ['abstract', 'chaotic', 'disordered', 'fluid', 'fragility', 'metaverse', 'soft', 'temporary', 'uncertain', 'vague', 'whirlwind'], // solidity
  'solipsism': ['dependence'], // solipsism
  'solitary': ['collaborative', 'public', 'shared'], // solitary
  'solitude': ['collectivism', 'dependence', 'dialogue', 'embrace', 'flotilla', 'interaction', 'togetherness'], // Solitude
  'solo': ['multi'], // solo
  'solutions': ['challenges', 'chaos', 'complication', 'confusion', 'disorder', 'failure', 'frustration', 'inefficiency', 'obstacle', 'obstacles', 'problems'], // Solutions
  'somewhere': ['nowhere'], // somewhere
  'somnolent': ['stimulating'], // somnolent
  'soothing': ['jarring'], // soothing
  'sophisticated': ['artless', 'cheap', 'childlike', 'composition', 'contrast', 'crude', 'faddish', 'frivolous', 'naive', 'primitive', 'rudimentary', 'tacky', 'vulgar', 'wacky'], // Sophisticated
  'sophistication': ['naivety'], // sophistication
  'sorrow': ['aether', 'bliss', 'celebration', 'comfort', 'delight', 'euphoria', 'happiness', 'hope', 'joy', 'levity', 'pleasure', 'prosperity'], // sorrow
  'sorrowful': ['jovial'], // sorrowful
  'sour': ['bakery', 'sweet'], // sour
  'sovereignty': ['anarchy', 'control', 'dependence', 'subjugation', 'subordination'], // Sovereignty
  'space': ['composition', 'contrast'], // Space
  'spacious': ['composition', 'constrict', 'contrast', 'dense'], // Spacious
  'spare': ['merchandise'], // spare
  'sparse': ['adorned', 'elaborate', 'excessive', 'filled', 'full', 'fullness', 'indulgent', 'lavish'], // sparse
  'sparse-elegance': ['garnish'], // sparse-elegance
  'sparsity': ['abundance', 'chaos', 'complexity', 'crowded', 'density', 'fullness', 'lavish', 'richness', 'textured-abundance'], // Sparsity
  'spatial': ['editorial', 'harmony'], // Spatial
  'special': ['common', 'ubiquitous'], // special
  'specific': ['abstracted', 'aggregate', 'ambiguous', 'broad', 'diffuse', 'general', 'imprecise', 'indistinct', 'interstitial', 'massproduced', 'random', 'ubiquitous', 'unclear', 'ungendered', 'vague'], // specific
  'speed': ['gradual', 'leisurely', 'sloth', 'slowness'], // Speed
  'spent': ['renew'], // spent
  'sphere': ['boxy'], // Sphere
  'spill': ['contain', 'containment', 'fixed', 'hold', 'neat', 'orderly', 'secure', 'solid', 'stable'], // spill
  'spirited': ['weary'], // spirited
  'splash': ['absorb', 'calm', 'clear', 'dry', 'flat', 'quiet', 'solid', 'still', 'typeset'], // splash
  'splat': ['clean', 'controlled', 'focused', 'neat', 'orderly', 'precise', 'smooth', 'subtle', 'typesetting'], // splat
  'split': ['align', 'bond', 'combine', 'connect', 'harmony', 'integrate', 'interlink', 'join', 'merge', 'unify', 'unite', 'wholeness'], // split
  'splotchy': ['clear', 'consistent', 'even', 'neat', 'polished', 'smooth', 'solid', 'solid-color', 'uniform'], // splotchy
  'spoken': ['nonverbal'], // spoken
  'spontaneity': ['captivity', 'cubism', 'editorial', 'engineering', 'grind', 'harmony', 'imposition', 'method', 'outlining', 'planned'], // Spontaneity
  'spontaneous': ['adulting', 'automated', 'behavioral', 'deliberate', 'doctrinal', 'fabricated', 'factory', 'formality', 'mechanic', 'mechanical', 'modelling', 'planned', 'predefined', 'predetermined', 'predictable', 'premeditated', 'procedural', 'regulated', 'repetitive', 'restrained', 'restricted', 'robotic', 'scheduled', 'sequential', 'staged', 'stilted'], // spontaneous
  'sports': ['cool', 'coolness', 'idle', 'unfocused'], // Sports
  'spotless': ['chaotic', 'dirty', 'flawed', 'imperfect', 'messy', 'rough', 'stained', 'tattered', 'worn'], // Spotless
  'sprawl': ['cohesive', 'compact', 'dashboard', 'dense', 'neat', 'orderly', 'organized', 'structured', 'uniform'], // sprawl
  'sprawled': ['cohesive', 'compact', 'focused', 'grounded', 'neat', 'organized', 'sculpted', 'stable', 'structured'], // sprawled
  'spread': ['block', 'centralized', 'compact', 'constricted', 'contained', 'focused', 'point', 'tight'], // spread
  'spreading': ['compressing'], // spreading
  'spring': ['fall'], // spring
  'squalor': ['brightness', 'cleanliness', 'elegance', 'harmony', 'idyll', 'neatness', 'order', 'purity', 'serenity', 'utopia'], // squalor
  'square': ['chaotic', 'curved', 'fluid', 'random', 'round'], // Square
  'squiggly': ['orderly', 'predictable', 'serif', 'simple', 'standard', 'straight', 'uniform'], // squiggly
  'stability': ['breakdown', 'chaos', 'chaotic', 'disorder', 'disruption', 'flexibility', 'fluke', 'flux', 'instability', 'mobility', 'risk', 'shakiness', 'turbulence', 'turmoil', 'uncertainty', 'whirlwind'], // Stability
  'stabilize': ['disrupt'], // stabilize
  'stable': ['anarchic', 'broken', 'cellular', 'deconstructivism', 'evanescent', 'explosive', 'faddish', 'fickle', 'flawed', 'fleeting', 'flicker', 'flighty', 'folding', 'fugitive', 'lost', 'molten', 'murky', 'mutable', 'plasma', 'postlude', 'reactive', 'serpentine', 'shaky', 'shift', 'shifting', 'shifty', 'spill', 'sprawled', 'tangential', 'temporary', 'undulating', 'ungrounded', 'unhinged', 'unsettled', 'unstable', 'unsteady', 'vague', 'variable', 'volatile', 'wave', 'waver', 'wavering', 'wobbly'], // stable
  'staccato': ['calm', 'continuous', 'fluid', 'gentle', 'leisurely-flow', 'smooth', 'steady'], // staccato
  'stack': ['flatten', 'loosen'], // Stack
  'staged': ['candid', 'chaotic', 'dynamic', 'fluid', 'genuine', 'natural', 'organic', 'raw', 'spontaneous'], // staged
  'staging': ['illustration', 'led'], // Staging
  'stagnant': ['aerodynamic', 'alive', 'beat', 'catalyst', 'live', 'molten', 'propulsive', 'raised', 'steam', 'swift', 'vanguard'], // stagnant
  'stagnate': ['motivate', 'renew', 'thrive', 'yield'], // stagnate
  'stagnation': ['adaptability', 'awakening', 'catalyst', 'day', 'development', 'dialogue', 'dream', 'event', 'flotilla', 'improvement', 'invention', 'logistics', 'metaverse', 'microcosm', 'mobility', 'passion', 'self-expression', 'watches'], // stagnation
  'stain': ['wash'], // stain
  'stained': ['spotless'], // stained
  'stale': ['beverage', 'bistro', 'bold', 'breezy', 'bright', 'colorful', 'cool', 'dynamic', 'exciting', 'fable', 'fresh', 'lively', 'novel', 'oceanic', 'vibrant', 'youthfulness'], // stale
  'stamina': ['weakness'], // stamina
  'standard': ['anomaly', 'boutique', 'exotic', 'extraordinary', 'improvised', 'novel', 'offbeat', 'personalized', 'rare', 'singular', 'squiggly', 'subjective', 'uncommon', 'unfamiliar', 'unique', 'uniqueness', 'variant'], // standard
  'standardization': ['customization', 'idiosyncrasy', 'localism'], // standardization
  'standardize': ['disrupt'], // standardize
  'stark': ['bistro', 'earthen', 'emerald', 'sweet'], // Stark
  'start': ['closed', 'end', 'ended', 'endgame', 'expire', 'final', 'finale', 'finish', 'stop'], // start
  'startup': ['cool', 'coolness'], // Startup
  'starvation': ['nourishment'], // starvation
  'starve': ['abundance', 'feed', 'full', 'nourish', 'plenty', 'rich', 'satiate', 'thrive'], // starve
  'stasis': ['mobility'], // stasis
  'stately': ['frenzied', 'heavy'], // Stately
  'statement': ['ambiguity', 'confusion', 'disregard', 'invisibility', 'neutral', 'obscurity', 'passive', 'plain', 'silence', 'subtle', 'uncertainty'], // Statement
  'states': ['composition', 'contrast', 'shift'], // States
  'static': ['activating', 'active', 'adventurous', 'animated', 'arcade', 'beat', 'biomorphic', 'breezy', 'brushstroke', 'catalyst', 'cellular', 'composition', 'explosive', 'fintech', 'fleeting', 'flexibility', 'folding', 'globe', 'graded', 'interactive', 'kaleidoscopic', 'labyrinthine', 'loop', 'mobile', 'mobility', 'motorsport', 'plasma', 'postdigital', 'propulsive', 'reactive', 'restless', 'retrofuturism', 'shift', 'shifting', 'smoky', 'strata', 'techno-futurism', 'thrive', 'thunders', 'twist', 'undulating', 'vanguard', 'variable', 'variant', 'wave', 'wavy', 'wearables', 'xr', 'youthfulness'], // Static
  'stationary': ['hover', 'mobile', 'mobility', 'wandering', 'watches', 'wearables', 'yachting'], // stationary
  'status': ['ignored', 'premium'], // Status
  'statusquo': ['counterculture'], // statusquo
  'staying': ['fleeing'], // staying
  'steadfast': ['chaotic', 'fickle', 'messy', 'random', 'transitory-visuals', 'unstable', 'volatile'], // steadfast
  'steady': ['anxious', 'bumpy', 'clatter', 'dragged', 'fickle', 'flashy', 'flicker', 'flighty', 'frantic', 'harried', 'hasty', 'mutable', 'overflow', 'rushed', 'shaky', 'shift', 'shifting', 'staccato', 'sudden', 'suddenness', 'uncertain', 'uneven', 'unreliable', 'unsettled', 'unstable', 'unsteady', 'volatile', 'wavering'], // steady
  'steam': ['calm', 'dry', 'solid', 'stagnant', 'still'], // Steam
  'steampunk': ['techno-futurism'], // steampunk
  'steel': ['brittle', 'flexible', 'flora', 'fluid', 'natural', 'organic', 'soft', 'warm'], // Steel
  'stellar': ['banal', 'common', 'dull', 'earthbound', 'earthly', 'grounded', 'mundane', 'ordinary', 'terrestrial'], // Stellar
  'sterile': ['bistro', 'chaotic', 'earthiness', 'fertile', 'foliage', 'gritty', 'lively', 'messy', 'murals', 'organic', 'rich', 'rough', 'soft', 'vibrant', 'warm', 'worn'], // Sterile
  'stern': ['cheerful', 'easy', 'flexible', 'gentle', 'light', 'playful', 'silly', 'soft', 'warm'], // stern
  'stiff': ['casual', 'dynamic', 'easy', 'flexibility', 'flexible', 'fluid', 'foamy', 'groovy', 'informal', 'light', 'loose', 'malleable', 'melt', 'pillow', 'playful', 'porous', 'skillful', 'soft', 'supple', 'yielding'], // stiff
  'stiffen': ['thaw'], // stiffen
  'stiffness': ['flexibility'], // stiffness
  'stifle': ['encourage'], // stifle
  'stifled': ['bold', 'dynamic', 'expressive', 'freed', 'limitless', 'lively', 'radiant', 'unsettled', 'vibrant'], // stifled
  'stifling': ['empowering'], // stifling
  'still': ['activating', 'active', 'blaring', 'blasts', 'boisterous', 'bustling', 'buzz', 'erupt', 'flood', 'frenzy', 'hover', 'hustle', 'live', 'liveliness', 'melt', 'mobile', 'molten', 'plasma', 'rush', 'shouting', 'splash', 'steam', 'unleash', 'uproarious', 'vibration', 'wave'], // still
  'stillness': ['agitation', 'clamor', 'day', 'din', 'flotilla', 'gym', 'shouts', 'stimulation', 'turbulence', 'whirlwind'], // Stillness
  'stillness-tone': ['vibration'], // stillness-tone
  'stilted': ['dynamic', 'easy', 'flowing', 'fluid', 'free', 'natural', 'natural-flow', 'smooth', 'spontaneous'], // Stilted
  'stimulate': ['bore'], // stimulate
  'stimulated': ['bored', 'unmoved'], // stimulated
  'stimulating': ['bland', 'boring', 'drab', 'draining', 'dull', 'flat', 'idle', 'insipid', 'lame', 'lethargic', 'lifeless', 'monotonous', 'somnolent', 'tedious', 'tiring', 'uninspiring'], // stimulating
  'stimulation': ['apathy', 'boredom', 'calm', 'dullness', 'inactivity', 'passivity', 'rest', 'serenity', 'silence', 'stillness'], // Stimulation
  'stoic': ['chaotic', 'comic', 'elaborate', 'emotional', 'expressive', 'fervent', 'passionate', 'reactive', 'unstable', 'volatile', 'vulnerable', 'zesty'], // Stoic
  'stop': ['active', 'flow', 'fresh', 'go', 'launch', 'loop', 'move', 'repeat', 'rise', 'scroll', 'start'], // stop
  'stopped': ['active', 'continuous', 'dynamic', 'flowing', 'fluid', 'moving', 'open', 'scrolling', 'unstoppable'], // stopped
  'storm': ['breeze', 'calm', 'clear', 'peace', 'sunny'], // storm
  'storyful': ['abstract-non-narrative', 'bland', 'chaotic', 'dull', 'flat', 'random', 'simple', 'unstructured', 'vague'], // storyful
  'straight': ['circuitous', 'crooked', 'curvy', 'labyrinthine', 'oblique', 'serpentine', 'squiggly', 'tangle', 'twist', 'twisted', 'undulating', 'wavy', 'wobbly'], // straight
  'straight-dynamics': ['serpentine', 'wobbly'], // straight-dynamics
  'straightforward': ['ambiguous', 'complex', 'confusing', 'enigmatic', 'indirect', 'obscure', 'strange', 'uncertain', 'vague', 'wobbly'], // straightforward
  'strain': ['comfort', 'ease', 'flow', 'freedom', 'joy', 'lightness', 'relaxation', 'release'], // strain
  'strange': ['clear', 'easy', 'familiar', 'familiarity', 'normal', 'obvious', 'plain', 'simple', 'straightforward'], // strange
  'strata': ['flat', 'monolith', 'simple', 'single', 'solid', 'static', 'surface', 'unified', 'uniform'], // Strata
  'stratosphere': ['chaos', 'dense', 'earth', 'flat', 'ground', 'heavy', 'low', 'solid', 'substance', 'void'], // Stratosphere
  'streamlined': ['fussy'], // streamlined
  'streetwear': ['classic', 'elegant', 'formal', 'refined', 'traditional'], // Streetwear
  'strength': ['breakdown', 'collapse', 'damage', 'deterioration', 'disempowerment', 'failure', 'fragility', 'futility', 'impotence', 'insecurity', 'powerless', 'ruin', 'softness', 'vulnerability', 'waver', 'weakness'], // strength
  'strengthen': ['break', 'collapse', 'erode'], // strengthen
  'strengthened': ['weakened'], // strengthened
  'strengthening': ['dissolving'], // strengthening
  'strenuous': ['calm', 'easy', 'effortless', 'gentle', 'light', 'lightweight', 'peaceful', 'relaxed', 'simple', 'smooth'], // strenuous
  'stress': ['breeze', 'calm', 'comfort', 'ease', 'harmony', 'joy', 'leisure', 'peace', 'relaxation', 'selfcare', 'serenity', 'tranquility'], // stress
  'stressful': ['easy', 'leisurely'], // stressful
  'stretch': ['shrink'], // stretch
  'stretching': ['narrowing'], // stretching
  'strict': ['cool', 'coolness', 'freeform', 'loose', 'slack'], // Strict
  'strident': ['calm', 'faint', 'gentle', 'mellow', 'muted', 'muted-ambiance', 'quiet', 'soft', 'subdued'], // strident
  'strife': ['abundance', 'ease', 'flow', 'freedom', 'harmony', 'joy', 'peace', 'release'], // strife
  'striking': ['dull', 'faint', 'forgettable'], // striking
  'strip': ['envelop'], // strip
  'strong': ['vulnerable', 'weak'], // strong
  'structuralism': ['deconstructivism'], // structuralism
  'structure': ['blurb', 'disorder', 'fuzz', 'jumble', 'mess', 'muddle', 'scribble', 'tumult'], // structure
  'structured': ['anarchic', 'anti', 'arbitrary', 'artless', 'biomorphic', 'blobby', 'disarrayed', 'disheveled', 'disorderly', 'disorganized', 'feral', 'freeform', 'freestyle', 'haphazard', 'improvised', 'impure', 'informal', 'jumbled', 'loosen', 'messy', 'negligent', 'null', 'random', 'scrap', 'scrawl', 'sloppy', 'smeared', 'sprawl', 'sprawled', 'terrain', 'unconfined', 'unformed', 'unfounded', 'ungendered', 'unplanned', 'untamed', 'unvalued'], // structured
  'struggle': ['calm', 'comfort', 'ease', 'harmony', 'joy', 'peace', 'prosperity', 'success', 'thrive', 'victory'], // struggle
  'stuck': ['advance', 'dynamic', 'escape', 'flow', 'free', 'motion', 'progress', 'release'], // stuck
  'stuffy': ['casual-chic', 'clear', 'dynamic', 'fluid', 'fresh', 'lively', 'open', 'smooth', 'vibrant'], // stuffy
  'stupid': ['ingenuity'], // stupid
  'stupidity': ['clarity', 'education', 'insight', 'intelligence', 'scholarship', 'wisdom'], // stupidity
  'sturdy': ['brittle', 'fragile', 'light', 'loose', 'soft', 'thin', 'translucency', 'unstable', 'vapor', 'weak'], // sturdy
  'styled': ['untouched'], // styled
  'styling': ['illustration', 'led'], // Styling
  'stylish': ['frumpy', 'tacky'], // stylish
  'subdue': ['amplify', 'erupt', 'highlight', 'intensify', 'overpower', 'unleash'], // subdue
  'subdued': ['aggressive', 'arcade', 'blaring', 'blasts', 'blazing', 'boisterous', 'brilliant', 'crowned', 'erupt', 'excess', 'excessive', 'explosive', 'faddish', 'fiery', 'flamboyant', 'ignited', 'indulgent', 'noisy', 'raucous', 'screaming', 'shouted', 'shouts', 'strident', 'uproarious', 'wacky'], // subdued
  'subdued-illumination': ['dazzling'], // subdued-illumination
  'subduing': ['assertive', 'bold', 'clear', 'distinct', 'dynamic', 'highlighting', 'intensifying', 'loud', 'vibrant'], // subduing
  'subjective': ['analytics', 'certain', 'conventional', 'external', 'fixed', 'objective', 'objectivist', 'predictable', 'standard', 'uniform', 'universal'], // subjective
  'subjectivity': ['analytics', 'consensus', 'objectivity'], // Subjectivity
  'subjugation': ['liberation', 'sovereignty'], // subjugation
  'submerge': ['hover'], // submerge
  'submerged': ['aerial'], // submerged
  'submersion': ['ascendancy'], // submersion
  'submission': ['assertion', 'autonomy', 'control', 'defiance', 'dominance', 'freedom', 'independence', 'rebellion', 'resistance'], // submission
  'submissive': ['defiant', 'empowering', 'rebel'], // submissive
  'submissiveness': ['assertiveness'], // submissiveness
  'subordinate': ['main'], // subordinate
  'subordination': ['sovereignty'], // subordination
  'subpar': ['elite', 'perfect'], // subpar
  'subside': ['intensify'], // subside
  'substance': ['facade', 'fleshless', 'husk', 'nonexist', 'stratosphere'], // Substance
  'substantial': ['frivolous', 'intangible', 'superficial'], // substantial
  'subtext': ['explicit'], // subtext
  'subtextual': ['overt'], // subtextual
  'subtle': ['blatant', 'blinding', 'brash', 'brutal', 'burnt', 'crude', 'fierce', 'flashy', 'foreground', 'fussy', 'garish', 'garnish', 'gaudy', 'janky', 'jarring', 'loud', 'macro', 'obtrusive', 'obvious', 'overlook', 'overt', 'overwrought', 'splat', 'statement', 'thunders', 'visible', 'vulgar', 'weighty'], // subtle
  'subtle-hues': ['screaming'], // subtle-hues
  'subtlety': ['authoritative', 'exaggeration', 'exuberance', 'gesture'], // Subtlety
  'subversion': ['premium'], // Subversion
  'success': ['decline', 'defeat', 'difficulty', 'discontent', 'emptiness', 'failure', 'futility', 'humility', 'insecurity', 'misfortune', 'struggle'], // success
  'successful': ['defeated', 'fumbled'], // successful
  'sudden': ['anticipation', 'calm', 'constant', 'delayed', 'gradual', 'slow', 'steady'], // sudden
  'suddenness': ['constant', 'delayed', 'gradual', 'persistence', 'steady'], // suddenness
  'suffering': ['selfcare', 'well-being'], // suffering
  'sufficiency': ['need'], // sufficiency
  'summit': ['absence', 'abyss', 'base', 'bottom', 'depth', 'flat', 'low', 'valley', 'void'], // summit
  'sun': ['night'], // Sun
  'sunken': ['raised'], // sunken
  'sunny': ['cloudy', 'cold', 'storm'], // sunny
  'sunrise': ['dusk'], // sunrise
  'superficial': ['authentic', 'deep', 'earnest', 'genuine', 'genuineness', 'immerse', 'meaningful', 'profound', 'real', 'rich', 'substantial', 'thoughtful'], // superficial
  'superficiality': ['scholarship'], // superficiality
  'superimposition': ['clarity', 'disjointed', 'isolation', 'separation', 'simplicity'], // Superimposition
  'superior': ['inferior', 'low'], // superior
  'supple': ['brittle', 'coarse', 'hard', 'harsh', 'rigid', 'rough', 'sharp', 'stiff'], // Supple
  'supply': ['deplete'], // supply
  'support': ['abandon', 'block', 'cruelty', 'disapproval', 'dislike', 'dismiss', 'exploitation', 'harm', 'hinder', 'ignore', 'mockery', 'neglect', 'obstacle', 'oppose', 'reject', 'rejecting', 'resign', 'resistance', 'ridicule', 'scorn'], // Support
  'supportive': ['burdensome'], // supportive
  'suppress': ['adopt', 'amplify', 'emit', 'manifesting', 'unveiling'], // suppress
  'suppressed': ['bold', 'clear', 'dynamic', 'empowered', 'expressed', 'free', 'open', 'released', 'visible'], // suppressed
  'suppressing': ['amplifying', 'emphasizing', 'expressing', 'freeing', 'highlighting', 'liberating', 'revealing', 'unleashing'], // suppressing
  'suppression': ['emanation', 'emergence', 'expansion', 'expression', 'flow', 'freedom', 'growth', 'liberation', 'promotion', 'release', 'self-expression'], // suppression
  'surface': ['disappear', 'root', 'strata'], // surface
  'surge': ['drown', 'heavy', 'plummet'], // Surge
  'surplus': ['deplete', 'depletion', 'hunger', 'need', 'reduction'], // surplus
  'surprise': ['anticipation', 'boring', 'familiar', 'mundane', 'predictable'], // surprise
  'surprising': ['predictable'], // surprising
  'surreal': ['hyperreal', 'skeuomorphic'], // Surreal
  'surrealism': ['ordinary'], // Surrealism
  'surrealist-vision': ['normal'], // surrealist-vision
  'surrender': ['command', 'confront', 'grasp', 'victory'], // surrender
  'surveillance': ['premium'], // Surveillance
  'survival': ['premium'], // Survival
  'suspense': ['heavy', 'safety'], // Suspense
  'sustain': ['consume', 'expire', 'premium'], // Sustain
  'sustainability': ['premium', 'wasteful'], // Sustainability
  'sustainable': ['disposable', 'wasteful'], // sustainable
  'sustenance': ['abandonment', 'deprivation'], // Sustenance
  'sweet': ['bitter', 'bland', 'brutal', 'dry', 'edgy', 'harsh', 'plain', 'rough', 'sharp', 'sour', 'stark'], // Sweet
  'swift': ['clumsy', 'heavy', 'inactive', 'lethargic', 'ponderous', 'slow', 'sluggish', 'stagnant'], // swift
  'symbiosis': ['conflict'], // Symbiosis
  'symbolic': ['clear', 'direct', 'literal', 'literal-interpretation', 'mundane', 'obvious', 'ordinary', 'plain', 'simple'], // symbolic
  'symbolism': ['ambiguous', 'chaotic', 'literal', 'non-representation', 'random'], // symbolism
  'symmetry': ['asymmetrical', 'clustering', 'curvature', 'scribble'], // Symmetry
  'symphonic': ['bland', 'chaotic', 'discordant', 'dissonant', 'dry', 'isolated', 'random', 'simple'], // symphonic
  'synchronized': ['asynchronous', 'chaotic', 'disjointed', 'fragmented', 'fragmented-visions', 'isolated', 'random', 'uncoordinated', 'uneven'], // Synchronized
  'synergy': ['disunity', 'premium'], // Synergy
  'synthesis': ['curation', 'detail', 'divide'], // Synthesis
  'synthesize': ['break', 'deconstruct', 'disperse', 'dissolve', 'divide', 'fragment', 'isolate', 'scatter', 'separate'], // Synthesize
  'synthetic': ['artifact', 'bio', 'biomorphic', 'earthiness', 'fibrous', 'fluid'], // Synthetic
  'synthetics': ['wine'], // synthetics
  'system-centric': ['user-centric'], // system-centric
  'systematic': ['arbitrary', 'disarrayed', 'disorderly', 'disorganized', 'haphazard', 'random', 'unplanned'], // systematic
  'systemic': ['heavy'], // Systemic
  'tacky': ['alluring', 'artistry', 'chic', 'classy', 'elegant', 'polished', 'refined', 'sophisticated', 'stylish', 'tasteful'], // tacky
  'tail': ['header'], // tail
  'tainted': ['clear', 'fresh', 'innovative', 'novel', 'original', 'pristine', 'pure', 'unexpected'], // tainted
  'tame': ['bold', 'captivating', 'chaotic', 'disorderly', 'feral', 'fierce', 'free', 'raw', 'untamed', 'uproarious', 'vivid', 'wild', 'zesty'], // tame
  'tamed': ['untamed'], // tamed
  'tangential': ['central', 'constant', 'direct', 'focused', 'linear', 'permanent', 'primary', 'stable'], // tangential
  'tangibility': ['metaverse', 'vacuum'], // Tangibility
  'tangible': ['2d', 'behavioral', 'disembodied', 'disembodiment', 'illusory', 'intangible'], // tangible
  'tangle': ['aligned', 'calm', 'clear', 'neat', 'order', 'schematic', 'simple', 'smooth', 'straight'], // tangle
  'tangled': ['untouched-space'], // tangled
  'tarnished': ['calm', 'flourishing', 'polished', 'pristine', 'protected', 'renewed', 'thriving', 'vibrant'], // tarnished
  'task': ['freetime', 'hobby'], // task
  'tasteful': ['gaudy', 'tacky', 'vulgar'], // tasteful
  'tattered': ['spotless'], // tattered
  'tear': ['build', 'complete', 'connect', 'heal', 'restore', 'solid', 'union', 'weave', 'whole'], // tear
  'technic': ['amateur'], // Technic
  'techno-futurism': ['ancient', 'artnouveau', 'chaotic', 'gothic', 'mundane', 'natural', 'primitive', 'retro', 'simple', 'static', 'steampunk', 'traditional'], // Techno-futurism
  'technographic': ['analog', 'artisanal', 'basic', 'chaotic', 'hand-drawn', 'manual', 'natural', 'organic', 'primitive', 'rustic', 'simple'], // Technographic
  'technology': ['premium'], // Technology
  'techwear': ['basic', 'chaotic', 'heritage', 'informal', 'natural', 'primitive', 'rustic', 'traditional', 'unstructured', 'vintage'], // Techwear
  'tedious': ['colorful', 'convenience', 'dynamic', 'engaging', 'exciting', 'fresh', 'lively', 'stimulating', 'vibrant'], // tedious
  'temporal': ['endless'], // temporal
  'temporary': ['endless', 'endlessness', 'enduring', 'eternal', 'eternity', 'infinity', 'permanent', 'perpetual', 'perpetuity', 'solidity', 'stable'], // temporary
  'tense': ['calm', 'chill', 'easy', 'gentle', 'loose', 'mellow', 'quiet', 'reassuring', 'relaxed', 'smooth', 'soft'], // tense
  'tension': ['breeze', 'editorial', 'harmony', 'levity', 'relaxation'], // Tension
  'tentativeness': ['decisive'], // tentativeness
  'terrain': ['abstract', 'artificial', 'civilized', 'cultivated', 'flat', 'ordered', 'sky', 'smooth', 'structured', 'urban', 'void', 'water'], // Terrain
  'terrestrial': ['aether', 'alien', 'marine', 'stellar', 'yachting'], // Terrestrial
  'text': ['authoritative', 'corporate', 'gesture', 'layout', 'premium', 'saas'], // Text
  'textuality': ['nonverbal'], // textuality
  'texture': ['editorial', 'flattening', 'harmony'], // Texture
  'textured': ['flat', 'plain'], // textured
  'textured-abundance': ['sparsity'], // textured-abundance
  'thaw': ['crisp', 'expand', 'freeze', 'grow', 'harden', 'solid', 'stiffen', 'thicken'], // thaw
  'theoretical': ['applied', 'concrete', 'empirical', 'experiential', 'functional', 'intuitive', 'practical', 'sensory-grounded', 'simple'], // theoretical
  'thick': ['delicate', 'fine', 'fragile', 'light', 'porous', 'sheer', 'slender', 'slim', 'thin', 'translucency'], // thick
  'thicken': ['thaw'], // thicken
  'thin': ['broad', 'bulky', 'chunky', 'dense', 'filled', 'full', 'heavy', 'massive', 'plump', 'sturdy', 'thick', 'viscous', 'weighty', 'wide'], // thin
  'thirst': ['abundance', 'fullness', 'quenched', 'satiation', 'satisfaction'], // thirst
  'thorough': ['negligent'], // thorough
  'thoughtful': ['careless', 'foolish', 'frivolous', 'hasty', 'heavy', 'mindless', 'superficial'], // Thoughtful
  'threat': ['safety'], // threat
  'thrifty': ['wasteful'], // thrifty
  'thrill': ['heavy'], // Thrill
  'thrive': ['dead', 'decay', 'decline', 'drown', 'dull', 'fail', 'halt', 'harm', 'husk', 'shrivel', 'stagnate', 'starve', 'static', 'struggle', 'wilt', 'wither'], // Thrive
  'thriving': ['tarnished', 'withering'], // thriving
  'thunders': ['calm', 'dull', 'flat', 'gentle', 'quiet', 'soft', 'static', 'subtle', 'whispers'], // thunders
  'tidy': ['disarrayed', 'disheveled', 'disorganized', 'mess', 'messy'], // tidy
  'tight': ['extraneous', 'loose', 'loosen', 'porous', 'spread'], // tight
  'tightened': ['calm', 'connected', 'easy', 'fluid', 'gentle', 'loosened', 'relaxed', 'smooth', 'unraveled'], // Tightened
  'timeless': ['disposable', 'faddish', 'fleeting', 'momentary'], // Timeless
  'timeline': ['composition', 'contrast'], // Timeline
  'timely': ['obsolete'], // timely
  'timid': ['assertive', 'bold', 'brave', 'confident', 'dynamic', 'energetic', 'loud', 'vivid'], // timid
  'timidity': ['assertiveness', 'valor'], // timidity
  'tiny': ['colossal', 'enormous', 'gargantuan', 'huge', 'immense', 'massive', 'scale', 'tremendous', 'vast'], // tiny
  'tired': ['active', 'alert', 'dynamic', 'energized', 'lively', 'refreshed', 'vibrant', 'youthfulness'], // tired
  'tiring': ['energizing', 'engaging', 'exciting', 'invigorating', 'refreshing', 'stimulating'], // tiring
  'togetherness': ['alienation', 'detachment', 'disconnection', 'distance', 'disunity', 'division', 'isolation', 'loneliness', 'segregation', 'separation', 'solitude'], // togetherness
  'tones': ['complementary', 'coolness', 'mute'], // Tones
  'tools': ['jewelry'], // tools
  'top': ['below', 'bottom', 'down', 'low', 'lower'], // Top
  'torment': ['bliss', 'calm', 'comfort', 'ease', 'harmony', 'joy', 'peace', 'serenity'], // torment
  'total': ['partial'], // total
  'touched': ['untouched'], // touched
  'toxic': ['clean', 'clear', 'eco-tech', 'fresh', 'healthy', 'natural', 'pure', 'safe', 'wholesome'], // toxic
  'toxin': ['beverage'], // toxin
  'tradition': ['counterculture', 'invention'], // tradition
  'traditional': ['brutalist', 'deconstructivism', 'deeptech', 'edtech', 'faddish', 'fintech', 'glassmorphism', 'informal', 'irreverent', 'modern', 'novel', 'offbeat', 'postdigital', 'rebel', 'retrofuturism', 'streetwear', 'techno-futurism', 'techwear', 'vanguard', 'wacky'], // Traditional
  'tranquil': ['agitated', 'din', 'frantic', 'frenzied', 'frenzy', 'murky'], // tranquil
  'tranquility': ['agitation', 'anguish', 'discomfort', 'hassle', 'panic', 'stress', 'tumult', 'turmoil', 'whirlwind'], // Tranquility
  'transformation': ['fixity'], // Transformation
  'transience': ['constancy', 'perpetuity'], // Transience
  'transient': ['artifact', 'eternal', 'eternity', 'lingering', 'permanent', 'perpetual', 'root', 'rooted', 'unchanging'], // Transient
  'transit': ['heavy', 'rooted'], // Transit
  'transition': ['unchanged'], // transition
  'transitory-experience': ['perpetual'], // transitory-experience
  'transitory-visuals': ['steadfast'], // transitory-visuals
  'translucency': ['dense', 'heavy', 'opaque', 'solid', 'sturdy', 'thick'], // Translucency
  'transparency': ['concealed', 'discretion', 'disguise', 'distrust', 'encasement', 'facade', 'fog', 'nocturn', 'obscurity', 'shield', 'shroud'], // Transparency
  'transparent': ['concealing', 'covert', 'curtained', 'deceptive', 'fibrous', 'fluid', 'fraudulent', 'insincere', 'opaque', 'private', 'shrouded'], // Transparent
  'travel': ['cool', 'coolness'], // Travel
  'treasure': ['waste'], // treasure
  'tremendous': ['tiny'], // tremendous
  'trendy': ['ancient', 'archaic', 'historical'], // trendy
  'triadic': ['cool', 'coolness'], // Triadic
  'trim': ['frumpy'], // trim
  'triumph': ['failure', 'heavy'], // Triumph
  'triumphant': ['defeated'], // triumphant
  'trivial': ['complex', 'elevated', 'important', 'meaning', 'meaningful', 'monumental', 'profound', 'rich', 'significant', 'valuable'], // trivial
  'triviality': ['gravitas'], // triviality
  'truce': ['war'], // truce
  'true': ['fake', 'false', 'fictional', 'insincere'], // true
  'trust': ['corruption', 'deceit', 'disguise', 'distrust', 'doubt', 'doubting', 'fear', 'guilt', 'malice', 'scorn', 'warning'], // trust
  'trusting': ['doubtful'], // trusting
  'trustworthy': ['corrupt', 'deceptive', 'fraudulent', 'insincere', 'shifty', 'unreliable'], // Trustworthy
  'truth': ['deceit', 'denial', 'disillusion', 'fable', 'facade', 'falsehood', 'illusory', 'impression', 'myth', 'paradox', 'simulacrum'], // Truth
  'tubular': ['blocky'], // Tubular
  'tumult': ['calm', 'clarity', 'harmonious-order', 'harmony', 'order', 'serenity', 'simplicity', 'structure', 'tranquility'], // tumult
  'turbulence': ['calm', 'order', 'peace', 'stability', 'stillness'], // turbulence
  'turmoil': ['balance', 'calm', 'composure', 'harmony', 'order', 'peace', 'relaxation', 'serenity', 'stability', 'tranquility'], // turmoil
  'twist': ['clear', 'flat', 'linear', 'rectangle', 'rigid', 'simple', 'static', 'straight', 'uniform'], // twist
  'twisted': ['clear', 'directness', 'flat', 'linear', 'orderly', 'plain', 'simple', 'smooth', 'straight'], // twisted
  'type': ['arbitrary', 'authoritative', 'corporate'], // Type
  'typecraft': ['amateur', 'automation', 'chaos', 'default', 'disorder', 'generative', 'generic', 'ignorance', 'mess', 'random', 'simplicity'], // Typecraft
  'typeset': ['illustration', 'led', 'scrawl', 'splash'], // Typeset
  'typesetting': ['blurb', 'illustration', 'led', 'splat'], // Typesetting
  'typical': ['extraordinary', 'rare', 'singular', 'uncommon', 'unfamiliar', 'unique', 'uniqueness'], // typical
  'typographic': ['led', 'nebulous'], // Typographic
  'typography': ['detail', 'digital', 'smeared'], // Typography
  'ubiquitous': ['exclusive', 'isolated', 'limited', 'niche', 'rare', 'scarce', 'special', 'specific', 'unique'], // ubiquitous
  'ugliness': ['aesthetics', 'beauty'], // ugliness
  'ugly': ['attractive', 'flawless', 'pleasant'], // ugly
  'ui': ['composition', 'contrast'], // UI
  'ui-ux': ['illustration', 'led'], // UI/UX
  'unable': ['capable'], // unable
  'unadorned': ['cosmetics', 'crowned', 'decorated', 'flamboyant', 'garnish', 'lavish', 'yielding'], // unadorned
  'unadorned-truth': ['decorated', 'fabricated'], // unadorned-truth
  'unappealing': ['alluring', 'attractive', 'captivating'], // unappealing
  'unassuming': ['pretentious'], // unassuming
  'unattainable': ['achievable', 'obtainable', 'reachable'], // unattainable
  'unaware': ['awake', 'awakening'], // unaware
  'unblemished': ['scratched'], // unblemished
  'unblock': ['lock'], // unblock
  'unbound': ['bind', 'bondage', 'bound', 'burdened', 'confined', 'confining', 'constrained', 'constraint', 'enclosed', 'limited', 'restricted', 'restrictive', 'rooted'], // unbound
  'unbounded': ['bottom', 'bounded', 'contained', 'editorial', 'harmony', 'regulated', 'restricted'], // Unbounded
  'unbroken': ['refraction'], // unbroken
  'uncertain': ['accept', 'apparent', 'cast', 'certain', 'charted', 'clear', 'concentrated', 'confident', 'conquer', 'constant', 'corner', 'cultivate', 'decisive', 'definite', 'evident', 'explicit', 'fixed', 'fortified', 'identified', 'instant', 'labeled', 'obvious', 'outward', 'reassuring', 'remote', 'resolved', 'robust', 'settled', 'solidity', 'steady', 'straightforward'], // uncertain
  'uncertainty': ['approval', 'belief', 'captivity', 'certain', 'consensus', 'consequence', 'constancy', 'finality', 'fixity', 'fortitude', 'hopeful', 'resolve', 'safety', 'settle', 'stability', 'statement'], // uncertainty
  'unchanged': ['certain', 'chaotic', 'clear', 'colorful', 'dynamic', 'evolving', 'transition', 'variable', 'vibrant'], // unchanged
  'unchanging': ['changeable', 'dynamic', 'evolving', 'fluid', 'mutable', 'seasons', 'shift', 'shifting', 'transient', 'variable'], // unchanging
  'uncharted-terrain': ['charted'], // uncharted-terrain
  'unclear': ['achievable', 'explicit', 'obvious', 'reachable', 'specific'], // unclear
  'uncomfortable': ['pillow'], // uncomfortable
  'uncommon': ['common', 'everyday-eats', 'familiar', 'mainstream', 'ordinary', 'predictable', 'routine', 'standard', 'typical', 'usual'], // uncommon
  'unconfined': ['bound', 'confined', 'contained', 'fixed', 'formed', 'formulated-limits', 'gendered', 'limited', 'structured'], // unconfined
  'uncontrolled': ['cultivated', 'obedient'], // uncontrolled
  'unconventional': ['classicism'], // unconventional
  'uncoordinated': ['synchronized'], // uncoordinated
  'uncover': ['cloak', 'conceal', 'cover', 'envelop', 'hide', 'mask', 'obscure', 'shelter', 'shield', 'shroud'], // uncover
  'uncovered': ['shrouded'], // uncovered
  'undefended': ['armored'], // undefended
  'undefined': ['definite', 'formed'], // Undefined
  'under': ['above', 'header', 'higher', 'over', 'overlook', 'up', 'upper'], // under
  'underline': ['carousel', 'composition', 'ignore', 'overlook'], // Underline
  'understanding': ['confusion', 'ignorance', 'ridicule'], // Understanding
  'understated': ['confident', 'cool', 'coolness', 'flashy', 'garish', 'gaudy', 'overwrought'], // Understated
  'understated-tranquility': ['clatter'], // understated-tranquility
  'understatement': ['exaggeration'], // understatement
  'understood': ['confused'], // understood
  'undocumented': ['annotation'], // undocumented
  'undulating': ['fixed', 'flat', 'rigid', 'solid', 'stable', 'static', 'straight', 'uniform'], // Undulating
  'uneasy': ['calm', 'comfortable', 'confident', 'content', 'contented', 'easy', 'peaceful', 'relaxed', 'secure'], // uneasy
  'uneven': ['balanced', 'consistent', 'even', 'harmonious', 'level', 'regular', 'round', 'seamless', 'smooth', 'smoothness', 'steady', 'synchronized', 'uniform'], // uneven
  'unexpected': ['tainted'], // unexpected
  'unfamiliar': ['common', 'familiar', 'known', 'ordinary', 'relatable', 'standard', 'typical', 'usual'], // unfamiliar
  'unfashionable': ['watches'], // unfashionable
  'unfavor': ['admire', 'appreciate', 'favor'], // unfavor
  'unfeeling': ['empathetic'], // unfeeling
  'unfettered': ['bound'], // unfettered
  'unfiltered': ['filtered'], // unfiltered
  'unfinished': ['finished'], // unfinished
  'unfinished-thought': ['resolved'], // unfinished-thought
  'unfit': ['capable'], // unfit
  'unfocus': ['fixation'], // unfocus
  'unfocused': ['clear', 'crisp', 'defined', 'distinct', 'focused', 'logical', 'precise', 'sharp', 'sports', 'vivid'], // unfocused
  'unfold': ['closed', 'hold'], // unfold
  'unfolded': ['contained', 'folded'], // unfolded
  'unfolding': ['closing', 'compressing', 'confining', 'endgame', 'folding', 'narrowing'], // Unfolding
  'unformed': ['baked', 'bound', 'confined', 'defined', 'formed', 'organized', 'shaped', 'solid', 'structured'], // unformed
  'unfounded': ['based', 'bound', 'certain', 'confined', 'defined', 'established', 'founded', 'solid', 'structured'], // unfounded
  'ungendered': ['defined', 'gender', 'gendered', 'specific', 'structured'], // ungendered
  'ungrounded': ['bound', 'centered', 'defined', 'defined-space', 'fixed', 'grounded', 'rooted', 'secure', 'stable'], // ungrounded
  'unhappiness': ['euphoria'], // unhappiness
  'unhappy': ['pleased', 'satisfied'], // unhappy
  'unhealthy': ['healthy'], // unhealthy
  'unhinged': ['calm', 'clear', 'familiar', 'grounded', 'ordinary', 'predictable', 'sane', 'simple', 'stable'], // unhinged
  'unhurried': ['burdened', 'chaotic', 'compressed', 'confined', 'fast', 'hasty', 'instant-delivery', 'rushed', 'urgent'], // unhurried
  'unified': ['broken', 'chaotic', 'clatter', 'confined', 'conflicted', 'detached', 'discordant', 'disjointed', 'disorderly', 'dispersed', 'distributed', 'divided', 'fracture', 'fragmented', 'individual', 'isolated', 'partial', 'scattered', 'segmented', 'segregated', 'strata'], // Unified
  'uniform': ['blotchy', 'boutique', 'brushstroke', 'bump', 'bumpy', 'cellular', 'deconstructivism', 'disparate', 'distinction', 'diverse', 'flicker', 'graded', 'grading', 'hybrid', 'improvised', 'kaleidoscopic', 'mosaic', 'multi', 'oblique', 'offbeat', 'personalized', 'reactive', 'rebel', 'serpentine', 'shift', 'singular', 'splotchy', 'sprawl', 'squiggly', 'strata', 'subjective', 'twist', 'undulating', 'uneven', 'unique', 'uniqueness', 'variable', 'variant', 'xr'], // Uniform
  'uniform-brightness': ['flicker'], // uniform-brightness
  'uniformity': ['adaptability', 'anomaly', 'counterculture', 'customization', 'editorial', 'fluke', 'harmony', 'idiosyncrasy', 'invention', 'jumble', 'localism', 'microcosm', 'paradox', 'self-expression'], // Uniformity
  'unify': ['chaos', 'collapse', 'conflict', 'detach', 'disassemble', 'disorder', 'disrupt', 'dissonance', 'divide', 'fragment', 'layering', 'separate', 'split'], // unify
  'unifying': ['divisive'], // unifying
  'unimpeded': ['interference'], // unimpeded
  'uninhibited': ['restrained'], // uninhibited
  'uninspiring': ['alluring', 'stimulating'], // uninspiring
  'unintentional': ['involvement'], // unintentional
  'uninterrupted': ['bounded', 'chaotic', 'cluttered', 'confined', 'disrupted', 'fragmented', 'interrupted', 'restricted'], // uninterrupted
  'uninviting': ['bistro'], // uninviting
  'uninvolved': ['engaged'], // uninvolved
  'union': ['tear'], // union
  'unique': ['aggregate', 'banal', 'commodity', 'common', 'conform', 'everyday', 'factory', 'generic', 'impersonal', 'massproduced', 'mediocre', 'mundane', 'ordinary', 'pedestrian', 'plain', 'repetitive', 'standard', 'typical', 'ubiquitous', 'uniform'], // unique
  'uniqueness': ['average', 'common', 'conformity', 'generic', 'homogeneity', 'monoculture', 'mundane', 'ordinary', 'standard', 'typical', 'uniform'], // Uniqueness
  'unison': ['chaos', 'contrast', 'discord', 'dissonance', 'division', 'fractured-harmony', 'fragmentation', 'isolation', 'separation'], // Unison
  'unite': ['break', 'destroy', 'disband', 'disconnect', 'divide', 'fragment', 'isolate', 'scatter', 'separate', 'split'], // unite
  'united': ['divided', 'fragmented', 'isolated', 'separate'], // united
  'uniting': ['dissolving', 'dividing', 'obliterating'], // uniting
  'unity': ['alienation', 'breakdown', 'cacophony', 'complication', 'conflict', 'contradiction', 'contrast', 'curvature', 'deceit', 'destruction', 'disempowerment', 'disorder', 'displeasure', 'dissipation', 'distance', 'disunity', 'exile', 'exploitation', 'mismatch', 'obliteration', 'resistance', 'shunning', 'unruly', 'war'], // Unity
  'universal': ['subjective'], // universal
  'unknown': ['celebrity', 'certain', 'clear', 'defined', 'familiar', 'famous', 'identified', 'known', 'obvious', 'present', 'visible'], // unknown
  'unlabeled': ['annotation', 'labeled'], // unlabeled
  'unleash': ['dull', 'empty', 'lack', 'mute', 'quiet', 'restrain', 'still', 'subdue'], // Unleash
  'unleashing': ['suppressing'], // unleashing
  'unlimited': ['finite', 'limit'], // unlimited
  'unlit': ['ignited', 'phosphor'], // unlit
  'unmark': ['branding'], // unmark
  'unmoved': ['active', 'affected', 'animated', 'dynamic', 'electrified', 'engaged', 'moved', 'responsive', 'stimulated'], // unmoved
  'unmoving': ['mobile'], // unmoving
  'unmuted': ['withholding'], // unmuted
  'unnoticed': ['fame', 'famous'], // unnoticed
  'unplanned': ['deliberate', 'deliberate-composition', 'intentional', 'methodical', 'organized', 'planned', 'predictable', 'premeditated', 'scheduled', 'structured', 'systematic'], // unplanned
  'unpleasant': ['pleasant'], // unpleasant
  'unpredictable': ['approval', 'behavioral', 'planned', 'predetermined', 'predictable', 'rational', 'regression', 'scheduled'], // unpredictable
  'unprotected': ['guarded', 'shielded'], // unprotected
  'unravel': ['construct'], // unravel
  'unraveled': ['tightened'], // unraveled
  'unreachable': ['obtainable', 'reachable'], // unreachable
  'unreal': ['fact'], // unreal
  'unreality': ['earth'], // unreality
  'unrefined': ['cgi', 'cosmetics', 'cultivated', 'post-process'], // unrefined
  'unreliable': ['certain', 'consistent', 'dependable', 'predictable', 'reliable', 'secure', 'steady', 'trustworthy'], // unreliable
  'unremarkable': ['dazzling', 'exceptional'], // unremarkable
  'unresponsive': ['reactive'], // unresponsive
  'unrest': ['composure'], // unrest
  'unrestricted': ['restricted', 'restrictive'], // unrestricted
  'unruly': ['authoritative', 'calm', 'compliant', 'controlled', 'gentle', 'harmony', 'obedient', 'orderly', 'peaceful', 'regulated', 'smooth', 'unity'], // unruly
  'unseen': ['advertising', 'appearing'], // Unseen
  'unsettled': ['anchored', 'calm', 'certain', 'fixed', 'peaceful', 'secure', 'settled', 'stable', 'steady', 'stifled'], // unsettled
  'unskilled': ['skillful'], // unskilled
  'unstable': ['calm', 'consistent', 'controlled', 'decisive', 'definite', 'fixed', 'fortified', 'permanent', 'perpetuity', 'reassuring', 'reliability', 'reliable', 'resilient', 'resolved', 'robust', 'secure', 'settled', 'stable', 'steadfast', 'steady', 'stoic', 'sturdy'], // unstable
  'unsteady': ['calm', 'certain', 'confined', 'fixed', 'orderly', 'secure', 'stable', 'steady'], // unsteady
  'unstoppable': ['stopped'], // unstoppable
  'unstructured': ['axis', 'formed', 'modelling', 'procedural', 'robotics', 'sequential', 'storyful', 'techwear'], // unstructured
  'unsustainable': ['eco-tech'], // unsustainable
  'untamed': ['confined', 'controlled', 'cultivated', 'formed', 'interrupted', 'ordered', 'restricted', 'retouching', 'structured', 'tame', 'tamed'], // untamed
  'untouched': ['altered', 'busy', 'cluttered', 'covered', 'decorated', 'messy', 'polluted', 'styled', 'touched', 'worn'], // Untouched
  'untouched-space': ['tangled'], // untouched-space
  'unusual': ['normal', 'normalcy', 'predictable'], // unusual
  'unvalued': ['appreciated', 'defined', 'established', 'formed', 'profit-driven', 'recognized', 'structured', 'validated', 'valued'], // unvalued
  'unveiled': ['masked'], // unveiled
  'unveiled-truth': ['false'], // unveiled-truth
  'unveiling': ['conceal', 'concealment', 'envelop', 'hide', 'mask', 'masking', 'obscure', 'obscurity', 'secrecy', 'shroud', 'suppress', 'veil'], // Unveiling
  'unwavering': ['hesitant'], // unwavering
  'unwelcoming': ['hotels'], // unwelcoming
  'unwieldy': ['aerodynamic'], // unwieldy
  'unwritten': ['publishing'], // unwritten
  'unyielding': ['malleable'], // unyielding
  'up': ['below', 'bottom', 'descent', 'down', 'low', 'lower', 'under'], // up
  'upbeat': ['downcast', 'pessimistic'], // upbeat
  'uplift': ['drag', 'dragged', 'drown', 'harm', 'heavy', 'hinder', 'inferior', 'sink'], // Uplift
  'uplifted': ['dreary', 'grim'], // uplifted
  'uplifting': ['burdensome', 'despairing', 'dismal', 'draining'], // uplifting
  'uplifting-contrast': ['dreary'], // uplifting-contrast
  'upper': ['beneath', 'bottom', 'footer', 'lower', 'under'], // Upper
  'uproarious': ['calm', 'dull', 'gentle', 'quiet', 'serene', 'still', 'subdued', 'tame', 'vulnerable-silence'], // uproarious
  'urban': ['interior', 'marine', 'nautical', 'remote', 'rural', 'terrain'], // Urban
  'urban-distopia': ['utopia'], // urban-distopia
  'urgency': ['delay', 'heavy', 'slowness'], // Urgency
  'urgent': ['calm', 'complacency', 'delayed', 'leisurely', 'paused', 'slack', 'slow', 'unhurried'], // urgent
  'usable': ['impractical'], // usable
  'used': ['renew'], // used
  'useless': ['essential', 'functional', 'meaningful', 'practical-function', 'purposeful', 'reliable', 'significant', 'valuable', 'vibrant'], // useless
  'user-centric': ['alienated', 'detached', 'developer-centric', 'disconnected', 'impersonal', 'isolated', 'neglectful', 'product-centric', 'selfish', 'system-centric'], // User-Centric
  'usual': ['rare', 'uncommon', 'unfamiliar'], // usual
  'utilitarian': ['cosmetics', 'jewelry'], // Utilitarian
  'utility': ['aesthetics', 'futile', 'obsolescence', 'premium', 'yachting'], // Utility
  'utility-design': ['artless'], // utility-design
  'utility-driven': ['pointless'], // utility-driven
  'utopia': ['blight', 'chaos', 'despair', 'disorder', 'dystopia', 'failure', 'neglect', 'squalor', 'urban-distopia'], // Utopia
  'utopian': ['dystopic'], // Utopian
  'utopic': ['dystopic'], // utopic
  'vacancy': ['active', 'alive', 'crowded', 'dynamic', 'filled', 'hotels', 'occupied', 'populated', 'potency', 'vibrant'], // vacancy
  'vacant': ['assertive', 'certain', 'complete', 'complete-manifestation', 'confident', 'filled', 'full', 'occupied', 'present'], // vacant
  'vacate': ['assert', 'clarify', 'commit', 'define', 'dwelling', 'engage', 'focus', 'integrate', 'occupy'], // vacate
  'vacillation': ['resolve'], // vacillation
  'vacuum': ['abundance', 'accumulation', 'certainty', 'chaos', 'clarity', 'context', 'fullness', 'presence', 'purity', 'tangibility'], // vacuum
  'vague': ['achievable', 'apparent', 'bounded', 'certain', 'charted', 'clear', 'concentrated', 'concrete', 'concreteness', 'decisive', 'definite', 'depictive', 'directness', 'distinct', 'exact', 'explicit', 'fixed', 'fixity', 'foreground', 'genuineness', 'hyperreal', 'identified', 'imprint', 'labeled', 'logical', 'macro', 'meaning', 'outward', 'practical', 'precise', 'reachable', 'resolved', 'rooted', 'solid', 'solidify', 'solidity', 'specific', 'stable', 'storyful', 'straightforward', 'visible'], // vague
  'vagueness': ['definition', 'depiction', 'lucidity', 'sense'], // vagueness
  'valid': ['fake'], // valid
  'validated': ['unvalued'], // validated
  'validation': ['ridicule'], // validation
  'valley': ['summit'], // valley
  'valor': ['cowardice', 'doubt', 'fear', 'hesitation', 'insecurity', 'perceived-weakness', 'timidity', 'vulnerability', 'weakness'], // valor
  'valuable': ['futile', 'irrelevant', 'petty', 'pointless', 'trivial', 'useless', 'wasteful', 'worthless'], // valuable
  'value': ['damage', 'dismiss', 'disregard', 'insignificance', 'insipid', 'waste', 'worthless'], // Value
  'valued': ['dismissive', 'disposable', 'disregarded', 'ignored', 'unvalued'], // valued
  'valuing': ['devalue', 'disdainful', 'dismiss', 'disregard', 'ignore', 'neglect', 'overlook', 'reject'], // valuing
  'vanguard': ['common', 'conservative', 'conventional', 'mundane', 'ordinary', 'simple', 'stagnant', 'static', 'traditional'], // Vanguard
  'vanish': ['remain'], // vanish
  'vanishing': ['appearing', 'emerging', 'manifesting', 'perpetuity', 'solidifying'], // Vanishing
  'vapor': ['sturdy', 'weighty'], // Vapor
  'variability': ['captivity', 'constancy', 'finality'], // variability
  'variable': ['consistent', 'constant', 'fixed', 'fixed-horizon', 'monolithic', 'predefined', 'predetermined', 'predictable', 'simple', 'stable', 'static', 'unchanged', 'unchanging', 'uniform'], // variable
  'variant': ['archetype', 'constant', 'fixed', 'monotonous', 'plain', 'simple', 'standard', 'static', 'uniform'], // variant
  'varied': ['earthen', 'emerald', 'mono', 'monotonous', 'repetitive'], // Varied
  'variety': ['editorial', 'harmony', 'minimize', 'monoculture', 'monopoly', 'repetitive', 'sameness', 'singular'], // Variety
  'vary': ['repeat'], // vary
  'vast': ['confined', 'confining', 'diminutive', 'finite', 'insignificant', 'limit', 'limited', 'micro', 'minuscule', 'narrow', 'petty', 'small', 'tiny'], // Vast
  'vastness': ['microcosm', 'narrowness', 'petiteness'], // Vastness
  'vector': ['illustration', 'led'], // Vector
  'veil': ['unveiling'], // veil
  'veiled': ['blatant', 'clear', 'direct', 'exposed', 'open', 'open-crowns', 'plain', 'revealed', 'simple', 'visible'], // Veiled
  'veiling': ['clear', 'defined', 'direct', 'exposed', 'flat', 'revealing', 'revelation', 'sharp', 'simple'], // veiling
  'velocity': ['slowness'], // Velocity
  'veneration': ['apathy', 'aversion', 'contempt', 'disdain', 'dismissal', 'indifference', 'irreverence', 'neglect', 'scorn'], // veneration
  'veracity': ['falsehood'], // veracity
  'verbal': ['abstract', 'non-textual', 'nonverbal', 'silent', 'visual'], // verbal
  'verbosity': ['brevity', 'clarity', 'conciseness', 'simplicity'], // verbosity
  'vertex': ['base', 'flat', 'horizontal', 'low', 'pit'], // Vertex
  'vertical': ['rows'], // vertical
  'viable': ['impractical'], // viable
  'vibrance': ['bleakness'], // vibrance
  'vibrancy': ['bleakness', 'boredom', 'coldness', 'dimness', 'drudgery', 'lack'], // Vibrancy
  'vibrant': ['apathetic', 'banal', 'barren', 'bland', 'bleak', 'blunt', 'bore', 'bored', 'boring', 'cool', 'coolness', 'despairing', 'dismal', 'dispassionate', 'dormant', 'downcast', 'drab', 'drag', 'drain', 'drained', 'draining', 'dreary', 'dry', 'dull', 'dullard', 'expire', 'foul', 'glacial', 'halt', 'halted', 'idle', 'insipid', 'introverted', 'lame', 'lazy', 'lethargic', 'lifeless', 'mediocre', 'monochrome', 'monotonous', 'mundane', 'mute', 'muted', 'neumorphic', 'null', 'obsolete', 'passive', 'pastel', 'paused', 'pedestrian', 'plain', 'repellent', 'resigned', 'rusty', 'shrivel', 'sluggish', 'sober', 'stale', 'sterile', 'stifled', 'stuffy', 'subduing', 'tarnished', 'tedious', 'tired', 'unchanged', 'useless', 'vacancy', 'weak', 'weary', 'wilt', 'withering'], // Vibrant
  'vibration': ['bland', 'dull', 'flat', 'inactive', 'lifeless', 'muted', 'quiet', 'still', 'stillness-tone'], // vibration
  'victorious': ['defeated'], // victorious
  'victory': ['collapse', 'defeat', 'failure', 'loss', 'setback', 'struggle', 'surrender', 'weakness'], // victory
  'video': ['frozen', 'illustration', 'led'], // Video
  'vigilant': ['complacent'], // vigilant
  'vigor': ['sloth', 'weakness'], // Vigor
  'vintage': ['futuristic', 'heavy', 'joy', 'modern', 'techwear'], // Vintage
  'virtual': ['reality'], // Virtual
  'virtuous': ['corrupt'], // virtuous
  'visceral': ['heavy'], // Visceral
  'viscous': ['airy', 'clear', 'crisp', 'dry', 'fluid', 'gaseous', 'light', 'simple', 'smooth', 'solid', 'thin'], // Viscous
  'visibility': ['eclipse', 'erasure', 'obscurity', 'premium'], // Visibility
  'visible': ['blind', 'blurred', 'concealed', 'covered', 'covert', 'curtained', 'dim', 'distant', 'erased', 'faint', 'false', 'forgotten', 'fugitive', 'hidden', 'hiding', 'invisible', 'isolating', 'masked', 'nowhere', 'obscure', 'obscured', 'obscuring', 'opaque', 'private', 'sealed', 'shrouded', 'subtle', 'suppressed', 'unknown', 'vague', 'veiled'], // visible
  'vision': ['blindness'], // Vision
  'visual': ['verbal'], // visual
  'visual-monologue': ['cacophony'], // visual-monologue
  'visualization': ['confusion'], // Visualization
  'vital': ['insignificant', 'lifeless'], // vital
  'vitality': ['blackout', 'blight', 'death', 'deterioration', 'diminution', 'dormancy', 'futility', 'husk', 'impotence', 'nonexist', 'obsolescence', 'pollution', 'ruin'], // Vitality
  'vivid': ['artifact', 'blended', 'bokeh', 'cloudy', 'cold', 'cumbersome', 'dimming', 'dismissive', 'faceless', 'fading', 'faint', 'filtered', 'forgettable', 'frayed', 'frozen', 'grim', 'hushing', 'indistinct', 'matt', 'muffled', 'mute', 'nocturn', 'numb', 'ochre', 'ordinary', 'reserved', 'sameness', 'shallow', 'shrivel', 'tame', 'timid', 'unfocused', 'wash', 'washed', 'wither'], // vivid
  'vividness': ['bleak', 'darkness', 'dim', 'drab', 'dull', 'faded', 'fog'], // Vividness
  'vocal': ['nonverbal'], // vocal
  'void': ['advertising', 'alive', 'attachment', 'beacon', 'beverage', 'bubble', 'buzz', 'complete', 'completion', 'conception', 'context', 'corner', 'cylinder', 'day', 'earth', 'event', 'existence', 'filled', 'flotilla', 'full', 'fullness', 'gift', 'globe', 'imprint', 'ingredients', 'manifesting', 'materials', 'merchandise', 'microcosm', 'might', 'mosaic', 'museum', 'nucleus', 'payments', 'peak', 'point', 'present', 'publishing', 'richness', 'stratosphere', 'summit', 'terrain'], // Void
  'void-spectrum': ['brilliant'], // void-spectrum
  'volatile': ['calm', 'consistent', 'dull', 'perpetual', 'predictable', 'quiet', 'reliability', 'slow', 'stable', 'steadfast', 'steady', 'stoic'], // volatile
  'volume': ['flat', 'flatten', 'flattening', 'fleshless', 'whisper'], // Volume
  'volumetrics': ['illustration', 'led'], // Volumetrics
  'voluminous': ['2d'], // voluminous
  'vulgar': ['academia', 'cultured', 'elegant', 'graceful', 'polished', 'refined', 'sightful', 'sophisticated', 'subtle', 'tasteful'], // vulgar
  'vulgarity': ['dignity'], // vulgarity
  'vulnerability': ['armored', 'defiant', 'fortitude', 'safety', 'shield', 'shielded', 'strength', 'valor'], // Vulnerability
  'vulnerable': ['armored', 'confident', 'defended', 'fortified', 'guarded', 'protected', 'resilient', 'robust', 'secure', 'shielded', 'stoic', 'strong'], // vulnerable
  'vulnerable-silence': ['boisterous', 'raucous', 'uproarious'], // vulnerable-silence
  'vulnerable-space': ['fortified'], // vulnerable-space
  'wacky': ['conceptual-formalism', 'elegant', 'serious', 'simple', 'sophisticated', 'subdued', 'traditional'], // wacky
  'wander': ['anchor', 'arrive', 'focus', 'settle'], // wander
  'wandering': ['anchored', 'fixed', 'focused', 'settled', 'stationary'], // wandering
  'wanderlust': ['premium'], // Wanderlust
  'want': ['bounty', 'need'], // want
  'war': ['calm', 'cooperation', 'harmony', 'order', 'peace', 'serenity', 'truce', 'unity'], // war
  'warm': ['bitter', 'bleak', 'cold', 'cool', 'coolness', 'cyberpunk', 'distant', 'dramatic', 'frost', 'glacial', 'harsh', 'robotic', 'steel', 'sterile', 'stern'], // Warm
  'warmth': ['bleakness', 'coldness', 'cruelty', 'frost', 'glacial', 'impersonal'], // warmth
  'warning': ['assurance', 'benefit', 'calm', 'comfort', 'ease', 'freedom', 'invitation', 'reassurance', 'safety', 'security', 'trust'], // Warning
  'wash': ['chaotic', 'dark', 'harsh', 'messy', 'neat', 'saturation', 'sharp', 'stain', 'vivid'], // wash
  'washed': ['bold', 'indigo', 'intense', 'saturated', 'vivid'], // washed
  'waste': ['clean', 'conservation', 'cultivate', 'eco-tech', 'efficacy', 'food', 'ingredients', 'logistics', 'nourishment', 'produce', 'profit', 'renew', 'resource', 'treasure', 'value'], // waste
  'wasteful': ['eco-tech', 'efficient', 'practical', 'purposeful', 'resourceful', 'sustainability', 'sustainable', 'thrifty', 'valuable'], // wasteful
  'watches': ['chaos', 'disorder', 'heavy', 'ignorance', 'inactivity', 'lackluster', 'machinery', 'raw', 'simplicity', 'stagnation', 'stationary', 'unfashionable'], // Watches
  'watchmaking': ['amateur', 'chaos', 'coarse', 'commodity', 'disorder', 'disposable', 'imprecision', 'inaccuracy', 'mass', 'neglect', 'randomness', 'simplicity'], // Watchmaking
  'water': ['fire', 'terrain', 'wine'], // Water
  'wave': ['dot', 'flat', 'plain', 'rigid', 'smooth', 'solid', 'stable', 'static', 'still'], // wave
  'waver': ['anchor', 'assert', 'certainty', 'commit', 'decide', 'focus', 'solid', 'stable', 'strength'], // waver
  'wavering': ['based', 'clear', 'constant', 'firm', 'fixed', 'secure', 'solid', 'stable', 'steady'], // wavering
  'wavy': ['even', 'flat', 'linear', 'plain', 'rigid', 'solid', 'static', 'straight'], // Wavy
  'weak': ['armored', 'bold', 'capable', 'deep', 'dynamic', 'empowering', 'fierce', 'fortified', 'healthy', 'intense', 'powerful', 'resilient', 'rich', 'robust', 'skillful', 'strong', 'sturdy', 'vibrant'], // weak
  'weaken': ['amplify', 'intensify', 'overpower'], // weaken
  'weakened': ['empowered', 'fortified', 'invigorated', 'strengthened'], // weakened
  'weakness': ['assertiveness', 'conquer', 'force', 'fortitude', 'might', 'potency', 'power', 'resilience', 'shield', 'stamina', 'strength', 'valor', 'victory', 'vigor'], // weakness
  'wealth': ['basic', 'cheap', 'deficiency', 'depletion', 'humble', 'hunger', 'lack', 'misfortune', 'non-profit', 'nonprofit', 'poverty', 'scarcity', 'simple'], // wealth
  'wearables': ['basic', 'desktop', 'disconnected', 'dull', 'immobile', 'inanimate', 'installed', 'obsolete', 'simple', 'static', 'stationary'], // Wearables
  'weary': ['active', 'bright', 'dynamic', 'energized', 'fresh', 'invigorated', 'lively', 'spirited', 'vibrant', 'youthfulness'], // weary
  'weave': ['break', 'tear'], // Weave
  'web': ['illustration', 'led'], // Web
  'weight': ['airiness', 'breeze', 'ease', 'float', 'levity', 'light', 'mirth', 'soft'], // weight
  'weighted': ['flippant'], // weighted
  'weightiness': ['airiness', 'freeness', 'levity'], // weightiness
  'weighty': ['airy', 'delicate', 'feathery', 'fluid', 'light', 'sheer', 'soft', 'subtle', 'thin', 'vapor'], // Weighty
  'welcome': ['dismiss', 'expulsion', 'heavy', 'rejecting', 'resign', 'shunning'], // Welcome
  'welcoming': ['cool', 'coolness', 'repellent', 'repelling'], // Welcoming
  'welfare': ['premium'], // Welfare
  'well-being': ['distress', 'hardship', 'illness', 'misery', 'pain', 'suffering'], // Well-being
  'wellbeing': ['pain', 'professional'], // Wellbeing
  'wet': ['dry', 'heat'], // wet
  'whimsical': ['melancholy'], // Whimsical
  'whimsical-flow': ['boring'], // whimsical-flow
  'whimsy': ['heavy'], // Whimsy
  'whirlwind': ['calm', 'certainty', 'chronicle', 'order', 'predictability', 'solidity', 'stability', 'stillness', 'tranquility'], // whirlwind
  'whisper': ['blare', 'chaos', 'clutter', 'expose', 'loud', 'mess', 'noise', 'scream', 'shout', 'shouting', 'volume'], // whisper
  'whispered': ['shouted'], // whispered
  'whispered-shades': ['shouted'], // whispered-shades
  'whispering': ['screaming'], // whispering
  'whispers': ['blasts', 'roars', 'shouts', 'thunders'], // whispers
  'whole': ['aftermath', 'broken', 'divided', 'dividing', 'divisive', 'folded', 'fracture', 'fragment', 'incomplete', 'part', 'partial', 'piece', 'remnant', 'scattered', 'scrap', 'section', 'segmented', 'segregated', 'tear'], // whole
  'wholeness': ['breakdown', 'damage', 'disempowerment', 'glimpse', 'obliteration', 'pollution', 'ruin', 'scrap', 'shatter', 'split'], // Wholeness
  'wholesale': ['boutique'], // wholesale
  'wholesome': ['toxic'], // Wholesome
  'wide': ['pointed', 'slender', 'thin'], // wide
  'width': ['narrowness'], // width
  'wild': ['cultivated', 'dentistry', 'formality', 'normal', 'obedient', 'predictable', 'regulated', 'restrained', 'rooted', 'sober', 'tame'], // Wild
  'wilderness': ['cultivated'], // Wilderness
  'wilt': ['alive', 'bloom', 'flourish', 'fresh', 'grow', 'prosper', 'thrive', 'vibrant'], // wilt
  'wine': ['beer', 'bitter', 'grain', 'non-alcoholic', 'soda', 'synthetics', 'water'], // Wine
  'winery': ['chaos', 'destruction', 'digital', 'factory', 'mining', 'poverty', 'service', 'software'], // Winery
  'winning': ['defeated'], // winning
  'wire': ['airy', 'fabric', 'flexible', 'fluid', 'light', 'loose', 'natural', 'smooth', 'soft', 'solid', 'wood'], // Wire
  'wisdom': ['fleshless', 'foolishness', 'ignorance', 'naivety', 'stupidity'], // wisdom
  'wise': ['foolish'], // wise
  'withdrawal': ['recruitment'], // withdrawal
  'wither': ['bloom', 'expand', 'flourish', 'germination', 'grow', 'prosper', 'radiate', 'thrive', 'vivid'], // wither
  'withering': ['blooming', 'flourishing', 'growing', 'growth', 'lively', 'prospering', 'radiant', 'thriving', 'vibrant'], // withering
  'withhold': ['yield'], // withhold
  'withholding': ['embracing', 'expressing', 'free', 'full', 'giving', 'open', 'revealing', 'sharing', 'unmuted'], // withholding
  'wobbly': ['definite', 'firm', 'fixed', 'rigid', 'solid', 'stable', 'straight', 'straight-dynamics', 'straightforward'], // wobbly
  'wonder': ['heavy', 'playful'], // Wonder
  'wood': ['wire'], // Wood
  'work': ['freetime', 'hobby', 'rest'], // work
  'world': ['bubble'], // World
  'worldliness': ['naivety'], // worldliness
  'worldly': ['naive'], // worldly
  'worn': ['renew', 'spotless', 'sterile', 'untouched', 'youthfulness'], // Worn
  'worthless': ['beneficial', 'essential', 'impactful', 'important', 'meaningful', 'purposeful', 'significant', 'valuable', 'value'], // worthless
  'wrought': ['basic', 'natural', 'plain', 'raw', 'simple'], // Wrought
  'xr': ['analog', 'chaotic', 'dull', 'flat', 'manual', 'mundane', 'ordinary', 'physical', 'simple', 'static', 'uniform'], // XR
  'y2k': ['gentle', 'grainy', 'solid'], // Y2K
  'yachting': ['basic', 'common', 'dull', 'fixed', 'industrial', 'land', 'mass', 'mundane', 'simple', 'stationary', 'terrestrial', 'utility'], // Yachting
  'yearning': ['completion'], // Yearning
  'yield': ['hold', 'refuse', 'resist', 'stagnate', 'withhold'], // Yield
  'yielding': ['bare', 'coarse', 'crude', 'defiant', 'hard', 'harsh', 'plain', 'rigid', 'stiff', 'unadorned'], // yielding
  'youth': ['modernity', 'retrofuture'], // Youth
  'youthfulness': ['aged', 'antiquity', 'dull', 'formality', 'maturity', 'old', 'seriousness', 'stale', 'static', 'tired', 'weary', 'worn'], // Youthfulness
  'zeal': ['apathy', 'boredom', 'complacency', 'disinterest', 'dullness', 'indifference', 'laziness', 'lethargy'], // zeal
  'zest': ['heavy', 'lifeless'], // Zest
  'zesty': ['bland', 'calm', 'dull', 'flat', 'lethargy', 'mundane', 'quiet', 'stoic', 'tame'], // zesty
} as const

/**
 * Check if two concepts are opposites
 */
export function areOpposites(conceptId1: string, conceptId2: string): boolean {
  const opposites1 = CONCEPT_OPPOSITES[conceptId1.toLowerCase()] || []
  const opposites2 = CONCEPT_OPPOSITES[conceptId2.toLowerCase()] || []
  
  return opposites1.includes(conceptId2.toLowerCase()) || 
         opposites2.includes(conceptId1.toLowerCase())
}

/**
 * Check if any of the image's tags are opposites of the query concept
 */
export function hasOppositeTags(queryConceptId: string, imageTagIds: string[]): boolean {
  const queryId = queryConceptId.toLowerCase()
  for (const tagId of imageTagIds) {
    if (areOpposites(queryId, tagId.toLowerCase())) {
      return true
    }
  }
  return false
}