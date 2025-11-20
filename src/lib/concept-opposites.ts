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
  '2d': ['3d', '3d-rendering', 'depth', 'dimensional', 'dynamic', 'realistic', 'solid', 'tangible', 'voluminous'], // 2D
  '3d': ['2d', 'flat', 'linear', 'planar', 'surface'], // 3D
  '3d-rendering': ['2d', 'abstract', 'flat', 'minimal', 'static'], // 3D Rendering
  'abandon': ['attachment', 'catering', 'childcare', 'commitment', 'connection', 'demand', 'embrace', 'engagement', 'healthcare', 'hotels', 'inclusion', 'journey', 'nurture', 'nurturing', 'ownership', 'presence', 'pursuit', 'remain', 'stewardship', 'support'], // abandon
  'abandonment': ['adoption', 'advertising', 'attachment', 'awareness', 'commitment', 'connection', 'cultivation', 'engagement', 'focus', 'inclusion', 'presence', 'preservation', 'protection', 'shelter', 'sustenance'], // abandonment
  'abnormal': ['normal', 'normalcy'], // abnormal
  'abound': ['deplete'], // abound
  'above': ['below', 'bottom', 'down', 'lower', 'under'], // above
  'abrasive': ['plush'], // abrasive
  'abrupt': ['gradual'], // abrupt
  'absence': ['abundance', 'advertising', 'beacon', 'being', 'canvas', 'clarity', 'completeness', 'completion', 'earth', 'echo', 'element', 'event', 'existence', 'field', 'fullness', 'gift', 'horology', 'impact', 'imprint', 'ingredients', 'involvement', 'marketing', 'materials', 'merchandise', 'metaverse', 'might', 'museum', 'nucleus', 'object', 'observation', 'origin', 'peak', 'point', 'presence', 'present', 'pressure', 'publishing', 'recruitment', 'source', 'story', 'substance', 'summit'], // Absence
  'absent': ['appearing', 'attentive', 'available', 'aware', 'connected', 'engaged', 'engaged-presence', 'existent', 'involved', 'present'], // absent
  'absolute': ['partial'], // absolute
  'absorb': ['cast', 'emit', 'splash'], // absorb
  'absorbent': ['dry', 'emissive', 'glossy', 'hard', 'impermeable', 'repellent', 'sealed', 'slick', 'smooth'], // absorbent
  'absorption': ['detachment', 'dispersal', 'dispersion', 'emission', 'exclusion', 'expulsion', 'reflectivity', 'refraction', 'rejection'], // Absorption
  'abstinence': ['consumption'], // Abstinence
  'abstract': ['3d-rendering', 'animalism', 'annotation', 'biographical', 'concreteness', 'depictive', 'earthiness', 'edutainment', 'embodiment', 'engineering', 'experiential', 'figurative', 'folk', 'foreground', 'geology', 'hyperreal', 'mineral', 'molecular', 'naturalistic', 'obtainable', 'pictorial', 'practical', 'relatable', 'roots', 'solidity', 'tangibility', 'terrain', 'verbal'], // abstract
  'abstract-non-narrative': ['storyful'], // abstract-non-narrative
  'abstracted': ['specific'], // abstracted
  'abstraction': ['concrete', 'defined', 'literal', 'skeuomorphism', 'specific', 'tangible'], // Abstraction
  'absurdity': ['clarity', 'meaning', 'order', 'sense'], // Absurdity
  'abundance': ['absence', 'deficiency', 'depletion', 'deprivation', 'hunger', 'insufficiency', 'lack', 'poverty', 'reduction', 'scarcity', 'sparsity', 'starve', 'strife', 'thirst', 'vacuum'], // Abundance
  'abundant': ['barren', 'meager', 'mono', 'rare'], // abundant
  'abyss': ['clarity', 'light', 'summit'], // Abyss
  'academia': ['casual', 'chaos', 'disorder', 'foolish', 'impractical', 'informal', 'naive', 'primitive', 'spontaneity', 'vulgar'], // Academia
  'academic': ['childcare', 'edutainment'], // Academic
  'acausal': ['consequence'], // acausal
  'accent': ['base', 'minimal', 'neutral', 'plain', 'subdued'], // Accent
  'accept': ['aspire', 'confront', 'deny', 'disagree', 'dislike', 'dismiss', 'doubt', 'neglect', 'refuse', 'reject', 'resign', 'uncertain'], // accept
  'acceptance': ['denial', 'disapproval', 'dismissal', 'doubting', 'exile', 'expulsion', 'negation', 'resistance', 'ridicule', 'shame', 'shunning'], // acceptance
  'accepting': ['rejecting'], // accepting
  'access': ['barrier', 'denial', 'deprivation', 'exclusion', 'lock', 'obstacle', 'obstruction', 'restriction'], // Access
  'accessibility': ['exclusivity'], // accessibility
  'accessible': ['arduous', 'cloistered', 'cluttered', 'complex', 'distant', 'exclusive', 'guarded', 'inaccessible', 'obscured', 'premium', 'private'], // Accessible
  'accord': ['conflict'], // accord
  'accordion': ['flat', 'open', 'static'], // Accordion
  'accumulation': ['decline', 'detachment', 'dispersal', 'dissipation', 'obliteration', 'reduction', 'vacuum'], // Accumulation
  'accuracy': ['mismatch'], // accuracy
  'achievable': ['impossible', 'inaccessible', 'unattainable', 'unrealistic'], // achievable
  'achievement': ['failure'], // achievement
  'achromatic': ['chromatic'], // achromatic
  'acknowledge': ['dismiss', 'disregard', 'forget', 'ignore'], // acknowledge
  'acknowledged': ['disregarded', 'ignored'], // acknowledged
  'acknowledgment': ['denial'], // acknowledgment
  'acoustic': ['digital', 'mechanical', 'silent', 'static', 'visual'], // Acoustic
  'action': ['hesitation', 'passivity', 'reflection', 'rest', 'sloth', 'stillness', 'suspension'], // Action
  'activating': ['dormant', 'inert', 'lethargic', 'lethargy', 'passive', 'quiet', 'sluggish', 'static', 'still'], // activating
  'active': ['aimless', 'bored', 'chill', 'complacent', 'defeated', 'delay', 'delayed', 'disinterested', 'dormant', 'expire', 'frozen', 'glacial', 'halt', 'halted', 'hushing', 'idle', 'inactive', 'laziness', 'lazy', 'lethargic', 'null', 'obsolete', 'passive', 'paused', 'reserved', 'resigned', 'rest', 'slack', 'slacker', 'sluggish', 'static', 'stop', 'stopped', 'tired', 'unmoved', 'vacancy', 'weary'], // active
  'activity': ['dormancy', 'evening', 'idleness', 'inactivity', 'passive', 'passivity', 'silence', 'slowness', 'stagnation', 'stillness'], // Activity
  'actual': ['fictional', 'retrofuturism'], // actual
  'adaptability': ['constancy', 'inflexibility', 'monotony', 'rigidity', 'sameness', 'stagnation', 'uniformity'], // Adaptability
  'adaptable': ['backward'], // adaptable
  'adaptation': ['fixation', 'premium', 'resistance'], // Adaptation
  'adding': ['erasing'], // adding
  'admiration': ['detached', 'disapproval', 'disdain', 'dislike', 'disregard', 'ridicule', 'scorn'], // admiration
  'admire': ['disapproval', 'dislike', 'dismissive', 'disorder', 'negative'], // Admire
  'admiring': ['apathy', 'contempt', 'disdain', 'disdainful', 'dismissal', 'indifference', 'neglect'], // admiring
  'adopt': ['dismiss', 'refuse', 'reject', 'resist'], // Adopt
  'adoption': ['abandonment', 'detachment', 'disconnection', 'isolation', 'rejection'], // Adoption
  'adorned': ['minimalistic', 'naked', 'plain', 'sparse'], // adorned
  'adult': ['childlike'], // adult
  'adult-services': ['childcare'], // Adult-services
  'adulthood': ['childhood'], // adulthood
  'adulting': ['carefree', 'casual', 'childhood', 'fun', 'messy', 'naive', 'simple', 'spontaneous'], // adulting
  'advance': ['hinder', 'past', 'regress', 'retreat', 'stuck'], // advance
  'advanced': ['amateur', 'primitive'], // advanced
  'advancement': ['backward', 'decline', 'deterioration', 'regression', 'retrogression', 'stagnation'], // Advancement
  'adventurous': ['boring', 'cautious', 'dull', 'mundane', 'predictable', 'routine', 'safe', 'static'], // Adventurous
  'advertising': ['abandonment', 'absence', 'disregard', 'distraction', 'ignored', 'invisibility', 'neglect', 'silence', 'unseen', 'void'], // Advertising
  'aerial': ['concealed', 'grounded', 'root', 'submerged'], // Aerial
  'aero': ['cluttered', 'dense', 'grounded', 'heavy', 'solid'], // Aero
  'aerodynamic': ['awkward', 'boxy', 'bulky', 'clunky', 'cumbersome', 'heavy', 'inefficient', 'rough', 'slow', 'stagnant', 'unwieldy'], // Aerodynamic
  'aerospace': ['marine'], // Aerospace
  'aesthetic': ['grotesque'], // aesthetic
  'aesthetics': ['basic', 'blandness', 'chaos', 'clutter', 'disorder', 'dullness', 'functionality', 'gritty', 'messiness', 'practicality', 'ugliness', 'utility'], // Aesthetics
  'aether': ['chaos', 'dull', 'earth', 'gloom', 'heaviness', 'mundane', 'solid', 'sorrow', 'terrestrial'], // Aether
  'affected': ['unmoved'], // affected
  'affection': ['alienation', 'aloof', 'aversion', 'detachment', 'disapproval', 'dislike', 'dismissive', 'distrust', 'scorn', 'shunning'], // affection
  'affirm': ['deny', 'disapproval', 'dislike', 'refute', 'reject', 'rejecting'], // Affirm
  'affirmation': ['doubting', 'negation'], // affirmation
  'affirmative': ['delay', 'disapproval', 'dismissive'], // affirmative
  'affluence': ['deprivation', 'dirt', 'lack', 'need', 'poverty', 'scarcity', 'want'], // Affluence
  'aftermath': ['beginning', 'clear', 'fresh', 'intact', 'new', 'origin', 'pure', 'whole'], // Aftermath
  'aged': ['youth', 'youthfulness'], // aged
  'agency': ['detachment', 'disempowerment', 'inactivity', 'passivity', 'subordination'], // Agency
  'aggregate': ['dispersed', 'distinct', 'fragmented', 'individual', 'isolated', 'scattered', 'segregated', 'specific', 'unique'], // Aggregate
  'aggression': ['zen'], // aggression
  'aggressive': ['ambient', 'calm', 'chill', 'feminine', 'gentle', 'passive', 'peaceful', 'serene', 'soft'], // aggressive
  'agitated': ['calm', 'chill', 'easy', 'gentle', 'mellow', 'peaceful', 'relaxed', 'serene', 'smooth', 'tranquil'], // agitated
  'agitation': ['calm', 'complacent-serenity', 'composure', 'ease', 'peace', 'quiet', 'relaxation', 'rest', 'serenity', 'stillness', 'tranquility'], // agitation
  'agony': ['bliss', 'calm', 'comfort', 'ease', 'happiness', 'joy', 'peace', 'serenity'], // agony
  'agree': ['resign'], // agree
  'agreeable': ['defiant'], // agreeable
  'agreement': ['conflict', 'contradiction', 'disapproval', 'disunity', 'resistance'], // agreement
  'agriculture': ['manufacturing'], // Agriculture
  'ai': ['chaotic', 'human', 'intuitive', 'natural', 'organic'], // AI
  'aimless': ['active', 'aware', 'bright', 'clear', 'engaged', 'focused', 'intent', 'intentional', 'purposeful'], // aimless
  'aimlessness': ['purpose'], // aimlessness
  'aion': ['chronos'], // aion
  'airiness': ['density', 'heaviness', 'mass', 'solid', 'weight', 'weightiness'], // airiness
  'airy': ['blocky', 'boxy', 'concrete', 'confining', 'constrict', 'viscous', 'weighty', 'wire'], // airy
  'album': ['live', 'single'], // Album
  'alert': ['apathetic', 'blind', 'complacent', 'dormant', 'oblivious', 'shallow', 'sluggish', 'tired'], // alert
  'alertness': ['drowsiness', 'lethargy'], // Alertness
  'algorithm': ['chaos', 'imprecision', 'intuition', 'spontaneity', 'subjectivity'], // Algorithm
  'alien': ['common', 'earthiness', 'earthy', 'familiar', 'friendly', 'local', 'mundane', 'native', 'ordinary', 'relatable', 'terrestrial'], // alien
  'alienated': ['embraced', 'genuineness', 'user-centric'], // alienated
  'alienation': ['affection', 'attachment', 'belonging', 'closeness', 'connect', 'connection', 'embrace', 'empathy', 'engagement', 'fandom', 'hospitality', 'humanism', 'inclusion', 'inclusivity', 'intimacy', 'togetherness', 'unity'], // alienation
  'align': ['chaos', 'disarray', 'disorder', 'disrupt', 'diverge', 'random', 'scatter', 'separate', 'split'], // Align
  'aligned': ['disparate', 'tangle'], // aligned
  'alignment': ['conflict', 'detachment', 'disorder', 'dispersal', 'mismatch'], // Alignment
  'alive': ['dead', 'defeated', 'despairing', 'dormant', 'drained', 'dry', 'empty', 'glacial', 'haunting', 'hollow', 'inactive', 'lifeless', 'numb', 'shrivel', 'stagnant', 'vacancy', 'void', 'wilt'], // alive
  'alluring': ['bland', 'dull', 'garish', 'mundane', 'repulsive', 'tacky', 'unappealing', 'uninspiring'], // alluring
  'aloof': ['affection', 'approachable', 'empathetic', 'engaged'], // Aloof
  'altered': ['untouched'], // altered
  'alternative': ['mainstream'], // alternative
  'altruism': ['greed'], // altruism
  'amateur': ['advanced', 'competent', 'expert', 'masterful', 'polished', 'professional', 'refined', 'skilled', 'technic', 'typecraft', 'watchmaking'], // amateur
  'amber': ['blue', 'cyan', 'green', 'indigo', 'violet'], // Amber
  'ambient': ['aggressive', 'chaotic', 'harsh', 'intense', 'jarring'], // Ambient
  'ambiguity': ['annotation', 'assertion', 'context', 'definition', 'depiction', 'distinctness', 'flowchart', 'gesture', 'insight', 'integrity', 'interpretation', 'meaning', 'measure', 'objectivity', 'outlining', 'principle', 'resolve', 'revelation', 'sense', 'statement', 'truth', 'understanding', 'visualization'], // ambiguity
  'ambiguous': ['certain', 'charted', 'decisive', 'definite', 'distinct', 'exact', 'explicit', 'identified', 'informative', 'instant', 'labeled', 'obvious', 'outward', 'practical', 'reachable', 'resolved', 'specific', 'straightforward', 'symbolism'], // ambiguous
  'ambition': ['apathy', 'complacency', 'indifference', 'laziness', 'lethargy', 'resignation'], // Ambition
  'ambitious': ['slacker'], // ambitious
  'amorphous': ['anatomy', 'crystalline', 'defined', 'fixed', 'formed', 'molecular', 'rigid', 'solid', 'structured'], // Amorphous
  'amplification': ['diminution', 'reduction'], // amplification
  'amplify': ['dampen', 'diminish', 'lessen', 'muffle', 'mute', 'quiet', 'reduce', 'shrink', 'subdue', 'suppress', 'weaken'], // amplify
  'amplifying': ['dimming', 'hushing', 'muting', 'suppressing'], // amplifying
  'amplitude': ['petiteness'], // amplitude
  'analog': ['fintech', 'metaverse', 'postdigital', 'technographic', 'xr'], // analog
  'analog-experience': ['automated'], // analog-experience
  'analogous': ['contrasting', 'disparate', 'dissimilar', 'divergent', 'inconsistent'], // Analogous
  'analogue': ['digitalization', 'edtech'], // analogue
  'analysis': ['chaos', 'fuzz', 'instinct', 'intuition', 'simplicity', 'whimsy'], // Analysis
  'analytical': ['emotional', 'imprecise', 'intuitive', 'spontaneous', 'subjective'], // Analytical
  'analytics': ['chaos', 'disorder', 'guesswork', 'haphazard', 'ignorance', 'instinct', 'intuition', 'negligence', 'qualitative', 'randomness', 'subjective', 'subjectivity'], // Analytics
  'anarchic': ['coherent', 'conformist', 'controlled', 'disciplined', 'harmonious', 'orderly', 'regulated', 'stable', 'structured'], // anarchic
  'anarchy': ['ascendancy', 'authority', 'command', 'consensus', 'consulting', 'dentistry', 'government', 'hierarchy', 'obedience', 'principle', 'regulation', 'scholarship', 'sovereignty'], // anarchy
  'anatomy': ['amorphous', 'chaos', 'disorder', 'fragmentation', 'simplicity'], // Anatomy
  'anchor': ['drift', 'float', 'wander', 'waver'], // anchor
  'anchored': ['chaos', 'detached', 'dispersal', 'fluidity', 'lost', 'mobility', 'nomadic', 'shifting', 'unanchored', 'unsettled', 'wandering', 'weightless'], // Anchored
  'anchoring': ['fleeing', 'forgetting'], // anchoring
  'ancient': ['contemporary', 'current', 'fresh', 'futurism', 'innovative', 'modern', 'new', 'novel', 'techno-futurism', 'trendy'], // ancient
  'anger': ['calm', 'joy', 'serenity'], // Anger
  'angle': ['circle', 'curve', 'loop'], // angle
  'anguish': ['bliss', 'calm', 'comfort', 'ease', 'happiness', 'joy', 'pleasure', 'serenity', 'tranquility'], // anguish
  'angular': ['circular', 'curvature', 'curvy', 'cylindrical', 'round', 'spherical', 'tubular'], // angular
  'angular-form': ['round'], // angular-form
  'angularity': ['curved', 'rounded', 'smooth', 'soft'], // Angularity
  'animalism': ['abstract', 'artificiality', 'digital', 'mechanism'], // Animalism
  'animated': ['apathetic', 'dispassionate', 'dullard', 'lifeless', 'static', 'unmoved'], // Animated
  'animation': ['boredom'], // animation
  'annotation': ['abstract', 'ambiguity', 'chaos', 'confusion', 'disconnection', 'implicit', 'undocumented', 'unlabeled'], // Annotation
  'annoyed': ['pleased'], // annoyed
  'anomaly': ['archetype', 'consistency', 'normalcy', 'order', 'predictability', 'regularity', 'routine', 'standard', 'uniformity'], // anomaly
  'anonymity': ['branding', 'celebrity', 'companionship', 'fame', 'identity', 'milestone', 'premium', 'publicity', 'recognition'], // Anonymity
  'anonymous': ['famous', 'identified', 'known', 'premium'], // Anonymous
  'anti': ['calm', 'commercial-aesthetics', 'harmonious', 'orderly', 'pro', 'sane', 'structured'], // anti
  'anti-form': ['formed'], // anti-form
  'anticipation': ['apathy', 'boredom', 'disappointment', 'disillusion', 'indifference', 'resignation', 'settled', 'sudden', 'surprise'], // Anticipation
  'antiquity': ['youthfulness'], // Antiquity
  'anxiety': ['calm', 'contentment', 'relaxation', 'safety', 'serenity'], // Anxiety
  'anxious': ['assured', 'calm', 'carefree', 'content', 'laid-back', 'peaceful', 'reassuring', 'relaxed', 'secure', 'steady'], // anxious
  'apathetic': ['alert', 'animated', 'aspirant', 'driven', 'empathetic', 'engaged', 'enthusiastic', 'excited', 'passionate', 'responsive', 'vibrant'], // apathetic
  'apathy': ['admiring', 'ambition', 'anticipation', 'assertiveness', 'attention', 'awakening', 'belief', 'cherishing', 'empathy', 'engage', 'expressiveness', 'exuberance', 'fandom', 'fervor', 'humanism', 'humanity', 'hype', 'kindness', 'participation', 'passion', 'quest', 'respect', 'self-expression', 'stimulation', 'veneration', 'vigor', 'zeal'], // apathy
  'apex': ['base', 'common', 'dull', 'flat', 'lowly', 'naive', 'pit', 'plain', 'simplicity'], // Apex
  'apparel': ['jewelry'], // Apparel
  'apparent': ['concealed', 'covert', 'hidden', 'invisible', 'obscured', 'unseen'], // apparent
  'appealing': ['repellent', 'repelling'], // appealing
  'appear': ['disappear'], // appear
  'appearing': ['absent', 'disappearing', 'dormant', 'hiding', 'inactive', 'null', 'unseen', 'vanishing'], // appearing
  'applied': ['theoretical'], // applied
  'appreciate': ['disapproval', 'dislike', 'dismiss', 'dismissive', 'disregard', 'rejecting', 'scorn'], // Appreciate
  'appreciated': ['unvalued'], // appreciated
  'appreciation': ['disapproval'], // appreciation
  'appreciative': ['dismissive'], // appreciative
  'apprehension': ['assurance', 'calmness', 'composure', 'confidence', 'serenity'], // Apprehension
  'approach': ['evade'], // approach
  'approachable': ['aloof'], // approachable
  'approval': ['chaos', 'critique', 'disapproval', 'dislike', 'displeasure', 'dissatisfaction', 'failure', 'instability', 'rejecting', 'rejection', 'scorn', 'shame', 'uncertainty', 'unpredictable'], // approval
  'aqueous': ['dry', 'harsh', 'rigid', 'solid', 'stark'], // Aqueous
  'arbitrary': ['basis', 'calculation', 'consequence', 'curated', 'intentional', 'methodical', 'ordered', 'procedural', 'relevance', 'structured', 'systematic'], // arbitrary
  'arcade': ['minimal', 'quiet', 'serene', 'static', 'subdued'], // Arcade
  'arch': ['collapse', 'flat', 'level', 'linear', 'plane', 'simple'], // Arch
  'archaic': ['contemporary', 'futuristic', 'humanist', 'innovative', 'modern', 'nouveau'], // archaic
  'archetype': ['anomaly', 'chaos', 'disorder', 'individuality', 'variant', 'variation'], // Archetype
  'architecture': ['chaos', 'deconstruction', 'disorder', 'fluidity', 'spontaneity'], // Architecture
  'archival': ['ephemeral', 'fleeting', 'mutable', 'transient'], // Archival
  'arduous': ['accessible', 'casual', 'convenience', 'easy', 'effortless', 'light', 'pleasant', 'simple', 'smooth'], // arduous
  'arid': ['fertile', 'flourishing', 'foliage', 'green', 'lush', 'moist', 'oceanic', 'wet'], // Arid
  'armored': ['bare', 'exposed', 'fragile', 'open', 'soft', 'undefended', 'vulnerability', 'vulnerable', 'weak'], // armored
  'arranged': ['disorderly'], // arranged
  'arrangement': ['cluttered', 'disorder', 'dispersal'], // Arrangement
  'array': ['cluttered', 'complex', 'detached', 'disorder', 'dispersal'], // Array
  'arrival': ['fleeing'], // arrival
  'arrive': ['disappear', 'wander'], // arrive
  'arrogant': ['humble'], // arrogant
  'art': ['banal', 'banality', 'bland', 'brutality', 'chaos', 'coding', 'commodity', 'disorder', 'dull', 'emptiness', 'haphazard', 'industry', 'lack', 'mundane'], // Art
  'art-deco': ['neo-grotesque'], // Art-Deco
  'art-nouveau': ['techno-futurist'], // art-nouveau
  'artful': ['artless'], // artful
  'articulate': ['illiterate', 'nonverbal'], // articulate
  'artifact': ['current', 'dynamic', 'fluid', 'fresh', 'modern', 'novel', 'organic', 'synthetic', 'transient', 'vivid'], // Artifact
  'artifice': ['authentic', 'authenticity', 'earth', 'genuine', 'genuineness', 'natural', 'nature', 'simplicity', 'truth'], // Artifice
  'artificial': ['authentic', 'bio', 'biomorphic', 'biophilic', 'candid', 'earthen', 'earthiness', 'environment', 'genuine', 'genuineness', 'natura', 'natural', 'naturalistic', 'primal', 'real', 'terrain'], // artificial
  'artificiality': ['animalism', 'earthiness'], // Artificiality
  'artisan': ['computational'], // artisan
  'artisanal': ['factory', 'generic', 'industrial', 'mass-produced', 'massproduced', 'synthetic', 'technographic', 'uniform'], // Artisanal
  'artistic': ['commercial', 'functional', 'functionalism', 'mechanic', 'mechanical', 'mundane', 'scientific', 'utilitarian'], // Artistic
  'artistry': ['banality', 'crudeness', 'disorder', 'mediocrity', 'tacky', 'uniformity'], // Artistry
  'artless': ['artful', 'complex', 'deliberate', 'detailed', 'intentional', 'refined', 'sophisticated', 'structured', 'utility-design'], // artless
  'artnouveau': ['techno-futurism'], // ArtNouveau
  'arts': ['engineering'], // Arts
  'artsy': ['mainstream'], // artsy
  'ascend': ['descend', 'low', 'lower', 'plummet', 'plunge', 'regress'], // ascend
  'ascendancy': ['anarchy', 'chaos', 'collapse', 'decline', 'disorder', 'failure', 'fall', 'grounded', 'loss', 'submersion'], // Ascendancy
  'ascension': ['decline', 'descent', 'diminution', 'fall', 'gravity', 'reduction'], // Ascension
  'ascent': ['decline', 'descent', 'fall'], // Ascent
  'ascii': ['fluid', 'modern', 'vector'], // ASCII
  'asleep': ['awake'], // asleep
  'aspirant': ['apathetic', 'defeated', 'heavy', 'resigned'], // Aspirant
  'aspiration': ['heavy', 'mediocre'], // Aspiration
  'aspire': ['accept', 'heavy', 'resign', 'settle'], // Aspire
  'assemblage': ['detachment', 'disorder', 'dispersal', 'isolation', 'separation'], // Assemblage
  'assemble': ['disassemble', 'disband', 'discard', 'disperse', 'divide'], // assemble
  'assembly': ['detachment', 'disorder', 'dispersal', 'dissipation', 'dissolution', 'separation'], // Assembly
  'assert': ['retreat', 'vacate', 'waver'], // assert
  'assertion': ['ambiguity', 'disapproval', 'dismissal', 'doubt', 'erasure', 'negation', 'passivity', 'submission'], // Assertion
  'assertive': ['hesitant', 'passive', 'resigned', 'shy', 'subduing', 'timid', 'vacant'], // assertive
  'assertiveness': ['apathy', 'hesitation', 'indecision', 'insecurity', 'meekness', 'passivity', 'submissiveness', 'timidity', 'weakness'], // Assertiveness
  'assurance': ['apprehension', 'doubt', 'doubting', 'risk', 'warning'], // assurance
  'assured': ['anxious', 'doubtful'], // assured
  'astral': ['concrete', 'earthly', 'material', 'tangible', 'terrestrial'], // Astral
  'astronomical': ['grounded', 'terrestrial'], // Astronomical
  'asymmetrical': ['balance', 'boxy', 'centered', 'centrality', 'symmetry'], // Asymmetrical
  'asymmetry': ['axial', 'balance', 'centrality', 'concentricity', 'conformity', 'proportion', 'rectilinear', 'regularity', 'rows', 'symmetry', 'uniform', 'uniformity'], // Asymmetry
  'asynchronous': ['synchronized'], // asynchronous
  'asynchrony': ['synchronicity'], // Asynchrony
  'athlete': ['couch', 'inactive', 'lazy', 'lethargic', 'sluggish'], // Athlete
  'atmosphere': ['chaos', 'desolation', 'void'], // Atmosphere
  'atmospheric': ['bland', 'minimal', 'sterile'], // Atmospheric
  'attach': ['detach'], // attach
  'attached': ['detached'], // attached
  'attachment': ['abandon', 'abandonment', 'alienation', 'detached', 'detachment', 'disconnection', 'dismiss', 'escape', 'expulsion', 'separation'], // attachment
  'attack': ['retreat'], // attack
  'attention': ['apathy', 'disregard', 'distraction', 'indifference', 'neglect', 'negligence', 'obscurity', 'sloppiness'], // Attention
  'attentive': ['absent', 'careless', 'distracted', 'oblivious', 'selfish'], // attentive
  'attract': ['regress'], // attract
  'attracting': ['disengaging', 'dull', 'invisible', 'repelling', 'repelling-hues'], // Attracting
  'attraction': ['aversion', 'dislike', 'rejection', 'repulsion'], // attraction
  'attractive': ['bland', 'deterring', 'drab', 'dull', 'mundane', 'ordinary', 'repellent', 'repulsive', 'ugly', 'unappealing'], // attractive
  'attrition': ['recruitment'], // Attrition
  'atypical': ['common'], // atypical
  'audacious': ['cautious'], // audacious
  'augmentation': ['depletion', 'diminution', 'reduction', 'simplification'], // Augmentation
  'aura': ['chaos', 'clarity', 'density', 'obscurity', 'void'], // Aura
  'aurora': ['dusk', 'obscurity', 'void'], // Aurora
  'authentic': ['artifice', 'artificial', 'deceptive', 'fabricated', 'facade', 'fake', 'false', 'falsehood', 'fraudulent', 'imperfect', 'insincere', 'pretentious', 'racket', 'simulacrum', 'simulated', 'superficial'], // authentic
  'authenticity': ['artifice', 'deception', 'disguise', 'facade', 'falsity', 'illusion', 'insincerity', 'pretense', 'simulation'], // Authenticity
  'authoritative': ['gentle', 'irreverent', 'muted', 'subtlety', 'text', 'type', 'unruly'], // Authoritative
  'authority': ['anarchy', 'chaos', 'disorder', 'freedom', 'rebellion'], // Authority
  'authorship': ['premium'], // Authorship
  'automated': ['analog-experience', 'chaotic', 'human', 'imperfect', 'manual', 'natural', 'organic', 'random', 'spontaneous'], // Automated
  'automation': ['premium', 'recruitment', 'typecraft'], // Automation
  'automotive': ['electronics', 'manual', 'natural', 'organic', 'pedestrian', 'primitive', 'static'], // Automotive
  'autonomy': ['collectivism', 'conformity', 'dependence', 'subjugation', 'submission'], // Autonomy
  'available': ['absent'], // available
  'avant-garde': ['retrofuturism'], // Avant-garde
  'avatar': ['individual', 'premium', 'real'], // Avatar
  'average': ['elite', 'exceptional', 'uniqueness'], // average
  'aversion': ['affection', 'attraction', 'demand', 'favor', 'pleasure', 'veneration'], // aversion
  'avoid': ['confront'], // avoid
  'awake': ['asleep', 'drowsy', 'night', 'unaware'], // Awake
  'awakening': ['apathy', 'delusion', 'dormancy', 'dullness', 'evening', 'ignorance', 'inattention', 'sleeping', 'slumber', 'stagnation', 'unaware'], // Awakening
  'aware': ['absent', 'aimless', 'blind', 'clueless', 'complacent', 'distracted', 'fumble', 'illiterate', 'mindless', 'nowhere', 'oblivious', 'shallow'], // aware
  'awareness': ['abandonment', 'blackout', 'blindness', 'ignorance', 'negligence', 'oblivion', 'premium'], // Awareness
  'awe': ['heavy', 'playful'], // Awe
  'awkward': ['aerodynamic', 'clear', 'coherent', 'confident', 'coolness', 'familiar', 'graceful', 'harmonious', 'intentional', 'polished', 'skillful', 'smooth'], // awkward
  'awkwardness': ['chic', 'clarity', 'elegant', 'ergonomic', 'grace', 'poise', 'prestige', 'refinement', 'streamline'], // awkwardness
  'axial': ['asymmetry', 'dispersed', 'nonlinear', 'radial', 'random'], // Axial
  'axis': ['chaos', 'disorder', 'fluid', 'freeform', 'irregular', 'random', 'scattered', 'unstructured'], // Axis
  'background': ['foreground'], // background
  'backward': ['adaptable', 'advancement', 'behavioral', 'confident', 'ease', 'fluid', 'forward', 'progress', 'soft'], // backward
  'baked': ['cold', 'fresh', 'moist', 'raw', 'uncooked', 'unformed'], // Baked
  'bakery': ['bitter', 'chaotic', 'disorderly', 'dry', 'durables', 'harsh', 'mining', 'raw', 'savory', 'software', 'sour'], // Bakery
  'balance': ['asymmetrical', 'asymmetry', 'based', 'complication', 'conflict', 'disorder', 'turmoil'], // Balance
  'balanced': ['discordant', 'jagged', 'jarring', 'uneven'], // balanced
  'banal': ['art', 'bold', 'dynamic', 'epic', 'exciting', 'expressive', 'innovative', 'original', 'stellar', 'sublime', 'unique', 'vibrant'], // banal
  'banality': ['art', 'artistry', 'gravitas'], // banality
  'bare': ['armored', 'caps', 'cosmetics', 'crowned', 'curtained', 'elaborate', 'eyewear', 'filled', 'full', 'garnish', 'glamour', 'plump', 'shielded', 'sticker', 'woven', 'yielding'], // bare
  'baroque': ['cleanliness', 'functionality', 'minimalism', 'modernism', 'simplicity'], // Baroque
  'barren': ['abundant', 'beverage', 'colorful', 'dynamic', 'fertile', 'flourishing', 'foliage', 'fullness', 'immerse', 'inviting', 'lush', 'oceanic', 'rich', 'richness', 'verdant', 'vibrant'], // barren
  'barrier': ['access', 'connection', 'freedom', 'integration', 'openness', 'portal'], // Barrier
  'barter': ['payments'], // Barter
  'base': ['accent', 'apex', 'complex', 'decorated', 'elaborate', 'elevated', 'elevation', 'horizon', 'intricate', 'luxe', 'ornamentation', 'peak', 'pinnacle', 'prestige', 'stratum', 'summit', 'top', 'transcendence', 'vertex'], // base
  'based': ['balance', 'fluid', 'masonry', 'organic', 'serif', 'unfounded', 'wavering'], // Based
  'basement': ['sky'], // basement
  'basic': ['aesthetics', 'boutique', 'cgi', 'cluttered', 'complex', 'decorated', 'deeptech', 'eclectic', 'edtech', 'elaborate', 'elite', 'exceptional', 'excessive', 'extraordinary', 'figurative', 'fine', 'fintech', 'garnish', 'gastronomy', 'gourmet', 'indulgent', 'lavish', 'macro', 'perfect', 'personalized', 'prime', 'retrofuturism', 'technographic', 'techwear', 'wealth', 'wearables', 'wrought', 'yachting'], // Basic
  'basic-bites': ['indulgent'], // basic-bites
  'basis': ['arbitrary', 'cluttered', 'disheveled', 'disorder', 'messy'], // basis
  'bauhaus': ['chaotic', 'eclectic', 'ornate'], // Bauhaus
  'beacon': ['absence', 'darkness', 'shadow', 'void'], // Beacon
  'beat': ['silence', 'stagnant', 'static', 'stillness'], // beat
  'beauty': ['chaos', 'clutter', 'dullness', 'mess', 'ugliness'], // Beauty
  'becoming': ['being', 'ended', 'stasis', 'static'], // Becoming
  'beer': ['wine'], // beer
  'begin': ['closed', 'expire', 'finish'], // begin
  'beginning': ['aftermath', 'closure', 'death', 'end', 'ended', 'endgame', 'final', 'finale', 'finality', 'finish'], // Beginning
  'behavioral': ['backward', 'chaotic', 'disorderly', 'erratic', 'hardware', 'impulsive', 'irrational', 'mechanical', 'physical', 'random', 'spontaneous', 'tangible', 'unpredictable'], // Behavioral
  'being': ['absence', 'becoming', 'nonbeing', 'nonexist', 'nothingness', 'null', 'void'], // Being
  'belief': ['apathy', 'confusion', 'denial', 'disbelief', 'disillusion', 'disillusionment', 'doubt', 'indifference', 'skepticism', 'uncertainty'], // belief
  'believing': ['doubtful'], // believing
  'belonging': ['alienation', 'detachment', 'disconnection', 'exile', 'forgetting', 'isolation', 'separation'], // Belonging
  'below': ['above', 'high', 'skyward', 'top', 'up'], // below
  'beneath': ['upper'], // beneath
  'beneficial': ['worthless'], // beneficial
  'benefit': ['harm', 'warning'], // benefit
  'benevolence': ['malice'], // benevolence
  'benevolent': ['greed'], // benevolent
  'bespoke': ['generic', 'massproduced', 'premium'], // Bespoke
  'betrayal': ['cherishing'], // betrayal
  'beverage': ['barren', 'dry', 'dull', 'empty', 'equipment', 'inedible', 'solid', 'stale', 'toxin', 'void'], // Beverage
  'beyond': ['limit', 'within'], // Beyond
  'bias': ['objectivity'], // bias
  'bigness': ['petiteness'], // bigness
  'binary': ['complex', 'diverse', 'fluid', 'monochrome'], // Binary
  'bind': ['chaos', 'detach', 'disorder', 'fluid', 'free', 'loose', 'open', 'release', 'unbound'], // bind
  'binding': ['disband', 'free', 'liberation', 'loose', 'separate'], // binding
  'bio': ['artificial', 'dead', 'inorganic', 'mechanical', 'synthetic'], // Bio
  'biographical': ['abstract', 'fictional', 'imaginary', 'imaginative'], // Biographical
  'biological': ['robotics'], // Biological
  'biomorphic': ['artificial', 'geometric', 'mechanical', 'rigid', 'static', 'structured', 'synthetic'], // Biomorphic
  'biophilia': ['premium'], // Biophilia
  'biophilic': ['artificial', 'concrete', 'detached', 'inhospitable', 'mechanical', 'sterile'], // Biophilic
  'biotech': ['electronics'], // Biotech
  'bistro': ['bland', 'chaotic', 'formal', 'impersonal', 'industrial', 'rigid', 'stale', 'stark', 'sterile', 'uninviting'], // Bistro
  'bitmap': ['vector-graphics'], // bitmap
  'bitter': ['bakery', 'bright', 'cheerful', 'gentle', 'jubilant', 'smooth', 'soft', 'sweet', 'warm', 'wine'], // bitter
  'bizarre': ['familiar'], // bizarre
  'blackout': ['awareness', 'brightness', 'clarity', 'dawn', 'energy', 'illumination', 'light', 'radiance', 'vitality'], // Blackout
  'bland': ['alluring', 'art', 'atmospheric', 'attractive', 'bistro', 'bold', 'brilliant', 'captivating', 'colorful', 'dazzling', 'depictive', 'distinct', 'distinction', 'dynamic', 'enchanted', 'enchanting', 'evocative', 'exceptional', 'exciting', 'expressive', 'fanciful', 'fierce', 'fiery', 'gleaming', 'graded', 'groovy', 'highlight', 'ignited', 'lively', 'lustrous', 'macro', 'murals', 'personalized', 'phosphor', 'pleasant', 'provocative', 'rich', 'richness', 'shimmer', 'shine', 'shiny', 'soulful', 'stimulating', 'storyful', 'sweet', 'symphonic', 'vibrant', 'vibration', 'zesty'], // bland
  'blandness': ['aesthetics'], // blandness
  'blank': ['complex', 'decorated', 'defined', 'detailed', 'filled', 'multi'], // Blank
  'blare': ['whisper'], // blare
  'blaring': ['calm', 'gentle', 'muted', 'peaceful', 'quiet', 'silent', 'soft', 'still', 'subdued'], // blaring
  'blasts': ['calm', 'gentle', 'muted', 'peaceful', 'quiet', 'soft', 'still', 'subdued', 'whispers'], // blasts
  'blatancy': ['discretion'], // blatancy
  'blatant': ['covert', 'discreet', 'hidden', 'mystery', 'nuanced', 'obscure', 'subtle', 'veiled'], // blatant
  'blazing': ['calm', 'cool', 'dimming', 'dull', 'faint', 'frosted-hue', 'mellow', 'pale', 'soft', 'subdued'], // blazing
  'bleak': ['bright', 'cheerful', 'colorful', 'festive', 'foliage', 'inviting', 'lush', 'optimistic', 'positive', 'rich', 'utopian', 'verdant', 'vibrancy', 'vibrant', 'vividness', 'warm'], // bleak
  'bleakness': ['brightness', 'color', 'fullness', 'joy', 'liveliness', 'richness', 'vibrance', 'vibrancy', 'warmth'], // bleakness
  'bleed': ['conceal', 'contain', 'heal', 'solidify', 'stabilize'], // Bleed
  'blend': ['divide', 'highlight', 'separate'], // blend
  'blended': ['chaotic', 'clashing', 'conflicting', 'contrasted', 'distinct', 'individual', 'pure', 'sharp', 'vivid'], // blended
  'blending': ['dividing', 'outlining'], // blending
  'blessing': ['misfortune'], // blessing
  'blight': ['brightness', 'flourish', 'nourish', 'prosperity', 'utopia', 'vitality'], // blight
  'blind': ['alert', 'aware', 'bright', 'clear', 'focused', 'led', 'luminous', 'sighted', 'sightful', 'visible'], // Blind
  'blinding': ['calm', 'dim', 'faint', 'gentle', 'muted', 'quiet', 'shading', 'soft', 'subtle'], // blinding
  'blindness': ['awareness', 'brightness', 'clarity', 'focus', 'insight', 'observation', 'perception', 'sight', 'vision'], // blindness
  'bliss': ['agony', 'anguish', 'heavy', 'pain', 'sorrow', 'torment'], // Bliss
  'blob': ['edge', 'line', 'point'], // Blob
  'blobby': ['clear', 'defined', 'firm', 'precise', 'sculpted', 'sharp', 'smooth', 'solid', 'structured'], // blobby
  'block': ['fluid', 'fringe', 'leak', 'open', 'spread', 'support', 'void'], // Block
  'blockage': ['catalyst', 'conduit', 'stream'], // blockage
  'blockchain': ['centralized', 'confined', 'isolated', 'linear', 'restricted'], // Blockchain
  'blocky': ['airy', 'curved', 'dynamic', 'fluid', 'light', 'organic', 'smooth', 'soft', 'tubular'], // blocky
  'bloom': ['decay', 'diminish', 'drown', 'fade', 'shrivel', 'wilt', 'wither'], // Bloom
  'blooming': ['withering'], // blooming
  'blotchy': ['clean', 'clear', 'crisp-white', 'neat', 'precise', 'smooth', 'solid', 'uniform'], // blotchy
  'blue': ['amber'], // blue
  'blunt': ['bright', 'clear', 'discretion', 'dynamic', 'engaging', 'expressive', 'intense', 'pointed', 'reflective', 'sharp', 'sheen', 'vibrant'], // blunt
  'blur': ['clear', 'defined', 'imprint', 'sharp'], // Blur
  'blurb': ['clarity', 'definition', 'focus', 'order', 'precision', 'sharpness', 'simplicity', 'structure', 'typesetting'], // blurb
  'blurred': ['clear', 'visible'], // blurred
  'blurriness': ['distinctness'], // blurriness
  'blurring': ['outlining'], // blurring
  'blurry': ['crisp', 'key'], // blurry
  'boarding': ['homecare', 'residential', 'travel', 'wilderness'], // Boarding
  'body': ['psyche'], // body
  'boiling': ['glacial'], // boiling
  'boisterous': ['calm', 'gentle', 'peaceful', 'quiet', 'reserved', 'soft', 'still', 'subdued', 'vulnerable-silence'], // boisterous
  'bokeh': ['bright', 'clear', 'crisp', 'defined', 'detailed', 'focused', 'sharp', 'vivid'], // Bokeh
  'bold': ['banal', 'bland', 'boring', 'cautious', 'drab', 'drain', 'dull', 'dullard', 'fading', 'faint', 'filtered', 'gentle', 'hesitant', 'hiding', 'humble', 'hushing', 'idle', 'introverted', 'lame', 'lethargic', 'mediocre', 'muffled', 'mundane', 'mute', 'neumorphic', 'pedestrian', 'plain', 'reserved', 'shy', 'stale', 'stifled', 'subduing', 'suppressed', 'tame', 'timid', 'washed', 'weak'], // Bold
  'bold-adventure': ['cautious'], // bold-adventure
  'boldness': ['hesitation'], // boldness
  'bond': ['detach', 'disengage', 'disperse', 'split'], // Bond
  'bondage': ['escape', 'expansive-freedom', 'flexible', 'fluid', 'freedom', 'liberation', 'open', 'release', 'unbound'], // bondage
  'bore': ['colorful', 'delight', 'dynamic', 'engage', 'excite', 'lively', 'motivate', 'stimulate', 'vibrant'], // bore
  'bored': ['active', 'curious', 'dynamic', 'engaged', 'excited', 'fascinated', 'interested', 'pleased', 'stimulated', 'vibrant'], // bored
  'boredom': ['animation', 'anticipation', 'curiosity', 'edutainment', 'engagement', 'enthusiasm', 'euphoria', 'excitement', 'fervor', 'hype', 'interest', 'joy', 'passion', 'stimulation', 'vibrancy', 'zeal'], // boredom
  'boring': ['adventurous', 'bold', 'captivating', 'colorful', 'dynamic', 'engaging', 'exciting', 'ingenuity', 'lively', 'stimulating', 'surprise', 'vibrant', 'whimsical-flow'], // Boring
  'botanical': ['geometric', 'industrial', 'mechanical', 'minimalist', 'synthetic', 'urban'], // Botanical
  'bottom': ['above', 'peak', 'summit', 'top', 'unbounded', 'up', 'upper'], // bottom
  'bound': ['detached', 'free', 'freedom', 'freeness', 'independent', 'loose', 'loosen', 'mobility', 'open', 'released', 'unbound', 'unconfined', 'unfettered', 'unformed', 'unfounded', 'ungrounded'], // bound
  'boundary': ['threshold'], // boundary
  'bounded': ['boundless', 'chaos', 'endless', 'endlessness', 'expansion', 'fluid', 'freedom', 'infinite', 'infinity', 'limitless', 'open', 'unbounded', 'uninterrupted', 'vague'], // bounded
  'boundless': ['bounded', 'finite', 'limit', 'limitation', 'limited', 'restricted'], // Boundless
  'boundless-exploration': ['limitation'], // boundless-exploration
  'bounty': ['deficiency', 'depletion', 'emptiness', 'lack', 'loss', 'poverty', 'scarcity', 'want'], // Bounty
  'boutique': ['basic', 'common', 'generic', 'industrial', 'mass', 'mass-market', 'monotonous', 'standard', 'uniform', 'wholesale'], // Boutique
  'boxy': ['aerodynamic', 'airy', 'asymmetrical', 'curvy', 'dynamic', 'fluid', 'light', 'organic', 'sphere'], // boxy
  'braided': ['flat', 'linear', 'smooth'], // Braided
  'branching': ['convergent', 'direct', 'linear'], // Branching
  'branding': ['anonymity', 'disorder', 'neglect', 'obscurity', 'simplicity', 'unmark'], // Branding
  'brash': ['calm', 'cautious', 'gentle', 'muted', 'quiet', 'reserved', 'shy', 'simple', 'soft', 'subtle'], // brash
  'brave': ['hiding', 'timid'], // brave
  'brazen': ['discretion'], // brazen
  'break': ['build', 'connect', 'create', 'establish', 'fix', 'loop', 'repeat', 'restore', 'strengthen', 'synthesize', 'unite', 'weave'], // break
  'breakdown': ['clarity', 'coherence', 'harmony', 'resilience', 'serenity', 'stability', 'strength', 'unity', 'wholeness'], // breakdown
  'breeze': ['burden', 'chaos', 'heaviness', 'heavyweight', 'pressure', 'storm', 'stress', 'tension', 'weight'], // breeze
  'breezy': ['certain', 'confined', 'dark', 'fixed', 'gloomy', 'heavy', 'ponderous', 'stale', 'static'], // breezy
  'brevity': ['lengthy', 'rambling', 'verbosity'], // brevity
  'brief': ['eternal', 'lengthy', 'lingering', 'perpetual'], // brief
  'bright': ['aimless', 'bitter', 'bleak', 'blind', 'blunt', 'bokeh', 'cloudy', 'cold', 'cumbersome', 'darkmode', 'despairing', 'dimming', 'dirt', 'dismal', 'dismissive', 'drag', 'drain', 'drained', 'dreary', 'dry', 'dull', 'dystopic', 'fall', 'foul', 'frayed', 'gothic', 'grim', 'grime', 'grungy', 'haunting', 'hushing', 'lethargic', 'matt', 'muddy', 'muffled', 'murky', 'mute', 'noir', 'obscuring', 'ochre', 'ominous', 'opaque', 'patina', 'pessimistic', 'repellent', 'reserved', 'rusty', 'shrouded', 'sluggish', 'smoky', 'somber', 'stale', 'weary'], // bright
  'brightness': ['blackout', 'bleakness', 'blight', 'blindness', 'coldness', 'darkness', 'dimness', 'dormancy', 'eclipse', 'evening', 'filth', 'fog', 'gloom', 'haze', 'mist', 'nocturn', 'shade', 'squalor', 'tunnel'], // brightness
  'brilliant': ['bland', 'dark', 'drab', 'dull', 'faded', 'flat', 'muted', 'subdued', 'void-spectrum'], // Brilliant
  'brisk': ['slow'], // brisk
  'brittle': ['ductile', 'flexible', 'malleable', 'resilient', 'robust', 'silk', 'soft', 'steel', 'sturdy', 'supple', 'velvet'], // Brittle
  'broad': ['micro', 'specific', 'thin'], // broad
  'broadening': ['narrowing'], // broadening
  'broken': ['cast', 'complete', 'dome', 'functional', 'intact', 'loop', 'solid', 'stable', 'unified', 'whole'], // broken
  'brushed': ['flat', 'glossy', 'polished', 'scratched', 'sleek', 'smooth'], // Brushed
  'brushstroke': ['clear', 'defined', 'digital', 'orderly', 'photographic', 'polished', 'precise', 'sharp', 'smooth', 'static', 'uniform'], // Brushstroke
  'brushwork': ['clean', 'flat', 'polished', 'smooth', 'uniform'], // Brushwork
  'brutal': ['delicate', 'elegant', 'feminine', 'gentle', 'humanist', 'literary', 'nouveau', 'poetic', 'pure', 'refined', 'romantic', 'soft', 'sweet', 'swiss', 'wholesome'], // brutal
  'brutalism': ['deco', 'elegant', 'fluid', 'ornate', 'refined', 'soft'], // Brutalism
  'brutalist': ['elegant', 'maximalist', 'traditional'], // Brutalist
  'brutality': ['art', 'craft', 'delicacy', 'elegance', 'grace', 'harmony', 'idyll', 'refinement'], // brutality
  'bubble': ['empty', 'flat', 'scatter', 'void', 'world'], // Bubble
  'build': ['break', 'collapse', 'damage', 'destroy', 'disassemble', 'erode', 'tear'], // build
  'building': ['destruction', 'dissolving', 'erasing', 'obliterating'], // building
  'bulge': ['flatten'], // bulge
  'bulk': ['petiteness'], // bulk
  'bulky': ['aerodynamic', 'petite', 'slender', 'thin'], // bulky
  'bump': ['even', 'flat', 'flatness', 'linear', 'plain', 'smooth', 'uniform'], // bump
  'bumpiness': ['smoothness'], // bumpiness
  'bumpy': ['even', 'flat', 'plain', 'slick', 'smooth', 'smoothness', 'steady', 'uniform'], // bumpy
  'burden': ['breeze', 'ease', 'flow', 'freedom', 'joy', 'levity', 'lightness', 'openness', 'pleasure', 'release', 'selfcare'], // burden
  'burdened': ['clear', 'easy', 'ethereal-lightness', 'free', 'light', 'open', 'pure', 'simple', 'unbound', 'unhurried', 'weightless'], // burdened
  'burdensome': ['carefree', 'easy', 'effortless', 'free', 'joyful', 'light', 'lightweight', 'simple', 'supportive', 'uplifting'], // burdensome
  'buried': ['overlook'], // buried
  'burnout': ['selfcare'], // burnout
  'burnt': ['calm', 'clear', 'cool', 'faint', 'frosted-blue', 'gentle', 'pale', 'soft', 'subtle'], // Burnt
  'burst': ['calm', 'contain', 'diminish', 'still', 'subdue'], // Burst
  'business': ['non-profit'], // business
  'bustling': ['calm', 'desolate', 'dormant', 'inactive', 'lethargic', 'quiet', 'serene', 'sluggish', 'still'], // bustling
  'busy': ['empty', 'lazy', 'leisurely', 'paused', 'rest', 'rural', 'simplify', 'untouched'], // busy
  'buzz': ['calm', 'empty', 'light', 'loose', 'quiet', 'silence', 'soft', 'still', 'void'], // buzz
  'cacophony': ['delicacy', 'harmony', 'melody', 'order', 'resonance', 'silence', 'silent', 'tranquility'], // cacophony
  'cage': ['freeness'], // cage
  'calculated': ['chaotic', 'imprecise', 'instinctive', 'irrational', 'random', 'spontaneous'], // Calculated
  'calculated-precision': ['imprecise'], // calculated-precision
  'calculation': ['arbitrary', 'imprecise', 'improvisation', 'instinct', 'intuition'], // calculation
  'callous': ['empathetic'], // callous
  'calm': ['aggressive', 'agitated', 'agitation', 'agony', 'anger', 'anguish', 'anti', 'anxiety', 'anxious', 'blaring', 'blasts', 'blazing', 'blinding', 'boisterous', 'brash', 'burnt', 'burst', 'bustling', 'buzz', 'chaotic', 'clamor', 'clatter', 'confront', 'din', 'dragged', 'dramatic', 'emotion', 'energetic', 'erupt', 'exaggeration', 'explosive', 'fear', 'feral', 'fierce', 'fiery', 'force', 'frantic', 'frenzied', 'frenzy', 'frustration', 'garish', 'harried', 'harsh', 'hasty', 'heated', 'heavy', 'hustle', 'hype', 'ignite', 'intensify', 'jarring', 'joy', 'jumbled', 'loud', 'messy', 'molten', 'motorsport', 'movement', 'murky', 'negation', 'noisy', 'overwrought', 'panic', 'plasma', 'postlude', 'punchy', 'racket', 'raucous', 'reckless', 'restless', 'risk', 'roars', 'roughness', 'rush', 'rushed', 'savage', 'scream', 'screaming', 'shouted', 'shouting', 'shouts', 'splash', 'staccato', 'steam', 'stimulation', 'storm', 'strenuous', 'stress', 'strident', 'struggle', 'sudden', 'tangle', 'tarnished', 'tense', 'thunders', 'tightened', 'torment', 'tumult', 'turbulence', 'turmoil', 'uneasy', 'unhinged', 'unruly', 'unsettled', 'unstable', 'unsteady', 'uproarious', 'urgent', 'velocity', 'volatile', 'vortex', 'war', 'warning', 'whirlwind', 'wild', 'wind', 'zesty'], // Calm
  'calmness': ['apprehension', 'exuberance'], // Calmness
  'camp': ['formal', 'minimal', 'restrained', 'serious', 'sober', 'subdued'], // Camp
  'camping': ['hotels'], // camping
  'candid': ['artificial', 'contrived', 'filtered', 'staged'], // Candid
  'canvas': ['absence', 'chaos', 'dispersal', 'emptiness', 'void'], // Canvas
  'capable': ['clumsy', 'inactive', 'incompetent', 'inept', 'limited', 'unable', 'unfit', 'weak'], // Capable
  'capricious': ['reliable'], // capricious
  'caps': ['bare', 'flat', 'minimal', 'naked', 'plain'], // Caps
  'captivating': ['bland', 'boring', 'dull', 'lackluster', 'mundane', 'ordinary', 'repelling', 'repulsive', 'tame', 'unappealing'], // captivating
  'captivity': ['expansive-freedom', 'exploration', 'freedom', 'liberation', 'openness', 'release', 'spontaneity', 'uncertainty', 'variability'], // captivity
  'capture': ['disperse', 'evade', 'forget', 'led', 'rendering'], // Capture
  'cardiology': ['orthodontics'], // Cardiology
  'care': ['cruelty', 'exploitation', 'malice', 'negligence', 'premium'], // Care
  'carefree': ['adulting', 'anxious', 'burdensome', 'cautious', 'grind', 'serious', 'studious', 'vigilance'], // carefree
  'careful': ['careless', 'hasty', 'negligent', 'reckless'], // careful
  'carefulness': ['sloppiness'], // carefulness
  'careless': ['attentive', 'careful', 'certain', 'considerate', 'deliberate', 'guarded', 'mindful', 'precise', 'premeditated', 'thoughtful'], // careless
  'carelessness': ['gravitas'], // carelessness
  'caring': ['selfish'], // caring
  'carousel': ['discrete', 'linear', 'minimalistic', 'static', 'stationary', 'tabs', 'underline'], // Carousel
  'cartoon': ['minimalism', 'realism', 'seriousness', 'sophistication', 'subtlety'], // Cartoon
  'cast': ['absorb', 'broken', 'chaotic', 'discard', 'flexible', 'fluid', 'partial', 'soft', 'uncertain'], // cast
  'casual': ['academia', 'adulting', 'arduous', 'ceremonial', 'clinical', 'formal', 'formality', 'grind', 'horology', 'impersonal', 'investigative', 'official', 'pretentious', 'stiff'], // Casual
  'casual-chaos': ['formality'], // casual-chaos
  'casual-chic': ['pretentious', 'stuffy'], // casual-chic
  'casual-collection': ['elite'], // casual-collection
  'catalog': ['chaos', 'disorder', 'randomness'], // Catalog
  'catalyst': ['blockage', 'halt', 'impediment', 'inhibitor', 'obstruction', 'passive', 'resistance', 'stagnant', 'stagnation', 'static'], // Catalyst
  'categorization': ['chaos', 'disorder', 'dispersal'], // Categorization
  'catering': ['abandon', 'chaos', 'disorder', 'diy', 'lack', 'manufacturing', 'mess', 'neglect', 'restaurant', 'retail', 'scarcity', 'simple'], // Catering
  'caution': ['hasty', 'heavy', 'reckless'], // Caution
  'cautious': ['adventurous', 'audacious', 'bold', 'bold-adventure', 'brash', 'carefree', 'daring', 'fearless', 'impulsive', 'reckless'], // cautious
  'cease': ['remain', 'repeat'], // cease
  'celebrate': ['dismiss'], // celebrate
  'celebrated': ['ignored'], // celebrated
  'celebration': ['despair', 'detachment', 'disapproval', 'disorder', 'memorial', 'mourning', 'ridicule', 'shame', 'sorrow'], // Celebration
  'celebrity': ['anonymity', 'humility', 'obscurity', 'ordinariness', 'simplicity', 'unknown'], // Celebrity
  'celestial': ['chthonic', 'earthly', 'grounded', 'mundane', 'subterranean', 'terrestrial'], // Celestial
  'cellular': ['centralized', 'fixed', 'simple', 'solid', 'stable', 'static', 'uniform'], // Cellular
  'center': ['drift', 'horizon', 'scatter', 'sidebar', 'swirl'], // center
  'centered': ['asymmetrical', 'cluttered', 'disorder', 'dispersed', 'distracted', 'editorial', 'music', 'offbeat', 'screen', 'unbalanced', 'ungrounded'], // Centered
  'central': ['peripheral', 'tangential'], // central
  'centrality': ['asymmetrical', 'asymmetry', 'decentralization', 'decentralized', 'disorder', 'dispersion', 'editorial', 'periphery', 'screen'], // Centrality
  'centralized': ['blockchain', 'cellular', 'decentralized', 'dispersed', 'distributed', 'fragmented', 'obscured', 'scattered', 'scroll', 'spread'], // Centralized
  'centric': ['fringe', 'marginal', 'peripheral', 'scroll'], // Centric
  'ceramic': ['flesh', 'glass', 'metal', 'plastic'], // Ceramic
  'cerebral': ['chaotic', 'emotional', 'impulsive', 'instinctive', 'intuitive', 'scatterbrained'], // Cerebral
  'ceremonial': ['casual'], // Ceremonial
  'certain': ['ambiguous', 'breezy', 'careless', 'clatter', 'clueless', 'confused', 'corrupt', 'delay', 'delayed', 'doubtful', 'false', 'fictional', 'flighty', 'fugitive', 'fumble', 'hesitant', 'hollow', 'imaginary', 'imprecise', 'lost', 'nebulous', 'nowhere', 'peripheral', 'sealed', 'subjective', 'uncertain', 'uncertainty', 'unchanged', 'unfounded', 'unknown', 'unreliable', 'unsettled', 'unsteady', 'vacant', 'vague'], // certain
  'certainty': ['confusion', 'contradiction', 'deceit', 'denial', 'discomfort', 'doubt', 'doubting', 'falsehood', 'fluke', 'hesitation', 'hypothesis', 'ignorance', 'impotence', 'limbo', 'liminality', 'myth', 'paradox', 'possibility', 'risk', 'vacuum', 'waver', 'whirlwind'], // certainty
  'cgi': ['basic', 'handmade', 'imperfect', 'natural', 'organic', 'primitive', 'raw', 'rough', 'simple', 'unrefined'], // CGI
  'ch-teau-style': ['rebel'], // ch-teau-style
  'challenge': ['comfort', 'ease', 'simplicity'], // Challenge
  'challenges': ['solutions'], // Challenges
  'challenging': ['clear', 'easy', 'gentle', 'light', 'pleasant', 'simple', 'smooth', 'soft'], // Challenging
  'change': ['constancy', 'fixity'], // change
  'changeable': ['permanent', 'unchanging'], // changeable
  'changing': ['constant'], // changing
  'chaos': ['academia', 'aesthetics', 'aether', 'algorithm', 'align', 'analysis', 'analytics', 'anatomy', 'anchored', 'annotation', 'approval', 'archetype', 'architecture', 'art', 'ascendancy', 'atmosphere', 'aura', 'authority', 'axis', 'beauty', 'bind', 'bounded', 'breeze', 'canvas', 'catalog', 'categorization', 'catering', 'childcare', 'circuit', 'classicism', 'climate', 'coding', 'command', 'completion', 'composure', 'conception', 'conquer', 'consensus', 'consequence', 'consolidate', 'constancy', 'constellation', 'constraint', 'consulting', 'context', 'contour', 'corner', 'cosmos', 'craft', 'craftsmanship', 'cubism', 'dashboard', 'dentistry', 'depiction', 'discipline', 'domain', 'earth', 'eco-tech', 'economy', 'ecosystem', 'edtech', 'education', 'edutainment', 'efficacy', 'element', 'engineering', 'equilibrium', 'fact', 'field', 'finality', 'finance', 'fixation', 'fixity', 'flowchart', 'focused', 'formation', 'fortitude', 'foundation', 'frame', 'framework', 'functionalism', 'globe', 'government', 'grading', 'healthtech', 'hierarchy', 'horology', 'hud', 'idyll', 'industry', 'integrity', 'interpretation', 'lattice', 'line', 'literary', 'logic', 'logistics', 'lucidity', 'marketing', 'mastery', 'matrix', 'meaning', 'measure', 'mechanism', 'method', 'microcosm', 'minimize', 'modelling', 'module', 'molecular', 'monoculture', 'monopoly', 'mosaic', 'museum', 'nodes', 'normalcy', 'nucleus', 'obedience', 'optimization', 'orbit', 'order', 'outlining', 'pattern', 'payments', 'planning', 'point', 'polygon', 'principle', 'productivity', 'proportion', 'publishing', 'purity', 'purpose', 'pyramid', 'realm', 'rectilinear', 'regulation', 'relaxation', 'resolve', 'restraint', 'restriction', 'rhythm', 'richness', 'ritual', 'rows', 'safety', 'sameness', 'sanctuary', 'scholarship', 'script', 'selfcare', 'sense', 'settle', 'shape', 'sightful', 'signal', 'solidify', 'solutions', 'source', 'sparsity', 'stability', 'stillness', 'stratosphere', 'synchronicitic', 'synchronicitical', 'systems', 'tranquility', 'typecraft', 'unify', 'unison', 'units', 'utopia', 'vacuum', 'watches', 'watchmaking', 'whisper', 'winery', 'world', 'zen'], // Chaos
  'chaotic': ['ai', 'ambient', 'automated', 'bakery', 'bauhaus', 'behavioral', 'bistro', 'blended', 'calculated', 'calm', 'cast', 'cerebral', 'charted', 'chill', 'clinical', 'coded', 'coherent', 'columnar', 'compliant', 'concentrated', 'concreteness', 'constant', 'cultivated', 'decisive', 'deeptech', 'definite', 'deliberate', 'depictive', 'discretion', 'doctrinal', 'easy', 'enclosed', 'exact', 'factory', 'filtered', 'fintech', 'flawless', 'formality', 'formed', 'functionalist', 'harmonic', 'hotels', 'hushing', 'intact', 'integrated', 'japandi', 'labeled', 'led', 'leisurely', 'level', 'logical', 'mechanic', 'mechanical', 'mellow', 'methodical', 'modelling', 'mono', 'neat', 'nordic', 'normal', 'obedient', 'parametric', 'pastoral', 'peace', 'peaceful', 'perfect', 'planned', 'pleasant', 'practical', 'predefined', 'predetermined', 'predictable', 'premeditated', 'prime', 'procedural', 'rational', 'reassuring', 'regression', 'regulated', 'remote', 'reserved', 'resolved', 'rest', 'restrained', 'robotic', 'robotics', 'rooted', 'rural', 'sane', 'scheduled', 'scholarly', 'scientific', 'seamless', 'sequential', 'serene', 'serious', 'settled', 'simplify', 'simplifying', 'sober', 'solidity', 'spotless', 'square', 'stability', 'staged', 'steadfast', 'sterile', 'stoic', 'storyful', 'strategic', 'structural', 'studious', 'swiss', 'symbolism', 'symphonic', 'synchronized', 'tame', 'techno-futurism', 'technographic', 'techwear', 'unchanged', 'unhurried', 'unified', 'uniform', 'uninterrupted', 'utilitarian', 'utopian', 'wash', 'xr'], // Chaotic
  'chaotic-abundance': ['limit'], // chaotic-abundance
  'charge': ['retreat'], // charge
  'charity': ['malice'], // charity
  'charming': ['repelling'], // charming
  'charted': ['ambiguous', 'chaotic', 'disordered', 'fluid', 'improvised', 'random', 'uncertain', 'uncharted-terrain', 'vague'], // charted
  'cheap': ['elite', 'exclusive', 'expensive', 'lavish', 'luxury', 'opulent', 'premium', 'refined', 'sophisticated', 'wealth'], // cheap
  'cheer': ['gloom', 'heavy'], // Cheer
  'cheerful': ['bitter', 'bleak', 'dismal', 'drag', 'drain', 'dreary', 'gothic', 'grim', 'haunting', 'ominous', 'pessimistic', 'solemn', 'somber', 'stern'], // cheerful
  'cheerfulness': ['dimness'], // cheerfulness
  'cherish': ['despise', 'disapproval', 'disdain', 'dislike', 'neglect'], // cherish
  'cherished': ['disposable', 'forgotten'], // cherished
  'cherishing': ['apathy', 'betrayal', 'despair', 'detachment', 'disdain', 'disdainful', 'dismissive', 'indifferent', 'neglecting'], // cherishing
  'chiaroscuro': ['flat', 'minimalistic', 'plain', 'uniform'], // Chiaroscuro
  'chic': ['awkwardness', 'clumsy', 'crude', 'frumpy', 'tacky'], // Chic
  'childcare': ['abandon', 'academic', 'adult-services', 'chaos', 'corporate', 'detachment', 'disorder', 'elderly-care', 'ignorance', 'indifference', 'neglect'], // Childcare
  'childhood': ['adulthood', 'adulting', 'independence', 'maturity', 'responsibility', 'seriousness'], // Childhood
  'childless': ['motherhood'], // childless
  'childlike': ['adult', 'mature', 'serious', 'sophisticated'], // Childlike
  'chill': ['active', 'aggressive', 'agitated', 'chaotic', 'frantic', 'heat', 'intense', 'melt', 'tense'], // Chill
  'chilled-contrast': ['heated'], // chilled-contrast
  'chipped': ['complete', 'polished', 'refined', 'smooth', 'whole'], // Chipped
  'chore': ['hobby'], // chore
  'chromatic': ['achromatic', 'monochrome', 'neutral'], // Chromatic
  'chronicle': ['premium', 'whirlwind'], // Chronicle
  'chronos': ['aion', 'eternal', 'eternity', 'evanescent', 'infinity', 'timelessness', 'void'], // Chronos
  'chthonic': ['celestial', 'ethereal', 'transcendent'], // Chthonic
  'chunky': ['minimal', 'refined', 'sleek', 'streamlined', 'thin'], // Chunky
  'cinematic': ['documentary', 'minimal', 'mundane', 'ordinary', 'static'], // Cinematic
  'cinematography': ['led', 'photography', 'rendering'], // Cinematography
  'circle': ['angle', 'corner', 'line', 'point', 'rectangle', 'square'], // Circle
  'circuit': ['chaos', 'disorder', 'fluidity', 'organic', 'random'], // Circuit
  'circuitous': ['direct', 'linear', 'linear-path', 'simple', 'straight'], // circuitous
  'circular': ['angular', 'linear', 'octagonal', 'pointed', 'straight'], // Circular
  'civilization': ['wilderness'], // civilization
  'civilized': ['terrain'], // civilized
  'clamor': ['calm', 'clarity', 'harmony', 'order', 'serenity', 'silence', 'silent', 'simplicity', 'stillness'], // clamor
  'clamping': ['unfolding'], // clamping
  'clarify': ['muffle', 'vacate'], // clarify
  'clarifying': ['diluting'], // clarifying
  'clarity': ['absence', 'absurdity', 'abyss', 'aura', 'awkwardness', 'blackout', 'blindness', 'blurb', 'breakdown', 'clamor', 'complexity', 'complication', 'confusion', 'contradiction', 'darkness', 'deceit', 'denial', 'dimness', 'discomfort', 'disempowerment', 'disguise', 'disillusion', 'disorder', 'distortion', 'dream', 'eclipse', 'emission', 'erasure', 'filth', 'fog', 'foolishness', 'fuzz', 'fuzzy', 'glitch', 'gloom', 'guilt', 'hassle', 'haze', 'heavy', 'idiosyncrasy', 'ignorance', 'illusion', 'imposition', 'impotence', 'impression', 'impressionist', 'insignificance', 'interference', 'jumble', 'limbo', 'mess', 'mismatch', 'mist', 'muddle', 'myth', 'narrowness', 'nebula', 'nocturn', 'obliteration', 'oblivion', 'obscurity', 'obsolescence', 'obstacle', 'paradox', 'pixelation', 'pollution', 'postlude', 'pressure', 'scribble', 'silhouette', 'sloppiness', 'stupidity', 'subjectivity', 'superimposition', 'surrealism', 'tumult', 'vacuum', 'verbosity'], // Clarity
  'clash': ['sameness'], // clash
  'clashing': ['blended', 'harmonic'], // clashing
  'classic': ['faddish', 'new', 'nouveau', 'retrofuturism', 'streetwear'], // classic
  'classic-integrity': ['faddish'], // classic-integrity
  'classical': ['jazz'], // Classical
  'classicism': ['chaos', 'deconstructivist', 'disorder', 'eclectic', 'experimental', 'grunge', 'memphis', 'modern', 'postmodernism'], // Classicism
  'classy': ['tacky'], // classy
  'clatter': ['calm', 'certain', 'cohesive', 'orderly', 'quiet', 'smooth', 'steady', 'understated-tranquility', 'unified'], // clatter
  'clean': ['blotchy', 'brushwork', 'dirt', 'dust', 'fussy', 'gothic', 'grime', 'grungy', 'impure', 'mess', 'messy', 'muddy', 'murky', 'ochre', 'painterly', 'patina', 'polluted', 'pulp', 'rusty', 'shifty', 'sloppy', 'smeared', 'splat', 'toxic', 'waste'], // clean
  'clean-cut': ['ragged'], // clean-cut
  'cleanliness': ['baroque', 'cluttered', 'disorder', 'filth', 'fuzz', 'grime', 'grunge', 'maximalism', 'messy', 'ruin', 'squalor'], // Cleanliness
  'clear': ['aftermath', 'aimless', 'awkward', 'blind', 'blobby', 'blotchy', 'blunt', 'blur', 'blurred', 'bokeh', 'brushstroke', 'burdened', 'burnt', 'challenging', 'closed', 'cloudy', 'clueless', 'concealed', 'concealing', 'conflicted', 'confused', 'confusing', 'corrupt', 'crooked', 'darkmode', 'deceptive', 'despairing', 'diffused', 'dirt', 'distorted', 'doubtful', 'dust', 'enigmatic', 'extraneous', 'false', 'flicker', 'flood', 'foolish', 'fraudulent', 'frayed', 'fugitive', 'fumble', 'fuzzy', 'grim', 'grime', 'harried', 'hazy', 'hesitant', 'illogical', 'illusory', 'imprecise', 'impure', 'incomplete', 'indistinct', 'intangible', 'interstitial', 'invisible', 'jumbled', 'labyrinthine', 'lost', 'masked', 'muddy', 'muffled', 'murky', 'mysterious', 'nebulous', 'neumorphic', 'noisy', 'nowhere', 'numb', 'oblique', 'obscured', 'obscuring', 'opaque', 'pixelation', 'polluted', 'rambling', 'roughness', 'scatterbrained', 'scratched', 'scrawl', 'sealed', 'serpentine', 'shifty', 'shroud', 'shrouded', 'smeared', 'smoky', 'splash', 'splotchy', 'storm', 'strange', 'stuffy', 'subduing', 'subsurface', 'suppressed', 'symbolic', 'tainted', 'tangle', 'toxic', 'twist', 'twisted', 'uncertain', 'unchanged', 'unfocused', 'unhinged', 'unknown', 'vague', 'veiled', 'veiling', 'viscous', 'wavering'], // Clear
  'climate': ['chaos', 'disorder', 'instability', 'randomness', 'rupture'], // Climate
  'climb': ['plummet'], // climb
  'clinging': ['fleeing'], // clinging
  'clinical': ['casual', 'chaotic', 'homely', 'intuitive', 'organic', 'romantic', 'warm'], // Clinical
  'cloak': ['uncover'], // cloak
  'cloistered': ['accessible', 'dispersed', 'exposed', 'open'], // Cloistered
  'closed': ['begin', 'clear', 'empty', 'expose', 'free', 'frontier', 'open', 'openness', 'start', 'unfold'], // closed
  'closeness': ['alienation', 'detachment', 'disconnection', 'distance', 'estrangement', 'isolation', 'loneliness', 'remoteness', 'separation'], // closeness
  'closing': ['connection', 'continuity', 'eternity', 'expansion', 'growth', 'opening', 'permanence', 'presence', 'unfolding'], // closing
  'closure': ['beginning', 'expanse', 'openness', 'passage', 'portal', 'prelude', 'vastness'], // closure
  'cloud': ['ground', 'solid', 'static'], // Cloud
  'cloudy': ['bright', 'clear', 'dry', 'gleaming', 'open', 'sharp', 'solid', 'sunny', 'vivid'], // cloudy
  'clueless': ['aware', 'certain', 'clear', 'expertise', 'focused', 'informed', 'insightful', 'knowledgeable', 'sharp'], // clueless
  'clumsiness': ['delicacy', 'expertise'], // clumsiness
  'clumsy': ['capable', 'chic', 'coordinated', 'elegant', 'ergonomic', 'feminine', 'flawless', 'graceful', 'perceptive', 'polished', 'refined', 'skillful', 'swift'], // clumsy
  'clunky': ['aerodynamic', 'elegant', 'refined', 'sleek', 'streamlined'], // clunky
  'cluster': ['disperse', 'scatter'], // cluster
  'clustered': ['detached', 'dispersal', 'dispersed', 'isolated', 'scattered', 'separated'], // Clustered
  'clustering': ['disorder', 'dispersion', 'minimalistic', 'sparse', 'symmetry'], // Clustering
  'clutter': ['aesthetics', 'beauty', 'proportion', 'transparency', 'whisper', 'zen'], // clutter
  'cluttered': ['accessible', 'aero', 'arrangement', 'array', 'basic', 'basis', 'centered', 'cleanliness', 'complex', 'composition', 'constellation', 'curated', 'dashboard', 'diorama', 'efficiency', 'essentialism', 'fintech', 'focused', 'japandi', 'minimalism', 'minimalistic', 'neat', 'nexus', 'ordered', 'organized', 'poetic', 'prestige', 'pristine', 'pure', 'resonance', 'simple', 'simplify', 'simplifying', 'streamline', 'tabs', 'uninterrupted', 'untouched', 'wholesome'], // cluttered
  'coarse': ['fine', 'plush', 'polished', 'powder', 'refined', 'silk', 'sleek', 'slick', 'smooth', 'soft', 'supple', 'velvet', 'watchmaking', 'yielding'], // Coarse
  'coarseness': ['smoothness'], // coarseness
  'coastal': ['industrial', 'urban'], // Coastal
  'coda': ['prelude'], // coda
  'coded': ['chaotic', 'fluid', 'natural', 'organic', 'spontaneous'], // Coded
  'coding': ['art', 'chaos', 'disorder', 'improvisation', 'spontaneity'], // Coding
  'coexistence': ['conflict', 'detachment', 'isolation'], // Coexistence
  'cognition': ['premium'], // Cognition
  'cohere': ['collapse', 'separate'], // cohere
  'coherence': ['breakdown', 'confusion', 'contradiction', 'dissipation', 'mismatch', 'muddle', 'paradox'], // coherence
  'coherent': ['anarchic', 'awkward', 'chaotic', 'confused', 'confusing', 'disarrayed', 'disjoint', 'disjointed', 'disordered', 'disorderly', 'disorganized', 'fragmented', 'haphazard', 'illogical', 'impure', 'incoherent', 'interstitial', 'jumbled', 'postmodernism', 'random', 'scattered'], // coherent
  'cohesion': ['detachment', 'disorder', 'dispersal', 'disunity', 'fragmentation', 'obliterating'], // Cohesion
  'cohesive': ['clatter', 'conflicted', 'deconstructed', 'deconstructivism', 'discordant', 'disjointed', 'disparate', 'dividing', 'divisive', 'interrupted', 'jarring', 'scrap', 'segmented', 'sprawl', 'sprawled'], // cohesive
  'coil': ['flat', 'linear', 'rigid', 'solid', 'straight'], // Coil
  'cold': ['baked', 'bright', 'cozy', 'empathetic', 'fiery', 'fullness', 'heat', 'heated', 'homely', 'hot', 'humanist', 'ignited', 'intimate', 'lively', 'molten', 'pillow', 'radiant', 'romantic', 'soulful', 'sunny', 'vivid', 'warm'], // cold
  'coldness': ['brightness', 'comfort', 'empathy', 'enthusiasm', 'intimacy', 'joy', 'life', 'passion', 'vibrancy', 'warmth'], // coldness
  'collaboration': ['detachment', 'disunity', 'isolation', 'monopoly'], // Collaboration
  'collaborative': ['detached', 'disjointed', 'exclusive', 'individual', 'isolated', 'isolating', 'isolationist', 'lonely', 'separate', 'solitary'], // collaborative
  'collage': ['led'], // Collage
  'collapse': ['arch', 'ascendancy', 'build', 'cohere', 'connect', 'expand', 'integrate', 'scaffold', 'solidify', 'strength', 'strengthen', 'unify', 'victory'], // collapse
  'collect': ['disband', 'discard', 'isolate'], // collect
  'collective': ['divisive', 'individual', 'singular', 'solitary'], // Collective
  'collectivism': ['autonomy', 'detachment', 'independence', 'individualism', 'isolation', 'self-reliance', 'solitude'], // Collectivism
  'color': ['bleakness'], // color
  'colorful': ['barren', 'bland', 'bleak', 'bore', 'boring', 'colorless', 'drab', 'drain', 'dry', 'dull', 'dullard', 'insipid', 'lame', 'lifeless', 'monochrome', 'monotonous', 'mute', 'muted', 'nocturn', 'ordinary', 'plain', 'sober', 'stale', 'tedious', 'unchanged'], // Colorful
  'colorless': ['colorful', 'saturated', 'vivid'], // Colorless
  'colossal': ['diminutive', 'small', 'tiny'], // colossal
  'columnar': ['chaotic', 'fluid', 'irregular', 'organic', 'random'], // Columnar
  'combine': ['disassemble', 'divide', 'isolate', 'separate', 'split'], // combine
  'combined': ['segregated'], // combined
  'combining': ['dividing'], // combining
  'comfort': ['agony', 'anguish', 'challenge', 'coldness', 'discomfort', 'dissatisfaction', 'hassle', 'heavy', 'pain', 'panic', 'sorrow', 'strain', 'stress', 'struggle', 'torment', 'warning'], // Comfort
  'comfortable': ['numb', 'uneasy'], // comfortable
  'comic': ['minimal', 'serious', 'sophisticated', 'stoic'], // Comic
  'command': ['anarchy', 'chaos', 'decentralization', 'disorder', 'informal'], // Command
  'commencement': ['finale'], // commencement
  'commercial': ['artistic', 'experimental', 'indie', 'non-profit', 'nonprofit', 'residential'], // Commercial
  'commercial-aesthetics': ['anti'], // commercial-aesthetics
  'commercial-chic': ['grungy'], // commercial-chic
  'commit': ['resign', 'vacate', 'waver'], // commit
  'commitment': ['abandon', 'abandonment', 'freetime'], // commitment
  'commodity': ['art', 'deeptech', 'individual', 'rare', 'unique', 'watchmaking'], // Commodity
  'common': ['alien', 'apex', 'atypical', 'boutique', 'distinct', 'distinction', 'elite', 'exceptional', 'exclusive', 'exotic', 'extraordinary', 'fame', 'famous', 'gourmet', 'incomplete', 'individual', 'lofty', 'majestic', 'mystic', 'mythic', 'novel', 'personalized', 'prime', 'private', 'rare', 'singular', 'special', 'stellar', 'uncommon', 'unfamiliar', 'unique', 'uniqueness', 'vanguard', 'yachting'], // common
  'commonality': ['exclusivity'], // commonality
  'communal': ['isolating', 'premium'], // Communal
  'communication': ['premium'], // Communication
  'communicative': ['nonverbal'], // communicative
  'community': ['exile', 'premium', 'solitude'], // Community
  'compact': ['flaky', 'loosen', 'porous', 'sprawl', 'sprawled', 'spread'], // compact
  'companion': ['exclusion', 'isolation', 'separation', 'solitude'], // Companion
  'companionship': ['anonymity', 'independence', 'isolation', 'solitude'], // Companionship
  'compassion': ['cruelty', 'heavy', 'scorn'], // Compassion
  'competence': ['heavy', 'lost'], // Competence
  'competent': ['amateur'], // competent
  'competition': ['monopoly'], // competition
  'complacency': ['ambition', 'urgent', 'vigilance', 'zeal'], // complacency
  'complacent': ['active', 'alert', 'aware', 'curious', 'driven', 'dynamic', 'engaged', 'responsive', 'vigilant'], // complacent
  'complacent-serenity': ['agitation'], // complacent-serenity
  'complementary': ['disparate', 'saturation', 'tones'], // Complementary
  'complete': ['broken', 'chipped', 'deconstructed', 'empty', 'flawed', 'folded', 'fracture', 'fragmented', 'incomplete', 'incomplete-can-be-replaced-with-unfinished-for-better-mutual-exclusivity', 'interrupted', 'leak', 'partial', 'scrap', 'tear', 'vacant'], // complete
  'complete-manifestation': ['incomplete', 'vacant'], // complete-manifestation
  'completeness': ['absence', 'flaw', 'fragmentation', 'glimpse', 'imperfection', 'liminality'], // completeness
  'completing': ['obliterating'], // completing
  'completion': ['absence', 'chaos', 'deconstruction', 'disarray', 'disruption', 'fragment', 'incompletion', 'journey', 'limbo', 'neglect', 'quest', 'suspension', 'void', 'yearning'], // completion
  'complex': ['accessible', 'array', 'artless', 'base', 'basic', 'binary', 'blank', 'cluttered', 'easy', 'essentialism', 'lightweight', 'minimalism', 'minimalistic', 'mono', 'naive', 'null', 'obvious', 'plain', 'primitive', 'pure', 'relatable', 'rudimentary', 'simple', 'simplify', 'single', 'straightforward', 'streamline', 'tabs', 'trivial'], // complex
  'complexity': ['clarity', 'flattening', 'fleshless', 'lucidity', 'minimize', 'monoculture', 'neat', 'order', 'simplicity', 'singularity', 'sparsity'], // Complexity
  'compliance': ['rebellion', 'resistance'], // compliance
  'compliant': ['chaotic', 'contrary', 'defiant', 'disorderly', 'nonconformist', 'rebellious', 'resistant', 'unruly'], // compliant
  'complicate': ['simplify'], // complicate
  'complicating': ['simplifying'], // complicating
  'complication': ['balance', 'clarity', 'ease', 'harmony', 'simplicity', 'solutions', 'unity'], // complication
  'composed': ['frantic', 'heavy'], // Composed
  'compositing': ['illustration', 'isolate', 'led', 'photography'], // Compositing
  'composition': ['cluttered', 'disheveled', 'disorder', 'disorganized', 'display', 'docs', 'drawer', 'drop', 'effects', 'elegant', 'elements', 'experimental', 'fashion', 'font', 'fonts', 'header', 'image', 'interactions', 'interactive', 'light', 'like', 'loading', 'luxurious', 'magazine', 'measurement', 'menu', 'messy', 'minimalistic', 'modal', 'modern', 'monospace', 'music', 'old', 'page', 'portfolio', 'product', 'random', 'sophisticated', 'space', 'spacious', 'states', 'static', 'timeline', 'ui', 'underline'], // Composition
  'composure': ['agitation', 'apprehension', 'chaos', 'confusion', 'disorder', 'distress', 'panic', 'restlessness', 'turmoil', 'unrest'], // composure
  'compress': ['magnify'], // compress
  'compressed': ['unhurried'], // compressed
  'compressing': ['diffusing', 'expanding', 'freeing', 'loosening', 'releasing', 'spreading', 'unfolding'], // compressing
  'compression': ['expansion'], // compression
  'computational': ['artisan', 'improvised', 'intuitive', 'natural', 'organic', 'spontaneous'], // Computational
  'computing': ['premium'], // Computing
  'conceal': ['bleed', 'trace', 'uncover', 'unveiling'], // conceal
  'concealed': ['aerial', 'apparent', 'clear', 'exposed', 'manifest', 'obvious', 'open', 'publishing', 'revealed', 'transparency', 'visible'], // concealed
  'concealing': ['clear', 'displaying', 'exposing', 'obvious', 'open', 'revealing', 'showing', 'transparent', 'unfolding'], // concealing
  'concealment': ['exposure', 'glimpse', 'revelation', 'self-expression', 'unveiling', 'visualization'], // Concealment
  'concentrate': ['disperse'], // concentrate
  'concentrated': ['chaotic', 'diffuse', 'diffused', 'dispersed', 'dispersed-tone', 'distracted', 'loose', 'random', 'scattered', 'uncertain', 'vague'], // Concentrated
  'concentrating': ['diluting', 'dissolving'], // concentrating
  'concentration': ['diffusion', 'dissipation'], // concentration
  'concentricity': ['asymmetry', 'decentralization', 'disorder', 'dispersion', 'eccentricity'], // Concentricity
  'conception': ['chaos', 'disorder', 'disruption', 'emptiness', 'fragmentation', 'void'], // Conception
  'conceptual': ['literal', 'pictorial', 'practical', 'traditional'], // Conceptual
  'conceptual-formalism': ['wacky'], // conceptual-formalism
  'concise': ['extraneous', 'rambling'], // concise
  'conciseness': ['verbosity'], // conciseness
  'conclusion': ['hypothesis', 'prelude'], // conclusion
  'concord': ['contradiction', 'deceit', 'disunity', 'harmonic-clash'], // Concord
  'concrete': ['abstraction', 'airy', 'astral', 'biophilic', 'disembodiment', 'dreamlike', 'endless', 'ethereal', 'flexible', 'fluid', 'freeform', 'imaginary', 'intangible', 'light', 'mystic', 'natural', 'organic', 'rural', 'soft', 'spirit', 'theoretical', 'vague', 'virtual', 'wood'], // concrete
  'concreteness': ['abstract', 'chaotic', 'disjointed', 'fleeting', 'fluid', 'imagination', 'incoherent', 'indeterminate', 'liminality', 'vague'], // concreteness
  'condensed': ['serif'], // Condensed
  'conduit': ['blockage', 'disconnection', 'obstruction'], // Conduit
  'confidence': ['apprehension', 'discomfort', 'disillusion', 'distrust', 'doubt', 'doubting', 'fear', 'guilt', 'heavy', 'hesitation', 'shame'], // Confidence
  'confident': ['awkward', 'backward', 'confused', 'doubtful', 'gentle', 'hesitant', 'humble', 'muted', 'shy', 'timid', 'uncertain', 'understated', 'uneasy', 'vacant', 'vulnerable'], // Confident
  'confine': ['expand', 'freeness'], // confine
  'confined': ['blockchain', 'breezy', 'freeform', 'limitless', 'unbound', 'unconfined', 'unformed', 'unfounded', 'unhurried', 'unified', 'uninterrupted', 'unsteady', 'untamed', 'vast'], // confined
  'confinement': ['escape', 'expanse', 'expansion', 'freedom', 'liberation', 'openness', 'release', 'vastness', 'vista'], // Confinement
  'confining': ['airy', 'expansive', 'fluid', 'free', 'liberated', 'open', 'unbound', 'unfolding', 'vast'], // confining
  'confirming': ['diluting'], // confirming
  'conflict': ['accord', 'agreement', 'alignment', 'balance', 'coexistence', 'consensus', 'cooperation', 'harmony', 'peace', 'symbiosis', 'unify', 'unity'], // conflict
  'conflicted': ['clear', 'cohesive', 'direct', 'effortless', 'focused', 'harmonious', 'resolved', 'settled', 'simple', 'unified'], // conflicted
  'conflicting': ['blended', 'harmonic'], // conflicting
  'conform': ['disrupt', 'diverge', 'individual', 'innovate', 'nonconform', 'unique'], // conform
  'conformist': ['anarchic', 'defiant', 'rebel'], // conformist
  'conformity': ['asymmetry', 'autonomy', 'counterculture', 'creativity', 'customization', 'discovery', 'diversity', 'idiosyncrasy', 'lifestyle', 'nonconformity', 'quest', 'rebellion', 'redefinition', 'reinvention', 'resistance', 'self-expression', 'surrealism', 'uniqueness'], // conformity
  'confront': ['accept', 'avoid', 'calm', 'embrace', 'escape', 'evade', 'gentle', 'harmony', 'peace', 'retreat', 'surrender'], // confront
  'confused': ['certain', 'clear', 'coherent', 'confident', 'direct', 'focused', 'identified', 'literacy', 'logical', 'lucid', 'sane', 'simple', 'understood'], // confused
  'confusing': ['clear', 'coherent', 'defined', 'direct', 'focused', 'informative', 'organized', 'simple', 'simplifying', 'straightforward'], // confusing
  'confusion': ['annotation', 'belief', 'certainty', 'clarity', 'coherence', 'composure', 'depiction', 'edutainment', 'efficacy', 'flowchart', 'focus', 'fortitude', 'harmony', 'insight', 'integrity', 'interpretation', 'lucidity', 'marketing', 'meaning', 'messaging', 'method', 'objectivity', 'order', 'outlining', 'resolve', 'scholarship', 'sense', 'signal', 'simplicity', 'solutions', 'statement', 'understanding', 'vision', 'visualization'], // confusion
  'conglomerating': ['dividing', 'isolating', 'simplifying'], // conglomerating
  'connect': ['alienation', 'break', 'collapse', 'detachment', 'disassemble', 'disconnect', 'disunity', 'divide', 'division', 'estrangement', 'evade', 'isolate', 'isolation', 'separate', 'separation', 'split', 'tear'], // connect
  'connected': ['absent', 'detached', 'disjoint', 'disjointed', 'distant', 'divisive', 'fracture', 'segregated', 'tightened'], // connected
  'connectedness': ['detachment', 'disconnection', 'isolation'], // Connectedness
  'connecting': ['isolating'], // connecting
  'connection': ['abandon', 'abandonment', 'alienation', 'barrier', 'closing', 'detachment', 'disconnect', 'exile', 'expulsion', 'heavy', 'negation', 'shunning', 'solitude'], // Connection
  'connectivity': ['premium'], // Connectivity
  'conquer': ['chaos', 'defeat', 'disorder', 'division', 'fail', 'fear', 'hesitation', 'uncertain', 'weakness'], // conquer
  'conscience': ['detached', 'disapproval', 'dislike', 'disorder', 'distrust'], // Conscience
  'conscientious': ['premium'], // Conscientious
  'conscious': ['detached', 'disengaged', 'ignorant', 'mindless', 'oblivious', 'unconscious'], // Conscious
  'consensus': ['anarchy', 'chaos', 'conflict', 'counterculture', 'disagreement', 'dissent', 'disunity', 'diversity', 'indifference', 'subjectivity', 'uncertainty'], // consensus
  'consequence': ['acausal', 'arbitrary', 'chaos', 'disorder', 'impunity', 'random', 'uncertainty'], // Consequence
  'conservation': ['consumption', 'destruction', 'development', 'exploitation', 'neglect', 'waste'], // Conservation
  'conservative': ['vanguard'], // conservative
  'consider': ['dismiss', 'disregard'], // consider
  'considerate': ['careless', 'selfish'], // considerate
  'consideration': ['negligence'], // consideration
  'consistency': ['anomaly', 'contradiction', 'divergence', 'fluke', 'juxtaposition', 'mismatch', 'paradox'], // consistency
  'consistent': ['discordant', 'disjointed', 'disparate', 'disruptive', 'dragged', 'fickle', 'postlude', 'reactive', 'shaky', 'splotchy', 'uneven', 'unreliable', 'unstable', 'variable', 'volatile'], // consistent
  'consolidate': ['chaos', 'disperse', 'disunity', 'divide', 'fragment', 'loose', 'radial-break', 'scatter', 'separate'], // Consolidate
  'consolidated': ['distributed'], // consolidated
  'constancy': ['adaptability', 'change', 'chaos', 'disorder', 'fluctuation', 'flux', 'impermanence', 'instability', 'transformation', 'transience', 'uncertainty', 'variability'], // constancy
  'constant': ['changing', 'chaotic', 'dynamic', 'evanescent', 'fickle', 'fleeting', 'flicker', 'fluid', 'folding', 'morph', 'mutable', 'random', 'seasons', 'shift', 'sudden', 'suddenness', 'tangential', 'uncertain', 'variable', 'variant', 'wavering'], // constant
  'constellation': ['chaos', 'cluttered', 'disorder', 'dispersal', 'randomness'], // Constellation
  'constrain': ['expand'], // constrain
  'constrained': ['endlessness', 'freestyle', 'heavy', 'limitless', 'loose', 'unbound'], // Constrained
  'constraining': ['empowering'], // constraining
  'constraint': ['chaos', 'expansion', 'fluidity', 'freedom', 'freeness', 'freetime', 'liberty', 'openness', 'release', 'unbound'], // Constraint
  'constrict': ['airy', 'expand', 'flexible', 'fluid', 'free', 'loose', 'open', 'overflow', 'release', 'spacious'], // constrict
  'constricted': ['spread'], // constricted
  'construct': ['destroy', 'disassemble', 'disband', 'dissolve', 'erase', 'erode', 'negate', 'unravel'], // Construct
  'constructed': ['deconstructed', 'environment'], // constructed
  'construction': ['deconstruction', 'destruction'], // construction
  'constructive': ['futile'], // constructive
  'constructivism': ['deconstructivism'], // constructivism
  'consulting': ['anarchy', 'chaos', 'disorder', 'ignorance', 'randomness'], // Consulting
  'consume': ['create', 'disperse', 'generate', 'gift', 'offer', 'produce', 'share', 'sustain'], // consume
  'consumerism': ['detachment', 'frugality', 'minimalism', 'simplicity', 'sustainability'], // Consumerism
  'consumption': ['abstinence', 'conservation', 'creation', 'frugality', 'production'], // Consumption
  'contain': ['bleed', 'burst', 'emit', 'overflow', 'spill'], // contain
  'contained': ['dispersed', 'distributed', 'endlessness', 'erupt', 'expansive', 'open', 'spread', 'unbounded', 'unconfined', 'unfettered', 'unrestricted'], // contained
  'containment': ['diffusion', 'dispersal', 'emission', 'expansion', 'freedom', 'openness', 'release', 'spill'], // Containment
  'contamination': ['purity'], // contamination
  'contemplation': ['heavy'], // Contemplation
  'contemplative': ['heavy'], // Contemplative
  'contemporary': ['ancient', 'archaic', 'historical', 'museum', 'retrofuturism'], // contemporary
  'contempt': ['admiring', 'favor', 'respect', 'veneration'], // contempt
  'content': ['anxious', 'frustration', 'restless', 'uneasy'], // content
  'contented': ['restless', 'uneasy'], // contented
  'contentment': ['anxiety', 'displeasure', 'dissatisfaction', 'guilt', 'heavy', 'panic', 'shame', 'yearning'], // Contentment
  'context': ['ambiguity', 'chaos', 'disconnect', 'disorder', 'ignorance', 'narrative-absence', 'random', 'vacuum', 'void'], // context
  'continental': ['marine'], // continental
  'continuation': ['end', 'ended'], // continuation
  'continue': ['deadend'], // continue
  'continuity': ['closing', 'detachment', 'disorder', 'dispersal', 'disruption', 'finality', 'fracture', 'fragment', 'moment', 'rupture'], // Continuity
  'continuous': ['fracture', 'interrupted', 'pixel', 'pixelated', 'segmented', 'staccato', 'stopped'], // continuous
  'continuum': ['discontinuity', 'fragment', 'isolation', 'separation', 'singularity'], // Continuum
  'contour': ['chaos', 'disorder', 'flat'], // Contour
  'contract': ['expand'], // contract
  'contraction': ['expanse', 'expansion'], // contraction
  'contradiction': ['agreement', 'certainty', 'clarity', 'coherence', 'concord', 'consistency', 'harmony', 'simplicity', 'unity'], // Contradiction
  'contrary': ['compliant'], // contrary
  'contrast': ['cool', 'cozy', 'display', 'docs', 'drawer', 'drop', 'effects', 'elegant', 'elements', 'experimental', 'fashion', 'font', 'fonts', 'header', 'image', 'interactions', 'interfacing', 'like', 'loading', 'luxurious', 'magazine', 'measurement', 'menu', 'minimalistic', 'minimize', 'modal', 'modern', 'monoculture', 'monospace', 'old', 'page', 'portfolio', 'product', 'sameness', 'sophisticated', 'space', 'spacious', 'states', 'timeline', 'ui', 'unison', 'unity'], // Contrast
  'contrasted': ['blended'], // contrasted
  'contrasting': ['analogous', 'neumorphic'], // contrasting
  'contrived': ['candid', 'genuine', 'naturalistic'], // contrived
  'control': ['disempowerment', 'drift', 'freeness', 'heavy', 'liberation', 'overflow', 'risk', 'sovereignty', 'submission'], // Control
  'controlled': ['anarchic', 'feral', 'fumbled', 'loose', 'postlude', 'splat', 'unruly', 'unstable', 'untamed', 'wild'], // controlled
  'convenience': ['arduous', 'cumbersome', 'premium', 'tedious'], // Convenience
  'convention': ['invention'], // convention
  'conventional': ['disruptive', 'exploratory', 'frontier', 'improvised', 'informal', 'innovative', 'inventive', 'irreverent', 'offbeat', 'subjective', 'vanguard'], // conventional
  'convergence': ['dispersal', 'divergence', 'fragmentation', 'isolation', 'refraction', 'separation'], // Convergence
  'convergent': ['branching'], // Convergent
  'conviction': ['doubt', 'doubting'], // conviction
  'convolution': ['linearity', 'minimalistic', 'order', 'simplification'], // convolution
  'cool': ['blazing', 'burnt', 'contrast', 'cozy', 'cyberpunk', 'dramatic', 'duotone', 'energetic', 'fiery', 'food', 'friendly', 'gradient', 'heat', 'heated', 'ignite', 'intensify', 'inviting', 'melt', 'molten', 'monochromatic', 'monochrome', 'muted', 'neon', 'nonprofit', 'ochre', 'pastel', 'powerful', 'rainbow', 'saturation', 'sepia', 'sports', 'stale', 'startup', 'strict', 'travel', 'triadic', 'understated', 'vibrant', 'warm', 'welcoming'], // Cool
  'coolness': ['awkward', 'energetic', 'expressive', 'fervor', 'food', 'friendly', 'gradient', 'inviting', 'lame', 'monochromatic', 'monochrome', 'muted', 'neon', 'nonprofit', 'pastel', 'rainbow', 'sepia', 'sports', 'startup', 'strict', 'tones', 'travel', 'triadic', 'understated', 'vibrant', 'warm', 'welcoming'], // Coolness
  'cooperation': ['conflict', 'war'], // cooperation
  'coordinated': ['clumsy'], // coordinated
  'copy': ['invention'], // copy
  'core': ['facade', 'husk', 'margin', 'periphery', 'surface'], // Core
  'corner': ['chaos', 'circle', 'disperse', 'edge', 'isolation', 'scatter', 'simplicity', 'uncertain', 'void'], // corner
  'corporate': ['childcare', 'media', 'non-profit', 'playful', 'text', 'type'], // Corporate
  'corridor': ['expanse', 'open', 'void'], // Corridor
  'corrupt': ['certain', 'clear', 'honest', 'integrity', 'pure', 'purity', 'right', 'trustworthy', 'virtuous'], // corrupt
  'corruption': ['honesty', 'innocence', 'integrity', 'purity', 'trust'], // corruption
  'cosmetics': ['bare', 'essential', 'heavy', 'natural', 'plain', 'raw', 'rough', 'simple', 'unadorned', 'unrefined', 'utilitarian'], // Cosmetics
  'cosmic': ['earthy', 'grounded', 'mundane', 'ordinary', 'petty', 'terrestrial'], // Cosmic
  'cosmos': ['chaos', 'disorder', 'fragmentation', 'nihility', 'void'], // Cosmos
  'cottagecore': ['industrial', 'synthetic', 'urban'], // Cottagecore
  'couch': ['athlete'], // couch
  'counterculture': ['conformity', 'consensus', 'mainstream', 'norms', 'orthodoxy', 'statusquo', 'tradition', 'uniformity'], // Counterculture
  'courage': ['fear'], // courage
  'courteous': ['rude'], // courteous
  'cover': ['uncover'], // cover
  'covered': ['exposed', 'obscured', 'revealed', 'uncovered', 'untouched'], // covered
  'covert': ['apparent', 'blatant', 'exhibition', 'exposed', 'obvious', 'open', 'overlook', 'overt', 'revealed', 'transparent', 'visible'], // covert
  'cowardice': ['valor'], // cowardice
  'cozy': ['cold', 'contrast', 'cool', 'cyberpunk', 'dramatic', 'duotone', 'expressive'], // Cozy
  'cracked': ['intact', 'polished', 'smooth', 'uniform', 'whole'], // Cracked
  'craft': ['brutality', 'chaos', 'deeptech', 'disorder', 'edtech', 'manufacturing', 'neglect', 'robotics', 'simplicity'], // Craft
  'crafted': ['massproduced'], // crafted
  'craftsmanship': ['chaos', 'disarray', 'haphazard', 'negligence', 'sloppiness'], // Craftsmanship
  'craggy': ['even', 'polished', 'smooth', 'soft'], // Craggy
  'craving': ['heavy'], // Craving
  'crazy': ['sane'], // crazy
  'creamy': ['grainy', 'rough'], // Creamy
  'create': ['break', 'consume', 'damage', 'destroy', 'erode', 'finish'], // create
  'creating': ['erasing', 'obliterating'], // creating
  'creation': ['consumption', 'destruction', 'erasure', 'negation', 'obliteration', 'oblivion', 'ruin', 'void'], // Creation
  'creativity': ['conformity', 'drudgery', 'idleness', 'monotony', 'rigidity', 'stagnation', 'uniformity'], // Creativity
  'crisp': ['blurry', 'bokeh', 'dull', 'messy', 'rough', 'smoky', 'soft', 'thaw', 'unfocused', 'viscous'], // Crisp
  'crisp-white': ['blotchy'], // crisp-white
  'critical': ['naive'], // critical
  'critique': ['approval', 'embrace', 'premium'], // Critique
  'crooked': ['clear', 'honest', 'integral', 'orderly', 'pure', 'simple', 'smooth', 'straight'], // crooked
  'crowded': ['rural', 'single', 'sparsity', 'vacancy'], // crowded
  'crowned': ['bare', 'humble', 'plain', 'simple', 'unadorned'], // crowned
  'crude': ['chic', 'dignity', 'elaborate', 'elegant', 'ergonomic', 'fine', 'gourmet', 'literary', 'luxe', 'minimalistic', 'polished', 'prestige', 'pristine', 'refined', 'sophisticated', 'yielding'], // crude
  'crudeness': ['artistry', 'delicacy'], // crudeness
  'cruelty': ['care', 'compassion', 'empathy', 'gentleness', 'kindness', 'love', 'support', 'warmth'], // cruelty
  'cryptocurrency': ['fiat', 'traditional'], // Cryptocurrency
  'crystal': ['formless', 'opaque', 'organic', 'rough'], // Crystal
  'crystalline': ['amorphous', 'dull', 'mundane', 'murky', 'opaque', 'rough'], // Crystalline
  'cube': ['cylinder', 'sphere'], // cube
  'cubism': ['chaos', 'disorder', 'field', 'flatness', 'fluidity', 'literal', 'randomness', 'simplicity', 'spontaneity'], // Cubism
  'cultivate': ['disheveled', 'disorder', 'filth', 'messy', 'neglect'], // Cultivate
  'cultivated': ['chaotic', 'disordered', 'neglected', 'primal', 'raw', 'terrain', 'uncontrolled', 'unrefined', 'untamed', 'wild', 'wilderness'], // cultivated
  'cultivation': ['abandonment', 'decay', 'destruction', 'disorder', 'neglect'], // Cultivation
  'culture': ['premium', 'savage'], // Culture
  'cultured': ['vulgar'], // cultured
  'cumbersome': ['aerodynamic', 'bright', 'convenience', 'dynamic', 'easy', 'fluid', 'light', 'playful', 'simple', 'vivid'], // cumbersome
  'curated': ['arbitrary', 'cluttered', 'disorder'], // Curated
  'curation': ['design', 'illustration', 'led', 'synthesis'], // Curation
  'curatorial': ['premium'], // Curatorial
  'curiosity': ['boredom', 'disinterest', 'heavy'], // Curiosity
  'curious': ['bored', 'complacent', 'disinterested', 'heavy'], // Curious
  'current': ['ancient', 'artifact', 'historical', 'obsolete'], // current
  'curse': ['gift'], // curse
  'curtained': ['bare', 'exposed', 'naked', 'open', 'revealed'], // Curtained
  'curvature': ['angular', 'flat', 'flatness', 'flatten', 'linearity', 'rectilinear', 'symmetry', 'unity'], // Curvature
  'curve': ['angle', 'edge', 'line', 'polygon', 'rectangle'], // Curve
  'curved': ['angularity', 'blocky', 'planar', 'square'], // curved
  'curvilinear': ['flat', 'geometric', 'linear', 'rectangular', 'rigid', 'straight'], // Curvilinear
  'curvilinear-harmony': ['disarrayed'], // curvilinear-harmony
  'curvy': ['angular', 'boxy', 'even', 'flat', 'linear', 'narrow', 'rectangular', 'rigid', 'sharp', 'straight'], // curvy
  'customization': ['conformity', 'generic', 'impersonality', 'monotony', 'ordinariness', 'sameness', 'standardization', 'uniformity'], // Customization
  'cyan': ['amber'], // cyan
  'cyanic': ['muddy'], // cyanic
  'cybernetic': ['manual', 'natural', 'organic', 'primitive', 'static'], // Cybernetic
  'cyberpunk': ['cool', 'cozy', 'warm'], // Cyberpunk
  'cybersecurity': ['exposure', 'vulnerability'], // Cybersecurity
  'cycle': ['end', 'finality', 'singularity', 'static'], // Cycle
  'cylinder': ['cube', 'flat', 'hollow', 'plane', 'void'], // Cylinder
  'cylindrical': ['angular', 'flat', 'irregular', 'planar', 'polygonal'], // Cylindrical
  'cynical': ['naive', 'optimistic'], // cynical
  'cynicism': ['hopeful', 'naivety', 'optimism'], // cynicism
  'damage': ['build', 'create', 'enhance', 'nurture', 'repair', 'restore', 'skincare', 'strength', 'value', 'wholeness'], // damage
  'damaged': ['intact'], // damaged
  'dampen': ['amplify', 'motivate'], // dampen
  'danger': ['safety'], // danger
  'dangerous': ['healthy'], // dangerous
  'daring': ['cautious'], // daring
  'dark': ['breezy', 'brilliant', 'glare', 'highlight', 'light', 'ochre', 'phosphor', 'positive', 'shine', 'shiny', 'wash'], // Dark
  'darken': ['ignite'], // darken
  'darkmode': ['bright', 'clear', 'lightmode', 'luminous', 'vibrant'], // Darkmode
  'darkness': ['beacon', 'brightness', 'clarity', 'dawn', 'glow', 'illumination', 'light', 'lightness', 'lucidity', 'luminance', 'morning', 'radiance', 'reflectivity', 'shine', 'solar', 'vision', 'vividness'], // darkness
  'dashboard': ['chaos', 'cluttered', 'disorder', 'disorganization', 'dispersal', 'sprawl'], // Dashboard
  'data': ['premium'], // Data
  'data-driven': ['pictorial'], // Data-driven
  'dawn': ['blackout', 'darkness', 'dimness', 'dusk', 'evening', 'night', 'twilight'], // Dawn
  'day': ['dusk', 'end', 'evening', 'lunar', 'night', 'pause', 'rest', 'sleep', 'stagnation', 'stillness', 'void'], // Day
  'daylight': ['eclipse', 'nocturn'], // daylight
  'dazzling': ['bland', 'drab', 'dull', 'faded', 'flat', 'muted', 'plain', 'subdued-illumination', 'unremarkable'], // dazzling
  'dead': ['alive', 'bio', 'live', 'liveliness', 'phosphor', 'thrive'], // dead
  'deadend': ['continue', 'expansion', 'flow', 'journey', 'open', 'path', 'pathway', 'progress', 'rise'], // deadend
  'death': ['beginning', 'growth', 'hope', 'immortality', 'joy', 'life', 'light', 'rebirth', 'vitality'], // death
  'debt': ['payments', 'profit'], // debt
  'decay': ['bloom', 'cultivation', 'development', 'evolution', 'flourish', 'freshness', 'germination', 'growth', 'renew', 'renewal', 'thrive', 'vitality'], // Decay
  'deceit': ['certainty', 'clarity', 'concord', 'honesty', 'integrity', 'sincerity', 'trust', 'trustworthy', 'truth', 'unity'], // deceit
  'decentralization': ['centrality', 'command', 'concentricity', 'dominance', 'monopoly'], // Decentralization
  'decentralized': ['centrality', 'centralized'], // decentralized
  'deception': ['authenticity', 'truth'], // deception
  'deceptive': ['authentic', 'clear', 'genuine', 'honest', 'open', 'real', 'sincere', 'transparent', 'trustworthy'], // deceptive
  'decide': ['waver'], // decide
  'decisive': ['ambiguous', 'chaotic', 'delay', 'delayed', 'hesitant', 'indecisive', 'random', 'tentativeness', 'uncertain', 'unstable', 'vague'], // decisive
  'decisiveness': ['hesitation'], // decisiveness
  'decline': ['accumulation', 'advancement', 'ascendancy', 'ascension', 'ascent', 'development', 'elevation', 'evolve', 'expansion', 'flourish', 'growth', 'improvement', 'peak', 'pinnacle', 'progress', 'prosperity', 'raise', 'rise', 'soar', 'success', 'thrive'], // decline
  'deco': ['brutalism', 'disjointed', 'minimalism', 'simplicity'], // Deco
  'deconstruct': ['integrate', 'preserve', 'scaffold', 'synthesize'], // deconstruct
  'deconstructed': ['cohesive', 'complete', 'constructed', 'defined', 'ordered'], // Deconstructed
  'deconstruction': ['architecture', 'completion', 'construction', 'integration', 'synthesis', 'unity'], // Deconstruction
  'deconstructivism': ['cohesive', 'constructivism', 'harmony', 'integrated', 'minimalism', 'order', 'ordered', 'simple', 'stable', 'structuralism', 'traditional', 'uniform'], // Deconstructivism
  'deconstructivist': ['classicism', 'intact', 'order', 'symmetry'], // Deconstructivist
  'decorated': ['base', 'basic', 'blank', 'minimalistic', 'plain', 'simple', 'unadorned', 'untouched'], // decorated
  'decrease': ['raise', 'rise'], // decrease
  'deemphasize': ['highlight'], // deemphasize
  'deep': ['shallow', 'superficial', 'weak'], // deep
  'deeptech': ['basic', 'chaotic', 'commodity', 'craft', 'disorderly', 'dull', 'low-tech', 'naive', 'ordinary', 'shallow', 'simple', 'traditional'], // DeepTech
  'default': ['typecraft'], // Default
  'defeat': ['conquer', 'optimism', 'success', 'victory'], // defeat
  'defeated': ['active', 'alive', 'aspirant', 'empowered', 'hopeful', 'successful', 'triumphant', 'victorious', 'winning'], // defeated
  'defended': ['vulnerable'], // defended
  'defenseless': ['shielded'], // defenseless
  'defiance': ['heavy', 'obedience', 'submission'], // Defiance
  'defiant': ['agreeable', 'compliant', 'conformist', 'docile', 'obedient', 'passive', 'submissive', 'vulnerability', 'yielding'], // defiant
  'deficiency': ['abundance', 'bounty', 'excellence', 'might', 'wealth'], // deficiency
  'deficient': ['fertile', 'filled', 'fortified'], // deficient
  'deficit': ['produce', 'profit'], // deficit
  'define': ['vacate'], // define
  'defined': ['abstraction', 'amorphous', 'blank', 'blobby', 'blur', 'bokeh', 'brushstroke', 'confusing', 'deconstructed', 'diffused', 'disembodied', 'distorted', 'endless', 'endlessness', 'erased', 'faceless', 'formless', 'freeform', 'freestyle', 'fuzzy', 'hazy', 'imprecise', 'impure', 'indistinct', 'interstitial', 'lost', 'muffled', 'nebulous', 'neumorphic', 'nowhere', 'obscuring', 'pixelation', 'scrap', 'scrawl', 'shifty', 'smeared', 'smoky', 'undefined', 'unfocused', 'unformed', 'unfounded', 'ungendered', 'ungrounded', 'unknown', 'unvalued', 'veiling'], // defined
  'defined-space': ['ungrounded'], // defined-space
  'definite': ['ambiguous', 'chaotic', 'disorderly', 'fictional', 'fluid', 'imaginary', 'intangible', 'interstitial', 'nebulous', 'random', 'uncertain', 'undefined', 'unstable', 'vague', 'wobbly'], // definite
  'definition': ['ambiguity', 'blurb', 'distortion', 'erasure', 'fog', 'fuzz', 'imprecise', 'impression', 'indeterminacy', 'messy', 'mist', 'redefinition', 'silhouette', 'vagueness'], // definition
  'delay': ['active', 'affirmative', 'certain', 'decisive', 'immediate', 'prompt', 'resolved', 'rush', 'urgency'], // delay
  'delayed': ['active', 'certain', 'decisive', 'immediate', 'instant', 'prompt', 'resolved', 'sudden', 'suddenness', 'urgent'], // delayed
  'deliberate': ['artless', 'careless', 'chaotic', 'erratic', 'frivolous', 'fumbled', 'hasty', 'improvised', 'impulsive', 'instinct', 'random', 'spontaneous', 'unplanned'], // Deliberate
  'deliberate-chaos': ['method'], // deliberate-chaos
  'deliberate-composition': ['unplanned'], // deliberate-composition
  'delicacy': ['brutality', 'cacophony', 'clumsiness', 'crudeness', 'disorder'], // Delicacy
  'delicate': ['brutal', 'garish', 'grotesque', 'resilient', 'rugged', 'thick', 'weighty'], // delicate
  'delight': ['bore', 'displeasure', 'dissatisfaction', 'pain', 'sorrow'], // delight
  'delusion': ['awakening'], // delusion
  'demand': ['abandon', 'aversion', 'disdain', 'disinterest', 'distraction', 'indifference', 'leisure', 'neglect', 'rejection'], // demand
  'demanding': ['easy', 'leisurely'], // demanding
  'demotivate': ['encourage'], // demotivate
  'denial': ['acceptance', 'access', 'acknowledgment', 'belief', 'certainty', 'clarity', 'faith', 'reality', 'truth'], // denial
  'dense': ['aero', 'empty', 'flaky', 'foamy', 'hollow', 'lightweight', 'loosen', 'minimalistic', 'perforated', 'plasma', 'porous', 'powder', 'sheer', 'simplify', 'skeletal', 'spacious', 'sprawl', 'stratosphere', 'thin', 'translucency', 'translucent', 'vapor', 'vapour'], // Dense
  'density': ['airiness', 'aura', 'sparsity'], // density
  'dentistry': ['anarchy', 'chaos', 'disorder', 'neglect', 'pain', 'wild'], // Dentistry
  'deny': ['accept', 'affirm'], // deny
  'depart': ['remain'], // depart
  'dependable': ['unreliable'], // dependable
  'dependence': ['autonomy', 'detachment', 'freedom', 'independence', 'liberty', 'self', 'solipsism', 'solitude', 'sovereignty'], // dependence
  'depiction': ['ambiguity', 'chaos', 'confusion', 'non-representation', 'vagueness'], // depiction
  'depictive': ['abstract', 'bland', 'chaotic', 'dull', 'indistinct', 'non-representational', 'random', 'simple', 'vague'], // depictive
  'deplete': ['abound', 'enhance', 'enrich', 'fill', 'increase', 'multiply', 'nourish', 'supply', 'surplus'], // deplete
  'depletion': ['abundance', 'augmentation', 'bounty', 'fullness', 'growth', 'ingredients', 'materials', 'plenty', 'richness', 'saturation', 'surplus', 'wealth'], // Depletion
  'depravity': ['innocence'], // depravity
  'depress': ['encourage'], // depress
  'depressed': ['raised'], // depressed
  'depression': ['elevation'], // depression
  'deprivation': ['abundance', 'access', 'affluence', 'expansion', 'freedom', 'growth', 'liberation', 'nourishment', 'privilege', 'prosperity', 'release', 'sustenance'], // deprivation
  'depth': ['2d', 'facade', 'flatness', 'flatten', 'flattening', 'fleshless', 'horizon', 'sky', 'summit'], // depth
  'dermatology': ['orthodontics'], // Dermatology
  'descend': ['ascend', 'elevate', 'evolve', 'float', 'forward', 'rise', 'soar', 'upper'], // descend
  'descent': ['ascension', 'ascent', 'elevation', 'near', 'pinnacle', 'rise', 'up'], // descent
  'desert': ['nautical'], // desert
  'deserted': ['hotels'], // deserted
  'design': ['curation', 'detail', 'irrational', 'muddle', 'scribble', 'sloppiness'], // Design
  'desire': ['heavy'], // Desire
  'desktop': ['wearables'], // Desktop
  'desolate': ['bustling', 'fertile', 'flourishing', 'lively', 'radiant', 'thriving', 'utopian', 'verdant', 'vibrant'], // Desolate
  'desolation': ['atmosphere', 'flotilla'], // desolation
  'despair': ['celebration', 'cherishing', 'dream', 'euphoria', 'exuberance', 'fullness', 'hopeful', 'might', 'optimism', 'prosperity', 'utopia'], // despair
  'despairing': ['alive', 'bright', 'clear', 'energized', 'hopeful', 'joyful', 'optimistic', 'uplifting', 'vibrant'], // despairing
  'despise': ['cherish'], // despise
  'destroy': ['build', 'construct', 'create', 'foster', 'harmony', 'nurturing', 'preserve', 'repair', 'restore', 'sculpt', 'unite'], // destroy
  'destruction': ['building', 'conservation', 'construction', 'creation', 'cultivation', 'development', 'genesis', 'germination', 'growth', 'harmony', 'museum', 'preservation', 'produce', 'rebirth', 'renewal', 'repair', 'shaping', 'unity', 'winery'], // destruction
  'detach': ['attach', 'bind', 'bond', 'interlock', 'intersect', 'join', 'merge', 'unify', 'weave'], // detach
  'detached': ['admiration', 'anchored', 'array', 'attached', 'attachment', 'biophilic', 'bound', 'clustered', 'collaborative', 'connected', 'conscience', 'conscious', 'diorama', 'embodiment', 'embraced', 'empathetic', 'engaged', 'experiential', 'framing', 'grounded', 'grounding', 'humanist', 'immerse', 'immersive', 'integrated', 'intentional', 'interconnectedness', 'intertwined', 'interwoven', 'intimate', 'involved', 'nexus', 'resonance', 'root', 'rooting', 'soulful', 'tabs', 'user-centric'], // detached
  'detaching': ['rooting'], // detaching
  'detachment': ['absorption', 'accumulation', 'adoption', 'affection', 'agency', 'alignment', 'assemblage', 'assembly', 'attachment', 'belonging', 'celebration', 'cherishing', 'childcare', 'closeness', 'coexistence', 'cohesion', 'collaboration', 'collectivism', 'connect', 'connectedness', 'connection', 'consumerism', 'continuity', 'dependence', 'dwelling', 'embrace', 'emotion', 'empathy', 'engage', 'engagement', 'envelopment', 'experience', 'expressiveness', 'fandom', 'fervor', 'formation', 'grouping', 'inclusion', 'integration', 'interaction', 'interconnection', 'interdependence', 'interplay', 'intimacy', 'involvement', 'layering', 'lifestyle', 'linkage', 'messaging', 'nurturing', 'observation', 'participation', 'passion', 'penetration', 'presence', 'roots', 'selection', 'self-expression', 'shaping', 'subjectivity', 'symbiosis', 'synchronicitical', 'togetherness', 'wholeness'], // Detachment
  'detail': ['design', 'erasure', 'illustration', 'led', 'painting', 'pixelation', 'silhouette', 'synthesis', 'typography'], // Detail
  'detailed': ['artless', 'blank', 'bokeh', 'pixelation', 'rudimentary'], // detailed
  'deteriorate': ['renew'], // deteriorate
  'deterioration': ['advancement', 'enhancement', 'flourishing', 'growth', 'improvement', 'preservation', 'prosperity', 'renewal', 'revival', 'strength', 'vitality'], // deterioration
  'determined': ['resigned'], // determined
  'deterring': ['attractive'], // deterring
  'detrimental': ['healthy'], // detrimental
  'devalue': ['valuing'], // devalue
  'develop': ['finish', 'past'], // develop
  'developer-centric': ['user-centric'], // Developer-centric
  'development': ['conservation', 'decay', 'decline', 'destruction', 'ended', 'obsolete', 'stagnation'], // Development
  'devoid': ['fertile'], // devoid
  'diagonal': ['horizontal', 'level', 'straight', 'vertical'], // Diagonal
  'dialogue': ['disconnection', 'isolation', 'monologue', 'silence', 'solitude', 'stagnation'], // dialogue
  'difference': ['monoculture'], // difference
  'difficulty': ['success'], // difficulty
  'diffuse': ['concentrated', 'labeled', 'specific'], // diffuse
  'diffused': ['clear', 'concentrated', 'defined', 'focused', 'sharp'], // Diffused
  'diffusing': ['compressing'], // diffusing
  'diffusion': ['concentration', 'containment', 'isolation'], // Diffusion
  'digital': ['acoustic', 'animalism', 'brushstroke', 'freight', 'handwritten', 'horology', 'illustration', 'led', 'painting', 'postal', 'typography', 'winery'], // Digital
  'digital art': ['murals'], // digital art
  'digital-art': ['murals'], // Digital Art
  'digitalization': ['analogue', 'manual', 'static', 'tangible', 'traditional'], // Digitalization
  'digitization': ['premium'], // Digitization
  'dignity': ['crude', 'disgrace', 'humiliation', 'indecency', 'informality', 'shame', 'vulgarity'], // Dignity
  'diligence': ['negligence'], // diligence
  'diligent': ['laziness', 'negligent'], // diligent
  'diluting': ['clarifying', 'concentrating', 'confirming', 'embodying', 'enhancing', 'fortifying', 'intensifying', 'saturating', 'solidifying'], // diluting
  'dim': ['blinding', 'flare', 'glare', 'gleaming', 'heat', 'highlight', 'ignite', 'phosphor', 'radiance', 'shine', 'visible', 'vividness'], // dim
  'dimension': ['flatness', 'flatten', 'flattening'], // dimension
  'dimensional': ['2d', 'flat', 'planar'], // dimensional
  'diminish': ['amplify', 'bloom', 'burst', 'evolve', 'expand', 'flourish', 'magnify', 'nourish', 'overpower', 'raise', 'rise', 'scale'], // diminish
  'diminished': ['empowering', 'overlook'], // diminished
  'diminishing': ['emerging'], // diminishing
  'diminution': ['amplification', 'ascension', 'augmentation', 'enrichment', 'enthusiasm', 'expansion', 'fullness', 'growth', 'intensification', 'presence', 'vitality'], // Diminution
  'diminutive': ['colossal', 'enormous', 'expansive', 'giant', 'huge', 'immense', 'massive', 'scale', 'vast'], // diminutive
  'dimming': ['amplifying', 'blazing', 'bright', 'flashy', 'glare', 'loud', 'radiant', 'shining', 'vivid'], // dimming
  'dimness': ['brightness', 'cheerfulness', 'clarity', 'dawn', 'lightness', 'liveliness', 'lumen', 'luminance', 'luminescence', 'radiance', 'vibrancy'], // dimness
  'din': ['calm', 'harmony', 'order', 'peace', 'quiet', 'quietude', 'silence', 'stillness', 'tranquil'], // din
  'diorama': ['cluttered', 'detached', 'dismantled', 'disorder', 'dispersal'], // Diorama
  'dip': ['peak'], // dip
  'direct': ['branching', 'circuitous', 'conflicted', 'confused', 'confusing', 'enigmatic', 'filtered', 'heavy', 'interference', 'labyrinthine', 'oblique', 'symbolic', 'tangential', 'veiled', 'veiling'], // Direct
  'directness': ['editorial', 'idiosyncrasy', 'interference', 'obscured', 'twisted', 'vague'], // Directness
  'dirt': ['affluence', 'bright', 'clean', 'clear', 'eco-tech', 'fresh', 'polished', 'pure', 'refined', 'skincare', 'smooth'], // dirt
  'dirtiness': ['freshness'], // dirtiness
  'dirty': ['spotless'], // dirty
  'disadvantage': ['privilege'], // disadvantage
  'disagree': ['accept'], // disagree
  'disagreement': ['consensus'], // disagreement
  'disappear': ['appear', 'arrive', 'emerge', 'exist', 'manifest', 'materialize', 'presence', 'present', 'remain', 'surface'], // disappear
  'disappearing': ['appearing', 'emerging'], // disappearing
  'disappointment': ['anticipation', 'hopeful'], // disappointment
  'disapproval': ['acceptance', 'admiration', 'admire', 'affection', 'affirm', 'affirmative', 'agreement', 'appreciate', 'appreciation', 'approval', 'assertion', 'celebration', 'cherish', 'conscience', 'endorsement', 'favor', 'satisfaction', 'support'], // disapproval
  'disarray': ['align', 'completion', 'craftsmanship', 'selfcare'], // disarray
  'disarrayed': ['coherent', 'curvilinear-harmony', 'harmonious', 'neat', 'orderly', 'organized', 'structured', 'systematic', 'tidy'], // disarrayed
  'disassemble': ['assemble', 'build', 'combine', 'connect', 'construct', 'form', 'gather', 'integrate', 'scaffold', 'sculpt', 'unify'], // disassemble
  'disband': ['assemble', 'binding', 'collect', 'construct', 'gather', 'manifesting', 'nexus', 'unite'], // disband
  'disbelief': ['belief'], // disbelief
  'discard': ['assemble', 'cast', 'collect', 'merchandise', 'organize', 'preserve', 'retain'], // discard
  'discipline': ['chaos', 'freedom', 'indulgence', 'negligence', 'spontaneity'], // Discipline
  'disciplined': ['anarchic', 'slacker'], // disciplined
  'disclosure': ['envelopment'], // Disclosure
  'discomfort': ['certainty', 'clarity', 'comfort', 'confidence', 'ease', 'harmony', 'relaxation', 'serenity', 'tranquility'], // discomfort
  'disconnect': ['connect', 'connection', 'context', 'engage', 'harmony', 'integrate', 'interlink', 'synchronicity', 'unite', 'unity'], // Disconnect
  'disconnected': ['integrated', 'user-centric', 'wearables'], // disconnected
  'disconnection': ['adoption', 'annotation', 'attachment', 'belonging', 'closeness', 'conduit', 'connectedness', 'dialogue', 'embrace', 'empathy', 'experience', 'fandom', 'fusion', 'identity', 'interaction', 'interfacing', 'interplay', 'linkage', 'memory', 'messaging', 'metaverse', 'nexus', 'synchronicitic', 'togetherness'], // disconnection
  'discontent': ['fulfillment', 'pleased', 'satisfied', 'success'], // discontent
  'discontinuity': ['continuum'], // discontinuity
  'discord': ['harmony', 'synchronicity', 'unison'], // discord
  'discordant': ['balanced', 'cohesive', 'consistent', 'harmonic', 'harmonious', 'harmonious-blend', 'melodic', 'serene', 'symphonic', 'unified'], // discordant
  'discourage': ['encourage', 'expand', 'motivate', 'positive'], // discourage
  'discovery': ['conformity', 'ignorance', 'oblivion', 'obscurity', 'stagnation', 'uniformity'], // Discovery
  'discreet': ['blatant', 'obtrusive', 'overt'], // discreet
  'discrete': ['carousel'], // discrete
  'discretion': ['blatancy', 'blunt', 'brazen', 'chaotic', 'exposed', 'indiscretion', 'loud', 'obvious', 'obviousness', 'outspoken', 'reckless', 'transparency'], // Discretion
  'disdain': ['admiration', 'admiring', 'cherish', 'cherishing', 'demand', 'favor', 'fervor', 'kindness', 'regard', 'sightful', 'veneration'], // disdain
  'disdainful': ['admiring', 'cherishing', 'valuing'], // disdainful
  'disembodied': ['defined', 'embodied', 'embodied-experience', 'embodiment', 'experiential', 'grounding', 'immersive', 'presence', 'solid', 'tangibility', 'tangible'], // disembodied
  'disembodiment': ['concrete', 'embodiment', 'existing', 'material', 'presence', 'real', 'solid', 'tangible'], // disembodiment
  'disempowering': ['empowering'], // disempowering
  'disempowerment': ['agency', 'clarity', 'control', 'empowerment', 'presence', 'strength', 'unity', 'wholeness'], // disempowerment
  'disenfranchisement': ['empowerment'], // disenfranchisement
  'disengage': ['bond', 'engage'], // disengage
  'disengaged': ['conscious', 'engaged', 'immerse'], // disengaged
  'disengagement': ['experience', 'involvement', 'participation'], // disengagement
  'disengaging': ['attracting'], // disengaging
  'disfavor': ['favor'], // disfavor
  'disgrace': ['dignity'], // disgrace
  'disguise': ['authenticity', 'clarity', 'gesture', 'honesty', 'identity', 'openness', 'representation', 'reveal', 'transparency', 'trust'], // disguise
  'disheveled': ['basis', 'composition', 'cultivate', 'elegant', 'formal', 'neat', 'orderly', 'polished', 'pristine', 'refined', 'sleekness', 'structured', 'tidy'], // disheveled
  'dishonest': ['trustworthy'], // dishonest
  'dishonesty': ['integrity', 'sincerity'], // dishonesty
  'disillusion': ['anticipation', 'belief', 'clarity', 'confidence', 'faith', 'hope', 'reality', 'satisfaction', 'truth'], // disillusion
  'disillusionment': ['belief'], // disillusionment
  'disintegration': ['emergence'], // disintegration
  'disinterest': ['curiosity', 'demand', 'engage', 'engagement', 'enthusiasm', 'excitement', 'fandom', 'fascination', 'fervor', 'fixation', 'interest', 'involvement', 'marketing', 'need', 'participation', 'passion', 'recruitment', 'zeal'], // disinterest
  'disinterested': ['active', 'curious', 'engaged', 'enthusiastic', 'interested', 'invested', 'involved', 'passionate'], // disinterested
  'disjoint': ['coherent', 'connected', 'empathetic', 'engaged', 'harmonious', 'inclusive', 'integrate', 'interested', 'intertwined', 'merged', 'passionate'], // disjoint
  'disjointed': ['coherent', 'cohesive', 'collaborative', 'concreteness', 'connected', 'consistent', 'deco', 'flowing', 'harmonious', 'integrated', 'seamless', 'smooth', 'superimposition', 'synchronized', 'unified'], // disjointed
  'dislike': ['accept', 'admiration', 'admire', 'affection', 'affirm', 'appreciate', 'approval', 'attraction', 'cherish', 'conscience', 'embrace', 'enjoy', 'favor', 'like', 'support', 'wholesome'], // dislike
  'dislocation': ['dwelling'], // dislocation
  'dismal': ['bright', 'cheerful', 'euphoric', 'hopeful', 'joyful', 'lively', 'radiant', 'uplifting', 'vibrant'], // dismal
  'dismantle': ['scaffold', 'sculpt'], // dismantle
  'dismantled': ['diorama'], // dismantled
  'dismiss': ['accept', 'acknowledge', 'adopt', 'appreciate', 'attachment', 'celebrate', 'consider', 'embrace', 'encourage', 'engage', 'grasp', 'like', 'nurturing', 'regard', 'selection', 'support', 'value', 'valuing', 'welcome'], // dismiss
  'dismissal': ['acceptance', 'admiring', 'assertion', 'embrace', 'engagement', 'evaluation', 'favor', 'inclusion', 'memorial', 'recognition', 'recruitment', 'respect', 'veneration'], // dismissal
  'dismissed': ['embraced'], // dismissed
  'dismissive': ['admire', 'affection', 'affirmative', 'appreciate', 'appreciative', 'bright', 'cherishing', 'engaged', 'expansive', 'inclusive', 'receptive', 'valued', 'vivid'], // dismissive
  'disobedience': ['obedience'], // disobedience
  'disobedient': ['obedient'], // disobedient
  'disorder': ['academia', 'admire', 'aesthetics', 'align', 'alignment', 'analytics', 'anatomy', 'archetype', 'architecture', 'arrangement', 'array', 'art', 'artistry', 'ascendancy', 'assemblage', 'assembly', 'authority', 'axis', 'balance', 'basis', 'bind', 'branding', 'catalog', 'categorization', 'catering', 'celebration', 'centered', 'centrality', 'childcare', 'circuit', 'clarity', 'classicism', 'cleanliness', 'climate', 'clustering', 'coding', 'cohesion', 'command', 'composition', 'composure', 'concentricity', 'conception', 'conquer', 'conscience', 'consequence', 'constancy', 'constellation', 'consulting', 'context', 'continuity', 'contour', 'cosmos', 'craft', 'cubism', 'cultivate', 'cultivation', 'curated', 'dashboard', 'delicacy', 'dentistry', 'diorama', 'domain', 'economy', 'ecosystem', 'edtech', 'education', 'efficacy', 'efficiency', 'engineering', 'equilibrium', 'ergonomic', 'expertise', 'finance', 'flowchart', 'focused', 'formation', 'fortitude', 'foundation', 'framework', 'framing', 'freight', 'grading', 'grounded', 'grounding', 'grouping', 'harmony', 'healthcare', 'healthtech', 'hierarchy', 'horology', 'hud', 'idyll', 'integration', 'integrity', 'intentional', 'interconnectedness', 'intersect', 'lattice', 'literary', 'luxe', 'marketing', 'mastery', 'matrix', 'measure', 'melody', 'method', 'modelling', 'module', 'monopoly', 'mosaic', 'museum', 'nexus', 'normalcy', 'nourishment', 'nucleus', 'optimization', 'order', 'organization', 'outlining', 'pathway', 'pattern', 'payments', 'planning', 'poetic', 'presence', 'prestige', 'principle', 'pristine', 'productivity', 'proportion', 'purity', 'purpose', 'realm', 'regulation', 'relevance', 'repetition', 'resolve', 'resonance', 'rows', 'sanctuary', 'scholarship', 'selection', 'sense', 'settle', 'shaping', 'sightful', 'solutions', 'stability', 'structure', 'symbiosis', 'synchronicitic', 'synchronicitical', 'systems', 'tranquility', 'typecraft', 'understanding', 'unify', 'units', 'unity', 'utopia', 'visualization', 'watches', 'watchmaking', 'wholeness', 'wholesome', 'zen'], // disorder
  'disordered': ['charted', 'coherent', 'cultivated', 'doctrinal', 'exact', 'formed', 'intact', 'level', 'logical', 'planned', 'practical', 'procedural', 'resolved', 'scheduled', 'sequential', 'settled', 'simplifying', 'solidity'], // disordered
  'disorderly': ['arranged', 'bakery', 'behavioral', 'coherent', 'compliant', 'deeptech', 'definite', 'formality', 'functionalist', 'harmonic', 'methodical', 'modelling', 'neat', 'orderly', 'organized', 'rational', 'regulated', 'remote', 'structured', 'studious', 'systematic', 'tame', 'unified'], // disorderly
  'disorganization': ['dashboard'], // disorganization
  'disorganized': ['coherent', 'composition', 'methodical', 'neat', 'orderly', 'organized', 'pragmatic-visuals', 'strategic', 'structured', 'systematic', 'tidy'], // disorganized
  'disparate': ['aligned', 'analogous', 'cohesive', 'complementary', 'consistent', 'harmonious', 'integrated', 'matched', 'similar', 'uniform'], // disparate
  'dispassionate': ['animated', 'emotional', 'engaged', 'expressive', 'intense', 'involved', 'passionate', 'sensory', 'vibrant'], // dispassionate
  'dispersal': ['absorption', 'accumulation', 'alignment', 'anchored', 'arrangement', 'array', 'assemblage', 'assembly', 'canvas', 'categorization', 'clustered', 'cohesion', 'constellation', 'containment', 'continuity', 'convergence', 'dashboard', 'diorama', 'dwelling', 'editorial', 'encasement', 'enclosure', 'envelopment', 'field', 'fixation', 'focused', 'formation', 'framing', 'fusion', 'grounding', 'grouping', 'harmony', 'integration', 'intentional', 'interconnectedness', 'interconnection', 'intertwined', 'interwoven', 'layering', 'linkage', 'network', 'nexus', 'nodes', 'orbit', 'pathway', 'preservation', 'resonance', 'roots', 'selection', 'shaping', 'singularity', 'source', 'tabs', 'units', 'vortex', 'wholeness'], // Dispersal
  'disperse': ['assemble', 'bond', 'capture', 'cluster', 'concentrate', 'consolidate', 'consume', 'corner', 'gather', 'imprint', 'integrate', 'interlock', 'intersect', 'manifesting', 'point', 'preserve', 'pyramid', 'scaffold', 'stack', 'synthesize', 'weave'], // disperse
  'dispersed': ['aggregate', 'axial', 'centered', 'centralized', 'cloistered', 'clustered', 'concentrated', 'contained', 'merged', 'regression', 'sculptural', 'unified'], // Dispersed
  'dispersed-tone': ['concentrated'], // dispersed-tone
  'dispersing': ['rooting'], // dispersing
  'dispersion': ['absorption', 'centrality', 'clustering', 'concentricity', 'editorial', 'harmony'], // Dispersion
  'display': ['composition', 'contrast', 'hide', 'shroud'], // Display
  'displaying': ['concealing', 'hiding'], // displaying
  'displeased': ['pleased', 'satisfied'], // displeased
  'displeasure': ['approval', 'contentment', 'delight', 'harmony', 'joy', 'pleasure', 'satisfaction', 'unity'], // displeasure
  'disposability': ['legacy'], // disposability
  'disposable': ['cherished', 'durable', 'enduring', 'essential', 'heritage-craft', 'permanent', 'sustainable', 'timeless', 'valued', 'watchmaking'], // disposable
  'disregard': ['acknowledge', 'admiration', 'advertising', 'appreciate', 'attention', 'consider', 'engrave', 'evaluation', 'focus', 'inquiry', 'memorial', 'milestone', 'nurture', 'nurturing', 'observation', 'promotion', 'publishing', 'recognition', 'regard', 'respect', 'statement', 'stewardship', 'value', 'valuing'], // disregard
  'disregarded': ['acknowledged', 'embraced', 'emphasized', 'focused', 'highlighted', 'identified', 'noted', 'organized', 'presented', 'profit-driven', 'valued'], // disregarded
  'disrespect': ['respect'], // disrespect
  'disrupt': ['align', 'conform', 'harmonize', 'integrate', 'loop', 'render', 'repeat', 'settle', 'stabilize', 'standardize', 'unify'], // disrupt
  'disrupted': ['uninterrupted'], // disrupted
  'disruption': ['completion', 'conception', 'continuity', 'order', 'stability'], // Disruption
  'disruptive': ['consistent', 'conventional', 'harmonious', 'stable', 'traditional'], // Disruptive
  'dissatisfaction': ['approval', 'comfort', 'contentment', 'delight', 'fulfillment', 'happiness', 'joy', 'pleasure', 'satisfaction'], // dissatisfaction
  'dissatisfied': ['pleased', 'satisfied', 'settled'], // dissatisfied
  'dissent': ['consensus'], // dissent
  'dissimilar': ['analogous'], // dissimilar
  'dissipate': ['manifesting'], // dissipate
  'dissipation': ['accumulation', 'assembly', 'coherence', 'concentration', 'fixation', 'focus', 'harmony', 'integration', 'solidarity', 'stewardship', 'unity'], // dissipation
  'dissolution': ['assembly', 'ecosystem', 'formation', 'germination', 'realm', 'shaping'], // dissolution
  'dissolve': ['construct', 'imprint', 'preserve', 'solidify', 'stack', 'synthesize'], // dissolve
  'dissolving': ['building', 'concentrating', 'enhancing', 'focusing', 'intensifying', 'sculpting', 'solidifying', 'strengthening', 'uniting'], // dissolving
  'dissonance': ['equilibrium', 'museum', 'unify', 'unison'], // dissonance
  'dissonant': ['harmonic', 'symphonic'], // dissonant
  'dissuade': ['encourage'], // dissuade
  'distance': ['closeness', 'embrace', 'intimacy', 'proximity', 'togetherness', 'unity'], // distance
  'distant': ['accessible', 'connected', 'empathetic', 'engaged', 'experiential', 'familiar', 'foreground', 'immerse', 'intimate', 'near', 'obtainable', 'present', 'relatable', 'visible', 'warm'], // distant
  'distinct': ['aggregate', 'ambiguous', 'bland', 'blended', 'common', 'faceless', 'false', 'generic', 'indistinct', 'interstitial', 'merged', 'muffled', 'nebulous', 'pedestrian', 'sameness', 'smeared', 'subduing', 'unfocused', 'vague'], // Distinct
  'distinction': ['bland', 'common', 'indistinct', 'overlapping', 'uniform'], // distinction
  'distinctive': ['ordinary'], // distinctive
  'distinctness': ['ambiguity', 'blurriness', 'indistinct', 'uniformity'], // Distinctness
  'distorted': ['clear', 'defined', 'orderly', 'smooth', 'straight'], // Distorted
  'distortion': ['clarity', 'definition', 'integrity', 'objectivity', 'order'], // Distortion
  'distracted': ['attentive', 'aware', 'centered', 'concentrated', 'engaged', 'focused', 'immersive', 'intent', 'intentional', 'mindful', 'observant', 'perceptive', 'studious'], // distracted
  'distraction': ['advertising', 'attention', 'demand', 'edutainment', 'heavy', 'relevance'], // Distraction
  'distress': ['composure', 'flawless', 'polished', 'pristine', 'smooth', 'well-being'], // Distress
  'distressed': ['fresh', 'neat', 'orderly', 'perfect', 'polished', 'pristine', 'refined', 'smooth'], // Distressed
  'distributed': ['centralized', 'consolidated', 'contained', 'unified'], // Distributed
  'distribution': ['editorial', 'harmony'], // Distribution
  'distrust': ['affection', 'confidence', 'conscience', 'faith', 'grounding', 'honesty', 'interest', 'like', 'literary', 'openness', 'presence', 'selection', 'sincerity', 'transparency', 'trust', 'trustworthy'], // distrust
  'disunity': ['agreement', 'cohesion', 'collaboration', 'concord', 'connect', 'consensus', 'consolidate', 'fusion', 'harmony', 'solidarity', 'synergy', 'togetherness', 'unity'], // disunity
  'diurnus': ['nocturn'], // diurnus
  'diverge': ['align', 'conform', 'integrate'], // diverge
  'divergence': ['consistency', 'convergence', 'unity'], // Divergence
  'divergent': ['analogous', 'normalcy'], // divergent
  'diverse': ['binary', 'homogeneous', 'mono', 'monochrome', 'monolithic', 'monotonous', 'repetitive', 'similar', 'uniform'], // Diverse
  'diversity': ['conformity', 'consensus', 'homogeneity', 'minimize', 'monoculture', 'monopoly', 'repetition', 'sameness', 'singularity', 'uniformity'], // Diversity
  'divide': ['assemble', 'blend', 'combine', 'connect', 'consolidate', 'harmonize', 'integrate', 'interlink', 'merge', 'stack', 'synthesis', 'synthesize', 'unify', 'unite'], // divide
  'divided': ['integrated', 'shared', 'unified', 'united', 'whole'], // divided
  'dividing': ['blending', 'cohesive', 'combining', 'conglomerating', 'harmonizing', 'integrating', 'merging', 'uniting', 'whole'], // dividing
  'division': ['connect', 'conquer', 'fusion', 'inclusivity', 'interfacing', 'togetherness', 'unison'], // division
  'divisive': ['cohesive', 'collective', 'connected', 'harmonious', 'inclusive', 'inclusivity', 'integrated', 'unifying', 'whole'], // divisive
  'diy': ['catering'], // DIY
  'docile': ['defiant', 'rebel'], // docile
  'docs': ['composition', 'contrast', 'messy'], // Docs
  'doctrinal': ['chaotic', 'disordered', 'flexible', 'fluid', 'informal', 'informal-inquiry', 'open', 'random', 'spontaneous'], // doctrinal
  'documentary': ['cinematic'], // documentary
  'dogma': ['interpretation'], // Dogma
  'domain': ['chaos', 'disorder', 'void'], // Domain
  'dome': ['broken', 'flat', 'level', 'plane', 'surface', 'void'], // Dome
  'domestic': ['nautical', 'premium'], // Domestic
  'domesticated': ['feral'], // domesticated
  'domestication': ['wilderness'], // domestication
  'dominance': ['decentralization', 'editorial', 'feminine', 'harmony', 'humble', 'submission', 'symbiosis'], // Dominance
  'dominant': ['peripheral'], // dominant
  'donation': ['payments'], // Donation
  'doodle': ['formal', 'precise', 'structured'], // Doodle
  'dormancy': ['activity', 'awakening', 'brightness', 'energy', 'flourish', 'growth', 'life', 'movement', 'pulse', 'vitality'], // dormancy
  'dormant': ['activating', 'active', 'alert', 'alive', 'appearing', 'bustling', 'dynamic', 'energized', 'energy', 'flourishing', 'moving', 'vibrant'], // dormant
  'dot': ['line', 'plane', 'surface', 'wave'], // Dot
  'doubt': ['accept', 'assertion', 'assurance', 'belief', 'certainty', 'confidence', 'conviction', 'faith', 'hopeful', 'security', 'trust', 'valor'], // doubt
  'doubtful': ['assured', 'believing', 'certain', 'clear', 'confident', 'positive', 'reassuring', 'robust', 'secure', 'trusting'], // doubtful
  'doubting': ['acceptance', 'affirmation', 'assurance', 'certainty', 'confidence', 'conviction', 'faith', 'skyward', 'trust'], // doubting
  'douse': ['ignite'], // douse
  'down': ['above', 'elevated', 'rise', 'top', 'up'], // down
  'downcast': ['elevated', 'engaged', 'enthusiastic', 'excited', 'harmonious', 'joyful', 'passionate', 'upbeat', 'vibrant'], // downcast
  'drab': ['attractive', 'bold', 'brilliant', 'colorful', 'dazzling', 'dynamic', 'enchanted', 'fullness', 'glamour', 'highlight', 'liveliness', 'lively', 'luxe', 'radiance', 'radiant', 'rich', 'stimulating', 'vibrancy', 'vibrant', 'vividness'], // drab
  'drag': ['bright', 'cheerful', 'dynamic', 'energize', 'exciting', 'lift', 'lively', 'uplift', 'vibrant'], // drag
  'dragged': ['calm', 'consistent', 'easy', 'free', 'gentle', 'predictable', 'smooth', 'steady', 'uplift'], // dragged
  'drain': ['bold', 'bright', 'cheerful', 'colorful', 'lively', 'radiant', 'rich', 'saturation', 'vibrant'], // drain
  'drained': ['alive', 'bright', 'dynamic', 'energetic', 'energized', 'full', 'lively', 'rich', 'vibrant'], // drained
  'draining': ['energizing', 'enriching', 'exciting', 'invigorating', 'refreshing', 'stimulating', 'tranquility', 'uplifting', 'vibrant'], // draining
  'dramatic': ['calm', 'cool', 'cozy', 'harmony', 'play', 'warm'], // Dramatic
  'drawer': ['composition', 'contrast'], // Drawer
  'drawing': ['erased', 'illustration', 'led'], // Drawing
  'dream': ['clarity', 'despair', 'dullness', 'fact', 'failure', 'reality', 'stagnation'], // dream
  'dreamlike': ['concrete', 'led', 'literal', 'mundane', 'ordinary', 'realistic'], // Dreamlike
  'dreariness': ['exuberance'], // dreariness
  'dreary': ['bright', 'cheerful', 'enchanting', 'festive', 'jovial', 'joyful', 'lively', 'radiant', 'uplifted', 'uplifting-contrast', 'vibrant', 'wholesome'], // dreary
  'drift': ['anchor', 'center', 'control', 'focus', 'root', 'stability'], // Drift
  'drifting': ['rooting'], // drifting
  'drive': ['heavy', 'idleness', 'passivity', 'rest', 'sloth'], // Drive
  'driven': ['apathetic', 'complacent', 'indifferent', 'laziness', 'lazy', 'passive', 'slack', 'slacker', 'static'], // Driven
  'drop': ['composition', 'contrast', 'elevation', 'peak', 'raise', 'rise', 'soar'], // Drop
  'dropped': ['raised'], // dropped
  'drought': ['produce', 'profit'], // drought
  'drown': ['bloom', 'expand', 'float', 'rise', 'shine', 'surge', 'thrive', 'uplift'], // drown
  'drowsiness': ['alertness'], // drowsiness
  'drowsy': ['awake'], // drowsy
  'drudgery': ['creativity', 'dynamism', 'energy', 'excitement', 'freedom', 'hobby', 'idyll', 'joy', 'leisure', 'playfulness', 'vibrancy'], // drudgery
  'dry': ['absorbent', 'alive', 'aqueous', 'bakery', 'beverage', 'bright', 'cloudy', 'colorful', 'dynamic', 'flood', 'foliage', 'lush', 'muddy', 'oceanic', 'plump', 'rich', 'splash', 'steam', 'sweet', 'symphonic', 'verdant', 'vibrant', 'viscous', 'wet'], // dry
  'duality': ['singularity', 'unity', 'wholeness'], // Duality
  'ductile': ['brittle'], // ductile
  'dull': ['adventurous', 'aether', 'alluring', 'apex', 'art', 'attracting', 'attractive', 'beverage', 'blazing', 'bold', 'bright', 'brilliant', 'captivating', 'colorful', 'crisp', 'crystalline', 'dazzling', 'deeptech', 'depictive', 'dynamic', 'elaborate', 'enchanted', 'evocative', 'exceptional', 'exciting', 'extraordinary', 'fi', 'fiery', 'flamboyant', 'flare', 'flashy', 'flawless', 'glare', 'glassy', 'glazed', 'gleaming', 'graded', 'heated', 'highlight', 'ignited', 'ingenuity', 'intensify', 'kaleidoscopic', 'lavish', 'liveliness', 'lively', 'luminescent', 'lustrous', 'macro', 'murals', 'novel', 'perfect', 'phosphor', 'pleasant', 'propulsive', 'radiance', 'rich', 'scholarly', 'sharp', 'sheen', 'shimmer', 'shine', 'shiny', 'spark', 'stellar', 'stimulating', 'storyful', 'striking', 'thrive', 'thunders', 'unleash', 'uproarious', 'vibrancy', 'vibrant', 'vibration', 'vividness', 'volatile', 'wearables', 'xr', 'yachting', 'youthfulness', 'zesty'], // dull
  'dullard': ['animated', 'bold', 'colorful', 'dynamic', 'engaging', 'exciting', 'intellect', 'lively', 'vibrant'], // dullard
  'dullness': ['aesthetics', 'awakening', 'beauty', 'dream', 'edutainment', 'euphoria', 'exuberance', 'hype', 'liveliness', 'luminescence', 'might', 'reflectivity', 'richness', 'stimulation', 'zeal'], // dullness
  'duotone': ['cool', 'cozy', 'harmony', 'key', 'play'], // Duotone
  'duplicity': ['sincerity'], // duplicity
  'durable': ['disposable'], // durable
  'durables': ['bakery'], // Durables
  'dusk': ['aurora', 'dawn', 'day', 'light', 'morning', 'sunrise'], // Dusk
  'dust': ['clean', 'clear', 'polished', 'refined', 'smooth'], // Dust
  'duty': ['freetime', 'hobby', 'leisure'], // duty
  'dwelling': ['detachment', 'dislocation', 'dispersal', 'vacate'], // Dwelling
  'dynamic': ['2d', 'artifact', 'banal', 'barren', 'bland', 'blocky', 'blunt', 'bore', 'bored', 'boring', 'boxy', 'complacent', 'constant', 'cumbersome', 'dormant', 'drab', 'drag', 'drained', 'dry', 'dull', 'dullard', 'faceless', 'frozen', 'glacial', 'halt', 'halted', 'hushing', 'idle', 'insipid', 'introverted', 'lame', 'lazy', 'lethargic', 'lifeless', 'mediocre', 'mono', 'monotonous', 'mundane', 'null', 'ordinary', 'passive', 'paused', 'pedestrian', 'plain', 'ponderous', 'regression', 'repetitive', 'reserved', 'slack', 'slacker', 'sluggish', 'staged', 'stale', 'statuary', 'stiff', 'stifled', 'stilted', 'stopped', 'stuck', 'stuffy', 'subduing', 'suppressed', 'tedious', 'timid', 'tired', 'unchanged', 'unchanging', 'unmoved', 'vacancy', 'weak', 'weary'], // dynamic
  'dynamism': ['drudgery', 'editorial', 'harmony', 'tranquility'], // Dynamism
  'dysfunction': ['efficacy'], // dysfunction
  'dystopia': ['idyll', 'utopia'], // dystopia
  'dystopian': ['utopian'], // dystopian
  'dystopic': ['bright', 'hopeful', 'ideal', 'joyful', 'optimistic', 'peaceful', 'positive', 'utopian', 'utopic'], // dystopic
  'e-commerce': ['local', 'physical', 'tangible'], // E-commerce
  'earnest': ['heavy', 'insincere', 'silly', 'superficial'], // Earnest
  'earth': ['absence', 'aether', 'artifice', 'chaos', 'ether', 'futility', 'sky', 'spirit', 'stratosphere', 'unreality', 'void'], // earth
  'earthbound': ['skyward', 'stellar'], // earthbound
  'earthen': ['artificial', 'emerald', 'energetic', 'hues', 'indigo', 'iridescent', 'key', 'limited', 'nocturne', 'palette', 'pop', 'primary', 'shadow', 'silver', 'stark', 'varied'], // Earthen
  'earthiness': ['abstract', 'alien', 'artificial', 'artificiality', 'otherworldly', 'sterile', 'synthetic'], // Earthiness
  'earthly': ['astral', 'celestial', 'stellar'], // earthly
  'earthy': ['alien', 'cosmic', 'ethereal'], // earthy
  'ease': ['agitation', 'agony', 'anguish', 'backward', 'burden', 'challenge', 'complication', 'discomfort', 'frustration', 'grind', 'guilt', 'hassle', 'heavy', 'imposition', 'narrowness', 'obstacle', 'pain', 'panic', 'strain', 'stress', 'strife', 'struggle', 'torment', 'warning', 'weight'], // Ease
  'easy': ['agitated', 'arduous', 'burdened', 'burdensome', 'challenging', 'chaotic', 'complex', 'cumbersome', 'demanding', 'dragged', 'hard', 'harried', 'intense', 'laborious', 'stern', 'stiff', 'stilted', 'strange', 'strenuous', 'stressful', 'tense', 'tightened', 'uneasy'], // easy
  'eccentric': ['grounded', 'mainstream', 'normal'], // eccentric
  'eccentricity': ['concentricity'], // eccentricity
  'echo': ['absence', 'silence', 'void'], // Echo
  'eclectic': ['basic', 'bauhaus', 'classicism', 'editorial', 'functionalist', 'harmony', 'japandi', 'monotonous', 'nordic', 'predictable'], // Eclectic
  'eclipse': ['brightness', 'clarity', 'daylight', 'exposure', 'light', 'origin', 'radiance', 'shine', 'visibility'], // Eclipse
  'eco-tech': ['chaos', 'dirt', 'fossil', 'heavy', 'obsolete', 'pollute', 'polluting', 'toxic', 'unsustainable', 'waste', 'wasteful'], // Eco-tech
  'ecology': ['pollution', 'premium'], // Ecology
  'ecommerce': ['local', 'physical', 'tangible'], // Ecommerce
  'economy': ['chaos', 'disorder', 'excess', 'inefficiency', 'waste'], // Economy
  'ecosystem': ['chaos', 'disorder', 'dissolution', 'fragmentation', 'isolation'], // Ecosystem
  'edge': ['blob', 'corner', 'curve', 'editorial', 'harmony'], // Edge
  'edgy': ['sweet'], // Edgy
  'editorial': ['centered', 'centrality', 'directness', 'dispersal', 'dispersion', 'distribution', 'dominance', 'dynamism', 'eclectic', 'edge', 'focus', 'geometry', 'grace', 'intricate', 'linearity', 'luminosity', 'monumental', 'negative', 'ornamentation', 'perspective', 'polish', 'portrait', 'simplicity', 'simplification', 'sleekness', 'softness', 'spatial', 'spontaneity', 'tension', 'texture', 'unbounded', 'uniformity', 'variety'], // Editorial
  'edtech': ['analogue', 'basic', 'chaos', 'craft', 'disorder', 'ignorance', 'industrial', 'manual', 'obsolete', 'traditional'], // EdTech
  'educated': ['illiterate'], // educated
  'education': ['chaos', 'disorder', 'ignorance', 'neglect', 'stagnation', 'stupidity'], // Education
  'edutainment': ['abstract', 'academic', 'boredom', 'chaos', 'confusion', 'distraction', 'dullness', 'ignorance', 'neglect', 'professional', 'pure entertainment', 'pure-entertainment'], // Edutainment
  'eerie': ['heavy', 'sane'], // Eerie
  'effective': ['futile', 'impractical', 'pointless'], // effective
  'effects': ['composition', 'contrast'], // Effects
  'efficacy': ['chaos', 'confusion', 'disorder', 'dysfunction', 'emptiness', 'failure', 'ineffectiveness', 'inefficacy', 'inefficiency', 'waste'], // Efficacy
  'efficiency': ['cluttered', 'disorder', 'excessive', 'sloppiness'], // Efficiency
  'efficient': ['impractical', 'wasteful'], // efficient
  'effort': ['idleness'], // effort
  'effortful': ['imperfect'], // effortful
  'effortless': ['arduous', 'burdensome', 'conflicted', 'heavy', 'strenuous'], // Effortless
  'elaborate': ['bare', 'base', 'basic', 'crude', 'dull', 'minimal', 'plain', 'rudimentary', 'simple', 'sparse', 'stoic'], // elaborate
  'elderly-care': ['childcare'], // Elderly-care
  'electrified': ['heavy', 'unmoved'], // Electrified
  'electronic': ['postal'], // electronic
  'electronics': ['automotive', 'biotech', 'hospitality', 'jewelry', 'textile'], // Electronics
  'elegance': ['brutality', 'filth', 'squalor'], // elegance
  'elegant': ['awkwardness', 'brutal', 'brutalism', 'brutalist', 'clumsy', 'clunky', 'composition', 'contrast', 'crude', 'disheveled', 'faddish', 'frumpy', 'fussy', 'gaudy', 'gritty', 'grotesque', 'grunge', 'grungy', 'industrial', 'janky', 'kitsch', 'ragged', 'scrappy', 'shabby', 'sloppy', 'streetwear', 'tacky', 'vulgar', 'wacky'], // Elegant
  'element': ['absence', 'chaos', 'void'], // Element
  'elements': ['composition', 'contrast'], // Elements
  'elevate': ['descend', 'low', 'lower', 'plummet', 'plunge', 'regress'], // elevate
  'elevated': ['base', 'down', 'downcast', 'flat', 'low', 'lower', 'mundane', 'ordinary', 'petty', 'trivial'], // Elevated
  'elevation': ['base', 'decline', 'depression', 'descent', 'drop', 'flattening', 'plummet'], // Elevation
  'elite': ['average', 'basic', 'casual-collection', 'cheap', 'common', 'inferior', 'mediocre', 'ordinary', 'simple', 'subpar'], // Elite
  'elusive': ['obtainable'], // elusive
  'emanation': ['ice', 'suppression'], // Emanation
  'ember': ['frost', 'light', 'void'], // Ember
  'embodied': ['disembodied'], // embodied
  'embodied-experience': ['disembodied'], // embodied-experience
  'embodiment': ['abstract', 'detached', 'disembodied', 'disembodiment'], // Embodiment
  'embodying': ['diluting'], // embodying
  'embrace': ['abandon', 'alienation', 'confront', 'critique', 'detachment', 'disconnection', 'dislike', 'dismiss', 'dismissal', 'distance', 'evade', 'expulsion', 'isolation', 'reject', 'rejecting', 'resign', 'separation', 'shunning', 'solitude'], // embrace
  'embraced': ['alienated', 'detached', 'dismissed', 'disregarded', 'excluded', 'ignored', 'neglected', 'rejected', 'repelled'], // embraced
  'embracing': ['fleeing', 'rejecting', 'shunning', 'withholding'], // embracing
  'emerald': ['earthen', 'energetic', 'hues', 'indigo', 'iridescent', 'limited', 'nocturne', 'palette', 'pop', 'primary', 'shadow', 'silver', 'stark', 'varied'], // Emerald
  'emerge': ['disappear', 'hide', 'past'], // emerge
  'emergence': ['disintegration', 'ended', 'endgame', 'stagnation', 'suppression', 'uniformity'], // Emergence
  'emerging': ['diminishing', 'disappearing', 'fading', 'vanishing'], // emerging
  'emission': ['absorption', 'clarity', 'containment', 'inhalation', 'purity', 'retention'], // Emission
  'emissive': ['absorbent', 'muted', 'opaque', 'subdued'], // Emissive
  'emit': ['absorb', 'contain', 'restrict', 'suppress'], // emit
  'emotion': ['calm', 'detachment', 'indifference', 'logic', 'objectivity'], // Emotion
  'emotional': ['analytical', 'cerebral', 'dispassionate', 'rational', 'scientific', 'stoic'], // emotional
  'emotional-design': ['rational'], // emotional-design
  'emotionalist': ['logical'], // emotionalist
  'empathetic': ['aloof', 'apathetic', 'callous', 'cold', 'detached', 'disjoint', 'distant', 'harsh', 'indifferent', 'selfish', 'unfeeling'], // Empathetic
  'empathy': ['alienation', 'apathy', 'coldness', 'cruelty', 'detachment', 'disconnection', 'hostility', 'indifference'], // Empathy
  'emphasis': ['erasure'], // emphasis
  'emphasize': ['forget', 'ignore', 'minimize'], // emphasize
  'emphasized': ['disregarded'], // emphasized
  'emphasizing': ['muting', 'suppressing'], // emphasizing
  'empirical': ['theoretical'], // empirical
  'empowered': ['defeated', 'heavy', 'suppressed', 'weakened'], // Empowered
  'empowering': ['constraining', 'diminished', 'disempowering', 'helpless', 'ineffective', 'oppressive', 'powerless', 'restricting', 'stifling', 'submissive', 'weak'], // Empowering
  'empowerment': ['disempowerment', 'disenfranchisement', 'marginalization', 'oppression', 'subjugation'], // Empowerment
  'emptiness': ['art', 'bounty', 'canvas', 'conception', 'efficacy', 'energy', 'euphoria', 'experience', 'flotilla', 'fulfillment', 'fullness', 'gravitas', 'identity', 'ingredients', 'materials', 'microcosm', 'might', 'narrowness', 'need', 'nourishment', 'pressure', 'purpose', 'richness', 'sense', 'significance', 'success'], // emptiness
  'empty': ['alive', 'beverage', 'bubble', 'busy', 'buzz', 'closed', 'complete', 'dense', 'fertile', 'filled', 'flood', 'freight', 'full', 'genuineness', 'humble', 'layered', 'meaning', 'merchandise', 'mosaic', 'murals', 'rich', 'skillful', 'sticker', 'unleash'], // Empty
  'encasement': ['dispersal', 'exposure', 'freedom', 'openness', 'transparency'], // Encasement
  'enchanted': ['bland', 'drab', 'dull', 'mundane', 'ordinary'], // Enchanted
  'enchanting': ['bland', 'dreary', 'mundane', 'ordinary', 'unremarkable'], // Enchanting
  'enclosed': ['chaotic', 'exposed', 'fluid', 'free', 'open', 'open-top', 'scattered', 'unbound'], // Enclosed
  'enclosure': ['dispersal', 'expansion', 'exposure', 'freedom', 'openness', 'street'], // Enclosure
  'encourage': ['demotivate', 'depress', 'discourage', 'dismiss', 'dissuade', 'hinder', 'neglect', 'stifle'], // encourage
  'end': ['beginning', 'continuation', 'cycle', 'day', 'genesis', 'growth', 'immortality', 'inception', 'life', 'loop', 'open', 'origin', 'prelude', 'repeat', 'rise', 'source', 'start', 'threshold'], // end
  'ended': ['becoming', 'beginning', 'continuation', 'development', 'emergence', 'expansion', 'flourish', 'growth', 'start'], // ended
  'endgame': ['beginning', 'emergence', 'exploration', 'growth', 'introduction', 'journey', 'prelude', 'start', 'unfolding'], // Endgame
  'endless': ['bounded', 'concrete', 'defined', 'ephemeral', 'finite', 'fixed', 'limit', 'limited', 'momentary', 'restrictive', 'temporal', 'temporary'], // endless
  'endlessness': ['bounded', 'constrained', 'contained', 'defined', 'finite', 'limited', 'momentary', 'mortality', 'temporary'], // endlessness
  'endorsement': ['disapproval'], // endorsement
  'endurance': ['fleeing', 'fragility', 'instability', 'transience'], // Endurance
  'enduring': ['disposable', 'ephemeral', 'evanescent', 'fleeting', 'folding', 'momentary', 'mutable', 'temporary', 'transient'], // Enduring
  'energetic': ['calm', 'cool', 'coolness', 'drained', 'earthen', 'emerald', 'laziness', 'lazy', 'lethargic', 'lifeless', 'monotonous', 'passive', 'peace', 'peaceful', 'rest', 'serene', 'sluggish', 'timid'], // Energetic
  'energize': ['drag'], // energize
  'energized': ['despairing', 'dormant', 'drained', 'tired', 'weary'], // energized
  'energizing': ['draining', 'tiring'], // energizing
  'energy': ['blackout', 'dormancy', 'dormant', 'drudgery', 'emptiness', 'inertia', 'sloth', 'sluggish', 'stagnation', 'stillness', 'void'], // Energy
  'engage': ['apathy', 'bore', 'detachment', 'disconnect', 'disengage', 'disinterest', 'dismiss', 'escape', 'evade', 'halt', 'ignore', 'indifference', 'neglect', 'retreat', 'vacate'], // engage
  'engaged': ['absent', 'aimless', 'aloof', 'apathetic', 'bored', 'complacent', 'detached', 'disengaged', 'disinterested', 'disjoint', 'dismissive', 'dispassionate', 'distant', 'distracted', 'downcast', 'idle', 'indifferent', 'laziness', 'mindless', 'oblivious', 'passive', 'resigned', 'shallow', 'slacker', 'uninvolved', 'unmoved'], // engaged
  'engaged-presence': ['absent'], // engaged-presence
  'engagement': ['abandon', 'abandonment', 'alienation', 'boredom', 'detachment', 'disinterest', 'dismissal', 'escape', 'heavy', 'idleness', 'negation', 'negligence', 'passivity', 'reflection', 'shunning', 'solitude'], // Engagement
  'engaging': ['blunt', 'boring', 'dullard', 'insipid', 'isolating', 'lame', 'repellent', 'repelling', 'tedious', 'tiring'], // engaging
  'engineered': ['natural', 'organic', 'primitive', 'raw', 'spontaneous'], // Engineered
  'engineering': ['abstract', 'arts', 'chaos', 'disorder', 'humanities', 'improvisation', 'instability', 'mess', 'randomness', 'services', 'spontaneity'], // Engineering
  'engrave': ['disregard', 'erase', 'fade', 'ignore', 'neglect', 'obliterate', 'remove', 'simplify'], // Engrave
  'enhance': ['damage', 'deplete', 'erode', 'hinder', 'muffle', 'shrink'], // enhance
  'enhanced': ['erased'], // enhanced
  'enhancement': ['deterioration'], // enhancement
  'enhancing': ['diluting', 'dissolving', 'erasing'], // enhancing
  'enigmatic': ['clear', 'direct', 'familiar', 'obvious', 'simple', 'straightforward'], // Enigmatic
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
  'envelop': ['expose', 'reveal', 'strip', 'uncover', 'unveiling'], // Envelop
  'envelopment': ['detachment', 'disclosure', 'dispersal', 'exposure', 'freedom', 'isolation', 'openness', 'release', 'scattering', 'separation'], // Envelopment
  'environment': ['artificial', 'constructed', 'manmade', 'synthetic', 'urban'], // Environment
  'ephemera': ['horology', 'substance'], // Ephemera
  'ephemeral': ['archival', 'endless', 'enduring', 'eternal', 'lingering', 'museum', 'permanent', 'perpetual', 'publishing', 'root', 'rooting', 'statuary', 'timeless', 'timelessness'], // Ephemeral
  'ephemerality': ['legacy', 'perpetuity', 'persistence'], // ephemerality
  'epic': ['banal', 'insignificant', 'mundane', 'ordinary', 'small', 'trivial'], // Epic
  'equality': ['hierarchy', 'inferior'], // equality
  'equilibrium': ['chaos', 'disorder', 'dissonance', 'imbalance', 'tension'], // Equilibrium
  'equipment': ['beverage'], // Equipment
  'erase': ['construct', 'engrave', 'imprint', 'sculpt', 'trace'], // erase
  'erased': ['defined', 'drawing', 'enhanced', 'expressed', 'filled', 'highlighted', 'marked', 'present', 'visible'], // erased
  'erasing': ['adding', 'building', 'creating', 'enhancing', 'filling', 'layering', 'sculpting'], // erasing
  'erasure': ['assertion', 'clarity', 'creation', 'definition', 'detail', 'emphasis', 'expression', 'painting', 'presence', 'visibility'], // erasure
  'ergonomic': ['awkwardness', 'clumsy', 'crude', 'disorder', 'excessive', 'restrictive'], // Ergonomic
  'erode': ['build', 'construct', 'create', 'enhance', 'expand', 'preserve', 'restore', 'solid', 'strengthen'], // erode
  'erratic': ['behavioral', 'deliberate', 'methodical', 'predictable', 'reliable'], // erratic
  'erupt': ['calm', 'contained', 'gentle', 'peaceful', 'quiet', 'smooth', 'still', 'subdue', 'subdued'], // Erupt
  'escape': ['attachment', 'bondage', 'confinement', 'confront', 'engage', 'engagement', 'immerse', 'inclusion', 'presence', 'remain', 'stuck'], // Escape
  'escapism': ['premium'], // Escapism
  'essence': ['facade', 'husk'], // essence
  'essential': ['cosmetics', 'disposable', 'extraneous', 'insignificant', 'irrelevant', 'obsolescence', 'obsolete', 'pointless', 'useless', 'worthless'], // essential
  'essentialism': ['cluttered', 'complex', 'excess', 'excessive'], // Essentialism
  'essentials': ['merchandise'], // Essentials
  'establish': ['break'], // establish
  'established': ['unfounded', 'unvalued'], // established
  'estate': ['layout', 'serif'], // Estate
  'estrangement': ['closeness', 'connect'], // estrangement
  'eternal': ['brief', 'chronos', 'ephemeral', 'finite', 'fleeting', 'limited', 'momentary', 'perishable', 'seasons', 'temporary', 'transient'], // Eternal
  'eternal-now': ['fugitive'], // eternal-now
  'eternity': ['chronos', 'closing', 'fleeting', 'moment', 'mortality', 'temporary', 'time', 'transient'], // eternity
  'ether': ['earth'], // ether
  'ethereal': ['chthonic', 'concrete', 'earthy', 'geology', 'mineral', 'mundane', 'solid', 'tangibility', 'tangible', 'terrestrial'], // Ethereal
  'ethereal-lightness': ['burdened'], // ethereal-lightness
  'euphoria': ['boredom', 'despair', 'dullness', 'emptiness', 'gloom', 'misery', 'sadness', 'sorrow', 'unhappiness'], // Euphoria
  'euphoric': ['dismal', 'heavy'], // Euphoric
  'european': ['exotic', 'premium'], // European
  'evade': ['approach', 'capture', 'confront', 'connect', 'embrace', 'engage', 'enter', 'expose', 'reveal'], // evade
  'evaluation': ['dismissal', 'disregard', 'neglect'], // Evaluation
  'evanescent': ['chronos', 'constant', 'enduring', 'fixed', 'immovable', 'lasting', 'permanent', 'solid', 'stable'], // Evanescent
  'even': ['bump', 'bumpy', 'craggy', 'curvy', 'jagged', 'oblique', 'splotchy', 'uneven', 'wavy'], // even
  'evening': ['activity', 'awakening', 'brightness', 'dawn', 'day', 'morning'], // Evening
  'event': ['absence', 'monotony', 'silence', 'stagnation', 'void'], // Event
  'everyday': ['exceptional', 'extraordinary', 'rare', 'unique'], // everyday
  'everyday-eats': ['uncommon'], // everyday-eats
  'everyday-practicality': ['fictional'], // everyday-practicality
  'evidence': ['myth'], // evidence
  'evident': ['invisible', 'uncertain'], // evident
  'evocative': ['bland', 'dull', 'flat', 'mundane', 'uninspired'], // Evocative
  'evolution': ['decay', 'obsolescence', 'regression', 'stagnation', 'static'], // Evolution
  'evolve': ['decline', 'descend', 'diminish', 'regress', 'stagnate'], // Evolve
  'evolving': ['unchanged', 'unchanging'], // evolving
  'exact': ['ambiguous', 'chaotic', 'disordered', 'imprecise', 'imprecision', 'inexact', 'loose', 'postlude', 'random', 'vague'], // exact
  'exactness': ['impression'], // exactness
  'exaggeration': ['calm', 'focus', 'minimalism', 'order', 'restraint', 'simplicity', 'subtlety', 'understatement'], // exaggeration
  'excellence': ['deficiency', 'failure', 'inferiority', 'mediocrity', 'ordinariness'], // Excellence
  'exceptional': ['average', 'basic', 'bland', 'common', 'dull', 'everyday', 'mediocre', 'ordinary', 'pedestrian', 'unremarkable'], // exceptional
  'excess': ['economy', 'essentialism', 'minimalism', 'moderation', 'plain', 'proportion', 'restraint', 'scarcity', 'simplicity', 'subdued'], // excess
  'excessive': ['basic', 'efficiency', 'ergonomic', 'essentialism', 'functionalism', 'minimal', 'minimalism', 'minimalistic', 'modest', 'ordinary', 'plain', 'pristine', 'simple', 'sparse', 'subdued', 'swiss'], // excessive
  'excite': ['bore', 'heavy'], // Excite
  'excited': ['apathetic', 'bored', 'downcast', 'numb'], // excited
  'excitement': ['boredom', 'disinterest', 'drudgery', 'heavy'], // Excitement
  'exciting': ['banal', 'bland', 'boring', 'drag', 'draining', 'dull', 'dullard', 'insipid', 'lame', 'lifeless', 'mediocre', 'monotonous', 'mundane', 'repetitive', 'stale', 'tedious', 'tiring'], // exciting
  'exclude': ['integrate'], // exclude
  'excluded': ['embraced', 'immerse'], // excluded
  'exclusion': ['absorption', 'access', 'companion', 'hospitality', 'penetration', 'privilege'], // Exclusion
  'exclusive': ['accessible', 'cheap', 'collaborative', 'common', 'peripheral', 'public', 'ubiquitous'], // exclusive
  'exclusivity': ['accessibility', 'commonality', 'inclusivity', 'openness', 'universality'], // Exclusivity
  'exhibition': ['covert', 'illustration', 'led', 'private'], // Exhibition
  'exile': ['acceptance', 'belonging', 'community', 'connection', 'homecoming', 'inclusion', 'integration', 'sanctuary', 'unity'], // exile
  'exist': ['disappear', 'nonexist'], // exist
  'existence': ['absence', 'nonexist', 'nothing', 'nullity', 'obliteration', 'oblivion', 'void'], // existence
  'existent': ['absent'], // existent
  'existing': ['disembodiment', 'imaginary'], // existing
  'exit': ['remain'], // exit
  'exotic': ['common', 'european', 'familiar', 'mundane', 'ordinary', 'plain', 'predictable', 'simple', 'standard'], // exotic
  'expand': ['collapse', 'confine', 'constrain', 'constrict', 'contract', 'diminish', 'discourage', 'drown', 'erode', 'limit', 'plunge', 'reduce', 'regress', 'restrict', 'shrink', 'shrivel', 'thaw', 'wither'], // expand
  'expanded': ['folded'], // expanded
  'expanding': ['compressing', 'narrowing'], // expanding
  'expanse': ['closure', 'confinement', 'contraction', 'corridor', 'limitation', 'narrowness'], // Expanse
  'expansion': ['bounded', 'closing', 'compression', 'confinement', 'constraint', 'containment', 'contraction', 'deadend', 'decline', 'deprivation', 'diminution', 'enclosure', 'ended', 'limitation', 'minimize', 'narrowing', 'narrowness', 'negation', 'reduction', 'restriction', 'suppression', 'tunnel'], // Expansion
  'expansive': ['confining', 'contained', 'diminutive', 'dismissive', 'finite', 'limit', 'micro', 'restrictive', 'small'], // expansive
  'expansive-freedom': ['bondage', 'captivity', 'restriction'], // expansive-freedom
  'expansiveness': ['petiteness'], // expansiveness
  'expected': ['offbeat'], // expected
  'expensive': ['cheap'], // expensive
  'experience': ['detachment', 'disconnection', 'disengagement', 'emptiness', 'isolation', 'naivety'], // Experience
  'experiences': ['merchandise'], // Experiences
  'experiential': ['abstract', 'detached', 'disembodied', 'distant', 'static', 'theoretical'], // Experiential
  'experimental': ['classicism', 'commercial', 'composition', 'contrast', 'mainstream', 'mundane'], // Experimental
  'expert': ['amateur'], // expert
  'expertise': ['clueless', 'clumsiness', 'disorder', 'ignorance', 'inexperience', 'naivety'], // Expertise
  'expire': ['active', 'begin', 'fresh', 'live', 'present', 'renew', 'start', 'sustain', 'vibrant'], // expire
  'explicit': ['ambiguous', 'general', 'subtext', 'uncertain', 'unclear', 'vague'], // explicit
  'exploitation': ['care', 'conservation', 'freedom', 'inclusion', 'nurture', 'philanthropy', 'support', 'unity'], // exploitation
  'exploration': ['captivity', 'endgame'], // exploration
  'exploratory': ['conventional', 'fixed', 'predictable', 'routine', 'static'], // Exploratory
  'explosive': ['calm', 'gentle', 'muted-emotion', 'peaceful', 'quiet', 'smooth', 'stable', 'static', 'subdued'], // explosive
  'expose': ['closed', 'envelop', 'evade', 'hide', 'lock', 'muffle', 'shroud', 'whisper'], // expose
  'exposed': ['armored', 'cloistered', 'concealed', 'covered', 'covert', 'curtained', 'discretion', 'enclosed', 'fortified', 'guarded', 'invisible', 'masked', 'obscuring', 'private', 'sealed', 'shielded', 'shrouded', 'subsurface', 'unseen', 'veiled', 'veiling'], // exposed
  'exposing': ['concealing', 'hiding'], // exposing
  'exposure': ['concealment', 'cybersecurity', 'eclipse', 'encasement', 'enclosure', 'envelopment', 'hiding', 'obscurity', 'protection', 'safety', 'sanctuary', 'seclusion', 'shade', 'shelter', 'shield', 'tunnel'], // Exposure
  'express': ['muffle'], // express
  'expressed': ['erased', 'suppressed'], // expressed
  'expressing': ['suppressing', 'withholding'], // expressing
  'expression': ['erasure', 'silence', 'stagnation', 'suppression', 'void'], // Expression
  'expressive': ['banal', 'bland', 'blunt', 'coolness', 'cozy', 'dispassionate', 'hushing', 'impersonal', 'introverted', 'nonverbal', 'reserved', 'stifled', 'stoic'], // Expressive
  'expressiveness': ['apathy', 'detachment', 'indifference', 'inhibition', 'silence'], // Expressiveness
  'expulsion': ['absorption', 'acceptance', 'attachment', 'connection', 'embrace', 'inclusion', 'integration', 'reception', 'welcome'], // expulsion
  'exterior': ['interior'], // Exterior
  'external': ['hidden', 'internal', 'intimate', 'introspective', 'inward', 'local', 'personal', 'private', 'subjective'], // external
  'extinguish': ['ignite'], // extinguish
  'extinguished': ['ignited'], // extinguished
  'extraneous': ['clear', 'concise', 'essential', 'focused', 'fundamental', 'integral', 'necessary', 'simple', 'tight'], // extraneous
  'extraordinary': ['basic', 'common', 'dull', 'everyday', 'mundane', 'normal', 'ordinary', 'pedestrian', 'standard', 'typical'], // extraordinary
  'extravagant': ['meager', 'sober', 'utilitarian'], // extravagant
  'extroverted': ['introverted', 'shy'], // extroverted
  'exuberance': ['apathy', 'calmness', 'despair', 'dreariness', 'dullness', 'gloom', 'indifference', 'melancholy', 'monotony', 'restraint', 'sadness', 'subtlety'], // Exuberance
  'exuberant': ['meager', 'restrained', 'solemn'], // exuberant
  'eyewear': ['bare', 'internal', 'natural'], // Eyewear
  'fable': ['fixed', 'literal', 'reality', 'rigid', 'serious', 'stale', 'truth'], // fable
  'fabric': ['hard', 'paper', 'rigid', 'solid', 'wire', 'wood'], // Fabric
  'fabricated': ['authentic', 'genuine', 'natural', 'real', 'simple', 'spontaneous', 'unadorned-truth'], // fabricated
  'facade': ['authentic', 'authenticity', 'core', 'depth', 'essence', 'genuine', 'inner', 'reality', 'substance', 'transparency', 'truth'], // Facade
  'face': ['fleshless'], // face
  'faceless': ['defined', 'distinct', 'dynamic', 'fleshy', 'fresh', 'identity', 'personable', 'sensible', 'vivid'], // faceless
  'faceted': ['flat', 'smooth', 'uniform'], // Faceted
  'facilitate': ['hinder'], // facilitate
  'fact': ['chaos', 'dream', 'false', 'falsehood', 'fantasy', 'fiction', 'hypothesis', 'illusion', 'impression', 'interpretation', 'lie', 'myth', 'mythos', 'unreal'], // fact
  'factory': ['artisanal', 'chaotic', 'freeform', 'handcrafted', 'handmade', 'natural', 'organic', 'spontaneous', 'unique', 'winery'], // factory
  'factual': ['fictional', 'imaginary'], // factual
  'faddish': ['classic', 'classic-integrity', 'elegant', 'serious', 'sophisticated', 'stable', 'subdued', 'timeless', 'traditional'], // faddish
  'fade': ['bloom', 'engrave', 'flourish', 'highlight', 'intensify', 'overpower', 'remain', 'streak'], // fade
  'faded': ['brilliant', 'dazzling', 'fiery', 'gleaming', 'ignited', 'vibrancy', 'vividness'], // faded
  'fading': ['bold', 'emerging', 'intense', 'saturating', 'sharp', 'vivid'], // fading
  'fail': ['conquer', 'thrive'], // fail
  'failure': ['achievement', 'approval', 'ascendancy', 'dream', 'efficacy', 'excellence', 'fulfillment', 'gain', 'improvement', 'mastery', 'milestone', 'payments', 'potential', 'produce', 'profit', 'prosperity', 'recognition', 'recruitment', 'resilience', 'satisfied', 'solutions', 'strength', 'success', 'triumph', 'utopia', 'victory'], // failure
  'faint': ['blazing', 'blinding', 'bold', 'burnt', 'foreground', 'glare', 'imprint', 'intense', 'loud', 'strident', 'striking', 'visible', 'vivid'], // faint
  'faith': ['denial', 'disillusion', 'distrust', 'doubt', 'doubting'], // faith
  'fake': ['authentic', 'genuine', 'genuineness', 'honest', 'original', 'real', 'sincere', 'true', 'valid'], // fake
  'fall': ['ascendancy', 'ascension', 'ascent', 'bright', 'full', 'life', 'prosperity', 'raise', 'rise', 'soar', 'spring'], // fall
  'false': ['authentic', 'certain', 'clear', 'distinct', 'fact', 'genuine', 'genuineness', 'honest', 'real', 'true', 'unveiled-truth', 'visible'], // false
  'falsehood': ['authentic', 'certainty', 'fact', 'genuine', 'reality', 'sincere', 'sincerity', 'truth', 'veracity'], // falsehood
  'falsity': ['authenticity'], // falsity
  'fame': ['anonymity', 'common', 'isolation', 'neglect', 'obscurity', 'ordinary', 'simple', 'unnoticed'], // fame
  'familiar': ['alien', 'awkward', 'bizarre', 'distant', 'enigmatic', 'exotic', 'foreign', 'forgotten', 'frontier', 'fugitive', 'mysterious', 'new', 'novel', 'strange', 'surprise', 'uncommon', 'unfamiliar', 'unhinged', 'unknown'], // familiar
  'familiarity': ['foreign', 'heavy', 'idiosyncrasy', 'strange'], // Familiarity
  'famous': ['anonymous', 'common', 'forgotten', 'ignored', 'insignificant', 'obscure', 'ordinary', 'unknown', 'unnoticed'], // famous
  'fanciful': ['bland', 'mundane', 'ordinary', 'practical', 'serious', 'simple'], // Fanciful
  'fandom': ['alienation', 'apathy', 'detachment', 'disconnection', 'disinterest', 'indifference', 'isolation', 'neglect'], // Fandom
  'fantasy': ['fact', 'hyperreal', 'normalcy', 'ordinariness', 'reality'], // Fantasy
  'fascinated': ['bored'], // fascinated
  'fascination': ['disinterest'], // fascination
  'fashion': ['composition', 'contrast', 'practical'], // Fashion
  'fast': ['slow', 'unhurried'], // fast
  'fast-food': ['gastronomy', 'healthy'], // Fast-food
  'fatigue': ['vitality'], // fatigue
  'fauna': ['flora'], // fauna
  'favor': ['aversion', 'contempt', 'disapproval', 'disdain', 'disfavor', 'dislike', 'dismissal', 'indifference', 'neglect', 'rejecting', 'rejection', 'unfavor'], // Favor
  'fear': ['calm', 'confidence', 'conquer', 'courage', 'hopeful', 'joy', 'peace', 'safety', 'trust', 'valor'], // fear
  'fearful': ['reassuring'], // fearful
  'fearless': ['cautious'], // fearless
  'feather': ['heavyweight'], // feather
  'feathery': ['weighty'], // feathery
  'feed': ['starve'], // feed
  'feminine': ['aggressive', 'brutal', 'clumsy', 'dominance', 'masculine'], // Feminine
  'feral': ['calm', 'controlled', 'domesticated', 'gentle', 'orderly', 'peaceful', 'refined', 'structured', 'tame'], // feral
  'fertile': ['arid', 'barren', 'deficient', 'desolate', 'devoid', 'empty', 'lacking', 'poor', 'sterile'], // fertile
  'fervent': ['stoic'], // fervent
  'fervor': ['apathy', 'boredom', 'coolness', 'detachment', 'disdain', 'disinterest', 'indifference'], // fervor
  'festive': ['bleak', 'dreary', 'gloomy', 'mundane', 'somber'], // Festive
  'fi': ['dull', 'mundane', 'static'], // fi
  'fiat': ['cryptocurrency'], // fiat
  'fibrous': ['fluid', 'layered', 'metallic', 'scrolling', 'soft', 'synthetic', 'transparent'], // Fibrous
  'fickle': ['consistent', 'constant', 'fixed', 'loyal', 'predictable', 'reliability', 'reliable', 'stable', 'steadfast', 'steady'], // fickle
  'fiction': ['fact'], // fiction
  'fictional': ['actual', 'biographical', 'certain', 'definite', 'everyday-practicality', 'factual', 'genuine', 'literal', 'real', 'true'], // fictional
  'field': ['absence', 'chaos', 'cubism', 'dispersal', 'fragment', 'void'], // Field
  'fierce': ['bland', 'calm', 'gentle', 'gentle-hue', 'quiet', 'soft', 'subtle', 'tame', 'weak'], // Fierce
  'fiery': ['bland', 'calm', 'cold', 'cool', 'dull', 'faded', 'icy-palette', 'neutral', 'soft', 'subdued'], // fiery
  'figurative': ['abstract', 'basic', 'flat', 'formless', 'geometric', 'literal', 'non-representational', 'plain', 'raw', 'rough', 'simple'], // Figurative
  'fill': ['deplete'], // fill
  'filled': ['bare', 'blank', 'deficient', 'empty', 'erased', 'hollow', 'lacking', 'null', 'porous', 'sparse', 'thin', 'vacancy', 'vacant', 'void'], // filled
  'filling': ['erasing', 'narrowing'], // filling
  'filmic': ['illustration', 'led'], // Filmic
  'filtered': ['bold', 'candid', 'chaotic', 'direct', 'harsh', 'intense', 'raw', 'unfiltered', 'vivid'], // filtered
  'filtering': ['flood', 'illustration', 'led', 'overflow'], // Filtering
  'filth': ['brightness', 'clarity', 'cleanliness', 'cultivate', 'elegance', 'freshness', 'neatness', 'order', 'purity', 'simplicity'], // filth
  'final': ['beginning', 'initial', 'ongoing', 'open', 'sketching', 'start'], // final
  'finale': ['beginning', 'commencement', 'initiation', 'introduction', 'launch', 'opening', 'prelude', 'premiere', 'start'], // Finale
  'finality': ['beginning', 'chaos', 'continuity', 'cycle', 'flux', 'freedom', 'infinity', 'journey', 'liminality', 'openness', 'possibility', 'uncertainty', 'variability'], // finality
  'finance': ['chaos', 'disorder', 'gift', 'hobby', 'inequity', 'media', 'poverty', 'simplicity'], // Finance
  'fine': ['basic', 'coarse', 'crude', 'janky', 'raw', 'rough', 'roughness', 'thick'], // Fine
  'fine art': ['murals'], // fine art
  'fine-art': ['murals'], // Fine Art
  'finish': ['begin', 'beginning', 'create', 'develop', 'generate', 'grow', 'initiate', 'open', 'start'], // finish
  'finished': ['incomplete', 'loading', 'ongoing', 'open', 'unfinished'], // finished
  'finite': ['boundless', 'endless', 'endlessness', 'eternal', 'expansive', 'globe', 'infinite', 'infinity', 'limitless', 'loop', 'nebula', 'perpetual', 'perpetuity', 'planetary', 'unlimited', 'vast'], // finite
  'finitude': ['immortality'], // finitude
  'fintech': ['analog', 'basic', 'chaotic', 'cluttered', 'legacy', 'manual', 'simple', 'static', 'traditional'], // Fintech
  'fire': ['frost', 'ice', 'water'], // Fire
  'firm': ['blobby', 'flexibility', 'hesitant', 'impotence', 'leak', 'malleable', 'melt', 'wavering', 'wobbly'], // firm
  'fit': ['frumpy'], // fit
  'fix': ['break'], // fix
  'fixation': ['adaptation', 'chaos', 'disinterest', 'dispersal', 'dissipation', 'freedom', 'neglect', 'release', 'unfocus'], // fixation
  'fixed': ['amorphous', 'breezy', 'cellular', 'endless', 'evanescent', 'exploratory', 'fable', 'fickle', 'fleeting', 'flex', 'flexibility', 'flicker', 'flighty', 'folding', 'freeform', 'freestyle', 'hover', 'improvised', 'liquid', 'loose', 'loosen', 'malleable', 'mobile', 'mobility', 'modular', 'morph', 'mutable', 'nomadic', 'parametric', 'plasma', 'reactive', 'responsive', 'serpentine', 'shift', 'shifting', 'spill', 'subjective', 'transient', 'uncertain', 'unconfined', 'undulating', 'ungrounded', 'unsettled', 'unstable', 'unsteady', 'vague', 'variable', 'variant', 'wandering', 'wavering', 'wobbly', 'yachting'], // fixed
  'fixed-horizon': ['variable'], // fixed-horizon
  'fixity': ['change', 'chaos', 'fluid', 'flux', 'mobility', 'random', 'shifting', 'transformation', 'uncertainty', 'vague'], // fixity
  'flaky': ['compact', 'dense', 'smooth', 'solid', 'uniform'], // Flaky
  'flamboyant': ['dull', 'modest', 'mute', 'neutral', 'ordinary', 'plain', 'reserved', 'simple', 'subdued', 'unadorned'], // flamboyant
  'flare': ['dim', 'dull', 'flat', 'muted', 'subdued'], // Flare
  'flashy': ['dimming', 'dull', 'muted', 'plain', 'simple', 'steady', 'subtle', 'understated'], // flashy
  'flat': ['3d', '3d-rendering', 'accordion', 'apex', 'arch', 'braided', 'brilliant', 'brushed', 'brushwork', 'bubble', 'bump', 'bumpy', 'caps', 'chiaroscuro', 'coil', 'contour', 'curvature', 'curvilinear', 'curvy', 'cylinder', 'cylindrical', 'dazzling', 'dimensional', 'dome', 'elevated', 'evocative', 'faceted', 'figurative', 'flare', 'foamy', 'folded', 'full', 'fuzzy', 'globe', 'graded', 'grading', 'grained', 'granular', 'kaleidoscopic', 'layered', 'layers', 'liveliness', 'lustrous', 'macro', 'neumorphic', 'oblique', 'painterly', 'paneled', 'panelled', 'parallax', 'particulate', 'phosphor', 'plump', 'pointed', 'punchy', 'pyramid', 'radial', 'raised', 'relief', 'round', 'sculptural', 'shape', 'sheen', 'shimmer', 'shine', 'shiny', 'skeuomorphism', 'spherical', 'spiral', 'splash', 'stimulating', 'storyful', 'strata', 'stratosphere', 'summit', 'terrain', 'textural', 'textured', 'thunders', 'tiered', 'topography', 'tubular', 'twist', 'twisted', 'undulating', 'undulation', 'veiling', 'vertex', 'vibration', 'volume', 'vortex', 'wave', 'wavy', 'woven', 'xr', 'zesty'], // flat
  'flat-plane': ['raised'], // flat-plane
  'flatness': ['bump', 'cubism', 'curvature', 'depth', 'dimension', 'hierarchy', 'layering', 'raise', 'relief', 'ripple', 'verticality', 'volume'], // Flatness
  'flatten': ['bulge', 'curvature', 'depth', 'dimension', 'magnify', 'rise', 'sculpt', 'stack', 'volume'], // flatten
  'flattening': ['complexity', 'depth', 'dimension', 'elevation', 'layering', 'richness', 'sculpting', 'texture', 'volume'], // flattening
  'flavorful': ['insipid'], // flavorful
  'flaw': ['completeness', 'flawless', 'integrity', 'perfection', 'portfolio'], // flaw
  'flawed': ['complete', 'flawless', 'ideal', 'perfect', 'polished', 'prime', 'pristine', 'retouching', 'solid', 'spotless', 'stable'], // flawed
  'flawless': ['chaotic', 'clumsy', 'distress', 'dull', 'flaw', 'flawed', 'imperfect', 'imperfection', 'messy', 'rough', 'ugly'], // flawless
  'flawlessness': ['imperfection'], // flawlessness
  'fleeing': ['anchoring', 'arrival', 'clinging', 'embracing', 'endurance', 'holding', 'presence', 'settling', 'staying'], // fleeing
  'fleeting': ['archival', 'concreteness', 'constant', 'enduring', 'eternal', 'eternity', 'fixed', 'lasting', 'lingering', 'monumental', 'permanent', 'perpetual', 'perpetuity', 'stable', 'static', 'timeless', 'timelessness'], // fleeting
  'flesh': ['ceramic', 'glass', 'metal', 'plastic', 'stone'], // Flesh
  'fleshless': ['complexity', 'depth', 'face', 'fleshy', 'psyche', 'richness', 'substance', 'volume', 'wisdom'], // fleshless
  'fleshy': ['faceless', 'fleshless'], // fleshy
  'flex': ['fixed', 'rigid', 'static'], // Flex
  'flexibility': ['firm', 'fixed', 'immobility', 'inflexibility', 'inflexible', 'restriction', 'rigidity', 'solid', 'stability', 'static', 'stiff', 'stiffness'], // Flexibility
  'flexible': ['bondage', 'brittle', 'cast', 'concrete', 'constrict', 'doctrinal', 'halted', 'predefined', 'restrained', 'restricted', 'restrictive', 'steel', 'stern', 'stiff', 'wire'], // flexible
  'flicker': ['clear', 'constant', 'fixed', 'smooth', 'solid', 'stable', 'steady', 'uniform', 'uniform-brightness'], // flicker
  'flighty': ['certain', 'fixed', 'focused', 'grounded', 'grounding', 'serious', 'solid', 'stable', 'steady'], // flighty
  'flippant': ['intense', 'serious', 'solemn', 'solemnity', 'weighted'], // flippant
  'float': ['anchor', 'descend', 'drown', 'ground', 'plummet', 'plunge', 'sink', 'submerge', 'weight'], // Float
  'floating': ['root', 'rooting'], // floating
  'flood': ['clear', 'dry', 'empty', 'filtering', 'light', 'low', 'minimal', 'solid', 'still'], // flood
  'flora': ['fauna', 'steel', 'synthetic', 'urban'], // Flora
  'flotilla': ['desolation', 'emptiness', 'isolation', 'monotony', 'singularity', 'solitude', 'stagnation', 'stillness', 'void'], // Flotilla
  'flourish': ['blight', 'decay', 'decline', 'diminish', 'dormancy', 'ended', 'fade', 'harm', 'ruin', 'shrivel', 'stagnate', 'wilt', 'wither'], // Flourish
  'flourishing': ['arid', 'barren', 'desolate', 'deterioration', 'dormant', 'tarnished', 'withering'], // flourishing
  'flow': ['burden', 'deadend', 'freeze', 'halt', 'hassle', 'interference', 'modularity', 'obstacle', 'pressure', 'stop', 'strain', 'strife', 'stuck', 'suppression'], // Flow
  'flowchart': ['ambiguity', 'chaos', 'confusion', 'disorder', 'randomness'], // Flowchart
  'flowing': ['disjointed', 'frozen', 'halted', 'narrowing', 'stilted', 'stopped'], // flowing
  'fluctuation': ['constancy'], // fluctuation
  'fluid': ['artifact', 'ascii', 'axis', 'backward', 'based', 'binary', 'bind', 'block', 'blocky', 'bondage', 'bounded', 'boxy', 'brutalism', 'cast', 'charted', 'coded', 'columnar', 'concrete', 'concreteness', 'confining', 'constant', 'constrict', 'cumbersome', 'definite', 'doctrinal', 'enclosed', 'fibrous', 'fixity', 'frame', 'frozen', 'glacial', 'grid', 'interrupted', 'janky', 'layered', 'mechanic', 'mechanical', 'metallic', 'mineral', 'octagonal', 'pixel', 'pixelated', 'pixelation', 'polygon', 'predefined', 'predetermined', 'rectangle', 'rectangular', 'regression', 'resolved', 'restrictive', 'robotic', 'rocky', 'rooted', 'rows', 'script', 'scrolling', 'segmented', 'single', 'soft', 'solidify', 'solidifying', 'solidity', 'square', 'staccato', 'staged', 'statuary', 'steel', 'stiff', 'stilted', 'stone', 'stopped', 'structural', 'stuffy', 'synthetic', 'technic', 'tightened', 'transparent', 'unchanging', 'viscous', 'weighty', 'wire'], // Fluid
  'fluidity': ['anchored', 'architecture', 'circuit', 'constraint', 'cubism', 'framework', 'imposition', 'mass', 'matrix', 'measure', 'mechanism'], // fluidity
  'fluke': ['certainty', 'consistency', 'predictability', 'principle', 'reliability', 'solid', 'stability', 'uniformity'], // fluke
  'flux': ['constancy', 'finality', 'fixity', 'order', 'permanence', 'stability', 'stasis', 'stillness', 'structure'], // Flux
  'foamy': ['dense', 'flat', 'smooth', 'solid', 'stiff'], // Foamy
  'focus': ['abandonment', 'blindness', 'blurb', 'confusion', 'disregard', 'dissipation', 'drift', 'editorial', 'exaggeration', 'fog', 'foolishness', 'forget', 'harmony', 'idleness', 'ignore', 'muddle', 'negligence', 'overflow', 'sidebar', 'sloppiness', 'sloth', 'vacate', 'wander', 'waver'], // Focus
  'focused': ['aimless', 'blind', 'bokeh', 'chaos', 'clueless', 'cluttered', 'conflicted', 'confused', 'confusing', 'diffused', 'disorder', 'dispersal', 'disregarded', 'distracted', 'extraneous', 'flighty', 'fumbled', 'imprecise', 'impure', 'interstitial', 'nebulous', 'negligent', 'noisy', 'oblivious', 'obscuring', 'peripheral', 'rambling', 'restless', 'scatterbrained', 'scrawl', 'slack', 'slacker', 'smeared', 'splat', 'sprawled', 'spread', 'tangential', 'unfocused', 'wandering'], // Focused
  'focusing': ['dissolving'], // focusing
  'fog': ['brightness', 'clarity', 'definition', 'focus', 'insight', 'lightness', 'openness', 'transparency', 'vividness'], // fog
  'folded': ['complete', 'expanded', 'flat', 'open', 'smooth', 'unfolded', 'whole'], // folded
  'folding': ['constant', 'enduring', 'fixed', 'permanent', 'solid', 'stable', 'static', 'unfolding'], // folding
  'foliage': ['arid', 'barren', 'bleak', 'dry', 'sterile'], // Foliage
  'folk': ['abstract', 'industrial', 'minimal', 'modern', 'sophisticated'], // Folk
  'following': ['trendsetting'], // following
  'font': ['composition', 'contrast', 'scribble'], // Font
  'fonts': ['composition', 'contrast'], // Fonts
  'food': ['cool', 'coolness', 'hunger', 'scarcity', 'waste'], // Food
  'foolish': ['academia', 'clear', 'intelligent', 'prudent', 'rational', 'sensible', 'thoughtful', 'wise'], // foolish
  'foolishness': ['clarity', 'focus', 'intelligence', 'knowledge', 'logic', 'meaning', 'purpose', 'sense', 'wisdom'], // foolishness
  'footer': ['prime', 'upper'], // footer
  'for': ['non-profit'], // for
  'for-profit': ['non-profit'], // For-profit
  'force': ['calm', 'rest', 'stillness', 'weakness'], // Force
  'forceful': ['passive'], // forceful
  'foreground': ['abstract', 'background', 'distant', 'faint', 'hidden', 'invisible', 'subtle', 'vague'], // foreground
  'foreign': ['familiar', 'familiarity', 'home', 'local', 'native'], // foreign
  'forget': ['acknowledge', 'capture', 'emphasize', 'focus', 'grasp', 'highlight', 'notice', 'present', 'recognize', 'remember', 'retain'], // forget
  'forgetfulness': ['memorial', 'remembrance'], // forgetfulness
  'forgettable': ['impactful', 'meaningful', 'memorable', 'mundane-spectacle', 'notable', 'significant', 'striking', 'vivid'], // forgettable
  'forgetting': ['anchoring', 'belonging', 'holding', 'memory', 'remembering', 'remembrance'], // forgetting
  'forgotten': ['cherished', 'familiar', 'famous', 'icon', 'known', 'notable', 'present', 'remembered', 'visible'], // forgotten
  'form': ['disassemble', 'line', 'psyche', 'void'], // form
  'formal': ['bistro', 'camp', 'casual', 'disheveled', 'doodle', 'freeform', 'freestyle', 'informal', 'irreverent', 'silly', 'streetwear'], // formal
  'formality': ['casual', 'casual-chaos', 'chaotic', 'disorderly', 'impressionist', 'informal', 'messy', 'relaxed', 'scribble', 'spontaneous', 'wild', 'youthfulness'], // Formality
  'formation': ['chaos', 'detachment', 'disorder', 'dispersal', 'dissolution'], // Formation
  'formed': ['amorphous', 'anti-form', 'chaotic', 'disordered', 'haphazard', 'messy', 'random', 'unconfined', 'undefined', 'unformed', 'unstructured', 'untamed', 'unvalued'], // Formed
  'forming': ['obliterating'], // forming
  'formless': ['crystal', 'defined', 'figurative', 'shaped', 'structured'], // Formless
  'formulated-limits': ['unconfined'], // formulated-limits
  'fortified': ['deficient', 'exposed', 'fragile', 'open', 'uncertain', 'unstable', 'vulnerable', 'vulnerable-space', 'weak', 'weakened'], // fortified
  'fortifying': ['diluting'], // fortifying
  'fortitude': ['chaos', 'confusion', 'disorder', 'indecision', 'instability', 'uncertainty', 'vulnerability', 'weakness'], // fortitude
  'fortune': ['misfortune'], // fortune
  'forward': ['backward', 'descend', 'retro', 'stagnant', 'static'], // Forward
  'fossil': ['eco-tech'], // fossil
  'foster': ['destroy'], // foster
  'foul': ['bright', 'fresh', 'freshness', 'friendly', 'generous', 'inviting', 'pure', 'rich', 'vibrant'], // foul
  'found': ['lost', 'nowhere'], // found
  'foundation': ['chaos', 'disorder', 'fragment'], // Foundation
  'founded': ['unfounded'], // founded
  'fracture': ['complete', 'connected', 'continuity', 'continuous', 'intact', 'smooth', 'solid', 'unified', 'whole'], // Fracture
  'fractured-harmony': ['unison'], // fractured-harmony
  'fragile': ['armored', 'fortified', 'freight', 'humble', 'resilient', 'robust', 'sturdy', 'thick'], // fragile
  'fragility': ['endurance', 'resilience', 'robustness', 'shield', 'solidity', 'stability', 'strength'], // Fragility
  'fragment': ['completion', 'consolidate', 'continuity', 'continuum', 'field', 'foundation', 'integrate', 'module', 'mosaic', 'nucleus', 'realm', 'synthesize', 'unify', 'unite', 'unity', 'whole'], // Fragment
  'fragmentation': ['anatomy', 'cohesion', 'completeness', 'conception', 'convergence', 'cosmos', 'ecosystem', 'fusion', 'globalization', 'integration', 'singularity', 'synchronicitic', 'systems', 'unison', 'units', 'unity', 'wholeness'], // Fragmentation
  'fragmented': ['aggregate', 'centralized', 'coherent', 'complete', 'globe', 'intact', 'integrated', 'integrity', 'interwoven', 'level', 'main', 'monolithic', 'regression', 'seamless', 'shared', 'synchronized', 'unified', 'uninterrupted', 'united'], // fragmented
  'fragmented-tones': ['harmonic'], // fragmented-tones
  'fragmented-visions': ['synchronized'], // fragmented-visions
  'frame': ['chaos', 'fluid', 'void'], // Frame
  'framework': ['chaos', 'disorder', 'fluidity', 'freedom', 'improvisation'], // Framework
  'framing': ['detached', 'disorder', 'dispersal'], // Framing
  'frantic': ['calm', 'chill', 'composed', 'leisurely', 'peaceful', 'quiet', 'serene', 'steady', 'tranquil'], // frantic
  'fraudulence': ['sincerity'], // fraudulence
  'fraudulent': ['authentic', 'clear', 'genuine', 'honest', 'open', 'reliable', 'transparent', 'trustworthy'], // fraudulent
  'frayed': ['bright', 'clear', 'fresh', 'marble', 'neat', 'sharp', 'smooth', 'solid', 'vivid'], // frayed
  'free': ['bind', 'binding', 'bound', 'burdened', 'burdensome', 'closed', 'confining', 'constrict', 'dragged', 'enclosed', 'guarded', 'lock', 'mechanical', 'merchandise', 'payments', 'predetermined', 'regulated', 'restrained', 'restricted', 'restrictive', 'rooted', 'sealed', 'stilted', 'stuck', 'suppressed', 'tame', 'technic', 'withholding'], // free
  'freed': ['stifled'], // freed
  'freedom': ['authority', 'barrier', 'bondage', 'bound', 'bounded', 'burden', 'captivity', 'confinement', 'constraint', 'containment', 'dependence', 'deprivation', 'discipline', 'drudgery', 'encasement', 'enclosure', 'envelopment', 'exploitation', 'finality', 'fixation', 'framework', 'government', 'guilt', 'heavy', 'imposition', 'industry', 'inferior', 'limit', 'limitation', 'monopoly', 'narrowness', 'obedience', 'obstacle', 'pressure', 'regulation', 'restraint', 'restriction', 'ritual', 'shroud', 'strain', 'strife', 'submission', 'suppression', 'warning'], // Freedom
  'freeform': ['axis', 'concrete', 'confined', 'defined', 'factory', 'fixed', 'formal', 'grid', 'mechanic', 'ordered', 'rigid', 'strict', 'structured'], // Freeform
  'freeing': ['compressing', 'suppressing'], // freeing
  'freeness': ['bound', 'cage', 'confine', 'constraint', 'control', 'limit', 'prison', 'restriction', 'weightiness'], // freeness
  'freestyle': ['constrained', 'defined', 'fixed', 'formal', 'menu', 'orderly', 'precise', 'rigid', 'structured'], // freestyle
  'freetime': ['commitment', 'constraint', 'duty', 'industry', 'obligation', 'routine', 'schedule', 'task', 'work'], // freetime
  'freeze': ['flow', 'heat', 'ignite', 'melt', 'thaw'], // Freeze
  'freight': ['digital', 'disorder', 'empty', 'fragile', 'lightweight', 'local', 'passenger', 'service'], // Freight
  'frenzied': ['calm', 'peaceful', 'serene', 'sober', 'stately', 'tranquil'], // frenzied
  'frenzy': ['calm', 'ordered', 'quiet', 'serene', 'still', 'tranquil'], // frenzy
  'frequent': ['rare'], // frequent
  'fresh': ['aftermath', 'ancient', 'artifact', 'baked', 'dirt', 'distressed', 'expire', 'faceless', 'foul', 'frayed', 'grime', 'grungy', 'muddy', 'patina', 'polluted', 'rusty', 'shallow', 'stale', 'stop', 'stuffy', 'tainted', 'tedious', 'toxic', 'weary', 'wilt', 'worn'], // fresh
  'freshness': ['decay', 'dirtiness', 'filth', 'foul', 'obsolescence', 'pollution', 'stagnation', 'staleness', 'worn'], // Freshness
  'friction': ['relaxation'], // friction
  'friendly': ['alien', 'cool', 'coolness', 'foul', 'harsh', 'impersonal'], // Friendly
  'fringe': ['block', 'centric'], // fringe
  'frivolity': ['gravitas'], // frivolity
  'frivolous': ['deliberate', 'functionalism', 'intentional', 'meaningful', 'profound', 'serious', 'sober', 'sophisticated', 'studious', 'substantial', 'thoughtful'], // frivolous
  'frontier': ['closed', 'conventional', 'familiar', 'settled', 'static'], // Frontier
  'frost': ['ember', 'fire', 'heat', 'melt', 'warm', 'warmth'], // frost
  'frosted-blue': ['burnt'], // frosted-blue
  'frosted-hue': ['blazing'], // frosted-hue
  'frozen': ['active', 'dynamic', 'flowing', 'fluid', 'hot', 'liquid', 'molten', 'soft', 'video', 'vivid'], // frozen
  'frugal': ['indulgent', 'lavish'], // frugal
  'frugality': ['consumerism', 'consumption'], // Frugality
  'fruitful': ['futile'], // fruitful
  'frumpy': ['chic', 'elegant', 'fit', 'polished', 'refined', 'sleek', 'stylish', 'trim'], // frumpy
  'frustrated': ['pleased'], // frustrated
  'frustration': ['calm', 'content', 'ease', 'happiness', 'joy', 'pleasure', 'satisfaction', 'solutions'], // frustration
  'fugitive': ['certain', 'clear', 'eternal-now', 'familiar', 'known', 'safe', 'settled', 'stable', 'visible'], // fugitive
  'fulfillment': ['discontent', 'dissatisfaction', 'emptiness', 'failure', 'neglect', 'yearning'], // Fulfillment
  'full': ['bare', 'drained', 'empty', 'fall', 'flat', 'hollow', 'incomplete', 'lack', 'leak', 'partial', 'ragged', 'skeletal', 'sparse', 'starve', 'thin', 'vacant', 'void', 'withholding'], // full
  'full-realization': ['partial'], // full-realization
  'full-scale': ['miniature'], // Full-scale
  'fullness': ['absence', 'barren', 'bleakness', 'cold', 'depletion', 'despair', 'diminution', 'drab', 'emptiness', 'hunger', 'husk', 'lack', 'scarcity', 'sparse', 'sparsity', 'thirst', 'vacuum', 'void'], // fullness
  'fumble': ['aware', 'certain', 'clear', 'grasp', 'principle'], // fumble
  'fumbled': ['controlled', 'deliberate', 'focused', 'mastered', 'mastery', 'orderly', 'planned', 'precise', 'successful'], // fumbled
  'fun': ['adulting'], // fun
  'functional': ['artistic', 'broken', 'impractical', 'pointless', 'theoretical', 'useless'], // functional
  'functionalism': ['artistic', 'chaos', 'excessive', 'frivolous', 'ornate', 'subjective'], // Functionalism
  'functionalist': ['chaotic', 'disorderly', 'eclectic', 'ornate'], // Functionalist
  'functionality': ['aesthetics', 'baroque'], // Functionality
  'fundamental': ['extraneous'], // fundamental
  'funny': ['serious'], // funny
  'fusion': ['disconnection', 'dispersal', 'disunity', 'division', 'fragmentation', 'isolation', 'segregation', 'separation'], // Fusion
  'fussy': ['clean', 'elegant', 'refined', 'simple', 'simplicity', 'sleek', 'smooth', 'streamlined', 'subtle'], // fussy
  'futile': ['constructive', 'effective', 'fruitful', 'impactful', 'meaningful', 'purposeful', 'significant', 'utility', 'valuable'], // futile
  'futility': ['earth', 'growth', 'hope', 'horology', 'joy', 'life', 'purpose', 'strength', 'success', 'vitality'], // futility
  'future': ['nostalgia', 'obsolescence', 'past', 'roots', 'stagnation', 'tradition'], // Future
  'futurism': ['ancient', 'futurist', 'glassmorphism', 'neumorphism'], // futurism
  'futurist': ['futurism', 'glassmorphism', 'neumorphism'], // futurist
  'futuristic': ['archaic', 'historical', 'retro', 'vintage'], // Futuristic
  'fuzz': ['analysis', 'clarity', 'cleanliness', 'definition', 'order', 'precision', 'sharpness', 'simplicity', 'structure'], // fuzz
  'fuzzy': ['clarity', 'clear', 'defined', 'flat', 'precise', 'sharp', 'simple', 'smooth'], // fuzzy
  'gain': ['failure', 'plummet'], // gain
  'game': ['illustration', 'led'], // Game
  'gamification': ['professional'], // Gamification
  'gamified': ['mundane', 'serious', 'simple', 'static', 'traditional'], // Gamified
  'gaming': ['professional'], // Gaming
  'gap': ['loop', 'point'], // gap
  'gargantuan': ['tiny'], // gargantuan
  'garish': ['alluring', 'calm', 'delicate', 'gentle', 'muted', 'pale', 'sober', 'soft', 'subtle', 'understated'], // garish
  'garnish': ['bare', 'basic', 'muted', 'ordinary', 'plain', 'simple', 'sparse-elegance', 'subtle', 'unadorned'], // garnish
  'gaseous': ['viscous'], // Gaseous
  'gastronomy': ['basic', 'fast-food'], // Gastronomy
  'gather': ['disassemble', 'disband', 'disperse', 'isolate', 'scatter'], // gather
  'gathering': ['premium'], // Gathering
  'gaudy': ['elegant', 'modest', 'plain', 'refined', 'simple', 'subtle', 'tasteful', 'understated'], // gaudy
  'gender': ['identity', 'role', 'sex', 'ungendered'], // Gender
  'gendered': ['unconfined', 'ungendered'], // gendered
  'general': ['explicit', 'labeled', 'specific'], // general
  'generate': ['consume', 'finish'], // generate
  'generation': ['illustration', 'led', 'null'], // Generation
  'generative': ['illustration', 'led', 'predefined', 'typecraft'], // Generative
  'generic': ['artisanal', 'bespoke', 'boutique', 'customization', 'distinct', 'personalized', 'singular', 'typecraft', 'unique', 'uniqueness'], // generic
  'generosity': ['greed'], // generosity
  'generous': ['foul', 'meager', 'selfish'], // generous
  'genesis': ['destruction', 'end', 'void'], // Genesis
  'gentle': ['aggressive', 'agitated', 'authoritative', 'bitter', 'blaring', 'blasts', 'blinding', 'boisterous', 'bold', 'brash', 'brutal', 'burnt', 'challenging', 'confident', 'confront', 'dragged', 'erupt', 'explosive', 'feral', 'fierce', 'garish', 'glossy', 'gritty', 'hard', 'harsh', 'heated', 'jarring', 'loud', 'motorsport', 'powerful', 'raucous', 'roughness', 'rude', 'savage', 'screaming', 'sharp', 'shouted', 'staccato', 'stern', 'strenuous', 'strident', 'tense', 'thunders', 'tightened', 'unruly', 'uproarious', 'y2k'], // Gentle
  'gentle-expression': ['rude'], // gentle-expression
  'gentle-hue': ['fierce', 'harried'], // gentle-hue
  'gentle-influence': ['overpower'], // gentle-influence
  'gentleness': ['cruelty'], // gentleness
  'genuine': ['artifice', 'artificial', 'contrived', 'deceptive', 'fabricated', 'facade', 'fake', 'false', 'falsehood', 'fictional', 'fraudulent', 'imperfect', 'insincere', 'manipulation', 'phony', 'pretentious', 'racket', 'sham', 'simulacrum', 'simulated', 'staged', 'superficial'], // Genuine
  'genuineness': ['alienated', 'artifice', 'artificial', 'empty', 'fake', 'false', 'illusion', 'insecure', 'superficial', 'vague'], // genuineness
  'geology': ['abstract', 'ethereal', 'metaphysics', 'spirituality', 'transcendence'], // Geology
  'geometric': ['biomorphic', 'botanical', 'curvilinear', 'figurative', 'naturalistic', 'organic'], // Geometric
  'geometry': ['editorial', 'harmony'], // Geometry
  'germination': ['decay', 'destruction', 'dissolution', 'wither'], // Germination
  'gesture': ['ambiguity', 'disguise', 'inactivity', 'indirectness', 'obscurity', 'passivity', 'silence', 'subtlety', 'text'], // gesture
  'giant': ['diminutive'], // giant
  'gift': ['absence', 'consume', 'curse', 'finance', 'loss', 'void'], // gift
  'gigantic': ['miniature'], // gigantic
  'giving': ['withholding'], // giving
  'glacial': ['active', 'alive', 'boiling', 'dynamic', 'fluid', 'heated', 'hot', 'vibrant', 'warm', 'warmth'], // Glacial
  'glamour': ['bare', 'drab', 'mundane', 'raw', 'simple'], // Glamour
  'glare': ['dark', 'dim', 'dimming', 'dull', 'faint', 'muted', 'shadow', 'soft'], // Glare
  'glass': ['ceramic', 'flesh', 'paper', 'wood'], // glass
  'glassmorphism': ['futurism', 'futurist', 'maximalist', 'traditional'], // Glassmorphism
  'glassy': ['dull', 'matte', 'opaque', 'rough', 'textured'], // Glassy
  'glazed': ['dull', 'matte', 'raw', 'rough', 'unfinished'], // Glazed
  'gleaming': ['bland', 'cloudy', 'dim', 'dull', 'faded', 'matte', 'muddy', 'opaque', 'sepia'], // gleaming
  'glimpse': ['completeness', 'concealment', 'obscurity', 'panorama', 'wholeness'], // Glimpse
  'glitch': ['clarity', 'harmony', 'order', 'perfect', 'perfection', 'seamless', 'simplicity'], // Glitch
  'global': ['individual', 'local', 'niche', 'private', 'restricted'], // Global
  'globalism': ['localism'], // globalism
  'globalization': ['fragmentation', 'isolation', 'localism', 'narrowness', 'segregation'], // Globalization
  'globe': ['chaos', 'finite', 'flat', 'fragmented', 'infinite', 'isolated', 'linear', 'local', 'nothing', 'static', 'void'], // Globe
  'gloom': ['aether', 'brightness', 'cheer', 'clarity', 'euphoria', 'exuberance', 'joy', 'optimism', 'vibrancy'], // Gloom
  'gloomy': ['breezy', 'festive', 'jovial', 'optimistic', 'pleasant', 'positive'], // gloomy
  'glossy': ['absorbent', 'brushed', 'gentle', 'graphite', 'matt', 'scrolling'], // Glossy
  'glow': ['darkness'], // glow
  'go': ['stop'], // go
  'goodness': ['malice'], // goodness
  'gothic': ['bright', 'cheerful', 'clean', 'light', 'modern', 'neo-grotesque', 'playful', 'simple', 'soft', 'techno-futurism'], // Gothic
  'gourmet': ['basic', 'common', 'crude', 'mundane'], // Gourmet
  'government': ['anarchy', 'chaos', 'freedom', 'independence', 'liberty'], // Government
  'grace': ['awkwardness', 'brutality', 'editorial', 'harmony'], // Grace
  'graceful': ['awkward', 'clumsy', 'grotesque', 'janky', 'vulgar'], // graceful
  'gracious': ['rude'], // gracious
  'graded': ['bland', 'dull', 'flat', 'monochrome', 'plain', 'simplistic', 'static', 'uniform'], // Graded
  'gradient': ['cool', 'coolness'], // Gradient
  'grading': ['chaos', 'disorder', 'flat', 'random', 'uniform'], // Grading
  'gradual': ['abrupt', 'immediate', 'instant', 'jarring', 'rapid', 'speed', 'sudden', 'suddenness'], // gradual
  'graffiti': ['illustration', 'led'], // Graffiti
  'grain': ['wine'], // grain
  'grained': ['flat', 'polished', 'sleek', 'smooth', 'uniform'], // Grained
  'grainy': ['creamy', 'overlapping', 'scrolling', 'y2k'], // Grainy
  'grand': ['petite', 'petty', 'small'], // grand
  'grandeur': ['insignificance', 'intimacy', 'microcosm', 'mundanity', 'ordinariness', 'petiteness', 'simplicity', 'triviality'], // Grandeur
  'grandiose': ['miniature'], // Grandiose
  'granular': ['flat', 'homogeneous', 'monolithic', 'smooth', 'uniform'], // Granular
  'graphic': ['painterly'], // Graphic
  'graphics': ['illustration', 'led'], // Graphics
  'graphite': ['glossy', 'light', 'smooth', 'soft', 'transparent'], // Graphite
  'grasp': ['dismiss', 'forget', 'fumble', 'neglect', 'release', 'surrender'], // grasp
  'grave': ['silly'], // grave
  'gravitas': ['banality', 'carelessness', 'emptiness', 'frivolity', 'insignificance', 'lightness', 'playfulness', 'silliness', 'triviality'], // Gravitas
  'gravity': ['ascension', 'levity', 'lightness'], // Gravity
  'greed': ['altruism', 'benevolent', 'generosity', 'humble', 'modest', 'non-profit', 'nonprofit', 'sacrifice', 'selfless', 'sharing'], // greed
  'green': ['amber', 'arid'], // green
  'grid': ['fluid', 'freeform', 'masonry', 'organic'], // Grid
  'grim': ['bright', 'cheerful', 'clear', 'humor', 'joyful', 'light', 'radiant', 'uplifted', 'utopian', 'vivid'], // grim
  'grime': ['bright', 'clean', 'cleanliness', 'clear', 'fresh', 'polished', 'pure', 'refined', 'smooth'], // grime
  'grind': ['carefree', 'casual', 'ease', 'leisure', 'relaxed', 'rest', 'simple', 'spontaneity'], // grind
  'gritty': ['aesthetics', 'elegant', 'gentle', 'sterile'], // Gritty
  'groovy': ['bland', 'mundane', 'rigid', 'stale', 'static', 'stiff'], // Groovy
  'grotesque': ['aesthetic', 'delicate', 'elegant', 'graceful', 'harmonious', 'polished', 'refined', 'smooth'], // Grotesque
  'ground': ['cloud', 'float', 'horizon', 'sky', 'stratosphere'], // ground
  'grounded': ['aerial', 'aero', 'ascendancy', 'astronomical', 'celestial', 'cosmic', 'detached', 'disorder', 'eccentric', 'flighty', 'hover', 'lofty', 'planetary', 'skyward', 'sprawled', 'stellar', 'ungrounded', 'unhinged', 'weightless'], // Grounded
  'groundedness': ['verticality'], // groundedness
  'grounding': ['detached', 'disembodied', 'disorder', 'dispersal', 'distrust', 'flighty'], // Grounding
  'group': ['individual'], // group
  'grouping': ['detachment', 'disorder', 'dispersal'], // Grouping
  'grow': ['finish', 'shrink', 'thaw', 'wilt', 'wither'], // grow
  'growing': ['narrowing', 'withering'], // growing
  'growth': ['closing', 'death', 'decay', 'decline', 'depletion', 'deprivation', 'destruction', 'deterioration', 'diminution', 'dormancy', 'end', 'ended', 'endgame', 'futility', 'limitation', 'reduction', 'shrink', 'stagnation', 'suppression', 'withering'], // Growth
  'grunge': ['classicism', 'cleanliness', 'elegant', 'neo-grotesque'], // Grunge
  'grungy': ['bright', 'clean', 'commercial-chic', 'elegant', 'fresh', 'polished', 'refined', 'simple', 'smooth'], // grungy
  'guarded': ['accessible', 'careless', 'exposed', 'free', 'open', 'openness', 'revealed', 'unprotected', 'vulnerable'], // guarded
  'guesswork': ['analytics'], // Guesswork
  'guilt': ['clarity', 'confidence', 'contentment', 'ease', 'freedom', 'innocence', 'serenity', 'trust'], // guilt
  'gym': ['idleness', 'indulgence', 'laziness', 'leisure', 'passive', 'relaxation', 'rest', 'retirement', 'sedentary', 'sloth', 'stillness'], // Gym
  'halt': ['active', 'catalyst', 'dynamic', 'engage', 'flow', 'manifesting', 'move', 'progress', 'repeat', 'scroll', 'thrive', 'vibrant'], // halt
  'halted': ['active', 'dynamic', 'flexible', 'flowing', 'scrolling', 'shiny', 'smooth', 'soft', 'vibrant'], // halted
  'hand-drawn': ['technographic'], // Hand-drawn
  'handcrafted': ['factory', 'mechanic'], // handcrafted
  'handcrafted-goods': ['massproduced'], // handcrafted-goods
  'handmade': ['cgi', 'factory', 'high-tech'], // handmade
  'handwritten': ['digital', 'mechanical', 'printed', 'typed', 'uniform'], // Handwritten
  'haphazard': ['analytics', 'art', 'coherent', 'craftsmanship', 'formed', 'intentional', 'level', 'method', 'methodical', 'modelling', 'neat', 'orderly', 'planned', 'precise', 'premeditated', 'procedural', 'rational', 'sequential', 'structured', 'systematic'], // haphazard
  'happiness': ['agony', 'anguish', 'dissatisfaction', 'frustration', 'misfortune', 'pain', 'sorrow'], // happiness
  'hard': ['absorbent', 'easy', 'fabric', 'gentle', 'malleable', 'matte', 'melt', 'pillow', 'silk', 'soft', 'supple', 'yielding'], // Hard
  'harden': ['thaw'], // harden
  'hardship': ['well-being'], // Hardship
  'hardware': ['behavioral'], // Hardware
  'harm': ['benefit', 'flourish', 'heal', 'healthcare', 'healthtech', 'nurture', 'restore', 'skincare', 'support', 'thrive', 'uplift'], // harm
  'harmful': ['healthy'], // harmful
  'harmonic': ['chaotic', 'clashing', 'conflicting', 'discordant', 'disorderly', 'dissonant', 'fragmented-tones', 'jarring', 'messy'], // Harmonic
  'harmonic-clash': ['concord'], // harmonic-clash
  'harmonious': ['anarchic', 'anti', 'awkward', 'conflicted', 'disarrayed', 'discordant', 'disjoint', 'disjointed', 'disparate', 'disruptive', 'divisive', 'downcast', 'grotesque', 'jarring', 'jumbled', 'segregated', 'uneven'], // harmonious
  'harmonious-blend': ['discordant'], // harmonious-blend
  'harmonious-order': ['tumult'], // harmonious-order
  'harmonize': ['disrupt', 'divide'], // harmonize
  'harmonizing': ['dividing'], // harmonizing
  'harmony': ['breakdown', 'brutality', 'cacophony', 'clamor', 'complication', 'conflict', 'confront', 'confusion', 'contradiction', 'deconstructivism', 'destroy', 'destruction', 'din', 'discomfort', 'disconnect', 'discord', 'disorder', 'dispersal', 'dispersion', 'displeasure', 'dissipation', 'distribution', 'disunity', 'dominance', 'dramatic', 'duotone', 'dynamism', 'eclectic', 'edge', 'focus', 'geometry', 'glitch', 'grace', 'hassle', 'inferior', 'intricate', 'jumble', 'juxtaposition', 'linearity', 'luminosity', 'mess', 'mismatch', 'monumental', 'negative', 'ornamentation', 'perspective', 'polish', 'pollution', 'portrait', 'rebellion', 'simplicity', 'simplification', 'sleekness', 'softness', 'spatial', 'split', 'spontaneity', 'squalor', 'stress', 'strife', 'struggle', 'tension', 'texture', 'torment', 'tumult', 'turmoil', 'unbounded', 'uniformity', 'unruly', 'variety', 'war'], // Harmony
  'harried': ['calm', 'clear', 'easy', 'gentle-hue', 'orderly', 'relaxed', 'serene', 'smooth', 'steady'], // Harried
  'harsh': ['ambient', 'aqueous', 'bakery', 'calm', 'empathetic', 'filtered', 'friendly', 'gentle', 'mellow', 'mild', 'neumorphic', 'pastoral', 'peaceful', 'pleasant', 'plush', 'romantic', 'smooth', 'soft', 'softness', 'supple', 'sweet', 'velvet', 'warm', 'wash', 'yielding'], // harsh
  'hassle': ['clarity', 'comfort', 'ease', 'flow', 'harmony', 'simplicity', 'smoothness', 'tranquility'], // hassle
  'haste': ['slowness'], // haste
  'hasty': ['calm', 'careful', 'caution', 'deliberate', 'intentional', 'lingering', 'measured', 'slow', 'steady', 'thoughtful', 'unhurried'], // hasty
  'hatred': ['kindness', 'respect'], // hatred
  'haunting': ['alive', 'bright', 'cheerful', 'joyful', 'serene', 'vibrant'], // Haunting
  'haze': ['brightness', 'clarity', 'sharpness', 'transparency', 'vividness'], // Haze
  'hazy': ['clear', 'defined', 'precise', 'sharp', 'solid'], // Hazy
  'header': ['composition', 'contrast', 'tail', 'under'], // Header
  'heal': ['bleed', 'harm', 'tear'], // heal
  'healthcare': ['abandon', 'disorder', 'harm', 'neglect'], // Healthcare
  'healthtech': ['chaos', 'disorder', 'harm', 'inefficiency', 'neglect'], // HealthTech
  'healthy': ['dangerous', 'detrimental', 'fast-food', 'harmful', 'indulgent', 'poor', 'processed', 'sickly', 'toxic', 'unhealthy', 'weak'], // Healthy
  'heart': ['husk'], // heart
  'heat': ['chill', 'cold', 'cool', 'dim', 'freeze', 'frost', 'ice', 'liquid', 'soft', 'wet'], // heat
  'heated': ['calm', 'chilled-contrast', 'cold', 'cool', 'dull', 'gentle', 'glacial', 'neutral', 'peaceful', 'soft'], // heated
  'heavenly': ['terrestrial'], // heavenly
  'heaviness': ['aether', 'airiness', 'breeze', 'lucidity'], // heaviness
  'heavy': ['aero', 'aerodynamic', 'aspirant', 'aspiration', 'aspire', 'awe', 'bliss', 'breezy', 'calm', 'caution', 'cheer', 'clarity', 'comfort', 'compassion', 'competence', 'composed', 'confidence', 'connection', 'constrained', 'contemplation', 'contemplative', 'contentment', 'control', 'cosmetics', 'craving', 'curiosity', 'curious', 'defiance', 'desire', 'direct', 'distraction', 'drive', 'earnest', 'ease', 'eco-tech', 'eerie', 'effortless', 'electrified', 'empowered', 'engagement', 'euphoric', 'excite', 'excitement', 'familiarity', 'freedom', 'humor', 'inquiry', 'inspiration', 'inspire', 'intellect', 'intensity', 'intent', 'intrigue', 'introspection', 'introspective', 'isolated', 'kinetic', 'light', 'lightness', 'lightweight', 'merriment', 'mirth', 'mystery', 'mystique', 'nostalgia', 'overload', 'peace', 'peaceful', 'petite', 'poised', 'potency', 'propulsive', 'prudence', 'reassurance', 'rebellious', 'reflective', 'refreshing', 'relax', 'reliability', 'retro', 'reverence', 'secure', 'serene', 'serenity', 'sheer', 'sincere', 'slender', 'social', 'stately', 'stratosphere', 'surge', 'suspense', 'swift', 'systemic', 'thin', 'thoughtful', 'thrill', 'transit', 'translucency', 'triumph', 'uplift', 'urgency', 'vintage', 'visceral', 'watches', 'weightless', 'welcome', 'whimsy', 'wonder', 'zest'], // Heavy
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
  'hierarchy': ['anarchy', 'chaos', 'disorder', 'equality', 'flatness'], // Hierarchy
  'high': ['below', 'hollow', 'low'], // high
  'high-tech': ['handmade', 'rustic'], // High-Tech
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
  'homecare': ['boarding'], // Homecare
  'homecoming': ['exile'], // homecoming
  'homely': ['clinical', 'cold', 'impersonal', 'minimal', 'sterile'], // Homely
  'homeware': ['jewelry'], // Homeware
  'homogeneity': ['diversity', 'mismatch', 'uniqueness'], // homogeneity
  'homogeneous': ['diverse', 'granular', 'hybrid', 'particulate'], // homogeneous
  'honest': ['corrupt', 'crooked', 'deceptive', 'fake', 'false', 'fraudulent', 'hidden', 'insincere', 'misleading', 'obscure', 'shifty'], // Honest
  'honesty': ['corruption', 'deceit', 'disguise', 'distrust', 'malice'], // honesty
  'honor': ['shame'], // honor
  'hope': ['death', 'disillusion', 'futility', 'pain', 'pessimism', 'playful', 'sorrow'], // Hope
  'hopeful': ['cynicism', 'defeated', 'despair', 'despairing', 'disappointment', 'dismal', 'doubt', 'dystopic', 'fear', 'hopelessness', 'ominous', 'pessimism', 'pessimistic', 'resigned', 'uncertainty'], // hopeful
  'hopelessness': ['hopeful'], // hopelessness
  'horizon': ['base', 'center', 'depth', 'ground', 'void'], // Horizon
  'horizontal': ['diagonal', 'vertex'], // horizontal
  'horizontality': ['verticality'], // horizontality
  'horology': ['absence', 'casual', 'chaos', 'digital', 'disorder', 'ephemera', 'futility', 'imprecision', 'inefficiency', 'informal', 'instability', 'randomness'], // Horology
  'hospitality': ['alienation', 'electronics', 'exclusion', 'hostility', 'indifference', 'neglect'], // Hospitality
  'hostel': ['hotels'], // hostel
  'hostile': ['reassuring'], // hostile
  'hostility': ['empathy', 'hospitality', 'kindness', 'sanctuary'], // hostility
  'hot': ['cold', 'frozen', 'glacial'], // hot
  'hotels': ['abandon', 'camping', 'chaotic', 'deserted', 'home', 'hostel', 'industrial', 'office', 'residential', 'retail', 'unwelcoming', 'vacancy'], // Hotels
  'hover': ['fixed', 'grounded', 'plunge', 'quiet', 'settled', 'stationary', 'still', 'submerge'], // hover
  'hud': ['chaos', 'disorder', 'simplicity'], // HUD
  'hues': ['earthen', 'emerald'], // Hues
  'huge': ['diminutive', 'miniature', 'small', 'tiny'], // huge
  'human': ['ai', 'automated', 'impersonal', 'robotic', 'robotics'], // human
  'humanism': ['alienation', 'apathy', 'indifference', 'inhumanity', 'selfishness'], // Humanism
  'humanist': ['archaic', 'brutal', 'cold', 'detached', 'rigid', 'robotic'], // Humanist
  'humanities': ['engineering'], // Humanities
  'humanity': ['apathy', 'indifference', 'inhumanity'], // Humanity
  'humble': ['arrogant', 'bold', 'confident', 'crowned', 'dominance', 'empty', 'fragile', 'greed', 'imposing', 'loud', 'ostentatious', 'pretentious', 'soft', 'wealth'], // humble
  'humiliation': ['dignity'], // humiliation
  'humility': ['celebrity', 'success'], // humility
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
  'hypothesis': ['certainty', 'conclusion', 'fact'], // Hypothesis
  'ice': ['emanation', 'fire', 'heat'], // Ice
  'icon': ['forgotten', 'premium'], // Icon
  'iconography': ['illustration', 'led'], // Iconography
  'icy-palette': ['fiery'], // icy-palette
  'ideal': ['dystopic', 'flawed', 'imperfect', 'inferior', 'mediocre', 'subpar'], // Ideal
  'identified': ['ambiguous', 'anonymous', 'confused', 'disregarded', 'hidden', 'ignored', 'uncertain', 'unknown', 'vague'], // identified
  'identity': ['anonymity', 'disconnection', 'disguise', 'emptiness', 'faceless', 'gender', 'masked', 'nullity', 'oblivion', 'obscurity'], // Identity
  'idiosyncrasy': ['clarity', 'conformity', 'directness', 'familiarity', 'ordinariness', 'predictability', 'simplicity', 'standardization', 'uniformity'], // idiosyncrasy
  'idle': ['active', 'bold', 'dynamic', 'engaged', 'intense', 'lively', 'sports', 'stimulating', 'vibrant'], // idle
  'idleness': ['activity', 'creativity', 'drive', 'effort', 'engagement', 'focus', 'gym', 'productivity', 'purpose', 'pursuit'], // idleness
  'idyll': ['brutality', 'chaos', 'disorder', 'drudgery', 'dystopia', 'squalor'], // Idyll
  'ignite': ['calm', 'cool', 'darken', 'dim', 'douse', 'extinguish', 'freeze', 'inertia', 'quench'], // ignite
  'ignited': ['bland', 'cold', 'dull', 'extinguished', 'faded', 'muted', 'plain', 'subdued', 'unlit'], // Ignited
  'ignorance': ['analytics', 'awakening', 'awareness', 'certainty', 'childcare', 'clarity', 'consulting', 'context', 'discovery', 'edtech', 'education', 'edutainment', 'enlightenment', 'expertise', 'inquiry', 'insight', 'intelligence', 'interpretation', 'involvement', 'knowledge', 'mastery', 'messaging', 'museum', 'perception', 'publishing', 'revelation', 'scholarship', 'typecraft', 'understanding', 'vision', 'watches', 'wisdom'], // ignorance
  'ignorant': ['conscious', 'perceptive', 'scholarly', 'sightful'], // ignorant
  'ignore': ['acknowledge', 'emphasize', 'engage', 'engrave', 'focus', 'highlight', 'notice', 'observe', 'overlook', 'recognize', 'regard', 'support', 'underline', 'valuing'], // ignore
  'ignored': ['acknowledged', 'advertising', 'celebrated', 'embraced', 'famous', 'identified', 'included', 'known', 'noticed', 'recognized', 'seen', 'status', 'valued'], // ignored
  'illiterate': ['articulate', 'aware', 'educated', 'informed', 'knowledgeable', 'literacy', 'literate', 'logical', 'precise'], // illiterate
  'illness': ['well-being'], // Illness
  'illogical': ['clear', 'coherent', 'logical', 'orderly', 'pragmatic-visuals'], // illogical
  'illuminated': ['obscuring'], // illuminated
  'illumination': ['blackout', 'darkness', 'obscurity', 'shadow'], // Illumination
  'illusion': ['authenticity', 'clarity', 'fact', 'genuineness', 'perception', 'reality', 'substance', 'truth'], // Illusion
  'illusory': ['clear', 'obvious', 'real', 'tangible', 'truth'], // illusory
  'illustrate': ['hide'], // illustrate
  'illustration': ['compositing', 'curation', 'detail', 'digital', 'drawing', 'exhibition', 'filmic', 'filtering', 'game', 'generation', 'generative', 'graffiti', 'graphics', 'iconography', 'imaging', 'interface', 'isometric', 'lens', 'manipulation', 'masking', 'modeling', 'photoreal', 'photorealistic', 'process', 'projection', 'render', 'retouching', 'schematic', 'shading', 'simulation', 'sketching', 'staging', 'styling', 'typeset', 'typesetting', 'ui-ux', 'vector', 'video', 'volumetrics', 'web'], // Illustration
  'image': ['composition', 'contrast'], // Image
  'imaginary': ['biographical', 'certain', 'concrete', 'definite', 'existing', 'factual', 'literal', 'practical', 'real'], // imaginary
  'imagination': ['concreteness', 'literal', 'reality'], // Imagination
  'imaginative': ['biographical'], // imaginative
  'imaging': ['illustration', 'invisible', 'led', 'negligent'], // Imaging
  'imbalance': ['equilibrium'], // imbalance
  'imitation': ['invention', 'trendsetting'], // imitation
  'immaterial': ['mineral', 'tangibility'], // immaterial
  'immediate': ['delay', 'delayed', 'gradual', 'post-process', 'prolonged', 'scheduled', 'slow'], // Immediate
  'immense': ['diminutive', 'small', 'tiny'], // immense
  'immensity': ['insignificance', 'minutiae', 'petiteness', 'triviality'], // Immensity
  'immerse': ['barren', 'detached', 'disengaged', 'distant', 'escape', 'excluded', 'isolated', 'shallow', 'superficial'], // immerse
  'immersion': ['premium'], // Immersion
  'immersive': ['detached', 'disembodied', 'distracted'], // Immersive
  'immobile': ['mobile', 'shift', 'wearables'], // immobile
  'immobility': ['flexibility', 'mobility'], // Immobility
  'immortality': ['death', 'end', 'finitude', 'mortality'], // immortality
  'immovable': ['evanescent'], // immovable
  'immutable': ['mutable'], // immutable
  'impact': ['absence', 'neglect', 'void'], // Impact
  'impactful': ['forgettable', 'futile', 'irrelevant', 'pointless', 'worthless'], // impactful
  'impediment': ['catalyst'], // impediment
  'imperfect': ['authentic', 'automated', 'cgi', 'effortful', 'flawless', 'genuine', 'hyperreal', 'ideal', 'intact', 'neat', 'perfect', 'pure', 'refined', 'spotless'], // imperfect
  'imperfection': ['completeness', 'flawless', 'flawlessness', 'perfection'], // Imperfection
  'impermanence': ['constancy', 'permanence', 'stability'], // Impermanence
  'impermeable': ['absorbent', 'porous'], // impermeable
  'impersonal': ['bistro', 'casual', 'expressive', 'friendly', 'homely', 'human', 'intimate', 'personal', 'personalized', 'unique', 'user-centric', 'warmth'], // impersonal
  'impersonality': ['customization', 'intimacy'], // Impersonality
  'implicit': ['annotation'], // Implicit
  'importance': ['insignificance'], // importance
  'important': ['insignificant', 'irrelevant', 'petty', 'trivial', 'worthless'], // important
  'imposing': ['humble', 'insignificant', 'modest', 'subtle', 'unassuming'], // Imposing
  'imposition': ['clarity', 'ease', 'fluidity', 'freedom', 'liberation', 'lightness', 'purity', 'simplicity', 'spontaneity'], // Imposition
  'impossible': ['achievable', 'obtainable', 'reachable'], // impossible
  'impotence': ['certainty', 'clarity', 'firm', 'potency', 'power', 'purity', 'solid', 'strength', 'vitality'], // impotence
  'impractical': ['academia', 'effective', 'efficient', 'functional', 'practical', 'realistic', 'sensible', 'usable', 'utilitarian', 'viable'], // impractical
  'imprecise': ['analytical', 'calculated', 'calculated-precision', 'calculation', 'certain', 'clear', 'defined', 'definition', 'exact', 'focused', 'precise', 'prime', 'seamless', 'sharp', 'specific'], // imprecise
  'imprecision': ['algorithm', 'exact', 'horology', 'measure', 'watchmaking'], // imprecision
  'impression': ['clarity', 'definition', 'exactness', 'fact', 'passion', 'photoreal', 'precision', 'reality', 'truth'], // impression
  'impressionist': ['clarity', 'formality', 'precision', 'realism', 'structure'], // Impressionist
  'imprint': ['absence', 'blur', 'disperse', 'dissolve', 'erase', 'faint', 'scatter', 'vague', 'void'], // Imprint
  'impromptu': ['methodical'], // impromptu
  'impromptu-display': ['premeditated'], // impromptu-display
  'impromptu-gathering': ['scheduled'], // impromptu-gathering
  'improv': ['script'], // improv
  'improvement': ['decline', 'deterioration', 'failure', 'regression', 'stagnation'], // Improvement
  'improvisation': ['calculation', 'coding', 'engineering', 'framework', 'method', 'outlining', 'planning'], // improvisation
  'improvised': ['charted', 'computational', 'conventional', 'deliberate', 'fixed', 'mechanic', 'modelling', 'planned', 'precise', 'predefined', 'procedural', 'standard', 'structured', 'uniform'], // improvised
  'impulsive': ['behavioral', 'cautious', 'cerebral', 'deliberate', 'planned', 'premeditated', 'rational', 'strategic'], // impulsive
  'impunity': ['consequence'], // impunity
  'impure': ['clean', 'clear', 'coherent', 'defined', 'focused', 'intentional', 'pure', 'structured'], // impure
  'impurity': ['purity'], // impurity
  'inaccessible': ['accessible', 'achievable', 'obtainable', 'reachable'], // inaccessible
  'inaccuracy': ['watchmaking'], // inaccuracy
  'inactive': ['active', 'alive', 'appearing', 'athlete', 'bustling', 'capable', 'live', 'swift', 'vibration'], // inactive
  'inactivity': ['activity', 'agency', 'gesture', 'stimulation', 'watches'], // inactivity
  'inanimate': ['wearables'], // inanimate
  'inattention': ['awakening'], // inattention
  'inception': ['end'], // inception
  'included': ['ignored'], // included
  'inclusion': ['abandon', 'abandonment', 'alienation', 'detachment', 'dismissal', 'escape', 'exile', 'exploitation', 'expulsion', 'premium', 'shunning'], // Inclusion
  'inclusive': ['disjoint', 'dismissive', 'divisive', 'isolating', 'segregated', 'selfish'], // inclusive
  'inclusivity': ['alienation', 'division', 'divisive', 'exclusivity', 'isolation', 'segregation'], // Inclusivity
  'incoherence': ['integrity'], // incoherence
  'incoherent': ['coherent', 'concreteness'], // incoherent
  'incompetence': ['intelligence', 'mastery', 'skillful'], // incompetence
  'incompetent': ['capable', 'skillful'], // incompetent
  'incomplete': ['clear', 'common', 'complete', 'complete-manifestation', 'finished', 'full', 'intact', 'simple', 'whole'], // incomplete
  'incomplete-can-be-replaced-with-unfinished-for-better-mutual-exclusivity': ['complete'], // incomplete" can be replaced with "unfinished" for better mutual exclusivity
  'incompleteness': ['wholeness'], // incompleteness
  'incompletion': ['completion'], // incompletion
  'inconsistency': ['resolve'], // inconsistency
  'inconsistent': ['analogous', 'reliable', 'seamless'], // inconsistent
  'increase': ['deplete', 'plummet', 'reduction', 'shrink'], // increase
  'indecency': ['dignity'], // indecency
  'indecision': ['assertiveness', 'fortitude', 'resolve'], // indecision
  'indecisive': ['decisive', 'resolved'], // indecisive
  'independence': ['childhood', 'collectivism', 'companionship', 'dependence', 'government', 'interdependence', 'obedience', 'premium', 'submission'], // Independence
  'independent': ['bound', 'obedient'], // independent
  'indeterminacy': ['definition', 'units'], // indeterminacy
  'indeterminate': ['concreteness', 'reachable'], // indeterminate
  'indie': ['commercial', 'mainstream', 'popular'], // Indie
  'indifference': ['admiring', 'ambition', 'anticipation', 'attention', 'belief', 'childcare', 'consensus', 'demand', 'emotion', 'empathy', 'engage', 'expressiveness', 'exuberance', 'fandom', 'favor', 'fervor', 'hospitality', 'humanism', 'humanity', 'hype', 'intimacy', 'involvement', 'kindness', 'marketing', 'participation', 'passion', 'recognition', 'respect', 'veneration', 'zeal'], // indifference
  'indifferent': ['cherishing', 'driven', 'empathetic', 'engaged'], // indifferent
  'indigo': ['amber', 'earthen', 'emerald', 'washed'], // Indigo
  'indirect': ['straightforward'], // indirect
  'indirectness': ['gesture'], // indirectness
  'indiscretion': ['discretion'], // indiscretion
  'indistinct': ['clear', 'defined', 'depictive', 'distinct', 'distinction', 'distinctness', 'specific', 'vivid'], // indistinct
  'individual': ['aggregate', 'avatar', 'blended', 'collaborative', 'collective', 'commodity', 'common', 'conform', 'global', 'group', 'massproduced', 'team-building', 'unified'], // individual
  'individualism': ['collectivism', 'premium'], // Individualism
  'individuality': ['archetype', 'industry', 'monoculture'], // individuality
  'indulgence': ['discipline', 'gym'], // indulgence
  'indulgent': ['basic', 'basic-bites', 'frugal', 'healthy', 'minimal', 'modest', 'plain', 'simple', 'sparse', 'subdued'], // indulgent
  'industrial': ['artisanal', 'bistro', 'botanical', 'boutique', 'coastal', 'cottagecore', 'edtech', 'elegant', 'folk', 'hotels', 'minimal', 'natural', 'organic', 'pastoral', 'residential', 'rural', 'soft', 'yachting'], // Industrial
  'industry': ['art', 'chaos', 'freedom', 'freetime', 'individuality', 'nature'], // Industry
  'inedible': ['beverage'], // Inedible
  'ineffective': ['empowering', 'practical'], // ineffective
  'ineffectiveness': ['efficacy', 'power'], // ineffectiveness
  'inefficacy': ['efficacy'], // inefficacy
  'inefficiency': ['economy', 'efficacy', 'healthtech', 'horology', 'optimization', 'productivity', 'solutions'], // inefficiency
  'inefficient': ['aerodynamic'], // inefficient
  'inept': ['capable'], // inept
  'inequity': ['finance'], // inequity
  'inert': ['activating'], // inert
  'inertia': ['energy', 'ignite', 'momentum', 'trajectory', 'vigor', 'vitality', 'voyage'], // inertia
  'inexact': ['exact'], // inexact
  'inexperience': ['expertise'], // inexperience
  'inferior': ['elite', 'equality', 'freedom', 'harmony', 'ideal', 'justice', 'kindness', 'prestige', 'prime', 'prosperity', 'superior', 'uplift'], // inferior
  'inferiority': ['excellence'], // inferiority
  'infinite': ['bounded', 'finite', 'globe', 'limit', 'limited'], // Infinite
  'infinity': ['bounded', 'chronos', 'finality', 'finite', 'limitation', 'limited', 'microcosm', 'mortality', 'temporary'], // Infinity
  'inflate': ['shrink'], // inflate
  'inflexibility': ['adaptability', 'flexibility'], // Inflexibility
  'inflexible': ['flexibility', 'malleable', 'responsive'], // inflexible
  'influence': ['premium'], // Influence
  'influential': ['insignificant'], // influential
  'informal': ['academia', 'command', 'conventional', 'doctrinal', 'formal', 'formality', 'horology', 'official', 'rigid', 'serious', 'solidify', 'stiff', 'structured', 'techwear', 'traditional'], // Informal
  'informal-inquiry': ['doctrinal'], // informal-inquiry
  'informal-knowledge': ['scholarly'], // informal-knowledge
  'informality': ['dignity'], // Informality
  'informative': ['ambiguous', 'confusing', 'misleading', 'obscure', 'vague'], // Informative
  'informed': ['clueless', 'illiterate'], // informed
  'infrastructure': ['premium'], // Infrastructure
  'ingenuity': ['boring', 'dull', 'lazy', 'mundane', 'stupid'], // Ingenuity
  'ingredients': ['absence', 'depletion', 'emptiness', 'void', 'waste'], // Ingredients
  'inhalation': ['emission'], // inhalation
  'inhibition': ['expressiveness', 'self-expression'], // inhibition
  'inhibitor': ['catalyst'], // inhibitor
  'inhospitable': ['biophilic'], // inhospitable
  'inhumanity': ['humanism', 'humanity'], // inhumanity
  'initial': ['final'], // initial
  'initiate': ['finish'], // initiate
  'initiation': ['finale'], // initiation
  'initiative': ['passivity', 'sloth'], // initiative
  'inland': ['marine', 'nautical'], // inland
  'inner': ['facade'], // inner
  'innocence': ['corruption', 'depravity', 'guilt', 'malice', 'vice', 'wickedness'], // Innocence
  'innovate': ['conform', 'repeat', 'replicate', 'restrict', 'simplify', 'stagnate'], // Innovate
  'innovative': ['ancient', 'archaic', 'banal', 'conventional', 'mediocre', 'mundane', 'obsolete', 'pedestrian', 'primitive', 'repetitive', 'stagnant', 'tainted', 'traditional'], // Innovative
  'inorganic': ['bio'], // inorganic
  'inquiry': ['disregard', 'heavy', 'ignorance'], // Inquiry
  'insecure': ['genuineness', 'robust', 'settled'], // insecure
  'insecurity': ['assertiveness', 'strength', 'success', 'valor'], // insecurity
  'insight': ['ambiguity', 'blindness', 'confusion', 'fog', 'ignorance', 'misunderstanding', 'obscurity', 'stupidity'], // Insight
  'insightful': ['clueless'], // insightful
  'insignificance': ['clarity', 'grandeur', 'gravitas', 'immensity', 'importance', 'meaning', 'prominence', 'relevance', 'significance', 'value'], // insignificance
  'insignificant': ['epic', 'essential', 'famous', 'important', 'imposing', 'influential', 'majestic', 'monumental', 'notable', 'prominent', 'remarkable', 'significant', 'vast', 'vital'], // insignificant
  'insincere': ['authentic', 'earnest', 'genuine', 'honest', 'open', 'real', 'sincere', 'transparent', 'true', 'trustworthy'], // insincere
  'insincerity': ['authenticity', 'sincerity'], // insincerity
  'insipid': ['colorful', 'dynamic', 'engaging', 'exciting', 'flavorful', 'rich', 'stimulating', 'value', 'vibrant'], // insipid
  'inspiration': ['heavy'], // Inspiration
  'inspire': ['heavy', 'hinder'], // Inspire
  'instability': ['approval', 'climate', 'constancy', 'endurance', 'engineering', 'fortitude', 'horology', 'persistence', 'resilience', 'settle', 'stability'], // instability
  'installed': ['wearables'], // Installed
  'instant': ['ambiguous', 'delayed', 'gradual', 'historical', 'lengthy', 'lingering', 'loading', 'slow', 'uncertain'], // instant
  'instant-delivery': ['lingering', 'unhurried'], // instant-delivery
  'instinct': ['analysis', 'analytics', 'calculation', 'deliberate', 'mechanism', 'predetermined', 'reason'], // Instinct
  'instinctive': ['calculated', 'cerebral'], // instinctive
  'insufficiency': ['abundance'], // insufficiency
  'intact': ['aftermath', 'broken', 'chaotic', 'cracked', 'damaged', 'deconstructivist', 'disordered', 'fracture', 'fragmented', 'imperfect', 'incomplete', 'leak', 'scattered', 'scratched'], // intact
  'intactness': ['obliteration'], // intactness
  'intangible': ['clear', 'concrete', 'definite', 'literal', 'material', 'physicality', 'solid', 'substantial', 'tangibility', 'tangible'], // Intangible
  'integral': ['crooked', 'extraneous', 'modular'], // integral
  'integrate': ['collapse', 'deconstruct', 'disassemble', 'disconnect', 'disjoint', 'disperse', 'disrupt', 'diverge', 'divide', 'exclude', 'fragment', 'scatter', 'separate', 'split', 'vacate'], // Integrate
  'integrated': ['chaotic', 'deconstructivism', 'detached', 'disconnected', 'disjointed', 'disparate', 'divided', 'divisive', 'fragmented', 'isolated', 'modular', 'scattered', 'segmented', 'segregated', 'separate'], // Integrated
  'integrating': ['dividing', 'isolating', 'obliterating'], // integrating
  'integration': ['barrier', 'deconstruction', 'detachment', 'disorder', 'dispersal', 'dissipation', 'exile', 'expulsion', 'fragmentation', 'negation'], // Integration
  'integrity': ['ambiguity', 'chaos', 'confusion', 'corrupt', 'corruption', 'deceit', 'dishonesty', 'disorder', 'distortion', 'flaw', 'fragmented', 'incoherence', 'ruin', 'separation'], // integrity
  'intellect': ['dullard', 'heavy'], // Intellect
  'intellectual property': ['merchandise'], // intellectual property
  'intellectual-property': ['merchandise'], // Intellectual Property
  'intelligence': ['foolishness', 'ignorance', 'incompetence', 'naivety', 'stupidity'], // Intelligence
  'intelligent': ['foolish', 'silly'], // intelligent
  'intense': ['ambient', 'blunt', 'chill', 'dispassionate', 'easy', 'fading', 'faint', 'filtered', 'flippant', 'idle', 'leisurely', 'mellow', 'mute', 'paused', 'shallow', 'slack', 'washed', 'weak'], // intense
  'intensification': ['diminution', 'reduction'], // intensification
  'intensify': ['calm', 'cool', 'dull', 'fade', 'lessen', 'reduce', 'subdue', 'subside', 'weaken'], // intensify
  'intensifying': ['diluting', 'dissolving', 'subduing'], // intensifying
  'intensity': ['heavy', 'levity'], // Intensity
  'intent': ['aimless', 'distracted', 'heavy'], // Intent
  'intention': ['negligence'], // intention
  'intentional': ['aimless', 'arbitrary', 'artless', 'awkward', 'detached', 'disorder', 'dispersal', 'distracted', 'frivolous', 'haphazard', 'hasty', 'impure', 'massproduced', 'negligent', 'unplanned'], // Intentional
  'interaction': ['detachment', 'disconnection', 'isolation', 'monologue', 'separation', 'silence', 'solitude'], // interaction
  'interactions': ['composition', 'contrast'], // Interactions
  'interactive': ['composition', 'isolating', 'static'], // Interactive
  'interconnectedness': ['detached', 'disorder', 'dispersal'], // Interconnectedness
  'interconnection': ['detachment', 'dispersal', 'isolation', 'segregated'], // Interconnection
  'interdependence': ['detachment', 'independence', 'isolation'], // Interdependence
  'interest': ['boredom', 'disinterest', 'distrust'], // interest
  'interested': ['bored', 'disinterested', 'disjoint'], // interested
  'interface': ['illustration', 'led'], // Interface
  'interfacing': ['contrast', 'disconnection', 'division', 'isolation', 'separation'], // Interfacing
  'interference': ['clarity', 'direct', 'directness', 'flow', 'openness', 'unimpeded'], // Interference
  'interior': ['exterior', 'landscape', 'street', 'urban'], // Interior
  'interlink': ['disconnect', 'divide', 'isolate', 'separate', 'split'], // Interlink
  'interlock': ['detach', 'disperse', 'separate'], // Interlock
  'internal': ['external', 'eyewear'], // internal
  'interplay': ['detachment', 'disconnection', 'isolation', 'monotony', 'stagnation'], // Interplay
  'interpretation': ['ambiguity', 'chaos', 'confusion', 'dogma', 'fact', 'ignorance', 'literalism', 'obscurity'], // Interpretation
  'interrupted': ['cohesive', 'complete', 'continuous', 'fluid', 'unified', 'uninterrupted', 'untamed'], // Interrupted
  'intersect': ['detach', 'disorder', 'disperse'], // Intersect
  'interstitial': ['clear', 'coherent', 'defined', 'definite', 'distinct', 'focused', 'personal', 'practical', 'solid', 'specific'], // Interstitial
  'intertwined': ['detached', 'disjoint', 'dispersal', 'separation'], // Intertwined
  'interwoven': ['detached', 'dispersal', 'fragmented', 'isolation', 'separate', 'separation'], // Interwoven
  'intimacy': ['alienation', 'coldness', 'detachment', 'distance', 'grandeur', 'impersonality', 'indifference', 'isolation', 'loneliness', 'separation'], // Intimacy
  'intimate': ['cold', 'detached', 'distant', 'external', 'impersonal', 'open', 'public'], // Intimate
  'intricacy': ['rudimentary'], // intricacy
  'intricate': ['base', 'editorial', 'harmony', 'lightweight', 'rudimentary', 'simplify', 'simplifying'], // Intricate
  'intrigue': ['heavy', 'obvious'], // Intrigue
  'introduction': ['endgame', 'finale'], // introduction
  'introspection': ['heavy', 'outward', 'shallow'], // Introspection
  'introspective': ['external', 'heavy', 'obtrusive'], // Introspective
  'introverted': ['bold', 'dynamic', 'expressive', 'extroverted', 'loud', 'outgoing', 'performative', 'social', 'vibrant'], // introverted
  'intuition': ['algorithm', 'analysis', 'analytics', 'calculation', 'logic'], // intuition
  'intuitive': ['ai', 'analytical', 'cerebral', 'clinical', 'computational', 'scientific', 'theoretical'], // intuitive
  'invade': ['retreat'], // invade
  'invention': ['convention', 'copy', 'heritage', 'imitation', 'repetition', 'routine', 'stagnation', 'tradition', 'uniformity'], // invention
  'inventive': ['conventional', 'mundane', 'ordinary', 'predictable', 'stagnant'], // Inventive
  'invested': ['disinterested'], // invested
  'investigative': ['casual', 'known', 'obvious', 'transparent', 'uninquisitive', 'unobservant'], // Investigative
  'invigorated': ['weakened', 'weary'], // invigorated
  'invigorating': ['draining', 'tiring'], // invigorating
  'invisibility': ['advertising', 'materials', 'observation', 'statement', 'visualization'], // invisibility
  'invisible': ['apparent', 'attracting', 'clear', 'evident', 'exposed', 'foreground', 'imaging', 'manifest', 'murals', 'obvious', 'performative', 'showy', 'visible'], // invisible
  'invitation': ['warning'], // invitation
  'invite': ['lock'], // invite
  'inviting': ['barren', 'bleak', 'cool', 'coolness', 'foul', 'ominous', 'repellent', 'repelling'], // Inviting
  'involved': ['absent', 'detached', 'disinterested', 'dispassionate'], // involved
  'involvement': ['absence', 'detachment', 'disengagement', 'disinterest', 'ignorance', 'indifference', 'neglect', 'passive', 'unintentional'], // involvement
  'inward': ['external', 'outward'], // inward
  'iridescent': ['earthen', 'emerald', 'matt', 'opaque'], // Iridescent
  'irrational': ['behavioral', 'calculated', 'design', 'logical', 'practical', 'rational', 'realistic', 'sane', 'sensible'], // irrational
  'irrationality': ['logic', 'sense'], // irrationality
  'irregular': ['axis', 'columnar', 'cylindrical', 'mainstream', 'normal', 'normalcy', 'octagonal', 'rows', 'scheduled', 'sequential', 'spherical'], // irregular
  'irrelevant': ['essential', 'impactful', 'important', 'meaningful', 'necessary', 'relevance', 'relevant', 'significant', 'valuable'], // irrelevant
  'irreverence': ['veneration'], // irreverence
  'irreverent': ['authoritative', 'conventional', 'formal', 'respectful', 'reverent', 'serious', 'sincere', 'solemn', 'traditional'], // Irreverent
  'isolate': ['collect', 'combine', 'compositing', 'connect', 'gather', 'interlink', 'join', 'merge', 'share', 'synthesize', 'unite'], // isolate
  'isolated': ['aggregate', 'blockchain', 'clustered', 'collaborative', 'globe', 'heavy', 'immerse', 'integrated', 'merged', 'public', 'shared', 'symphonic', 'synchronized', 'ubiquitous', 'unified', 'united', 'user-centric'], // Isolated
  'isolating': ['collaborative', 'communal', 'conglomerating', 'connecting', 'engaging', 'inclusive', 'integrating', 'interactive', 'visible'], // isolating
  'isolation': ['adoption', 'assemblage', 'belonging', 'closeness', 'coexistence', 'collaboration', 'collectivism', 'companion', 'companionship', 'connect', 'connectedness', 'continuum', 'convergence', 'corner', 'dialogue', 'diffusion', 'ecosystem', 'embrace', 'envelopment', 'experience', 'fame', 'fandom', 'flotilla', 'fusion', 'globalization', 'inclusivity', 'interaction', 'interconnection', 'interdependence', 'interfacing', 'interplay', 'interwoven', 'intimacy', 'logistics', 'metaverse', 'microcosm', 'network', 'nodes', 'openness', 'participation', 'premium', 'superimposition', 'synchronicitical', 'telecommunications', 'togetherness', 'unison', 'world'], // Isolation
  'isolationist': ['collaborative'], // isolationist
  'isometric': ['illustration'], // Isometric
  'jaded': ['naive'], // jaded
  'jagged': ['balanced', 'even', 'linear', 'round', 'smooth', 'uniform'], // Jagged
  'jaggedness': ['smoothness'], // jaggedness
  'janky': ['elegant', 'fine', 'fluid', 'graceful', 'polished', 'refined', 'sleek', 'smooth', 'subtle'], // janky
  'japandi': ['chaotic', 'cluttered', 'eclectic'], // Japandi
  'jarring': ['ambient', 'balanced', 'calm', 'cohesive', 'gentle', 'gradual', 'harmonic', 'harmonious', 'neumorphism', 'pleasant', 'seamless', 'smooth', 'soothing', 'subtle'], // jarring
  'jazz': ['classical', 'pop'], // Jazz
  'jewelry': ['apparel', 'electronics', 'homeware', 'tools', 'utilitarian'], // Jewelry
  'join': ['detach', 'isolate', 'resign', 'separate', 'split'], // join
  'journey': ['abandon', 'completion', 'deadend', 'endgame', 'finality', 'stasis'], // Journey
  'jovial': ['dreary', 'gloomy', 'sad', 'solemn', 'sorrowful'], // jovial
  'joy': ['agony', 'anger', 'anguish', 'bleakness', 'boredom', 'burden', 'calm', 'coldness', 'death', 'displeasure', 'dissatisfaction', 'drudgery', 'fear', 'frustration', 'futility', 'gloom', 'misfortune', 'pain', 'peaceful', 'pessimism', 'serene', 'shame', 'sorrow', 'strain', 'stress', 'strife', 'struggle', 'torment', 'vintage'], // Joy
  'joyful': ['burdensome', 'despairing', 'dismal', 'downcast', 'dreary', 'dystopic', 'grim', 'haunting', 'ominous', 'pessimistic', 'resigned', 'solemn', 'somber'], // joyful
  'jubilant': ['bitter'], // jubilant
  'jumble': ['clarity', 'harmony', 'layout', 'neatness', 'order', 'simplicity', 'smoothness', 'structure', 'uniformity'], // jumble
  'jumbled': ['calm', 'clear', 'coherent', 'harmonious', 'linearity', 'neat', 'ordered', 'simple', 'structured'], // jumbled
  'justice': ['inferior'], // justice
  'juxtaposition': ['consistency', 'harmony', 'unity'], // Juxtaposition
  'kaleidoscope': ['monochrome-palette'], // kaleidoscope
  'kaleidoscopic': ['dull', 'flat', 'linear', 'monochrome', 'monotony', 'quiet', 'simple', 'static', 'uniform'], // kaleidoscopic
  'key': ['blurry', 'duotone', 'earthen', 'muffled'], // key
  'kind': ['rude', 'savage'], // kind
  'kindness': ['apathy', 'cruelty', 'disdain', 'hatred', 'hostility', 'indifference', 'inferior', 'malice', 'neglect', 'ridicule', 'scorn'], // kindness
  'kinetic': ['heavy'], // Kinetic
  'kitsch': ['elegant', 'minimal', 'refined', 'sophisticated', 'subtle'], // Kitsch
  'knowledge': ['foolishness', 'ignorance', 'naivety', 'premium'], // Knowledge
  'knowledgeable': ['clueless', 'illiterate'], // knowledgeable
  'known': ['anonymous', 'forgotten', 'fugitive', 'hidden', 'ignored', 'investigative', 'neglected', 'obscure', 'unfamiliar', 'unknown'], // known
  'labeled': ['ambiguous', 'chaotic', 'diffuse', 'general', 'non-textual', 'random', 'uncertain', 'unlabeled', 'vague'], // labeled
  'laborious': ['easy'], // laborious
  'labyrinthine': ['clear', 'direct', 'linear', 'obvious', 'plain', 'simple', 'simplistic', 'static', 'straight'], // labyrinthine
  'lack': ['abundance', 'affluence', 'art', 'bounty', 'catering', 'full', 'fullness', 'materials', 'merchandise', 'might', 'need', 'plenty', 'richness', 'saturation', 'unleash', 'vibrancy', 'wealth'], // lack
  'lacking': ['fertile', 'filled'], // lacking
  'lackluster': ['captivating', 'watches'], // lackluster
  'laid-back': ['anxious', 'tense'], // Laid-back
  'lame': ['bold', 'colorful', 'coolness', 'dynamic', 'engaging', 'exciting', 'lively', 'stimulating', 'vibrant'], // lame
  'land': ['marine', 'nautical', 'oceanic', 'soar', 'yachting'], // land
  'land-based': ['marine'], // Land-based
  'landscape': ['interior'], // Landscape
  'language': ['premium'], // Language
  'languid': ['propulsive'], // languid
  'large': ['micro', 'miniature', 'petite', 'small'], // large
  'lasting': ['evanescent', 'fleeting', 'momentary'], // lasting
  'lattice': ['chaos', 'disorder', 'randomness', 'simplicity', 'solidity'], // Lattice
  'launch': ['finale', 'stop'], // launch
  'lavish': ['basic', 'cheap', 'dull', 'frugal', 'meager', 'modest', 'plain', 'simple', 'sparse', 'sparsity', 'unadorned'], // lavish
  'layered': ['empty', 'fibrous', 'flat', 'fluid', 'null', 'planar', 'simplify'], // Layered
  'layering': ['detachment', 'dispersal', 'erasing', 'flatness', 'flattening', 'minimalism', 'simplicity', 'simplify', 'unify'], // Layering
  'layers': ['flat', 'simple', 'single'], // Layers
  'layoffs': ['recruitment'], // Layoffs
  'layout': ['estate', 'jumble', 'text'], // Layout
  'laziness': ['active', 'ambition', 'diligent', 'driven', 'energetic', 'engaged', 'gym', 'motivated', 'productive', 'zeal'], // laziness
  'lazy': ['active', 'athlete', 'busy', 'driven', 'dynamic', 'energetic', 'enthusiastic', 'ingenuity', 'motivated', 'vibrant'], // lazy
  'leak': ['block', 'complete', 'firm', 'full', 'intact', 'seal', 'secure', 'solid'], // leak
  'lean': ['plump'], // lean
  'leave': ['remain'], // leave
  'led': ['blind', 'capture', 'chaotic', 'cinematography', 'collage', 'compositing', 'curation', 'detail', 'digital', 'drawing', 'dreamlike', 'exhibition', 'filmic', 'filtering', 'game', 'generation', 'generative', 'graffiti', 'graphics', 'iconography', 'imaging', 'interface', 'lens', 'manipulation', 'masking', 'modeling', 'photoreal', 'photorealistic', 'process', 'projection', 'render', 'retouching', 'schematic', 'shading', 'simulation', 'sketching', 'staging', 'styling', 'typeset', 'typesetting', 'typographic', 'ui-ux', 'vector', 'video', 'volumetrics', 'web'], // Led
  'legacy': ['disposability', 'ephemerality', 'fintech', 'novelty', 'obsolescence', 'transience'], // Legacy
  'leisure': ['demand', 'drudgery', 'duty', 'grind', 'gym', 'hustle', 'motorsport', 'obligation', 'rush', 'stress', 'work'], // Leisure
  'leisurely': ['busy', 'chaotic', 'demanding', 'frantic', 'hectic', 'intense', 'speed', 'stressful', 'urgent'], // leisurely
  'leisurely-flow': ['rushed', 'staccato'], // leisurely-flow
  'lengthy': ['brevity', 'brief', 'instant', 'quick', 'short'], // lengthy
  'lens': ['illustration', 'led'], // Lens
  'lessen': ['amplify', 'intensify', 'magnify', 'overpower'], // lessen
  'letgo': ['hold'], // letgo
  'lethargic': ['activating', 'active', 'athlete', 'bold', 'bright', 'bustling', 'dynamic', 'energetic', 'lively', 'stimulating', 'swift', 'vibrant'], // lethargic
  'lethargy': ['activating', 'alertness', 'ambition', 'vigor', 'zeal', 'zesty'], // lethargy
  'level': ['arch', 'chaotic', 'diagonal', 'disordered', 'dome', 'fragmented', 'haphazard', 'raised', 'random', 'scattered', 'uneven'], // level
  'levelness': ['verticality'], // levelness
  'levity': ['burden', 'gravity', 'intensity', 'restraint', 'seriousness', 'sorrow', 'tension', 'weight', 'weightiness'], // levity
  'liberate': ['hinder'], // liberate
  'liberated': ['confining'], // liberated
  'liberating': ['suppressing'], // liberating
  'liberation': ['binding', 'bondage', 'captivity', 'confinement', 'control', 'deprivation', 'imposition', 'limitation', 'oppression', 'restriction', 'subjugation', 'suppression'], // Liberation
  'liberty': ['constraint', 'dependence', 'government', 'regulation', 'restriction'], // liberty
  'lie': ['fact'], // lie
  'life': ['coldness', 'death', 'dormancy', 'end', 'fall', 'futility', 'nonexist', 'stillness', 'void'], // Life
  'lifeless': ['alive', 'animated', 'colorful', 'dynamic', 'energetic', 'exciting', 'liveliness', 'lively', 'stimulating', 'vibrant', 'vibration', 'vital', 'zest'], // lifeless
  'lifestyle': ['conformity', 'detachment', 'rigidity', 'stagnation', 'uniformity'], // Lifestyle
  'lift': ['drag', 'plunge'], // lift
  'light': ['abyss', 'arduous', 'blackout', 'blocky', 'boxy', 'burdened', 'burdensome', 'buzz', 'challenging', 'composition', 'concrete', 'cumbersome', 'dark', 'darkness', 'death', 'dusk', 'eclipse', 'ember', 'flood', 'gothic', 'graphite', 'grim', 'heavy', 'obscured', 'pain', 'pessimism', 'pessimistic', 'ponderous', 'serious', 'shade', 'stern', 'stiff', 'stone', 'strenuous', 'sturdy', 'thick', 'viscous', 'weight', 'weighty', 'wire'], // Light
  'lighten': ['plunge'], // lighten
  'lighthearted': ['solemn'], // lighthearted
  'lightmode': ['darkmode'], // lightmode
  'lightness': ['burden', 'darkness', 'dimness', 'fog', 'gravitas', 'gravity', 'heavy', 'imposition', 'mass', 'pressure', 'strain'], // Lightness
  'lightweight': ['burdensome', 'complex', 'dense', 'freight', 'heavy', 'intricate', 'monolithic-depth', 'robust', 'solid', 'strenuous'], // lightweight
  'like': ['composition', 'contrast', 'dislike', 'dismiss', 'distrust'], // Like
  'limbo': ['certainty', 'clarity', 'completion', 'resolve'], // Limbo
  'liminality': ['certainty', 'completeness', 'concreteness', 'finality', 'permanence', 'stability'], // Liminality
  'limit': ['beyond', 'boundless', 'chaotic-abundance', 'endless', 'expand', 'expansive', 'freedom', 'freeness', 'infinite', 'limitless', 'overflow', 'portal', 'threshold', 'unlimited', 'vast'], // Limit
  'limitation': ['boundless', 'boundless-exploration', 'expanse', 'expansion', 'freedom', 'growth', 'infinity', 'liberation', 'limitless', 'openness', 'possibility', 'potential', 'vastness'], // Limitation
  'limited': ['boundless', 'capable', 'earthen', 'emerald', 'endless', 'endlessness', 'eternal', 'infinite', 'infinity', 'limitless', 'restless', 'ubiquitous', 'unbound', 'unconfined', 'vast'], // Limited
  'limitless': ['bounded', 'confined', 'constrained', 'finite', 'limit', 'limitation', 'limited', 'narrowed', 'restricted', 'shroud', 'stifled'], // limitless
  'line': ['blob', 'chaos', 'circle', 'curve', 'dot', 'form', 'loop', 'polyhedron', 'sphere', 'surface', 'volume'], // Line
  'linear': ['3d', 'arch', 'blockchain', 'braided', 'branching', 'bump', 'carousel', 'circuitous', 'circular', 'coil', 'curvilinear', 'curvy', 'globe', 'jagged', 'kaleidoscopic', 'labyrinthine', 'loop', 'oblique', 'octagonal', 'radial', 'round', 'serpentine', 'spherical', 'spiral', 'tangential', 'topography', 'tubular', 'twist', 'twisted', 'wavy'], // linear
  'linear-path': ['circuitous'], // linear-path
  'linearity': ['convolution', 'curvature', 'editorial', 'harmony', 'jumbled'], // Linearity
  'lingering': ['brief', 'ephemeral', 'fleeting', 'hasty', 'instant', 'instant-delivery', 'momentary', 'quick', 'transient'], // lingering
  'linkage': ['detachment', 'disconnection', 'dispersal'], // Linkage
  'liquefying': ['solidifying'], // liquefying
  'liquid': ['fixed', 'frozen', 'heat', 'powder', 'rigid', 'solid'], // Liquid
  'literacy': ['confused', 'illiterate', 'premium'], // Literacy
  'literal': ['abstraction', 'conceptual', 'cubism', 'dreamlike', 'fable', 'fictional', 'figurative', 'imaginary', 'imagination', 'intangible', 'mystic', 'oblique', 'symbolic', 'symbolism'], // literal
  'literal-interpretation': ['symbolic'], // literal-interpretation
  'literalism': ['interpretation'], // Literalism
  'literary': ['brutal', 'chaos', 'crude', 'disorder', 'distrust'], // Literary
  'literate': ['illiterate'], // literate
  'live': ['album', 'dead', 'expire', 'inactive', 'memorial', 'past', 'stagnant', 'still'], // live
  'liveliness': ['bleakness', 'dead', 'dimness', 'drab', 'dull', 'dullness', 'flat', 'lifeless', 'mundane', 'quiet', 'still'], // Liveliness
  'lively': ['bland', 'bore', 'boring', 'cold', 'desolate', 'dismal', 'drab', 'drag', 'drain', 'drained', 'dreary', 'dull', 'dullard', 'idle', 'lame', 'lethargic', 'lifeless', 'monotonous', 'plain', 'sluggish', 'sober', 'somber', 'stale', 'sterile', 'stifled', 'stuffy', 'tedious', 'tired', 'weary', 'withering'], // lively
  'loading': ['composition', 'contrast', 'finished', 'instant'], // Loading
  'local': ['alien', 'e-commerce', 'ecommerce', 'external', 'foreign', 'freight', 'global', 'globe', 'planetary', 'premium', 'remote'], // Local
  'localism': ['globalism', 'globalization', 'monotony', 'standardization', 'uniformity'], // localism
  'lock': ['access', 'expose', 'free', 'invite', 'loose', 'open', 'release', 'scroll', 'unblock'], // lock
  'lofty': ['common', 'grounded', 'lowly', 'mundane', 'ordinary', 'simple'], // lofty
  'logic': ['chaos', 'emotion', 'foolishness', 'intuition', 'irrationality', 'myth', 'paradox', 'subjectivity'], // Logic
  'logical': ['chaotic', 'confused', 'disordered', 'emotionalist', 'illiterate', 'illogical', 'irrational', 'random', 'unfocused', 'vague'], // logical
  'logistics': ['chaos', 'isolation', 'residential', 'stagnation', 'waste'], // Logistics
  'loneliness': ['closeness', 'intimacy', 'togetherness'], // loneliness
  'lonely': ['collaborative', 'shared'], // lonely
  'loop': ['angle', 'break', 'broken', 'disrupt', 'end', 'finite', 'gap', 'line', 'linear', 'sharp', 'static', 'stop'], // Loop
  'loose': ['bind', 'binding', 'bound', 'buzz', 'concentrated', 'consolidate', 'constrained', 'constrict', 'controlled', 'exact', 'fixed', 'hold', 'lock', 'narrow', 'restrained', 'restrictive', 'rigid', 'root', 'rooted', 'serious', 'stiff', 'strict', 'sturdy', 'tense', 'tight', 'wire'], // loose
  'loosen': ['bound', 'compact', 'dense', 'fixed', 'narrow', 'rigid', 'stack', 'structured', 'tight'], // loosen
  'loosened': ['tightened'], // loosened
  'loosening': ['compressing'], // loosening
  'lore': ['premium'], // Lore
  'loss': ['ascendancy', 'bounty', 'gift', 'merchandise', 'payments', 'peak', 'present', 'produce', 'profit', 'prosperity', 'recruitment', 'victory'], // loss
  'lost': ['anchored', 'certain', 'clear', 'competence', 'defined', 'found', 'present', 'secure', 'stable'], // lost
  'loud': ['calm', 'dimming', 'discretion', 'faint', 'gentle', 'humble', 'hushing', 'introverted', 'muffle', 'muffled', 'mute', 'muted', 'muting', 'pale', 'paused', 'quiet', 'reserved', 'shy', 'soft', 'subduing', 'subtle', 'timid', 'whisper'], // loud
  'love': ['cruelty', 'malice'], // love
  'low': ['ascend', 'elevate', 'elevated', 'flood', 'high', 'premium', 'rise', 'stratosphere', 'summit', 'superior', 'top', 'up', 'vertex'], // low
  'low-tech': ['deeptech'], // low-tech
  'lower': ['above', 'ascend', 'elevate', 'elevated', 'higher', 'peak', 'raise', 'rise', 'top', 'up', 'upper'], // lower
  'lowered': ['raised'], // lowered
  'lowly': ['apex', 'lofty'], // lowly
  'loyal': ['fickle'], // loyal
  'lucid': ['confused'], // lucid
  'lucidity': ['chaos', 'complexity', 'confusion', 'darkness', 'heaviness', 'mist', 'muddiness', 'obscurity', 'vagueness'], // lucidity
  'luck': ['misfortune'], // luck
  'lumen': ['dimness', 'obscurity', 'shade'], // Lumen
  'luminance': ['darkness', 'dimness', 'nocturn', 'obscurity', 'shadow'], // Luminance
  'luminescence': ['dimness', 'dullness', 'obscurity'], // Luminescence
  'luminescent': ['dull', 'matte', 'murky', 'opaque', 'shadowy'], // Luminescent
  'luminosity': ['editorial', 'harmony'], // Luminosity
  'luminous': ['blind', 'darkmode', 'matt', 'repellent', 'rusty'], // luminous
  'lunar': ['day', 'solar', 'terrestrial'], // Lunar
  'lush': ['arid', 'barren', 'bleak', 'dry', 'shrivel', 'skeletal'], // lush
  'lush-abundance': ['meager'], // lush-abundance
  'lustrous': ['bland', 'dull', 'flat', 'matte', 'rough'], // Lustrous
  'luxe': ['base', 'crude', 'disorder', 'drab', 'mundane', 'shabby'], // Luxe
  'luxurious': ['composition', 'contrast', 'shabby'], // Luxurious
  'luxury': ['cheap', 'hunger'], // luxury
  'machinery': ['watches'], // Machinery
  'macro': ['basic', 'bland', 'dull', 'flat', 'micro', 'simple', 'subtle', 'vague'], // Macro
  'macrocosm': ['microcosm'], // Macrocosm
  'madness': ['rationality', 'sanity'], // Madness
  'magazine': ['composition', 'contrast'], // Magazine
  'magnify': ['compress', 'diminish', 'flatten', 'lessen', 'minimize', 'reduce', 'shrink', 'simplify'], // Magnify
  'main': ['fragmented', 'marginal', 'minor', 'peripheral', 'scattered', 'secondary', 'sidebar', 'subordinate'], // main
  'mainstream': ['alternative', 'artsy', 'counterculture', 'eccentric', 'experimental', 'indie', 'irregular', 'niche', 'obscure', 'offbeat', 'uncommon'], // mainstream
  'majestic': ['common', 'insignificant', 'mundane', 'ordinary', 'simple'], // Majestic
  'malice': ['benevolence', 'care', 'charity', 'goodness', 'honesty', 'innocence', 'kindness', 'love', 'trust'], // malice
  'malleable': ['brittle', 'firm', 'fixed', 'hard', 'inflexible', 'rigid', 'solid', 'stiff', 'unyielding'], // malleable
  'man-made': ['natura'], // Man-made
  'manifest': ['concealed', 'disappear', 'invisible'], // manifest
  'manifestation': ['negation', 'rejection', 'suppression'], // Manifestation
  'manifesting': ['disband', 'disperse', 'dissipate', 'halt', 'neglect', 'repel', 'suppress', 'vanishing', 'void'], // manifesting
  'manipulation': ['genuine', 'illustration', 'led'], // Manipulation
  'manmade': ['environment'], // manmade
  'manual': ['automated', 'automotive', 'cybernetic', 'digitalization', 'edtech', 'fintech', 'postdigital', 'robotics', 'technographic', 'xr'], // manual
  'manual-labor': ['motorsport'], // Manual-labor
  'manufacturing': ['agriculture', 'catering', 'craft', 'retail', 'service'], // Manufacturing
  'marble': ['frayed', 'matte', 'organic', 'rough', 'soft', 'temporary'], // Marble
  'margin': ['core'], // margin
  'marginal': ['centric', 'main'], // marginal
  'marginalization': ['empowerment', 'privilege'], // marginalization
  'marine': ['aerospace', 'continental', 'inland', 'land', 'land-based', 'terrestrial', 'urban'], // Marine
  'marked': ['erased'], // marked
  'marketing': ['absence', 'chaos', 'confusion', 'disinterest', 'disorder', 'indifference', 'neglect', 'operations', 'research', 'secrecy', 'silence'], // Marketing
  'masculine': ['feminine'], // masculine
  'mask': ['uncover', 'unveiling'], // mask
  'masked': ['clear', 'exposed', 'identity', 'overlook', 'revealed', 'unveiled', 'visible'], // masked
  'masking': ['illustration', 'led', 'unveiling'], // Masking
  'masonry': ['based', 'grid'], // Masonry
  'mass': ['airiness', 'boutique', 'fluidity', 'lightness', 'particle', 'petiteness', 'point', 'simplicity', 'void', 'watchmaking', 'yachting'], // Mass
  'mass-market': ['boutique'], // Mass-market
  'mass-produced': ['artisanal'], // mass-produced
  'massing': ['outlining'], // massing
  'massive': ['diminutive', 'miniature', 'petite', 'small', 'thin', 'tiny'], // massive
  'massproduced': ['artisanal', 'bespoke', 'crafted', 'handcrafted-goods', 'individual', 'intentional', 'personal', 'specific', 'unique'], // massproduced
  'mastered': ['fumbled'], // mastered
  'masterful': ['amateur'], // masterful
  'mastery': ['chaos', 'disorder', 'failure', 'fumbled', 'ignorance', 'incompetence'], // Mastery
  'matched': ['disparate'], // matched
  'material': ['astral', 'disembodiment', 'intangible', 'metaverse'], // material
  'materiality': ['virtualization'], // Materiality
  'materialize': ['disappear'], // materialize
  'materials': ['absence', 'depletion', 'emptiness', 'invisibility', 'lack', 'nothing', 'scarcity', 'void'], // Materials
  'matrix': ['chaos', 'disorder', 'fluidity', 'randomness', 'simplicity'], // Matrix
  'matt': ['bright', 'glossy', 'iridescent', 'luminous', 'phosphor', 'polished', 'reflective', 'shiny', 'smooth', 'vivid'], // matt
  'matte': ['glassy', 'glazed', 'gleaming', 'hard', 'luminescent', 'lustrous', 'marble', 'reflectivity', 'scrolling', 'sheen', 'shimmer', 'shiny'], // Matte
  'matter': ['psyche', 'spirit'], // matter
  'mature': ['childlike'], // mature
  'maturity': ['childhood', 'youthfulness'], // Maturity
  'maximalism': ['cleanliness', 'minimalism', 'order', 'simplicity', 'subtlety'], // Maximalism
  'maximalist': ['brutalist', 'glassmorphism', 'minimal', 'minimalistic'], // Maximalist
  'maximize': ['minimize'], // maximize
  'meager': ['abundant', 'extravagant', 'exuberant', 'generous', 'lavish', 'lush-abundance', 'opulent', 'plentiful', 'rich'], // Meager
  'meaning': ['absurdity', 'ambiguity', 'chaos', 'confusion', 'empty', 'foolishness', 'insignificance', 'narrative-absence', 'nonsense', 'trivial', 'vague'], // meaning
  'meaningful': ['forgettable', 'frivolous', 'futile', 'irrelevant', 'petty', 'pointless', 'superficial', 'trivial', 'useless', 'worthless'], // meaningful
  'meaninglessness': ['significance'], // meaninglessness
  'measure': ['ambiguity', 'chaos', 'disorder', 'fluidity', 'imprecision'], // Measure
  'measured': ['hasty'], // measured
  'measurement': ['composition', 'contrast'], // Measurement
  'mechanic': ['artistic', 'chaotic', 'fluid', 'freeform', 'handcrafted', 'improvised', 'natural', 'organic', 'spontaneous'], // mechanic
  'mechanical': ['acoustic', 'artistic', 'behavioral', 'bio', 'biomorphic', 'biophilic', 'botanical', 'chaotic', 'fluid', 'free', 'handwritten', 'natural', 'organic', 'soft', 'soulful', 'spontaneous'], // mechanical
  'mechanism': ['animalism', 'chaos', 'fluidity', 'instinct', 'organic', 'spontaneity'], // Mechanism
  'media': ['corporate', 'finance'], // Media
  'mediocre': ['aspiration', 'bold', 'dynamic', 'elite', 'exceptional', 'exciting', 'ideal', 'innovative', 'original', 'unique', 'vibrant'], // mediocre
  'mediocrity': ['artistry', 'excellence'], // mediocrity
  'meekness': ['assertiveness'], // meekness
  'melancholy': ['exuberance', 'playful', 'whimsical'], // Melancholy
  'mellow': ['agitated', 'blazing', 'chaotic', 'harsh', 'intense', 'strident', 'tense'], // Mellow
  'melodic': ['discordant'], // melodic
  'melody': ['cacophony', 'disorder', 'silence'], // Melody
  'melt': ['chill', 'cool', 'firm', 'freeze', 'frost', 'hard', 'solid', 'solidify', 'stiff', 'still'], // melt
  'melting': ['solidifying'], // melting
  'memorable': ['forgettable'], // memorable
  'memorial': ['celebration', 'dismissal', 'disregard', 'forgetfulness', 'live', 'neglect'], // Memorial
  'memory': ['disconnection', 'forgetting', 'neglect', 'oblivion'], // Memory
  'memphis': ['classicism', 'minimalism', 'monochrome'], // Memphis
  'menu': ['composition', 'contrast', 'freestyle'], // Menu
  'merchandise': ['absence', 'discard', 'empty', 'essentials', 'experiences', 'free', 'intellectual property', 'intellectual-property', 'lack', 'loss', 'services', 'spare', 'void'], // Merchandise
  'merge': ['detach', 'divide', 'isolate', 'separate', 'split'], // merge
  'merged': ['disjoint', 'dispersed', 'distinct', 'isolated', 'separate'], // merged
  'merging': ['dividing'], // merging
  'merriment': ['heavy'], // Merriment
  'mesh': ['serif'], // Mesh
  'mess': ['beauty', 'catering', 'clarity', 'clean', 'engineering', 'harmony', 'method', 'neat', 'order', 'outlining', 'portfolio', 'sightful', 'simplicity', 'structure', 'tidy', 'typecraft', 'whisper'], // mess
  'messaging': ['confusion', 'detachment', 'disconnection', 'ignorance', 'silence'], // Messaging
  'messiness': ['aesthetics'], // messiness
  'messy': ['adulting', 'basis', 'calm', 'clean', 'cleanliness', 'composition', 'crisp', 'cultivate', 'definition', 'docs', 'flawless', 'formality', 'formed', 'harmonic', 'neat', 'orderly', 'organized', 'perfect', 'precise', 'prime', 'scholarly', 'simplifying', 'spotless', 'steadfast', 'sterile', 'structured', 'tidy', 'untouched', 'wash'], // messy
  'metal': ['ceramic', 'flesh', 'paper', 'wood'], // metal
  'metallic': ['fibrous', 'fluid'], // Metallic
  'metaphysics': ['geology'], // metaphysics
  'metaverse': ['absence', 'analog', 'disconnection', 'isolation', 'material', 'onsite', 'physical', 'realism', 'simplicity', 'solidity', 'stagnation', 'tangibility'], // Metaverse
  'method': ['chaos', 'confusion', 'deliberate-chaos', 'disorder', 'haphazard', 'improvisation', 'mess', 'random', 'spontaneity'], // method
  'methodical': ['arbitrary', 'chaotic', 'disorderly', 'disorganized', 'erratic', 'haphazard', 'impromptu', 'random', 'scatterbrained', 'scrawl', 'spontaneous', 'unplanned'], // Methodical
  'meticulous': ['negligent'], // meticulous
  'metropolitan': ['rural'], // metropolitan
  'micro': ['broad', 'expansive', 'large', 'macro', 'vast'], // Micro
  'microcosm': ['chaos', 'emptiness', 'grandeur', 'infinity', 'isolation', 'macrocosm', 'simplicity', 'stagnation', 'uniformity', 'vastness', 'void'], // Microcosm
  'might': ['absence', 'deficiency', 'despair', 'dullness', 'emptiness', 'lack', 'perceived-weakness', 'sadness', 'void', 'weakness'], // might
  'mild': ['harsh'], // mild
  'milestone': ['anonymity', 'disregard', 'failure', 'neglect', 'obscurity'], // Milestone
  'mindful': ['careless', 'distracted', 'mindless', 'oblivious'], // mindful
  'mindless': ['aware', 'conscious', 'engaged', 'mindful', 'thoughtful'], // mindless
  'mineral': ['abstract', 'ethereal', 'fluid', 'immaterial', 'organic'], // Mineral
  'miniature': ['full-scale', 'gigantic', 'grandiose', 'huge', 'large', 'massive', 'monumental'], // Miniature
  'minimal': ['3d-rendering', 'accent', 'arcade', 'atmospheric', 'camp', 'caps', 'chunky', 'cinematic', 'comic', 'elaborate', 'excessive', 'flood', 'folk', 'homely', 'indulgent', 'industrial', 'kitsch', 'maximalist', 'noir', 'overwrought', 'painterly', 'paneled', 'performative', 'spectacle', 'sticker', 'textural', 'volume'], // Minimal
  'minimalism': ['baroque', 'cartoon', 'cluttered', 'complex', 'consumerism', 'deco', 'deconstructivism', 'exaggeration', 'excess', 'excessive', 'layering', 'maximalism', 'memphis', 'postmodernism', 'skeuomorphism'], // Minimalism
  'minimalist': ['botanical', 'neoclassical', 'techno'], // minimalist
  'minimalistic': ['adorned', 'carousel', 'chiaroscuro', 'clustering', 'cluttered', 'complex', 'composition', 'contrast', 'convolution', 'crude', 'decorated', 'dense', 'excessive', 'maximalist'], // Minimalistic
  'minimize': ['chaos', 'complexity', 'contrast', 'diversity', 'emphasize', 'expansion', 'magnify', 'maximize', 'overline', 'scale', 'variety'], // minimize
  'mining': ['bakery', 'winery'], // Mining
  'minor': ['main'], // minor
  'minuscule': ['vast'], // minuscule
  'minutiae': ['immensity'], // minutiae
  'mirth': ['heavy', 'weight'], // Mirth
  'misery': ['euphoria', 'pleasure', 'well-being'], // misery
  'misfortune': ['blessing', 'fortune', 'happiness', 'joy', 'luck', 'prosperity', 'serendipity', 'success', 'wealth'], // misfortune
  'misleading': ['honest', 'informative'], // misleading
  'mismatch': ['accuracy', 'alignment', 'clarity', 'coherence', 'consistency', 'harmony', 'homogeneity', 'precision', 'sameness', 'unity'], // mismatch
  'misrepresentation': ['truth'], // misrepresentation
  'mist': ['brightness', 'clarity', 'definition', 'lucidity', 'openness', 'transparency'], // Mist
  'misunderstanding': ['insight', 'understanding'], // misunderstanding
  'mixed': ['mono'], // mixed
  'mobile': ['fixed', 'immobile', 'rigid', 'settled', 'static', 'stationary', 'still', 'unmoving'], // Mobile
  'mobility': ['anchored', 'bound', 'fixed', 'fixity', 'immobility', 'rigid', 'stability', 'stagnation', 'stasis', 'static', 'stationary'], // Mobility
  'mockery': ['respect', 'sincerity', 'support'], // mockery
  'modal': ['composition', 'contrast'], // Modal
  'modeling': ['illustration', 'led'], // Modeling
  'modelling': ['chaos', 'chaotic', 'disorder', 'disorderly', 'haphazard', 'improvised', 'random', 'rough', 'spontaneous', 'unstructured'], // Modelling
  'moderation': ['excess'], // moderation
  'modern': ['ancient', 'archaic', 'artifact', 'ascii', 'classicism', 'composition', 'contrast', 'folk', 'gothic', 'historical', 'obsolete', 'primitive', 'retro', 'rural', 'timeless', 'traditional', 'vintage'], // Modern
  'modernism': ['baroque', 'postmodernism'], // modernism
  'modernist': ['neoclassical'], // modernist
  'modernity': ['obsolescence', 'youth'], // Modernity
  'modest': ['excessive', 'flamboyant', 'gaudy', 'greed', 'imposing', 'indulgent', 'lavish', 'pretentious'], // modest
  'modular': ['fixed', 'integral', 'integrated', 'monolithic', 'solid', 'unified', 'whole'], // Modular
  'modularity': ['flow'], // Modularity
  'module': ['chaos', 'disorder', 'fragment'], // Module
  'moist': ['arid', 'baked'], // moist
  'molecular': ['abstract', 'amorphous', 'chaos', 'random', 'void'], // Molecular
  'molten': ['calm', 'cold', 'cool', 'frozen', 'solid', 'stable', 'stagnant', 'still'], // Molten
  'moment': ['continuity', 'eternity', 'stagnation'], // Moment
  'momentary': ['endless', 'endlessness', 'enduring', 'eternal', 'lasting', 'lingering', 'perpetual', 'perpetuity', 'timeless'], // momentary
  'momentum': ['inertia', 'stasis', 'stillness'], // Momentum
  'mono': ['abundant', 'chaotic', 'complex', 'diverse', 'dynamic', 'mixed', 'poly', 'varied'], // mono
  'monochromatic': ['cool', 'coolness'], // Monochromatic
  'monochrome': ['binary', 'chromatic', 'colorful', 'cool', 'coolness', 'diverse', 'graded', 'kaleidoscopic', 'memphis', 'murals', 'vibrant'], // Monochrome
  'monochrome-palette': ['kaleidoscope'], // monochrome-palette
  'monoculture': ['chaos', 'complexity', 'contrast', 'difference', 'diversity', 'individuality', 'uniqueness', 'variety'], // monoculture
  'monolith': ['strata'], // monolith
  'monolithic': ['diverse', 'fragmented', 'granular', 'hybrid', 'modular', 'particulate', 'scattered', 'segmented', 'variable', 'varied'], // Monolithic
  'monolithic-depth': ['lightweight'], // monolithic-depth
  'monologue': ['dialogue', 'interaction'], // monologue
  'monopoly': ['chaos', 'collaboration', 'competition', 'decentralization', 'disorder', 'diversity', 'freedom', 'openness', 'variety'], // monopoly
  'monospace': ['composition', 'contrast'], // Monospace
  'monotone': ['relief'], // monotone
  'monotonous': ['boutique', 'colorful', 'diverse', 'dynamic', 'eclectic', 'energetic', 'exciting', 'lively', 'reactive', 'stimulating', 'variant', 'varied', 'vibrant'], // monotonous
  'monotony': ['adaptability', 'creativity', 'customization', 'event', 'exuberance', 'flotilla', 'interplay', 'kaleidoscopic', 'localism', 'passion'], // monotony
  'monumental': ['editorial', 'fleeting', 'harmony', 'insignificant', 'miniature', 'petite', 'trivial'], // Monumental
  'morning': ['darkness', 'dusk', 'evening', 'night', 'sleep'], // morning
  'morph': ['constant', 'fixed', 'rigid', 'solid', 'stable', 'static'], // Morph
  'mortality': ['endlessness', 'eternity', 'immortality', 'infinity', 'perpetuity'], // Mortality
  'mosaic': ['chaos', 'disorder', 'empty', 'fragment', 'simple', 'singular', 'singular-style', 'uniform', 'void'], // mosaic
  'motherhood': ['childless', 'petcare'], // Motherhood
  'motion': ['slowness', 'stuck'], // motion
  'motivate': ['bore', 'dampen', 'discourage', 'stagnate'], // motivate
  'motivated': ['laziness', 'lazy'], // motivated
  'motorsport': ['calm', 'gentle', 'leisure', 'manual-labor', 'mundane', 'pedestrian', 'quiet', 'simple', 'slow', 'slow-paced', 'static'], // Motorsport
  'mourning': ['celebration'], // mourning
  'move': ['halt', 'stop'], // move
  'moved': ['unmoved'], // moved
  'movement': ['calm', 'dormancy', 'stasis', 'stillness'], // Movement
  'moving': ['dormant', 'paused', 'stopped'], // moving
  'muddiness': ['lucidity'], // muddiness
  'muddle': ['clarity', 'coherence', 'design', 'focus', 'order', 'precision', 'shape', 'simplicity', 'structure'], // muddle
  'muddy': ['bright', 'clean', 'clear', 'cyanic', 'dry', 'fresh', 'gleaming', 'neat', 'pure', 'smooth'], // muddy
  'muffle': ['amplify', 'clarify', 'enhance', 'expose', 'express', 'loud', 'project', 'reveal', 'signal'], // muffle
  'muffled': ['bold', 'bright', 'clear', 'defined', 'distinct', 'key', 'loud', 'sharp', 'vivid'], // muffled
  'multi': ['blank', 'plain', 'simple', 'single', 'singular-tone', 'solo', 'uniform'], // multi
  'multiple': ['single'], // multiple
  'multiplicity': ['singularity'], // multiplicity
  'multiply': ['deplete'], // multiply
  'mundane': ['adventurous', 'aether', 'alien', 'alluring', 'art', 'artistic', 'attractive', 'bold', 'captivating', 'celestial', 'cinematic', 'cosmic', 'crystalline', 'dreamlike', 'dynamic', 'elevated', 'enchanted', 'enchanting', 'epic', 'ethereal', 'evocative', 'exciting', 'exotic', 'experimental', 'extraordinary', 'fanciful', 'festive', 'fi', 'gamified', 'glamour', 'gourmet', 'groovy', 'ingenuity', 'innovative', 'inventive', 'liveliness', 'lofty', 'luxe', 'majestic', 'motorsport', 'mystic', 'mythic', 'personalized', 'propulsive', 'provocative', 'retrofuturism', 'roars', 'spectacle', 'stellar', 'sublime', 'surprise', 'symbolic', 'techno-futurism', 'transcendence', 'unique', 'uniqueness', 'vanguard', 'vibrant', 'xr', 'yachting', 'zesty'], // mundane
  'mundane-spectacle': ['forgettable'], // mundane-spectacle
  'mundanity': ['grandeur'], // mundanity
  'murals': ['bland', 'digital art', 'digital-art', 'dull', 'empty', 'fine art', 'fine-art', 'invisible', 'monochrome', 'plain', 'sculpture', 'silent', 'small-scale art', 'small-scale-art', 'sterile'], // Murals
  'murky': ['bright', 'calm', 'clean', 'clear', 'crystalline', 'luminescent', 'serene', 'smooth', 'stable', 'tranquil'], // murky
  'museum': ['absence', 'chaos', 'contemporary', 'destruction', 'disorder', 'dissonance', 'ephemeral', 'ignorance', 'neglect', 'retail', 'void'], // Museum
  'music': ['centered', 'composition'], // Music
  'mutable': ['archival', 'constant', 'enduring', 'fixed', 'immutable', 'permanent', 'rigid', 'stable', 'steady', 'unchanging'], // mutable
  'mute': ['amplify', 'bold', 'bright', 'colorful', 'flamboyant', 'intense', 'loud', 'overpower', 'tones', 'unleash', 'vibrant', 'vivid'], // mute
  'muted': ['authoritative', 'blaring', 'blasts', 'blinding', 'brash', 'brilliant', 'colorful', 'confident', 'cool', 'coolness', 'dazzling', 'emissive', 'flare', 'flashy', 'garish', 'garnish', 'glare', 'ignited', 'loud', 'neon', 'overt', 'punchy', 'screaming', 'shine', 'shouted', 'strident', 'vibrancy', 'vibrant', 'vibration'], // Muted
  'muted-ambiance': ['strident'], // muted-ambiance
  'muted-emotion': ['explosive'], // muted-emotion
  'muting': ['amplifying', 'emphasizing', 'highlighting', 'loud'], // muting
  'mysterious': ['clear', 'familiar', 'obvious'], // Mysterious
  'mystery': ['blatant', 'heavy', 'revelation'], // Mystery
  'mystic': ['common', 'concrete', 'literal', 'mundane', 'ordinary'], // Mystic
  'mystique': ['heavy'], // Mystique
  'myth': ['certainty', 'clarity', 'evidence', 'fact', 'logic', 'reality', 'reason', 'truth'], // myth
  'mythic': ['common', 'mundane', 'ordinary'], // Mythic
  'mythos': ['fact', 'reality', 'truth'], // Mythos
  'naive': ['academia', 'adulting', 'apex', 'complex', 'critical', 'cynical', 'deeptech', 'jaded', 'pragmatic', 'skeptical', 'sophisticated', 'worldly'], // naive
  'naivety': ['cynicism', 'experience', 'expertise', 'intelligence', 'knowledge', 'pragmatism', 'realism', 'scholarship', 'skepticism', 'sophistication', 'wisdom', 'worldliness'], // naivety
  'naked': ['adorned', 'caps', 'curtained', 'shield', 'shielded'], // naked
  'narrative-absence': ['context', 'meaning'], // narrative-absence
  'narrow': ['curvy', 'loose', 'loosen', 'vast'], // narrow
  'narrowed': ['limitless'], // narrowed
  'narrowing': ['broadening', 'expanding', 'expansion', 'filling', 'flowing', 'growing', 'opening', 'stretching', 'unfolding'], // Narrowing
  'narrowness': ['clarity', 'ease', 'emptiness', 'expanse', 'expansion', 'freedom', 'globalization', 'openness', 'vastness', 'vista', 'width'], // narrowness
  'native': ['alien', 'foreign'], // native
  'natura': ['artificial', 'man-made', 'synthetic', 'urban'], // Natura
  'natural': ['ai', 'artifice', 'artificial', 'automated', 'automotive', 'cgi', 'coded', 'computational', 'concrete', 'cosmetics', 'cybernetic', 'engineered', 'eyewear', 'fabricated', 'factory', 'industrial', 'mechanic', 'mechanical', 'plastic', 'polluted', 'post-process', 'pretentious', 'racket', 'robotic', 'robotics', 'simulated', 'staged', 'steel', 'stilted', 'technic', 'techno', 'techno-futurism', 'technographic', 'techwear', 'toxic', 'urban', 'wire', 'wrought'], // natural
  'natural-flow': ['stilted'], // natural-flow
  'naturalism': ['premium', 'regulated', 'stylization'], // Naturalism
  'naturalistic': ['abstract', 'artificial', 'contrived', 'geometric', 'synthetic'], // Naturalistic
  'nature': ['artifice', 'industry', 'pollution', 'synthetic', 'urban'], // Nature
  'nautical': ['desert', 'domestic', 'inland', 'land', 'urban'], // Nautical
  'near': ['descent', 'distant'], // near
  'neat': ['blotchy', 'chaotic', 'cluttered', 'complexity', 'disarrayed', 'disheveled', 'disorderly', 'disorganized', 'distressed', 'frayed', 'haphazard', 'imperfect', 'jumbled', 'mess', 'messy', 'muddy', 'ragged', 'random', 'rough', 'scrappy', 'scratched', 'scrawl', 'shabby', 'sloppy', 'spill', 'splat', 'splotchy', 'sprawl', 'sprawled', 'tangle', 'wash'], // neat
  'neatness': ['filth', 'jumble', 'scribble', 'sloppiness', 'squalor'], // neatness
  'nebula': ['clarity', 'finite', 'order', 'void'], // Nebula
  'nebulous': ['certain', 'clear', 'defined', 'definite', 'distinct', 'focused', 'precise', 'sharp', 'typographic'], // nebulous
  'necessary': ['extraneous', 'irrelevant'], // necessary
  'need': ['affluence', 'disinterest', 'emptiness', 'lack', 'privilege', 'sufficiency', 'surplus', 'want'], // need
  'negate': ['construct'], // negate
  'negation': ['acceptance', 'affirmation', 'assertion', 'calm', 'connection', 'creation', 'engagement', 'expansion', 'integration', 'manifestation', 'object', 'reassurance'], // negation
  'negative': ['admire', 'editorial', 'harmony', 'positive'], // Negative
  'neglect': ['accept', 'admiring', 'advertising', 'attention', 'branding', 'catering', 'cherish', 'childcare', 'completion', 'conservation', 'craft', 'cultivate', 'cultivation', 'demand', 'dentistry', 'education', 'edutainment', 'encourage', 'engage', 'engrave', 'evaluation', 'fame', 'fandom', 'favor', 'fixation', 'fulfillment', 'grasp', 'healthcare', 'healthtech', 'hospitality', 'impact', 'involvement', 'kindness', 'manifesting', 'marketing', 'memorial', 'memory', 'milestone', 'museum', 'nourish', 'nurture', 'nurturing', 'observation', 'participation', 'present', 'preservation', 'privilege', 'produce', 'promotion', 'protection', 'publishing', 'recognition', 'recruitment', 'regard', 'remembrance', 'respect', 'selfcare', 'sightful', 'skincare', 'stewardship', 'support', 'sustenance', 'utopia', 'value', 'valuing', 'veneration', 'watchmaking'], // neglect
  'neglected': ['cultivated', 'embraced', 'known'], // neglected
  'neglectful': ['user-centric'], // neglectful
  'neglecting': ['cherishing'], // neglecting
  'negligence': ['analytics', 'attention', 'awareness', 'care', 'consideration', 'craftsmanship', 'diligence', 'discipline', 'engagement', 'focus', 'intention', 'remembrance', 'vigilance'], // negligence
  'negligent': ['careful', 'diligent', 'focused', 'imaging', 'intentional', 'meticulous', 'orderly', 'structured', 'thorough'], // negligent
  'neo-grotesque': ['art-deco', 'gothic', 'grunge', 'retro'], // Neo-Grotesque
  'neoclassical': ['minimalist', 'modernist'], // Neoclassical
  'neon': ['cool', 'coolness', 'muted', 'pastel'], // Neon
  'network': ['dispersal', 'isolation', 'separation'], // Network
  'neumorphic': ['bold', 'clear', 'contrasting', 'defined', 'flat', 'harsh', 'rigid', 'sharp', 'solid', 'vibrant'], // Neumorphic
  'neumorphism': ['futurism', 'futurist', 'jarring'], // Neumorphism
  'neurodiversity': ['premium'], // Neurodiversity
  'neutral': ['accent', 'chromatic', 'fiery', 'flamboyant', 'heated', 'ochre', 'statement'], // neutral
  'new': ['aftermath', 'ancient', 'classic', 'familiar', 'historical', 'old', 'outdated', 'patina', 'rusty', 'stale', 'traditional', 'worn'], // New
  'nexus': ['cluttered', 'detached', 'disband', 'disconnection', 'disorder', 'dispersal'], // Nexus
  'niche': ['global', 'mainstream', 'ubiquitous'], // niche
  'night': ['awake', 'dawn', 'day', 'morning', 'seed', 'solar', 'sun'], // Night
  'nihility': ['cosmos'], // nihility
  'noble': ['petty'], // noble
  'nocturn': ['brightness', 'clarity', 'colorful', 'daylight', 'diurnus', 'luminance', 'radiance', 'transparency', 'vivid'], // nocturn
  'nocturne': ['earthen', 'emerald'], // Nocturne
  'nodes': ['chaos', 'dispersal', 'isolation'], // Nodes
  'noir': ['bright', 'minimal', 'vibrant'], // noir
  'noise': ['signal', 'silence', 'silent', 'stillness', 'whisper', 'zen'], // noise
  'noisy': ['calm', 'clear', 'focused', 'objective', 'quiet', 'serene', 'simple', 'subdued'], // noisy
  'nomadic': ['anchored', 'fixed', 'rooted', 'settled', 'static'], // Nomadic
  'non-alcoholic': ['wine'], // Non-alcoholic
  'non-monetary': ['payments'], // Non-monetary
  'non-profit': ['business', 'commercial', 'corporate', 'for', 'for-profit', 'greed', 'profit', 'selfish', 'wealth'], // Non-profit
  'non-representation': ['depiction', 'symbolism'], // non-representation
  'non-representational': ['depictive', 'figurative'], // non-representational
  'non-textual': ['labeled', 'verbal'], // non-textual
  'non-visual': ['sightful'], // non-visual
  'nonbeing': ['being'], // nonbeing
  'nonconform': ['conform'], // nonconform
  'nonconformist': ['compliant'], // nonconformist
  'nonconformity': ['conformity', 'tradition', 'uniformity'], // Nonconformity
  'nonexist': ['being', 'exist', 'existence', 'life', 'presence', 'reality', 'substance', 'vitality'], // nonexist
  'nonlinear': ['axial'], // nonlinear
  'nonprofit': ['commercial', 'cool', 'coolness', 'greed', 'profit', 'wealth'], // Nonprofit
  'nonsense': ['meaning', 'sense'], // nonsense
  'nonverbal': ['articulate', 'communicative', 'expressive', 'spoken', 'textuality', 'verbal', 'vocal'], // nonverbal
  'nordic': ['chaotic', 'eclectic', 'ornate'], // Nordic
  'normal': ['abnormal', 'chaotic', 'eccentric', 'extraordinary', 'irregular', 'odd', 'strange', 'surrealist-vision', 'unusual', 'wild'], // normal
  'normalcy': ['abnormal', 'anomaly', 'chaos', 'disorder', 'divergent', 'fantasy', 'irregular', 'peculiar', 'risk', 'unusual'], // normalcy
  'norms': ['counterculture'], // norms
  'nostalgia': ['future', 'heavy', 'nowhere', 'playful', 'present'], // Nostalgia
  'notable': ['forgettable', 'forgotten', 'insignificant'], // notable
  'noted': ['disregarded'], // noted
  'nothing': ['existence', 'globe', 'materials'], // nothing
  'nothingness': ['being'], // nothingness
  'notice': ['forget', 'ignore'], // notice
  'noticed': ['ignored'], // noticed
  'nourish': ['blight', 'deplete', 'diminish', 'neglect', 'starve', 'waste'], // Nourish
  'nourishment': ['deprivation', 'disorder', 'emptiness', 'starvation', 'waste'], // Nourishment
  'nouveau': ['archaic', 'brutal', 'classic'], // Nouveau
  'novel': ['ancient', 'artifact', 'common', 'dull', 'familiar', 'historical', 'old', 'ordinary', 'repetitive', 'stale', 'standard', 'tainted', 'traditional'], // Novel
  'novelty': ['legacy', 'obsolescence', 'premium', 'roots'], // Novelty
  'now': ['past'], // now
  'nowhere': ['aware', 'certain', 'clear', 'defined', 'found', 'nostalgia', 'present', 'somewhere', 'visible'], // nowhere
  'nuanced': ['blatant', 'rudimentary'], // nuanced
  'nucleus': ['absence', 'chaos', 'disorder', 'fragment', 'periphery', 'scatter', 'void'], // nucleus
  'null': ['active', 'appearing', 'being', 'complex', 'dynamic', 'filled', 'generation', 'layered', 'rich', 'structured', 'vibrant'], // Null
  'nullity': ['existence', 'identity', 'presence', 'significance', 'substance'], // Nullity
  'numb': ['alive', 'clear', 'comfortable', 'excited', 'perceptive', 'pure', 'sensitive', 'sharp', 'vivid'], // numb
  'nurture': ['abandon', 'damage', 'disregard', 'exploitation', 'harm', 'hinder', 'neglect'], // Nurture
  'nurturing': ['abandon', 'destroy', 'detachment', 'dismiss', 'disregard', 'neglect', 'selfish'], // Nurturing
  'obedience': ['anarchy', 'chaos', 'defiance', 'disobedience', 'freedom', 'independence', 'rebellion', 'resistance'], // obedience
  'obedient': ['chaotic', 'defiant', 'disobedient', 'independent', 'rebel', 'rebellious', 'uncontrolled', 'unruly', 'wild'], // obedient
  'object': ['absence', 'negation', 'void'], // Object
  'objective': ['noisy', 'subjective'], // objective
  'objectivist': ['subjective'], // objectivist
  'objectivity': ['ambiguity', 'bias', 'confusion', 'distortion', 'emotion', 'opinion', 'partiality', 'subjectivity'], // objectivity
  'obligation': ['freetime', 'hobby', 'leisure'], // obligation
  'oblique': ['clear', 'direct', 'even', 'flat', 'linear', 'literal', 'simple', 'straight', 'uniform'], // Oblique
  'obliterate': ['engrave'], // obliterate
  'obliterating': ['building', 'cohesion', 'completing', 'creating', 'forming', 'integrating', 'sculpting', 'solidifying', 'uniting'], // obliterating
  'obliteration': ['accumulation', 'clarity', 'creation', 'existence', 'intactness', 'presence', 'rebirth', 'unity', 'wholeness'], // obliteration
  'oblivion': ['awareness', 'clarity', 'creation', 'discovery', 'existence', 'identity', 'memory', 'presence', 'remembrance', 'significance'], // oblivion
  'oblivious': ['alert', 'attentive', 'aware', 'conscious', 'engaged', 'focused', 'mindful', 'perceptive', 'present'], // oblivious
  'obscure': ['blatant', 'famous', 'highlight', 'honest', 'informative', 'known', 'mainstream', 'overt', 'straightforward', 'trace', 'uncover', 'unveiling', 'visible'], // obscure
  'obscured': ['accessible', 'apparent', 'centralized', 'clear', 'covered', 'directness', 'light', 'visible'], // Obscured
  'obscuring': ['bright', 'clear', 'defined', 'exposed', 'focused', 'highlighting', 'illuminated', 'revealing', 'visible'], // obscuring
  'obscurity': ['attention', 'aura', 'aurora', 'branding', 'celebrity', 'clarity', 'discovery', 'exposure', 'fame', 'gesture', 'glimpse', 'identity', 'illumination', 'insight', 'interpretation', 'lucidity', 'lumen', 'luminance', 'luminescence', 'milestone', 'publicity', 'radiance', 'recognition', 'revelation', 'signal', 'statement', 'transparency', 'unveiling', 'visibility', 'vision', 'vista', 'visualization'], // Obscurity
  'observant': ['distracted'], // observant
  'observation': ['absence', 'blindness', 'detachment', 'disregard', 'invisibility', 'neglect'], // Observation
  'observe': ['ignore'], // observe
  'obsolescence': ['clarity', 'essential', 'evolution', 'freshness', 'future', 'legacy', 'modernity', 'novelty', 'redefinition', 'relevance', 'renewal', 'utility', 'vitality'], // obsolescence
  'obsolete': ['active', 'current', 'development', 'eco-tech', 'edtech', 'essential', 'innovative', 'modern', 'relevance', 'relevant', 'timely', 'trend', 'vibrant', 'wearables', 'youth'], // obsolete
  'obstacle': ['access', 'clarity', 'ease', 'flow', 'freedom', 'openness', 'path', 'pathway', 'solutions', 'support'], // obstacle
  'obstacles': ['solutions'], // Obstacles
  'obstruction': ['access', 'catalyst', 'conduit', 'pathway', 'stream'], // obstruction
  'obtainable': ['abstract', 'distant', 'elusive', 'impossible', 'inaccessible', 'remote', 'unattainable', 'unreachable'], // obtainable
  'obtrusive': ['discreet', 'introspective', 'quiet', 'soft', 'subtle'], // obtrusive
  'obvious': ['ambiguous', 'complex', 'concealed', 'concealing', 'covert', 'discretion', 'enigmatic', 'hidden', 'illusory', 'intrigue', 'investigative', 'invisible', 'labyrinthine', 'mysterious', 'strange', 'subtle', 'symbolic', 'uncertain', 'unclear', 'unknown'], // obvious
  'obviousness': ['discretion'], // obviousness
  'occupied': ['vacancy', 'vacant'], // occupied
  'occupy': ['vacate'], // occupy
  'oceanic': ['arid', 'barren', 'dry', 'land', 'stale'], // Oceanic
  'ochre': ['bright', 'clean', 'cool', 'dark', 'neutral', 'pale', 'soft', 'vivid'], // Ochre
  'octagonal': ['circular', 'fluid', 'irregular', 'linear', 'spherical'], // Octagonal
  'odd': ['normal'], // odd
  'offbeat': ['centered', 'conventional', 'expected', 'mainstream', 'ordinary', 'predictable', 'standard', 'traditional', 'uniform'], // offbeat
  'offer': ['consume'], // offer
  'office': ['hotels', 'residential'], // Office
  'official': ['casual', 'informal'], // official
  'old': ['composition', 'contrast', 'new', 'novel', 'renew', 'youthfulness'], // Old
  'ominous': ['bright', 'cheerful', 'hopeful', 'inviting', 'joyful', 'uplifting'], // Ominous
  'ongoing': ['final', 'finished'], // ongoing
  'online': ['postal'], // Online
  'onsite': ['metaverse'], // Onsite
  'opacity': ['reflectivity', 'transparency'], // Opacity
  'opaque': ['bright', 'clear', 'crystal', 'crystalline', 'emissive', 'glassy', 'gleaming', 'iridescent', 'luminescent', 'phosphor', 'porous', 'sheer', 'shimmer', 'translucency', 'translucent', 'transparent', 'visible'], // opaque
  'open': ['accordion', 'armored', 'bind', 'block', 'bondage', 'bound', 'bounded', 'burdened', 'cloistered', 'closed', 'cloudy', 'concealed', 'concealing', 'confining', 'constrict', 'contained', 'corridor', 'covert', 'curtained', 'deadend', 'deceptive', 'doctrinal', 'enclosed', 'end', 'final', 'finish', 'finished', 'folded', 'fortified', 'fraudulent', 'guarded', 'hiding', 'insincere', 'intimate', 'lock', 'predefined', 'predetermined', 'private', 'restricted', 'restrictive', 'sealed', 'shielded', 'shroud', 'shrouded', 'shy', 'stopped', 'stuffy', 'subsurface', 'suppressed', 'veiled', 'withholding'], // open
  'open-crowns': ['veiled'], // open-crowns
  'open-top': ['enclosed', 'sealed'], // open-top
  'opening': ['closing', 'finale', 'narrowing'], // opening
  'openness': ['barrier', 'burden', 'captivity', 'closed', 'closure', 'confinement', 'constraint', 'containment', 'disguise', 'distrust', 'encasement', 'enclosure', 'envelopment', 'exclusivity', 'finality', 'fog', 'guarded', 'interference', 'isolation', 'limitation', 'mist', 'monopoly', 'narrowness', 'obstacle', 'restriction', 'seclusion', 'shield', 'tunnel'], // Openness
  'operations': ['marketing'], // Operations
  'ophthalmology': ['orthodontics'], // Ophthalmology
  'opinion': ['objectivity'], // opinion
  'oppose': ['support'], // oppose
  'oppression': ['empowerment', 'liberation'], // oppression
  'oppressive': ['empowering'], // oppressive
  'optimism': ['cynicism', 'defeat', 'despair', 'gloom', 'pessimism'], // Optimism
  'optimistic': ['bleak', 'cynical', 'despairing', 'dystopic', 'gloomy', 'pessimistic'], // Optimistic
  'optimization': ['chaos', 'disorder', 'inefficiency'], // Optimization
  'opulent': ['cheap', 'meager'], // opulent
  'orbit': ['chaos', 'dispersal', 'stillness'], // Orbit
  'order': ['absurdity', 'anomaly', 'blurb', 'cacophony', 'chaos', 'clamor', 'complexity', 'confusion', 'convolution', 'deconstructivism', 'deconstructivist', 'din', 'disorder', 'disruption', 'distortion', 'exaggeration', 'filth', 'flux', 'fuzz', 'glitch', 'jumble', 'maximalism', 'mess', 'muddle', 'nebula', 'overflow', 'paradox', 'racket', 'randomness', 'rebellion', 'scribble', 'sloppiness', 'squalor', 'surrealism', 'tangle', 'tumult', 'turbulence', 'turmoil', 'vortex', 'war', 'whirlwind', 'wilderness'], // Order
  'ordered': ['arbitrary', 'cluttered', 'deconstructed', 'deconstructivism', 'freeform', 'frenzy', 'jumbled', 'rambling', 'random', 'terrain', 'undefined', 'untamed'], // ordered
  'orderly': ['anarchic', 'anti', 'brushstroke', 'clatter', 'crooked', 'disarrayed', 'disheveled', 'disorderly', 'disorganized', 'distorted', 'distressed', 'feral', 'freestyle', 'fumbled', 'haphazard', 'harried', 'illogical', 'messy', 'negligent', 'ragged', 'raucous', 'rebel', 'reckless', 'scrap', 'scrappy', 'scrawl', 'shabby', 'shifty', 'sloppy', 'spill', 'splat', 'sprawl', 'squiggly', 'twisted', 'unruly', 'unsteady', 'wild'], // orderly
  'ordinariness': ['celebrity', 'customization', 'excellence', 'fantasy', 'grandeur', 'idiosyncrasy'], // ordinariness
  'ordinary': ['alien', 'attractive', 'captivating', 'cinematic', 'colorful', 'cosmic', 'deeptech', 'distinctive', 'dreamlike', 'dynamic', 'elevated', 'elite', 'enchanted', 'enchanting', 'epic', 'exceptional', 'excessive', 'exotic', 'extraordinary', 'fame', 'famous', 'fanciful', 'flamboyant', 'garnish', 'inventive', 'lofty', 'majestic', 'mystic', 'mythic', 'novel', 'offbeat', 'propulsive', 'provocative', 'rare', 'remarkable', 'retrofuturism', 'roars', 'singular', 'stellar', 'surrealism', 'symbolic', 'transcendence', 'uncommon', 'unfamiliar', 'unhinged', 'unique', 'uniqueness', 'vanguard', 'vivid', 'xr'], // ordinary
  'organic': ['ai', 'artifact', 'automated', 'automotive', 'based', 'blocky', 'boxy', 'cgi', 'circuit', 'clinical', 'coded', 'columnar', 'computational', 'concrete', 'crystal', 'cybernetic', 'engineered', 'factory', 'geometric', 'grid', 'industrial', 'marble', 'mechanic', 'mechanical', 'mechanism', 'mineral', 'pixel', 'plastic', 'polluted', 'rectangle', 'rectangular', 'robotic', 'robotics', 'staged', 'steel', 'sterile', 'structural', 'technic', 'techno', 'techno-futurist', 'technographic'], // Organic
  'organization': ['disorder'], // organization
  'organize': ['discard'], // organize
  'organized': ['cluttered', 'confusing', 'disarrayed', 'disorderly', 'disorganized', 'disregarded', 'messy', 'scatterbrained', 'shifty', 'sprawl', 'sprawled', 'unformed', 'unplanned'], // organized
  'origin': ['absence', 'aftermath', 'eclipse', 'end', 'void'], // Origin
  'original': ['banal', 'fake', 'mediocre', 'simulacrum', 'tainted'], // original
  'ornamentation': ['base', 'editorial', 'harmony'], // Ornamentation
  'ornate': ['bauhaus', 'brutalism', 'functionalism', 'functionalist', 'nordic', 'plain', 'utilitarian'], // ornate
  'orthodontics': ['cardiology', 'dermatology', 'ophthalmology', 'podiatry'], // Orthodontics
  'orthodoxy': ['counterculture'], // orthodoxy
  'ostentatious': ['humble'], // ostentatious
  'otherworldly': ['earthiness'], // Otherworldly
  'outdated': ['new', 'trendsetting'], // Outdated
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
  'painterly': ['clean', 'flat', 'graphic', 'minimal', 'sleek'], // Painterly
  'painting': ['detail', 'digital', 'erasure'], // Painting
  'pale': ['blazing', 'burnt', 'garish', 'loud', 'ochre'], // pale
  'palette': ['earthen', 'emerald'], // Palette
  'paneled': ['flat', 'minimal', 'plain', 'simple', 'smooth'], // Paneled
  'panelled': ['flat', 'plain', 'smooth'], // Panelled
  'panic': ['calm', 'comfort', 'composure', 'contentment', 'ease', 'peace', 'relaxation', 'serenity', 'tranquility'], // panic
  'panorama': ['glimpse'], // Panorama
  'paper': ['fabric', 'glass', 'metal', 'plastic', 'stone'], // Paper
  'paradox': ['certainty', 'clarity', 'coherence', 'consistency', 'logic', 'order', 'simplicity', 'truth', 'uniformity'], // Paradox
  'parallax': ['flat', 'static', 'uniform'], // Parallax
  'parametric': ['chaotic', 'fixed', 'random', 'rigid', 'simple'], // Parametric
  'part': ['whole'], // part
  'partial': ['absolute', 'cast', 'complete', 'entire', 'full', 'full-realization', 'solid', 'total', 'unified', 'whole'], // partial
  'partiality': ['objectivity'], // partiality
  'participation': ['apathy', 'detachment', 'disengagement', 'disinterest', 'indifference', 'isolation', 'neglect', 'passivity', 'rejection'], // participation
  'particle': ['mass', 'unity', 'whole'], // Particle
  'particulate': ['flat', 'homogeneous', 'monolithic', 'smooth', 'uniform'], // Particulate
  'passage': ['closure', 'stasis', 'stillness'], // Passage
  'passenger': ['freight'], // Passenger
  'passion': ['apathy', 'boredom', 'coldness', 'detachment', 'disinterest', 'impression', 'indifference', 'monotony', 'passivity', 'stagnation'], // passion
  'passionate': ['apathetic', 'disinterested', 'disjoint', 'dispassionate', 'downcast', 'resigned', 'stoic'], // passionate
  'passive': ['activating', 'active', 'activity', 'aggressive', 'assertive', 'catalyst', 'defiant', 'driven', 'dynamic', 'energetic', 'engaged', 'forceful', 'gym', 'involvement', 'present', 'propulsive', 'reactive', 'rebel', 'statement', 'vibrant'], // passive
  'passivity': ['action', 'activity', 'agency', 'assertion', 'assertiveness', 'drive', 'engagement', 'gesture', 'initiative', 'participation', 'passion', 'stimulation'], // passivity
  'past': ['advance', 'develop', 'emerge', 'future', 'live', 'now', 'present', 'progress', 'retrofuturism'], // past
  'pastel': ['cool', 'coolness', 'neon', 'vibrant'], // Pastel
  'pastoral': ['chaotic', 'harsh', 'industrial', 'sterile', 'urban'], // Pastoral
  'path': ['deadend', 'obstacle'], // path
  'pathway': ['deadend', 'disorder', 'dispersal', 'obstacle', 'obstruction'], // Pathway
  'patina': ['bright', 'clean', 'fresh', 'new', 'plain', 'shiny', 'smooth', 'solid'], // Patina
  'pattern': ['chaos', 'disorder', 'randomness', 'simplicity', 'uniformity'], // Pattern
  'pause': ['day', 'premium', 'repeat', 'rush', 'trajectory', 'velocity', 'voyage'], // Pause
  'paused': ['active', 'busy', 'dynamic', 'intense', 'loud', 'moving', 'scrolling', 'urgent', 'vibrant'], // paused
  'payments': ['barter', 'chaos', 'debt', 'disorder', 'donation', 'failure', 'free', 'loss', 'non-monetary', 'poverty', 'receipts', 'void'], // Payments
  'peace': ['agitation', 'agony', 'chaotic', 'conflict', 'confront', 'din', 'energetic', 'fear', 'heavy', 'panic', 'playful', 'scream', 'shouting', 'storm', 'stress', 'strife', 'struggle', 'torment', 'turbulence', 'turmoil', 'war'], // Peace
  'peaceful': ['aggressive', 'agitated', 'anxious', 'blaring', 'blasts', 'boisterous', 'chaotic', 'dystopic', 'energetic', 'erupt', 'explosive', 'feral', 'frantic', 'frenzied', 'harsh', 'heated', 'heavy', 'joy', 'raucous', 'screaming', 'strenuous', 'uneasy', 'unruly', 'unsettled'], // Peaceful
  'peak': ['absence', 'base', 'bottom', 'decline', 'dip', 'drop', 'loss', 'lower', 'pit', 'void'], // Peak
  'peculiar': ['normalcy'], // peculiar
  'pedestrian': ['automotive', 'bold', 'distinct', 'dynamic', 'exceptional', 'extraordinary', 'innovative', 'motorsport', 'unique', 'vibrant'], // pedestrian
  'penetration': ['detachment', 'exclusion', 'rejection', 'separation', 'shield', 'withdrawal'], // Penetration
  'perceived-weakness': ['might', 'valor'], // perceived-weakness
  'perception': ['blindness', 'ignorance', 'illusion', 'reality'], // Perception
  'perceptive': ['clumsy', 'distracted', 'ignorant', 'numb', 'oblivious', 'unaware'], // Perceptive
  'perfect': ['basic', 'chaotic', 'distressed', 'dull', 'flawed', 'glitch', 'imperfect', 'messy', 'rough', 'scratched', 'subpar'], // perfect
  'perfection': ['flaw', 'glitch', 'imperfection'], // perfection
  'perforated': ['dense', 'solid'], // Perforated
  'performative': ['introverted', 'invisible', 'minimal', 'reserved', 'static', 'subdued'], // Performative
  'peripheral': ['central', 'centric', 'certain', 'dominant', 'exclusive', 'focused', 'main', 'primary', 'singular'], // peripheral
  'periphery': ['centrality', 'core', 'nucleus'], // periphery
  'perishable': ['eternal'], // perishable
  'permanence': ['closing', 'flux', 'impermanence', 'liminality', 'transience'], // permanence
  'permanent': ['changeable', 'disposable', 'ephemeral', 'evanescent', 'fleeting', 'folding', 'mutable', 'tangential', 'temporary', 'transient', 'unstable'], // permanent
  'perpetual': ['brief', 'ephemeral', 'finite', 'fleeting', 'momentary', 'temporary', 'transient', 'transitory-experience', 'volatile'], // perpetual
  'perpetuity': ['ephemerality', 'finite', 'fleeting', 'momentary', 'mortality', 'temporary', 'transience', 'unstable', 'vanishing'], // perpetuity
  'persist': ['resign'], // persist
  'persistence': ['ephemerality', 'instability', 'suddenness', 'transience'], // Persistence
  'personable': ['faceless'], // personable
  'personal': ['external', 'impersonal', 'interstitial', 'massproduced'], // personal
  'personalization': ['premium'], // Personalization
  'personalized': ['basic', 'bland', 'common', 'generic', 'impersonal', 'mundane', 'standard', 'uniform'], // Personalized
  'perspective': ['editorial', 'harmony'], // Perspective
  'pessimism': ['hope', 'hopeful', 'joy', 'light', 'optimism'], // pessimism
  'pessimistic': ['bright', 'cheerful', 'hopeful', 'joyful', 'light', 'optimistic', 'positive', 'upbeat'], // pessimistic
  'petcare': ['motherhood'], // petcare
  'petite': ['bulky', 'grand', 'heavy', 'large', 'massive', 'monumental', 'oversized'], // petite
  'petiteness': ['amplitude', 'bigness', 'bulk', 'expansiveness', 'grandeur', 'immensity', 'mass', 'vastness'], // petiteness
  'petty': ['cosmic', 'elevated', 'grand', 'important', 'meaningful', 'noble', 'significant', 'valuable', 'vast'], // petty
  'philanthropy': ['exploitation', 'premium', 'selfish'], // Philanthropy
  'phony': ['genuine'], // phony
  'phosphor': ['bland', 'dark', 'dead', 'dim', 'dull', 'flat', 'matt', 'opaque', 'unlit'], // Phosphor
  'photographic': ['brushstroke'], // Photographic
  'photography': ['cinematography', 'compositing'], // Photography
  'photoreal': ['illustration', 'impression', 'led'], // Photoreal
  'photorealistic': ['illustration', 'led'], // Photorealistic
  'physical': ['behavioral', 'e-commerce', 'ecommerce', 'metaverse', 'spirit', 'virtual', 'xr'], // Physical
  'physicality': ['intangible', 'virtualization'], // Physicality
  'pictorial': ['abstract', 'conceptual', 'data-driven', 'textual'], // Pictorial
  'piece': ['whole'], // piece
  'pillow': ['cold', 'hard', 'rough', 'stiff', 'uncomfortable'], // Pillow
  'pinnacle': ['base', 'decline', 'descent'], // Pinnacle
  'pit': ['apex', 'peak', 'vertex'], // pit
  'pixel': ['continuous', 'fluid', 'organic', 'smooth', 'vector', 'vector-graphics'], // Pixel
  'pixelated': ['continuous', 'fluid', 'polished', 'refined', 'smooth'], // Pixelated
  'pixelation': ['clarity', 'clear', 'defined', 'detail', 'detailed', 'fluid', 'polished', 'realism', 'realistic', 'sharp', 'smooth', 'smoothness'], // Pixelation
  'plain': ['accent', 'adorned', 'apex', 'bold', 'bump', 'bumpy', 'caps', 'chiaroscuro', 'colorful', 'complex', 'cosmetics', 'crowned', 'dazzling', 'decorated', 'dynamic', 'elaborate', 'excess', 'excessive', 'exotic', 'figurative', 'flamboyant', 'flashy', 'garnish', 'gaudy', 'graded', 'ignited', 'indulgent', 'labyrinthine', 'lavish', 'lively', 'multi', 'murals', 'ornate', 'overwrought', 'paneled', 'panelled', 'patina', 'plump', 'relief', 'rich', 'scaly', 'speckled', 'statement', 'sticker', 'strange', 'sweet', 'symbolic', 'textural', 'textured', 'twisted', 'unique', 'variant', 'veiled', 'vibrant', 'wave', 'wavy', 'woven', 'wrought', 'yielding'], // plain
  'planar': ['3d', 'curved', 'cylindrical', 'dimensional', 'layered', 'spherical', 'textured', 'voluminous'], // Planar
  'plane': ['arch', 'cylinder', 'dome', 'dot', 'sphere'], // plane
  'planetary': ['finite', 'grounded', 'local', 'static', 'terrestrial'], // Planetary
  'planned': ['chaotic', 'disordered', 'fumbled', 'haphazard', 'improvised', 'impulsive', 'postlude', 'random', 'spontaneity', 'spontaneous', 'unplanned', 'unpredictable'], // planned
  'planning': ['chaos', 'disorder', 'improvisation', 'randomness', 'spontaneity'], // Planning
  'plasma': ['calm', 'dense', 'fixed', 'quiet', 'solid', 'stable', 'static', 'still'], // Plasma
  'plastic': ['ceramic', 'flesh', 'natural', 'organic', 'paper', 'stone', 'textile', 'wood'], // Plastic
  'play': ['dramatic', 'duotone', 'serious'], // Play
  'playful': ['awe', 'corporate', 'cumbersome', 'gothic', 'hope', 'melancholy', 'nostalgia', 'peace', 'ponderous', 'professional', 'serenity', 'serious', 'shy', 'solemn', 'stern', 'stiff', 'wonder'], // Playful
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
  'plurality': ['simplicity', 'singularity', 'uniformity'], // Plurality
  'plush': ['abrasive', 'coarse', 'harsh', 'rough', 'stiff'], // Plush
  'podiatry': ['orthodontics'], // Podiatry
  'poetic': ['brutal', 'cluttered', 'disorder'], // Poetic
  'point': ['absence', 'blob', 'chaos', 'circle', 'disperse', 'gap', 'mass', 'spread', 'void'], // point
  'pointed': ['blunt', 'circular', 'flat', 'round', 'rounded', 'smooth', 'soft', 'wide'], // pointed
  'pointless': ['effective', 'essential', 'functional', 'impactful', 'meaningful', 'purposeful', 'significant', 'utility-driven', 'valuable'], // pointless
  'poise': ['awkwardness'], // poise
  'poised': ['heavy', 'shaky'], // Poised
  'polish': ['editorial', 'harmony'], // Polish
  'polished': ['amateur', 'awkward', 'brushed', 'brushstroke', 'brushwork', 'chipped', 'clumsy', 'coarse', 'cracked', 'craggy', 'crude', 'dirt', 'disheveled', 'distress', 'distressed', 'dust', 'flawed', 'frumpy', 'grained', 'grime', 'grotesque', 'grungy', 'janky', 'matt', 'pixelated', 'pixelation', 'pulp', 'ragged', 'rocky', 'roughness', 'rudimentary', 'rugged', 'rusty', 'scrappy', 'scratched', 'shabby', 'shaky', 'sloppy', 'splotchy', 'tacky', 'tarnished', 'vulgar'], // polished
  'polite': ['rude'], // polite
  'pollute': ['eco-tech'], // pollute
  'polluted': ['clean', 'clear', 'fresh', 'natural', 'organic', 'pristine', 'pure', 'purity', 'untouched'], // polluted
  'polluting': ['eco-tech'], // polluting
  'pollution': ['clarity', 'ecology', 'freshness', 'harmony', 'nature', 'purity', 'serenity', 'vitality', 'wholeness'], // pollution
  'poly': ['mono', 'simple', 'single', 'uniform'], // poly
  'polygon': ['chaos', 'curve', 'fluid'], // Polygon
  'polygonal': ['cylindrical'], // polygonal
  'polyhedron': ['line', 'surface', 'void'], // Polyhedron
  'ponderous': ['breezy', 'dynamic', 'light', 'playful', 'swift', 'vibrant'], // Ponderous
  'poor': ['fertile', 'healthy'], // poor
  'pop': ['earthen', 'emerald', 'jazz'], // Pop
  'popular': ['indie'], // Popular
  'popularity': ['scholarship'], // Popularity
  'populated': ['vacancy'], // populated
  'porous': ['compact', 'dense', 'filled', 'impermeable', 'opaque', 'rigid', 'solid', 'stiff', 'thick', 'tight'], // Porous
  'portal': ['barrier', 'closure', 'limit'], // Portal
  'portfolio': ['composition', 'contrast', 'flaw', 'mess'], // Portfolio
  'portrait': ['editorial', 'harmony'], // Portrait
  'positive': ['bleak', 'dark', 'discourage', 'doubtful', 'dystopic', 'gloomy', 'negative', 'pessimistic', 'sad'], // positive
  'possibility': ['certainty', 'finality', 'limitation'], // Possibility
  'post-process': ['immediate', 'natural', 'raw', 'simple', 'unrefined'], // Post-process
  'postal': ['digital', 'electronic', 'online'], // Postal
  'postdigital': ['analog', 'manual', 'simple', 'static', 'traditional'], // Postdigital
  'posthuman': ['premium'], // Posthuman
  'postlude': ['calm', 'clarity', 'consistent', 'controlled', 'exact', 'planned', 'prelude', 'stable'], // Postlude
  'postmodernism': ['classicism', 'coherent', 'minimalism', 'modernism'], // Postmodernism
  'potency': ['heavy', 'impotence', 'vacancy', 'weakness'], // Potency
  'potential': ['failure', 'limitation', 'stagnation'], // Potential
  'poverty': ['abundance', 'affluence', 'bounty', 'finance', 'payments', 'profit', 'prosperity', 'richness', 'wealth', 'winery'], // poverty
  'powder': ['coarse', 'dense', 'liquid', 'smooth', 'solid'], // Powder
  'power': ['impotence', 'ineffectiveness', 'powerlessness', 'submissiveness', 'vulnerability', 'weakness'], // Power
  'powerful': ['cool', 'gentle', 'weak'], // Powerful
  'powerless': ['empowering', 'strength'], // Powerless
  'powerlessness': ['power'], // powerlessness
  'practical': ['abstract', 'ambiguous', 'chaotic', 'conceptual', 'disordered', 'fanciful', 'fashion', 'imaginary', 'impractical', 'ineffective', 'interstitial', 'irrational', 'random', 'theoretical', 'vague', 'wasteful'], // practical
  'practical-function': ['useless'], // practical-function
  'practicality': ['aesthetics'], // Practicality
  'pragmatic': ['naive', 'retrofuturism'], // Pragmatic
  'pragmatic-visuals': ['disorganized', 'illogical'], // pragmatic-visuals
  'pragmatism': ['naivety'], // pragmatism
  'precise': ['blobby', 'blotchy', 'brushstroke', 'careless', 'doodle', 'freestyle', 'fumbled', 'fuzzy', 'haphazard', 'hazy', 'illiterate', 'imprecise', 'improvised', 'messy', 'nebulous', 'regress', 'scrawl', 'sloppy', 'smeared', 'splat', 'unfocused', 'vague'], // precise
  'precision': ['blurb', 'fuzz', 'impression', 'impressionist', 'mismatch', 'muddle', 'scribble', 'sloppiness'], // precision
  'predefined': ['chaotic', 'flexible', 'fluid', 'generative', 'improvised', 'open', 'random', 'spontaneous', 'variable'], // predefined
  'predetermined': ['chaotic', 'fluid', 'free', 'instinct', 'open', 'random', 'spontaneous', 'unpredictable', 'variable'], // predetermined
  'predictability': ['anomaly', 'fluke', 'idiosyncrasy', 'risk', 'whirlwind'], // predictability
  'predictable': ['adventurous', 'chaotic', 'dragged', 'eclectic', 'erratic', 'exotic', 'exploratory', 'fickle', 'inventive', 'offbeat', 'random', 'reactive', 'spontaneous', 'squiggly', 'subjective', 'surprise', 'surprising', 'uncommon', 'unhinged', 'unplanned', 'unpredictable', 'unreliable', 'unusual', 'variable', 'volatile', 'wild'], // predictable
  'prelude': ['closure', 'coda', 'conclusion', 'end', 'endgame', 'finale', 'postlude'], // Prelude
  'premeditated': ['careless', 'chaotic', 'haphazard', 'impromptu-display', 'impulsive', 'random', 'spontaneous', 'unplanned'], // premeditated
  'premiere': ['finale'], // premiere
  'premium': ['accessible', 'adaptation', 'anonymity', 'anonymous', 'authorship', 'automation', 'avatar', 'awareness', 'bespoke', 'biophilia', 'care', 'cheap', 'chronicle', 'cognition', 'communal', 'communication', 'community', 'computing', 'connectivity', 'conscientious', 'convenience', 'critique', 'culture', 'curatorial', 'data', 'digitization', 'domestic', 'ecology', 'escapism', 'european', 'gathering', 'heritage', 'hidden', 'icon', 'immersion', 'inclusion', 'independence', 'individualism', 'influence', 'infrastructure', 'isolation', 'knowledge', 'language', 'literacy', 'local', 'lore', 'low', 'naturalism', 'neurodiversity', 'novelty', 'pause', 'personalization', 'philanthropy', 'posthuman', 'privacy', 'readiness', 'refinement', 'representation', 'scrappy', 'status', 'subversion', 'surveillance', 'survival', 'sustain', 'sustainability', 'synergy', 'technology', 'text', 'utility', 'visibility', 'wanderlust', 'welfare'], // Premium
  'presence': ['abandon', 'abandonment', 'absence', 'closing', 'detachment', 'diminution', 'disappear', 'disembodied', 'disembodiment', 'disempowerment', 'disorder', 'distrust', 'erasure', 'escape', 'fleeing', 'nonexist', 'nullity', 'obliteration', 'oblivion', 'remnant', 'vacuum', 'virtualization', 'void'], // Presence
  'present': ['absence', 'absent', 'disappear', 'distant', 'erased', 'expire', 'forget', 'forgotten', 'hidden', 'loss', 'lost', 'neglect', 'nostalgia', 'nowhere', 'oblivious', 'passive', 'past', 'shadow', 'unknown', 'vacant', 'void'], // present
  'presented': ['disregarded'], // presented
  'presentism': ['historical'], // presentism
  'preservation': ['abandonment', 'destruction', 'deterioration', 'dispersal', 'neglect'], // Preservation
  'preserve': ['deconstruct', 'destroy', 'discard', 'disperse', 'dissolve', 'erode'], // Preserve
  'pressure': ['absence', 'breeze', 'clarity', 'emptiness', 'flow', 'freedom', 'lightness', 'release', 'relief', 'smooth'], // pressure
  'prestige': ['awkwardness', 'base', 'cluttered', 'crude', 'disorder', 'inferior'], // Prestige
  'pretend': ['real'], // pretend
  'pretense': ['authenticity', 'sincerity'], // pretense
  'pretentious': ['authentic', 'casual', 'casual-chic', 'genuine', 'humble', 'modest', 'natural', 'simple', 'unassuming'], // pretentious
  'pride': ['shame'], // pride
  'primal': ['artificial', 'cultivated', 'refined', 'sophisticated', 'synthetic'], // Primal
  'primary': ['earthen', 'emerald', 'peripheral', 'tangential'], // Primary
  'prime': ['basic', 'chaotic', 'common', 'flawed', 'footer', 'imprecise', 'inferior', 'messy', 'random'], // Prime
  'primitive': ['academia', 'advanced', 'automotive', 'cgi', 'complex', 'cybernetic', 'engineered', 'innovative', 'modern', 'refined', 'sophisticated', 'techno-futurism', 'technographic', 'techwear'], // primitive
  'principle': ['ambiguity', 'anarchy', 'chaos', 'disorder', 'fluke', 'fumble', 'randomness'], // Principle
  'printed': ['handwritten'], // printed
  'prison': ['freeness'], // prison
  'pristine': ['cluttered', 'crude', 'disheveled', 'disorder', 'distress', 'distressed', 'excessive', 'flawed', 'polluted', 'scrappy', 'shabby', 'tainted', 'tarnished', 'worn'], // Pristine
  'privacy': ['premium', 'publicity'], // Privacy
  'private': ['accessible', 'common', 'exhibition', 'exposed', 'external', 'global', 'open', 'public', 'publishing', 'shared', 'transparent', 'visible'], // private
  'privilege': ['deprivation', 'disadvantage', 'exclusion', 'marginalization', 'need', 'neglect'], // Privilege
  'pro': ['anti'], // pro
  'problems': ['solutions'], // Problems
  'procedural': ['arbitrary', 'chaotic', 'disordered', 'haphazard', 'improvised', 'random', 'spontaneous', 'unstructured'], // Procedural
  'process': ['illustration', 'led'], // Process
  'processed': ['healthy'], // Processed
  'procrastination': ['productivity'], // procrastination
  'produce': ['consume', 'deficit', 'destruction', 'drought', 'failure', 'loss', 'neglect', 'scarcity', 'waste'], // Produce
  'product': ['composition', 'contrast'], // Product
  'product-centric': ['user-centric'], // Product-centric
  'production': ['consumption'], // Production
  'productive': ['laziness', 'slacker'], // productive
  'productivity': ['chaos', 'disorder', 'idleness', 'inefficiency', 'procrastination', 'slacker'], // Productivity
  'professional': ['amateur', 'edutainment', 'gamification', 'gaming', 'playful', 'wellbeing'], // Professional
  'profit': ['debt', 'deficit', 'drought', 'failure', 'loss', 'non-profit', 'nonprofit', 'poverty', 'scarcity', 'waste'], // profit
  'profit-driven': ['disregarded', 'unvalued'], // profit-driven
  'profound': ['frivolous', 'shallow', 'superficial', 'trivial'], // Profound
  'progress': ['backward', 'deadend', 'decline', 'halt', 'past', 'regress', 'regression', 'stagnation', 'stuck'], // Progress
  'progression': ['regression'], // progression
  'project': ['muffle'], // project
  'projection': ['illustration', 'led', 'reflection', 'retreat'], // Projection
  'proliferation': ['reduction'], // proliferation
  'prolonged': ['immediate'], // prolonged
  'prominence': ['insignificance'], // prominence
  'prominent': ['insignificant'], // prominent
  'promote': ['hinder'], // promote
  'promotion': ['disregard', 'neglect', 'recession', 'silence', 'suppression'], // Promotion
  'prompt': ['delay', 'delayed'], // prompt
  'proportion': ['asymmetry', 'chaos', 'clutter', 'disorder', 'excess'], // Proportion
  'propulsive': ['dull', 'heavy', 'languid', 'mundane', 'ordinary', 'passive', 'simple', 'slow', 'stagnant', 'static'], // Propulsive
  'prosper': ['wilt', 'wither'], // prosper
  'prospering': ['withering'], // prospering
  'prosperity': ['blight', 'decline', 'deprivation', 'despair', 'deterioration', 'failure', 'fall', 'inferior', 'loss', 'misfortune', 'poverty', 'ruin', 'sorrow', 'struggle'], // Prosperity
  'protected': ['tarnished', 'vulnerable'], // protected
  'protection': ['abandonment', 'exposure', 'neglect', 'risk', 'vulnerability'], // Protection
  'provocative': ['bland', 'mundane', 'ordinary', 'reserved', 'subdued'], // Provocative
  'proximity': ['distance'], // proximity
  'prudence': ['heavy'], // Prudence
  'prudent': ['foolish'], // prudent
  'psyche': ['body', 'fleshless', 'form', 'husk', 'matter', 'shell'], // Psyche
  'public': ['exclusive', 'hidden', 'intimate', 'isolated', 'private', 'secret', 'solitary'], // public
  'publicity': ['anonymity', 'obscurity', 'privacy', 'secrecy'], // publicity
  'publishing': ['absence', 'chaos', 'concealed', 'disregard', 'ephemeral', 'ignorance', 'neglect', 'private', 'raw', 'silence', 'unwritten', 'void'], // Publishing
  'pulp': ['clean', 'polished', 'refined', 'sleek', 'smooth'], // Pulp
  'pulse': ['dormancy', 'silence', 'stasis', 'stillness'], // Pulse
  'punchy': ['calm', 'flat', 'muted', 'soft', 'subdued'], // Punchy
  'pure': ['aftermath', 'blended', 'brutal', 'burdened', 'cluttered', 'complex', 'corrupt', 'crooked', 'dirt', 'foul', 'grime', 'hybrid', 'imperfect', 'impure', 'muddy', 'numb', 'polluted', 'sealed', 'smoky', 'tainted', 'toxic'], // Pure
  'pure entertainment': ['edutainment'], // pure entertainment
  'pure-entertainment': ['edutainment'], // Pure Entertainment
  'purity': ['chaos', 'contamination', 'corrupt', 'corruption', 'disorder', 'emission', 'filth', 'imposition', 'impotence', 'impurity', 'polluted', 'pollution', 'ruin', 'squalor', 'vacuum'], // Purity
  'purpose': ['aimlessness', 'chaos', 'disorder', 'emptiness', 'foolishness', 'futility', 'idleness', 'randomness'], // Purpose
  'purposeful': ['aimless', 'futile', 'pointless', 'useless', 'wasteful', 'worthless'], // purposeful
  'pursue': ['retreat'], // pursue
  'pursuit': ['abandon', 'idleness', 'rest', 'stagnation'], // Pursuit
  'pyramid': ['chaos', 'disperse', 'flat', 'sphere', 'void'], // Pyramid
  'qualitative': ['analytics'], // Qualitative
  'quench': ['ignite'], // quench
  'quenched': ['thirst'], // quenched
  'quest': ['apathy', 'completion', 'conformity', 'stagnation', 'surrender'], // Quest
  'quick': ['lengthy', 'lingering', 'slow'], // quick
  'quickness': ['slowness'], // quickness
  'quiet': ['activating', 'agitation', 'amplify', 'arcade', 'blaring', 'blasts', 'blinding', 'boisterous', 'brash', 'bustling', 'buzz', 'clatter', 'din', 'erupt', 'explosive', 'fierce', 'frantic', 'frenzy', 'hover', 'kaleidoscopic', 'liveliness', 'loud', 'motorsport', 'noisy', 'obtrusive', 'overt', 'overwrought', 'plasma', 'racket', 'raucous', 'restless', 'screaming', 'shouted', 'shouting', 'shouts', 'splash', 'strident', 'tense', 'thunders', 'unleash', 'uproarious', 'urban', 'vibration', 'volatile', 'zesty'], // quiet
  'quietude': ['din', 'racket'], // quietude
  'racket': ['authentic', 'calm', 'genuine', 'natural', 'order', 'quiet', 'quietude', 'silence', 'simple'], // racket
  'radial': ['axial', 'flat', 'linear', 'static'], // Radial
  'radial-break': ['consolidate'], // radial-break
  'radiance': ['blackout', 'darkness', 'dim', 'dimness', 'drab', 'dull', 'eclipse', 'nocturn', 'obscurity', 'shadow'], // Radiance
  'radiant': ['cold', 'desolate', 'dimming', 'dismal', 'drab', 'drain', 'dreary', 'grim', 'stifled', 'withering'], // radiant
  'radiate': ['wither'], // radiate
  'ragged': ['clean-cut', 'elegant', 'full', 'neat', 'orderly', 'polished', 'refined', 'rich', 'smooth'], // ragged
  'rainbow': ['cool', 'coolness'], // Rainbow
  'raise': ['decline', 'decrease', 'diminish', 'drop', 'fall', 'flatness', 'lower', 'reduce', 'sink'], // raise
  'raised': ['depressed', 'dropped', 'flat', 'flat-plane', 'level', 'lowered', 'recessed', 'stagnant', 'sunken'], // raised
  'rambling': ['brevity', 'clear', 'concise', 'focused', 'ordered'], // rambling
  'random': ['align', 'automated', 'axial', 'axis', 'behavioral', 'calculated', 'charted', 'circuit', 'coherent', 'columnar', 'composition', 'concentrated', 'consequence', 'constant', 'context', 'decisive', 'definite', 'deliberate', 'depictive', 'doctrinal', 'exact', 'fixity', 'formed', 'grading', 'labeled', 'level', 'logical', 'method', 'methodical', 'modelling', 'molecular', 'neat', 'ordered', 'outlining', 'parametric', 'planned', 'practical', 'predefined', 'predetermined', 'predictable', 'premeditated', 'prime', 'procedural', 'rational', 'regression', 'regulated', 'repetitive', 'robotics', 'rows', 'scheduled', 'scholarly', 'script', 'sequential', 'serious', 'solidify', 'specific', 'square', 'steadfast', 'storyful', 'strategic', 'structured', 'symbolism', 'symphonic', 'synchronized', 'systematic', 'typecraft', 'uniform'], // random
  'randomness': ['analytics', 'catalog', 'climate', 'constellation', 'consulting', 'cubism', 'engineering', 'flowchart', 'horology', 'lattice', 'matrix', 'order', 'pattern', 'planning', 'principle', 'purpose', 'synchronicitic', 'synchronicitical', 'synchronicity', 'watchmaking'], // randomness
  'rapid': ['gradual', 'slow'], // rapid
  'rare': ['abundant', 'commodity', 'common', 'everyday', 'frequent', 'ordinary', 'plentiful', 'standard', 'typical', 'ubiquitous', 'usual'], // rare
  'raster': ['vector-graphics'], // raster
  'rational': ['chaotic', 'disorderly', 'emotional', 'emotional-design', 'foolish', 'haphazard', 'impulsive', 'irrational', 'random', 'unpredictable'], // Rational
  'rationality': ['madness'], // rationality
  'raucous': ['calm', 'gentle', 'orderly', 'peaceful', 'quiet', 'serene', 'soft', 'subdued', 'vulnerable-silence'], // raucous
  'raw': ['baked', 'bakery', 'cgi', 'cosmetics', 'cultivated', 'engineered', 'figurative', 'filtered', 'fine', 'glamour', 'glazed', 'post-process', 'publishing', 'shielded', 'staged', 'tame', 'watches', 'wrought'], // raw
  'reachable': ['ambiguous', 'impossible', 'inaccessible', 'indeterminate', 'remote', 'unattainable', 'unclear', 'unreachable', 'vague'], // reachable
  'reactive': ['consistent', 'fixed', 'monotonous', 'passive', 'predictable', 'stable', 'static', 'stoic', 'uniform', 'unresponsive'], // reactive
  'readiness': ['hesitation', 'premium'], // Readiness
  'real': ['artificial', 'avatar', 'deceptive', 'disembodiment', 'fabricated', 'fake', 'false', 'fictional', 'illusory', 'imaginary', 'insincere', 'pretend', 'simulacrum', 'simulated', 'superficial'], // real
  'realism': ['cartoon', 'impressionist', 'metaverse', 'naivety', 'pixelation', 'stylization', 'surrealism'], // realism
  'realistic': ['2d', 'dreamlike', 'impractical', 'irrational', 'pixelation', 'vr'], // realistic
  'reality': ['denial', 'disillusion', 'dream', 'fable', 'facade', 'falsehood', 'fantasy', 'illusion', 'imagination', 'impression', 'myth', 'mythos', 'nonexist', 'perception', 'virtual'], // Reality
  'realm': ['chaos', 'disorder', 'dissolution', 'fragment', 'void'], // Realm
  'reason': ['instinct', 'myth'], // reason
  'reassurance': ['heavy', 'negation', 'warning'], // Reassurance
  'reassuring': ['anxious', 'chaotic', 'doubtful', 'fearful', 'hostile', 'tense', 'uncertain', 'unstable'], // Reassuring
  'rebel': ['ch-teau-style', 'conformist', 'docile', 'obedient', 'orderly', 'passive', 'submissive', 'traditional', 'uniform'], // rebel
  'rebellion': ['authority', 'compliance', 'conformity', 'harmony', 'obedience', 'order', 'stability', 'submission'], // Rebellion
  'rebellious': ['compliant', 'heavy', 'obedient'], // Rebellious
  'rebirth': ['death', 'destruction', 'obliteration', 'stagnation'], // Rebirth
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
  'rectangle': ['circle', 'curve', 'fluid', 'organic', 'sphere', 'twist'], // Rectangle
  'rectangular': ['curvilinear', 'curvy', 'fluid', 'organic'], // Rectangular
  'rectilinear': ['asymmetry', 'chaos', 'curvature'], // Rectilinear
  'redefinition': ['conformity', 'definition', 'obsolescence', 'stagnation'], // Redefinition
  'reduce': ['amplify', 'expand', 'intensify', 'magnify', 'overpower', 'raise', 'scale'], // reduce
  'reduction': ['abundance', 'accumulation', 'amplification', 'ascension', 'augmentation', 'expansion', 'growth', 'increase', 'intensification', 'proliferation', 'surplus'], // Reduction
  'refine': ['regress'], // refine
  'refined': ['amateur', 'artless', 'brutal', 'brutalism', 'cheap', 'chipped', 'chunky', 'clumsy', 'clunky', 'coarse', 'crude', 'dirt', 'disheveled', 'distressed', 'dust', 'feral', 'frumpy', 'fussy', 'gaudy', 'grime', 'grotesque', 'grungy', 'imperfect', 'janky', 'kitsch', 'pixelated', 'primal', 'primitive', 'pulp', 'ragged', 'rude', 'rudimentary', 'rugged', 'scrappy', 'scratched', 'shabby', 'sloppy', 'streetwear', 'tacky', 'vulgar'], // refined
  'refinement': ['awkwardness', 'brutality', 'premium'], // Refinement
  'reflection': ['action', 'engagement', 'projection', 'refraction'], // Reflection
  'reflective': ['blunt', 'heavy', 'matt'], // Reflective
  'reflectivity': ['absorption', 'darkness', 'dullness', 'matte', 'opacity'], // Reflectivity
  'refraction': ['absorption', 'convergence', 'reflection', 'unbroken'], // Refraction
  'refreshed': ['tired'], // refreshed
  'refreshing': ['draining', 'heavy', 'tiring'], // Refreshing
  'refuse': ['accept', 'adopt', 'yield'], // refuse
  'refute': ['affirm'], // refute
  'regard': ['disdain', 'dismiss', 'disregard', 'ignore', 'neglect', 'overlook', 'reject', 'scorn', 'snub'], // regard
  'regress': ['advance', 'ascend', 'attract', 'elevate', 'evolve', 'expand', 'precise', 'progress', 'refine'], // regress
  'regression': ['advancement', 'chaotic', 'dispersed', 'dynamic', 'evolution', 'fluid', 'fragmented', 'improvement', 'progress', 'progression', 'random', 'unpredictable'], // regression
  'regular': ['uneven'], // regular
  'regularity': ['anomaly', 'asymmetry'], // regularity
  'regulated': ['anarchic', 'chaotic', 'disorderly', 'free', 'naturalism', 'random', 'spontaneous', 'unbounded', 'unruly', 'wild'], // regulated
  'regulation': ['anarchy', 'chaos', 'disorder', 'freedom', 'liberty'], // Regulation
  'reinvention': ['conformity', 'repetition', 'stagnation', 'tradition', 'uniformity'], // Reinvention
  'reject': ['accept', 'adopt', 'affirm', 'embrace', 'regard', 'support', 'valuing'], // reject
  'rejected': ['embraced'], // rejected
  'rejecting': ['accepting', 'affirm', 'appreciate', 'approval', 'embrace', 'embracing', 'favor', 'support', 'welcome'], // rejecting
  'rejection': ['absorption', 'adoption', 'approval', 'attraction', 'demand', 'favor', 'manifestation', 'participation', 'penetration', 'recruitment'], // rejection
  'relatable': ['abstract', 'alien', 'complex', 'distant', 'unfamiliar'], // Relatable
  'relax': ['heavy'], // Relax
  'relaxation': ['agitation', 'anxiety', 'chaos', 'discomfort', 'friction', 'gym', 'panic', 'strain', 'stress', 'tension', 'turmoil', 'vigilance'], // Relaxation
  'relaxed': ['agitated', 'anxious', 'formality', 'grind', 'harried', 'restless', 'rushed', 'strenuous', 'tense', 'tightened', 'uneasy'], // relaxed
  'release': ['bind', 'bondage', 'burden', 'captivity', 'confinement', 'constraint', 'constrict', 'containment', 'deprivation', 'envelopment', 'fixation', 'grasp', 'hold', 'lock', 'pressure', 'strain', 'strife', 'stuck', 'suppression'], // release
  'released': ['bound', 'suppressed'], // released
  'releasing': ['compressing'], // releasing
  'relevance': ['arbitrary', 'disorder', 'distraction', 'insignificance', 'irrelevant', 'obsolescence', 'obsolete'], // Relevance
  'relevant': ['irrelevant', 'obsolete'], // relevant
  'reliability': ['fickle', 'fluke', 'heavy', 'unstable', 'volatile'], // Reliability
  'reliable': ['capricious', 'erratic', 'fickle', 'fraudulent', 'inconsistent', 'unreliable', 'unstable', 'useless', 'volatile'], // Reliable
  'relief': ['flat', 'flatness', 'monotone', 'plain', 'pressure', 'smooth', 'uniform'], // Relief
  'remain': ['abandon', 'cease', 'depart', 'disappear', 'escape', 'exit', 'fade', 'leave', 'vanish'], // remain
  'remarkable': ['insignificant', 'ordinary'], // remarkable
  'remember': ['forget'], // remember
  'remembered': ['forgotten'], // remembered
  'remembering': ['forgetting'], // remembering
  'remembrance': ['forgetfulness', 'forgetting', 'neglect', 'negligence', 'oblivion'], // Remembrance
  'remnant': ['presence', 'unity', 'whole'], // Remnant
  'remote': ['chaotic', 'disorderly', 'local', 'obtainable', 'reachable', 'uncertain', 'urban'], // remote
  'remoteness': ['closeness'], // remoteness
  'remove': ['engrave'], // remove
  'render': ['disrupt', 'illustration', 'led'], // Render
  'rendering': ['capture', 'cinematography'], // Rendering
  'renew': ['decay', 'deteriorate', 'expire', 'old', 'spent', 'stagnate', 'used', 'waste', 'worn'], // Renew
  'renewal': ['decay', 'destruction', 'deterioration', 'obsolescence', 'stagnation'], // Renewal
  'renewed': ['tarnished'], // renewed
  'repair': ['damage', 'destroy', 'destruction'], // repair
  'repeat': ['break', 'cease', 'disrupt', 'end', 'halt', 'innovate', 'pause', 'stop', 'vary'], // repeat
  'repel': ['manifesting'], // repel
  'repelled': ['embraced'], // repelled
  'repellent': ['absorbent', 'appealing', 'attractive', 'bright', 'engaging', 'inviting', 'luminous', 'vibrant', 'welcoming'], // repellent
  'repelling': ['appealing', 'attracting', 'captivating', 'charming', 'engaging', 'enticing', 'inviting', 'welcoming'], // repelling
  'repelling-hues': ['attracting', 'pleasant'], // repelling-hues
  'repetition': ['disorder', 'diversity', 'invention', 'reinvention', 'singularity', 'uniqueness', 'variation'], // Repetition
  'repetitive': ['diverse', 'dynamic', 'exciting', 'innovative', 'novel', 'random', 'singular', 'spontaneous', 'unique', 'varied', 'variety'], // repetitive
  'replicate': ['innovate'], // replicate
  'representation': ['disguise', 'premium'], // Representation
  'repulsion': ['attraction'], // repulsion
  'repulsive': ['alluring', 'attractive', 'captivating'], // repulsive
  'research': ['marketing'], // Research
  'reserve': ['self-expression'], // reserve
  'reserved': ['active', 'boisterous', 'bold', 'brash', 'bright', 'chaotic', 'dynamic', 'expressive', 'flamboyant', 'loud', 'overt', 'performative', 'provocative', 'silly', 'vivid'], // reserved
  'residential': ['boarding', 'commercial', 'hotels', 'industrial', 'logistics', 'office'], // Residential
  'resign': ['accept', 'agree', 'aspire', 'commit', 'embrace', 'join', 'persist', 'support', 'welcome'], // resign
  'resignation': ['ambition', 'anticipation'], // resignation
  'resigned': ['active', 'aspirant', 'assertive', 'determined', 'engaged', 'hopeful', 'joyful', 'passionate', 'vibrant'], // resigned
  'resilience': ['breakdown', 'failure', 'fragility', 'instability', 'vulnerability', 'weakness'], // Resilience
  'resilient': ['brittle', 'delicate', 'fragile', 'sensitive', 'soft', 'unstable', 'vulnerable', 'weak'], // Resilient
  'resist': ['adopt', 'yield'], // resist
  'resistance': ['acceptance', 'adaptation', 'agreement', 'catalyst', 'compliance', 'conformity', 'obedience', 'submission', 'support', 'unity'], // resistance
  'resistant': ['compliant'], // resistant
  'resolution': ['suspension'], // resolution
  'resolve': ['ambiguity', 'chaos', 'confusion', 'disorder', 'inconsistency', 'indecision', 'limbo', 'uncertainty', 'vacillation'], // resolve
  'resolved': ['ambiguous', 'chaotic', 'conflicted', 'delay', 'delayed', 'disordered', 'fluid', 'indecisive', 'uncertain', 'unfinished-thought', 'unstable', 'vague'], // resolved
  'resonance': ['cacophony', 'cluttered', 'detached', 'disorder', 'dispersal'], // Resonance
  'resource': ['waste'], // resource
  'resourceful': ['wasteful'], // resourceful
  'respect': ['apathy', 'contempt', 'dismissal', 'disregard', 'disrespect', 'hatred', 'indifference', 'mockery', 'neglect', 'ridicule', 'scorn'], // respect
  'respectful': ['irreverent', 'rude'], // respectful
  'responsibility': ['childhood'], // responsibility
  'responsive': ['apathetic', 'complacent', 'fixed', 'inflexible', 'rigid', 'serif', 'stagnant', 'static', 'unmoved'], // Responsive
  'rest': ['action', 'active', 'agitation', 'busy', 'chaotic', 'day', 'drive', 'energetic', 'force', 'grind', 'gym', 'hustle', 'pursuit', 'rush', 'stimulation', 'trajectory', 'voyage', 'work'], // rest
  'restaurant': ['catering'], // Restaurant
  'restless': ['calm', 'content', 'contented', 'focused', 'limited', 'quiet', 'relaxed', 'settled', 'static'], // restless
  'restlessness': ['composure'], // restlessness
  'restore': ['break', 'damage', 'destroy', 'erode', 'harm', 'tear'], // restore
  'restrain': ['unleash'], // restrain
  'restrained': ['camp', 'chaotic', 'exuberant', 'flexible', 'free', 'loose', 'spontaneous', 'uninhibited', 'wild'], // restrained
  'restraint': ['chaos', 'exaggeration', 'excess', 'exuberance', 'freedom', 'levity'], // Restraint
  'restrict': ['emit', 'expand', 'innovate', 'overflow'], // restrict
  'restricted': ['blockchain', 'boundless', 'flexible', 'free', 'global', 'limitless', 'open', 'spontaneous', 'unbound', 'unbounded', 'uninterrupted', 'unrestricted', 'untamed'], // restricted
  'restricting': ['empowering', 'unfolding'], // Restricting
  'restriction': ['access', 'chaos', 'expansion', 'expansive-freedom', 'flexibility', 'freedom', 'freeness', 'liberation', 'liberty', 'openness', 'self-expression', 'vastness'], // restriction
  'restrictive': ['endless', 'ergonomic', 'expansive', 'flexible', 'fluid', 'free', 'loose', 'open', 'unbound', 'unrestricted'], // restrictive
  'retail': ['catering', 'hotels', 'manufacturing', 'museum'], // Retail
  'retain': ['discard', 'forget'], // retain
  'retention': ['emission', 'recruitment'], // Retention
  'retirement': ['gym'], // retirement
  'retouching': ['flawed', 'illustration', 'led', 'untamed'], // Retouching
  'retreat': ['advance', 'assert', 'attack', 'charge', 'confront', 'engage', 'invade', 'projection', 'pursue'], // Retreat
  'retro': ['forward', 'futuristic', 'heavy', 'modern', 'neo-grotesque', 'techno-futurism', 'techno-futurist'], // Retro
  'retrofuture': ['youth'], // Retrofuture
  'retrofuturism': ['actual', 'avant-garde', 'basic', 'classic', 'contemporary', 'mundane', 'ordinary', 'past', 'pragmatic', 'simple', 'static', 'traditional'], // Retrofuturism
  'retrogression': ['advancement'], // retrogression
  'reveal': ['disguise', 'envelop', 'evade', 'hide', 'muffle', 'shield', 'shroud'], // reveal
  'revealed': ['concealed', 'covered', 'covert', 'curtained', 'guarded', 'masked', 'sealed', 'shrouded', 'veiled'], // revealed
  'revealing': ['concealing', 'hiding', 'obscuring', 'suppressing', 'veiling', 'withholding'], // revealing
  'revelation': ['ambiguity', 'concealment', 'ignorance', 'mystery', 'obscurity', 'veiling'], // Revelation
  'reverence': ['heavy', 'ridicule', 'scorn'], // Reverence
  'reverent': ['irreverent'], // reverent
  'revival': ['deterioration'], // revival
  'rhythm': ['chaos', 'silence', 'stasis'], // Rhythm
  'rich': ['barren', 'bland', 'bleak', 'drab', 'drain', 'drained', 'dry', 'dull', 'empty', 'foul', 'insipid', 'meager', 'null', 'plain', 'ragged', 'shallow', 'skeletal', 'starve', 'sterile', 'superficial', 'trivial', 'weak'], // rich
  'richness': ['barren', 'bland', 'bleakness', 'chaos', 'depletion', 'dullness', 'emptiness', 'flattening', 'fleshless', 'hunger', 'husk', 'lack', 'poverty', 'scarcity', 'simple', 'sparsity', 'void'], // Richness
  'ridicule': ['acceptance', 'admiration', 'celebration', 'kindness', 'respect', 'reverence', 'support', 'understanding', 'validation'], // ridicule
  'right': ['corrupt'], // right
  'rigid': ['amorphous', 'aqueous', 'biomorphic', 'bistro', 'coil', 'curvilinear', 'curvy', 'fable', 'fabric', 'flex', 'freeform', 'freestyle', 'groovy', 'humanist', 'informal', 'liquid', 'loose', 'loosen', 'malleable', 'mobile', 'mobility', 'morph', 'mutable', 'neumorphic', 'parametric', 'porous', 'responsive', 'serpentine', 'skillful', 'slack', 'spiral', 'supple', 'tubular', 'twist', 'undulating', 'undulation', 'wave', 'wavy', 'wobbly', 'woven', 'yielding'], // rigid
  'rigidity': ['adaptability', 'creativity', 'flexibility', 'lifestyle'], // rigidity
  'ripple': ['flatness', 'stagnation', 'stillness'], // Ripple
  'rise': ['deadend', 'decline', 'decrease', 'descend', 'descent', 'diminish', 'down', 'drop', 'drown', 'end', 'fall', 'flatten', 'low', 'lower', 'plummet', 'plunge', 'sink', 'slump', 'stop'], // Rise
  'risk': ['assurance', 'calm', 'certainty', 'control', 'normalcy', 'predictability', 'protection', 'safety', 'security', 'stability'], // Risk
  'ritual': ['chaos', 'freedom', 'spontaneity'], // Ritual
  'roars': ['calm', 'mundane', 'ordinary', 'whispers'], // roars
  'robotic': ['chaotic', 'fluid', 'human', 'humanist', 'natural', 'organic', 'soft', 'spontaneous', 'warm'], // robotic
  'robotics': ['biological', 'chaotic', 'craft', 'human', 'manual', 'natural', 'organic', 'random', 'simple', 'slow', 'unstructured'], // Robotics
  'robust': ['brittle', 'doubtful', 'fragile', 'insecure', 'lightweight', 'shaky', 'uncertain', 'unstable', 'vulnerable', 'weak'], // Robust
  'robustness': ['fragility'], // robustness
  'rocky': ['fluid', 'polished', 'sleek', 'smooth', 'soft'], // Rocky
  'role': ['gender'], // role
  'romantic': ['brutal', 'clinical', 'cold', 'harsh', 'sterile'], // romantic
  'root': ['aerial', 'detached', 'drift', 'ephemeral', 'floating', 'loose', 'shallow', 'surface', 'transient'], // root
  'rooted': ['chaotic', 'fluid', 'free', 'loose', 'nomadic', 'shifting', 'transient', 'transit', 'unbound', 'ungrounded', 'vague', 'wild'], // rooted
  'rooting': ['detached', 'detaching', 'dispersing', 'drifting', 'ephemeral', 'floating', 'scattering'], // Rooting
  'roots': ['abstract', 'detachment', 'dispersal', 'future', 'novelty'], // Roots
  'rough': ['aerodynamic', 'cgi', 'cosmetics', 'creamy', 'crisp', 'crystal', 'crystalline', 'figurative', 'fine', 'flawless', 'glassy', 'glazed', 'lustrous', 'marble', 'modelling', 'neat', 'perfect', 'pillow', 'plush', 'seamless', 'sheen', 'shiny', 'silk', 'skincare', 'slick', 'spotless', 'sterile', 'supple', 'sweet', 'velvet'], // rough
  'roughness': ['calm', 'clear', 'fine', 'gentle', 'polished', 'serene', 'simple', 'slick', 'smooth', 'smoothness', 'soft'], // Roughness
  'round': ['angular', 'angular-form', 'flat', 'jagged', 'linear', 'pointed', 'sharp', 'square', 'uneven'], // round
  'rounded': ['angularity', 'pointed'], // rounded
  'routine': ['adventurous', 'anomaly', 'exploratory', 'freetime', 'hobby', 'invention', 'uncommon'], // routine
  'rows': ['asymmetry', 'chaos', 'disorder', 'fluid', 'irregular', 'random', 'scatter', 'scattered', 'vertical'], // Rows
  'rude': ['courteous', 'gentle', 'gentle-expression', 'gracious', 'kind', 'polite', 'refined', 'respectful'], // rude
  'rudimentary': ['complex', 'detailed', 'elaborate', 'intricacy', 'intricate', 'nuanced', 'polished', 'refined', 'sophisticated'], // rudimentary
  'rugged': ['delicate', 'polished', 'refined', 'smooth', 'soft'], // Rugged
  'ruin': ['cleanliness', 'creation', 'flourish', 'integrity', 'prosperity', 'purity', 'strength', 'vitality', 'wholeness'], // ruin
  'rupture': ['climate', 'continuity', 'unity', 'wholeness'], // Rupture
  'rural': ['busy', 'chaotic', 'concrete', 'crowded', 'industrial', 'metropolitan', 'modern', 'urban'], // rural
  'rural-serenity': ['hustle'], // rural-serenity
  'rush': ['calm', 'delay', 'leisure', 'pause', 'rest', 'slow', 'slowness', 'still'], // rush
  'rushed': ['calm', 'leisurely-flow', 'relaxed', 'slow', 'steady', 'unhurried'], // rushed
  'rustic': ['high-tech', 'techno', 'techno-futurist', 'technographic', 'techwear'], // rustic
  'rusty': ['bright', 'clean', 'fresh', 'luminous', 'new', 'polished', 'sheen', 'smooth', 'vibrant'], // rusty
  'saas': ['text'], // SaaS
  'sacrifice': ['greed', 'selfcare'], // sacrifice
  'sad': ['jovial', 'pleased', 'positive'], // sad
  'sadness': ['euphoria', 'exuberance', 'might'], // sadness
  'safe': ['adventurous', 'fugitive', 'toxic'], // safe
  'safety': ['anxiety', 'chaos', 'danger', 'exposure', 'fear', 'risk', 'suspense', 'threat', 'uncertainty', 'vulnerability', 'warning'], // safety
  'sameness': ['adaptability', 'chaos', 'clash', 'contrast', 'customization', 'distinct', 'diversity', 'mismatch', 'variety', 'vivid'], // sameness
  'sanctuary': ['chaos', 'disorder', 'exile', 'exposure', 'hostility', 'street', 'vulnerability'], // Sanctuary
  'sane': ['anti', 'chaotic', 'confused', 'crazy', 'eerie', 'irrational', 'unhinged'], // sane
  'sanity': ['madness'], // Sanity
  'sans': ['serif'], // sans
  'satiate': ['starve'], // satiate
  'satiation': ['thirst'], // satiation
  'satisfaction': ['disapproval', 'disillusion', 'displeasure', 'dissatisfaction', 'frustration', 'hunger', 'thirst', 'yearning'], // satisfaction
  'satisfied': ['discontent', 'displeased', 'dissatisfied', 'failure', 'pain', 'unhappy'], // satisfied
  'saturated': ['colorless', 'washed'], // saturated
  'saturating': ['diluting', 'fading'], // saturating
  'saturation': ['complementary', 'cool', 'depletion', 'drain', 'lack', 'wash'], // Saturation
  'savage': ['calm', 'culture', 'gentle', 'kind', 'soft'], // savage
  'savory': ['bakery'], // savory
  'scaffold': ['collapse', 'deconstruct', 'disassemble', 'dismantle', 'disperse'], // Scaffold
  'scale': ['diminish', 'diminutive', 'minimize', 'reduce', 'tiny'], // Scale
  'scaly': ['plain', 'simple', 'sleek', 'smooth', 'soft'], // Scaly
  'scarce': ['ubiquitous'], // scarce
  'scarcity': ['abundance', 'affluence', 'bounty', 'catering', 'excess', 'food', 'fullness', 'materials', 'overflow', 'plenty', 'produce', 'profit', 'richness', 'wealth'], // scarcity
  'scatter': ['align', 'bubble', 'center', 'cluster', 'consolidate', 'corner', 'gather', 'imprint', 'integrate', 'nucleus', 'rows', 'stack', 'synthesize', 'unite'], // Scatter
  'scatterbrained': ['cerebral', 'clear', 'focused', 'methodical', 'organized'], // scatterbrained
  'scattered': ['aggregate', 'axis', 'centralized', 'clustered', 'coherent', 'concentrated', 'enclosed', 'intact', 'integrated', 'level', 'main', 'monolithic', 'rows', 'sequential', 'unified', 'whole'], // scattered
  'scattering': ['envelopment', 'rooting'], // scattering
  'schedule': ['freetime'], // schedule
  'scheduled': ['chaotic', 'disordered', 'immediate', 'impromptu-gathering', 'irregular', 'random', 'spontaneous', 'unplanned', 'unpredictable'], // scheduled
  'schematic': ['illustration', 'led', 'tangle'], // Schematic
  'scholarly': ['chaotic', 'dull', 'ignorant', 'informal-knowledge', 'messy', 'random', 'simple'], // scholarly
  'scholarship': ['anarchy', 'chaos', 'confusion', 'disorder', 'ignorance', 'naivety', 'popularity', 'simplicity', 'stupidity', 'superficiality'], // Scholarship
  'scientific': ['artistic', 'chaotic', 'emotional', 'intuitive', 'subjective'], // Scientific
  'scorn': ['admiration', 'affection', 'appreciate', 'approval', 'compassion', 'kindness', 'regard', 'respect', 'reverence', 'support', 'trust', 'veneration'], // scorn
  'scrap': ['cohesive', 'complete', 'defined', 'orderly', 'solid', 'structured', 'whole', 'wholeness'], // scrap
  'scrappy': ['elegant', 'neat', 'orderly', 'polished', 'premium', 'pristine', 'refined', 'sleek', 'smooth'], // scrappy
  'scratched': ['brushed', 'clear', 'intact', 'neat', 'perfect', 'polished', 'refined', 'smooth', 'unblemished'], // Scratched
  'scrawl': ['clear', 'defined', 'focused', 'methodical', 'neat', 'orderly', 'precise', 'structured', 'typeset'], // scrawl
  'scream': ['calm', 'peace', 'silence', 'whisper'], // scream
  'screaming': ['calm', 'gentle', 'muted', 'peaceful', 'quiet', 'soft', 'subdued', 'subtle-hues', 'whispering'], // screaming
  'screen': ['centered', 'centrality'], // Screen
  'scribble': ['clarity', 'design', 'font', 'formality', 'neatness', 'order', 'precision', 'structure', 'symmetry'], // scribble
  'script': ['chaos', 'fluid', 'improv', 'random', 'unscripted'], // Script
  'scroll': ['centralized', 'centric', 'halt', 'hold', 'lock', 'stop'], // Scroll
  'scrolling': ['fibrous', 'fluid', 'glossy', 'grainy', 'halted', 'matte', 'paused', 'stopped'], // Scrolling
  'sculpt': ['destroy', 'disassemble', 'dismantle', 'erase', 'flatten'], // Sculpt
  'sculpted': ['blobby', 'sprawled'], // sculpted
  'sculpting': ['dissolving', 'erasing', 'flattening', 'obliterating'], // sculpting
  'sculptural': ['dispersed', 'flat', 'void'], // Sculptural
  'sculpture': ['murals'], // Sculpture
  'seal': ['leak'], // seal
  'sealed': ['absorbent', 'certain', 'clear', 'exposed', 'free', 'open', 'open-top', 'pure', 'revealed', 'visible'], // Sealed
  'seamless': ['chaotic', 'disjointed', 'fragmented', 'glitch', 'imprecise', 'inconsistent', 'jarring', 'rough', 'segmented', 'uneven'], // Seamless
  'seasons': ['constant', 'eternal', 'static', 'timeless', 'unchanging', 'uniform'], // Seasons
  'seclusion': ['exposure', 'openness'], // seclusion
  'secondary': ['main'], // secondary
  'secrecy': ['marketing', 'publicity', 'unveiling'], // Secrecy
  'secret': ['public'], // secret
  'section': ['whole'], // section
  'secure': ['anxious', 'doubtful', 'heavy', 'leak', 'lost', 'shaky', 'spill', 'uneasy', 'ungrounded', 'unreliable', 'unsettled', 'unstable', 'unsteady', 'vulnerable', 'wavering'], // Secure
  'security': ['doubt', 'risk', 'warning'], // security
  'sedentary': ['gym'], // sedentary
  'seed': ['night'], // Seed
  'seen': ['ignored'], // seen
  'segmented': ['cohesive', 'continuous', 'fluid', 'integrated', 'monolithic', 'seamless', 'smooth', 'solid', 'unified', 'whole'], // Segmented
  'segregated': ['aggregate', 'combined', 'connected', 'harmonious', 'inclusive', 'integrated', 'interconnection', 'unified', 'whole'], // segregated
  'segregation': ['fusion', 'globalization', 'inclusivity', 'togetherness'], // segregation
  'selection': ['detachment', 'dismiss', 'disorder', 'dispersal', 'distrust'], // Selection
  'self': ['dependence'], // self
  'self-expression': ['apathy', 'concealment', 'conformity', 'detachment', 'inhibition', 'reserve', 'restriction', 'silence', 'stagnation', 'suppression', 'uniformity'], // Self-expression
  'self-reliance': ['collectivism'], // Self-reliance
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
  'separate': ['align', 'binding', 'blend', 'cohere', 'collaborative', 'combine', 'connect', 'consolidate', 'integrate', 'integrated', 'interlink', 'interlock', 'interwoven', 'join', 'merge', 'merged', 'shared', 'stack', 'synthesize', 'unify', 'unite', 'united'], // separate
  'separated': ['clustered'], // separated
  'separation': ['assemblage', 'assembly', 'attachment', 'belonging', 'closeness', 'companion', 'connect', 'continuum', 'convergence', 'embrace', 'envelopment', 'fusion', 'integrity', 'interaction', 'interfacing', 'intertwined', 'interwoven', 'intimacy', 'network', 'penetration', 'superimposition', 'togetherness', 'unison'], // separation
  'sepia': ['cool', 'coolness', 'gleaming'], // Sepia
  'sequential': ['chaotic', 'disordered', 'haphazard', 'irregular', 'random', 'scattered', 'spontaneous', 'unstructured'], // Sequential
  'serendipity': ['misfortune'], // serendipity
  'serene': ['aggressive', 'agitated', 'arcade', 'bustling', 'chaotic', 'discordant', 'energetic', 'frantic', 'frenzied', 'frenzy', 'harried', 'haunting', 'heavy', 'joy', 'murky', 'noisy', 'raucous', 'roughness', 'uproarious'], // Serene
  'serenity': ['agitation', 'agony', 'anger', 'anguish', 'anxiety', 'apprehension', 'breakdown', 'clamor', 'discomfort', 'guilt', 'heavy', 'panic', 'playful', 'pollution', 'squalor', 'stimulation', 'stress', 'torment', 'tumult', 'turmoil', 'war'], // Serenity
  'serif': ['based', 'condensed', 'estate', 'mesh', 'responsive', 'sans', 'squiggly'], // Serif
  'serious': ['camp', 'carefree', 'chaotic', 'childlike', 'comic', 'fable', 'faddish', 'fanciful', 'flighty', 'flippant', 'frivolous', 'funny', 'gamified', 'informal', 'irreverent', 'light', 'loose', 'play', 'playful', 'random', 'silly', 'wacky'], // serious
  'seriousness': ['cartoon', 'childhood', 'levity', 'youthfulness'], // seriousness
  'serpentine': ['clear', 'fixed', 'linear', 'rigid', 'simple', 'stable', 'straight', 'straight-dynamics', 'uniform'], // serpentine
  'service': ['freight', 'manufacturing', 'winery'], // Service
  'services': ['engineering', 'merchandise'], // Services
  'setback': ['victory'], // setback
  'settle': ['aspire', 'chaos', 'disorder', 'disrupt', 'instability', 'soar', 'uncertainty', 'wander'], // settle
  'settled': ['anticipation', 'chaotic', 'conflicted', 'disordered', 'dissatisfied', 'frontier', 'fugitive', 'hover', 'insecure', 'mobile', 'nomadic', 'restless', 'shifting', 'uncertain', 'unsettled', 'unstable', 'wandering'], // settled
  'settling': ['fleeing'], // settling
  'sex': ['gender'], // sex
  'shabby': ['elegant', 'luxe', 'luxurious', 'neat', 'orderly', 'polished', 'pristine', 'refined', 'smooth'], // shabby
  'shade': ['brightness', 'exposure', 'light', 'lumen', 'shine', 'solar'], // shade
  'shading': ['blinding', 'illustration', 'led', 'outlining'], // Shading
  'shadow': ['beacon', 'earthen', 'emerald', 'glare', 'highlight', 'illumination', 'luminance', 'present', 'radiance'], // Shadow
  'shadowy': ['luminescent'], // shadowy
  'shakiness': ['stability'], // shakiness
  'shaky': ['consistent', 'poised', 'polished', 'robust', 'secure', 'simple', 'smooth', 'solid', 'stable', 'steady'], // shaky
  'shallow': ['alert', 'aware', 'deep', 'deeptech', 'engaged', 'fresh', 'immerse', 'intense', 'introspection', 'profound', 'rich', 'root', 'vivid'], // shallow
  'sham': ['genuine'], // sham
  'shame': ['acceptance', 'approval', 'celebration', 'confidence', 'contentment', 'dignity', 'honor', 'joy', 'pride'], // shame
  'shape': ['chaos', 'flat', 'muddle', 'void'], // Shape
  'shaped': ['formless', 'unformed'], // shaped
  'shaping': ['destruction', 'detachment', 'disorder', 'dispersal', 'dissolution'], // Shaping
  'share': ['consume', 'isolate'], // share
  'shared': ['divided', 'fragmented', 'isolated', 'lonely', 'private', 'separate', 'solitary'], // shared
  'sharing': ['greed', 'withholding'], // sharing
  'sharp': ['blended', 'blobby', 'blunt', 'blur', 'bokeh', 'brushstroke', 'cloudy', 'clueless', 'curvy', 'diffused', 'dull', 'fading', 'frayed', 'fuzzy', 'gentle', 'hazy', 'imprecise', 'loop', 'muffled', 'nebulous', 'neumorphic', 'numb', 'pixelation', 'round', 'smeared', 'smooth', 'soft', 'supple', 'sweet', 'unfocused', 'veiling', 'wash'], // Sharp
  'sharpness': ['blurb', 'fuzz', 'haze'], // sharpness
  'shatter': ['wholeness'], // shatter
  'sheen': ['blunt', 'dull', 'flat', 'matte', 'rough', 'rusty'], // Sheen
  'sheer': ['dense', 'heavy', 'opaque', 'solid', 'thick', 'weighty'], // Sheer
  'shell': ['psyche'], // shell
  'shelter': ['abandonment', 'exposure', 'uncover', 'vulnerability'], // Shelter
  'shield': ['exposure', 'fragility', 'naked', 'openness', 'penetration', 'reveal', 'transparency', 'uncover', 'vulnerability', 'weakness'], // Shield
  'shielded': ['bare', 'defenseless', 'exposed', 'naked', 'open', 'raw', 'unprotected', 'vulnerability', 'vulnerable'], // shielded
  'shift': ['constant', 'fixed', 'immobile', 'stable', 'states', 'static', 'steady', 'unchanging', 'uniform'], // Shift
  'shifting': ['anchored', 'fixed', 'fixity', 'rooted', 'settled', 'solid', 'stable', 'static', 'steady', 'unchanging'], // shifting
  'shifty': ['clean', 'clear', 'defined', 'honest', 'orderly', 'organized', 'solid', 'stable', 'trustworthy'], // shifty
  'shimmer': ['bland', 'dull', 'flat', 'matte', 'opaque'], // Shimmer
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
  'sidebar': ['center', 'focus', 'main'], // Sidebar
  'sight': ['blindness'], // sight
  'sighted': ['blind'], // sighted
  'sightful': ['blind', 'chaos', 'disdain', 'disorder', 'ignorant', 'mess', 'neglect', 'non-visual', 'vulgar'], // sightful
  'signal': ['chaos', 'confusion', 'muffle', 'noise', 'obscurity', 'silence'], // Signal
  'significance': ['emptiness', 'insignificance', 'meaninglessness', 'nullity', 'oblivion', 'triviality'], // Significance
  'significant': ['forgettable', 'futile', 'insignificant', 'irrelevant', 'petty', 'pointless', 'trivial', 'useless', 'worthless'], // significant
  'silence': ['activity', 'advertising', 'beat', 'buzz', 'cacophony', 'clamor', 'dialogue', 'din', 'echo', 'event', 'expression', 'expressiveness', 'gesture', 'interaction', 'marketing', 'melody', 'messaging', 'noise', 'promotion', 'publishing', 'pulse', 'racket', 'rhythm', 'scream', 'self-expression', 'shouting', 'shouts', 'signal', 'sound', 'statement', 'stimulation', 'story', 'telecommunications'], // Silence
  'silent': ['acoustic', 'blaring', 'cacophony', 'clamor', 'murals', 'noise', 'shouting', 'verbal'], // Silent
  'silhouette': ['clarity', 'definition', 'detail'], // Silhouette
  'silk': ['brittle', 'coarse', 'hard', 'rough', 'stiff'], // Silk
  'silliness': ['gravitas'], // silliness
  'silly': ['earnest', 'formal', 'grave', 'intelligent', 'reserved', 'serious', 'sober', 'solemn', 'stern'], // silly
  'silver': ['earthen', 'emerald'], // Silver
  'similar': ['disparate', 'diverse'], // similar
  'simple': ['adulting', 'arch', 'arduous', 'brash', 'burdened', 'burdensome', 'catering', 'cellular', 'cgi', 'challenging', 'circuitous', 'cluttered', 'complex', 'conflicted', 'confused', 'confusing', 'cosmetics', 'crooked', 'crowned', 'cumbersome', 'deconstructivism', 'decorated', 'deeptech', 'depictive', 'elaborate', 'elite', 'enigmatic', 'excessive', 'exotic', 'extraneous', 'fabricated', 'fame', 'fanciful', 'figurative', 'fintech', 'flamboyant', 'flashy', 'fussy', 'fuzzy', 'gamified', 'garnish', 'gaudy', 'glamour', 'gothic', 'grind', 'grungy', 'hybrid', 'incomplete', 'indulgent', 'jumbled', 'kaleidoscopic', 'labyrinthine', 'lavish', 'layers', 'lofty', 'macro', 'majestic', 'mosaic', 'motorsport', 'multi', 'noisy', 'oblique', 'overwrought', 'paneled', 'parametric', 'poly', 'post-process', 'postdigital', 'pretentious', 'propulsive', 'racket', 'retrofuturism', 'richness', 'robotics', 'roughness', 'scaly', 'scholarly', 'serpentine', 'shaky', 'smoky', 'squiggly', 'storyful', 'strange', 'strata', 'strenuous', 'symbolic', 'symphonic', 'tangle', 'techno-futurism', 'technographic', 'theoretical', 'topography', 'twist', 'twisted', 'unhinged', 'vanguard', 'variable', 'variant', 'veiled', 'veiling', 'viscous', 'wacky', 'wealth', 'wearables', 'wrought', 'xr', 'yachting'], // simple
  'simplicity': ['analysis', 'anatomy', 'apex', 'artifice', 'baroque', 'blurb', 'branding', 'celebrity', 'challenge', 'clamor', 'complexity', 'complication', 'confusion', 'consumerism', 'contradiction', 'corner', 'craft', 'cubism', 'deco', 'editorial', 'exaggeration', 'excess', 'filth', 'finance', 'fussy', 'fuzz', 'glitch', 'grandeur', 'harmony', 'hassle', 'hud', 'idiosyncrasy', 'imposition', 'jumble', 'lattice', 'layering', 'mass', 'matrix', 'maximalism', 'mess', 'metaverse', 'microcosm', 'muddle', 'paradox', 'pattern', 'plurality', 'scholarship', 'subjectivity', 'superimposition', 'surrealism', 'tumult', 'typecraft', 'verbosity', 'watches', 'watchmaking'], // Simplicity
  'simplification': ['augmentation', 'convolution', 'editorial', 'harmony'], // Simplification
  'simplify': ['busy', 'chaotic', 'cluttered', 'complex', 'complicate', 'dense', 'engrave', 'innovate', 'intricate', 'layered', 'layering', 'magnify'], // simplify
  'simplifying': ['chaotic', 'cluttered', 'complicating', 'confusing', 'conglomerating', 'disordered', 'intricate', 'messy', 'overwhelming'], // simplifying
  'simplistic': ['graded', 'labyrinthine', 'overwrought'], // simplistic
  'simulacrum': ['authentic', 'genuine', 'original', 'real', 'truth'], // Simulacrum
  'simulated': ['authentic', 'genuine', 'natural', 'real'], // Simulated
  'simulation': ['authenticity', 'illustration', 'led'], // Simulation
  'sincere': ['deceptive', 'fake', 'falsehood', 'heavy', 'hollow', 'insincere', 'irreverent'], // Sincere
  'sincerity': ['deceit', 'dishonesty', 'distrust', 'duplicity', 'falsehood', 'fraudulence', 'hypocrisy', 'insincerity', 'mockery', 'pretense'], // sincerity
  'single': ['album', 'complex', 'crowded', 'fluid', 'hybrid', 'layers', 'multi', 'multiple', 'poly', 'strata', 'tiered'], // single
  'singular': ['collective', 'common', 'generic', 'hybrid', 'mosaic', 'ordinary', 'peripheral', 'plural', 'repetitive', 'standard', 'typical', 'uniform', 'variety'], // singular
  'singular-style': ['mosaic'], // singular-style
  'singular-tone': ['multi'], // singular-tone
  'singularity': ['complexity', 'continuum', 'cycle', 'dispersal', 'diversity', 'duality', 'flotilla', 'fragmentation', 'multiplicity', 'plurality', 'repetition'], // Singularity
  'sink': ['float', 'raise', 'rise', 'soar', 'uplift'], // sink
  'skeletal': ['dense', 'full', 'lush', 'plump', 'rich', 'solid'], // Skeletal
  'skeptical': ['naive'], // skeptical
  'skepticism': ['belief', 'naivety'], // skepticism
  'sketching': ['final', 'illustration', 'led'], // Sketching
  'skeuomorphic': ['surreal'], // Skeuomorphic
  'skeuomorphism': ['abstraction', 'flat', 'minimalism'], // Skeuomorphism
  'skilled': ['amateur'], // skilled
  'skillful': ['awkward', 'clumsy', 'empty', 'incompetence', 'incompetent', 'rigid', 'stiff', 'unskilled', 'weak'], // skillful
  'skincare': ['damage', 'dirt', 'harm', 'neglect', 'rough'], // Skincare
  'sky': ['basement', 'depth', 'earth', 'ground', 'terrain', 'void'], // Sky
  'skyward': ['below', 'doubting', 'earthbound', 'grounded', 'subterranean'], // Skyward
  'slack': ['active', 'driven', 'dynamic', 'focused', 'intense', 'rigid', 'strict', 'urgent'], // slack
  'slacker': ['active', 'ambitious', 'disciplined', 'driven', 'dynamic', 'engaged', 'focused', 'productive', 'productivity'], // slacker
  'sleek': ['brushed', 'chunky', 'clunky', 'coarse', 'frumpy', 'fussy', 'grained', 'janky', 'painterly', 'pulp', 'rocky', 'scaly', 'scrappy', 'textural'], // sleek
  'sleekness': ['disheveled', 'editorial', 'harmony'], // Sleekness
  'sleep': ['day', 'morning'], // sleep
  'sleeping': ['awakening'], // sleeping
  'slender': ['bulky', 'heavy', 'thick', 'wide'], // Slender
  'slick': ['absorbent', 'bumpy', 'coarse', 'rough', 'roughness', 'textured', 'uneven'], // Slick
  'slim': ['plump', 'thick'], // slim
  'sloppiness': ['attention', 'carefulness', 'clarity', 'craftsmanship', 'design', 'efficiency', 'focus', 'neatness', 'order', 'precision'], // sloppiness
  'sloppy': ['clean', 'elegant', 'neat', 'orderly', 'polished', 'precise', 'refined', 'structured'], // sloppy
  'sloth': ['action', 'drive', 'energy', 'focus', 'gym', 'hurry', 'initiative', 'speed', 'vigor'], // sloth
  'slow': ['aerodynamic', 'brisk', 'fast', 'hasty', 'immediate', 'instant', 'motorsport', 'propulsive', 'quick', 'rapid', 'robotics', 'rush', 'rushed', 'sudden', 'swift', 'urgent', 'volatile'], // slow
  'slow-paced': ['motorsport'], // Slow-paced
  'slowness': ['activity', 'haste', 'motion', 'quickness', 'rush', 'speed', 'urgency', 'velocity'], // slowness
  'sluggish': ['activating', 'active', 'alert', 'athlete', 'bright', 'bustling', 'dynamic', 'energetic', 'energy', 'lively', 'swift', 'vibrant'], // sluggish
  'slumber': ['awakening'], // slumber
  'slump': ['rise'], // slump
  'small': ['colossal', 'epic', 'expansive', 'grand', 'huge', 'immense', 'large', 'massive', 'vast'], // small
  'small-scale art': ['murals'], // small-scale art
  'small-scale-art': ['murals'], // Small-scale Art
  'smeared': ['clean', 'clear', 'defined', 'distinct', 'focused', 'precise', 'sharp', 'structured', 'typography'], // smeared
  'smoky': ['bright', 'clear', 'crisp', 'defined', 'pure', 'simple', 'smooth', 'solid', 'static'], // Smoky
  'smooth': ['absorbent', 'agitated', 'angularity', 'arduous', 'awkward', 'bitter', 'blobby', 'blocky', 'blotchy', 'braided', 'brushed', 'brushstroke', 'brushwork', 'bump', 'bumpy', 'challenging', 'chipped', 'clatter', 'coarse', 'cracked', 'craggy', 'crooked', 'dirt', 'disjointed', 'distorted', 'distress', 'distressed', 'dragged', 'dust', 'erupt', 'explosive', 'faceted', 'flaky', 'flicker', 'foamy', 'folded', 'fracture', 'frayed', 'fussy', 'fuzzy', 'grained', 'granular', 'graphite', 'grime', 'grotesque', 'grungy', 'halted', 'harried', 'harsh', 'jagged', 'janky', 'jarring', 'matt', 'muddy', 'murky', 'paneled', 'panelled', 'particulate', 'patina', 'pixel', 'pixelated', 'pixelation', 'plump', 'pointed', 'powder', 'pressure', 'pulp', 'ragged', 'relief', 'rocky', 'roughness', 'rugged', 'rusty', 'scaly', 'scrappy', 'scratched', 'segmented', 'shabby', 'shaky', 'sharp', 'smoky', 'speckled', 'splat', 'splotchy', 'staccato', 'sticker', 'stilted', 'stone', 'strenuous', 'stuffy', 'tangle', 'tense', 'terrain', 'textural', 'tightened', 'topography', 'twisted', 'uneven', 'unruly', 'viscous', 'wave', 'wire', 'worn', 'woven'], // smooth
  'smoothness': ['bumpiness', 'bumpy', 'coarseness', 'hassle', 'jaggedness', 'jumble', 'pixelation', 'roughness', 'textured', 'uneven'], // Smoothness
  'snub': ['regard'], // snub
  'soar': ['decline', 'descend', 'drop', 'fall', 'land', 'plummet', 'settle', 'sink'], // Soar
  'sober': ['camp', 'chaotic', 'colorful', 'extravagant', 'frenzied', 'frivolous', 'garish', 'lively', 'silly', 'vibrant', 'wild'], // sober
  'social': ['heavy', 'introverted'], // Social
  'soda': ['wine'], // Soda
  'soft': ['aggressive', 'angularity', 'armored', 'backward', 'bitter', 'blaring', 'blasts', 'blazing', 'blinding', 'blocky', 'boisterous', 'brash', 'brittle', 'brutal', 'brutalism', 'burnt', 'buzz', 'cast', 'challenging', 'coarse', 'concrete', 'craggy', 'crisp', 'fibrous', 'fierce', 'fiery', 'fluid', 'frozen', 'garish', 'glare', 'gothic', 'graphite', 'halted', 'hard', 'harsh', 'heat', 'heated', 'humble', 'industrial', 'loud', 'marble', 'mechanical', 'obtrusive', 'ochre', 'outward', 'overwrought', 'pointed', 'punchy', 'raucous', 'resilient', 'robotic', 'rocky', 'roughness', 'rugged', 'savage', 'scaly', 'screaming', 'sharp', 'shouted', 'shouts', 'solidity', 'steel', 'sterile', 'stern', 'stiff', 'stone', 'strident', 'sturdy', 'technic', 'tense', 'thunders', 'weight', 'weighty', 'wire'], // Soft
  'soften': ['overpower', 'solidify'], // soften
  'softness': ['editorial', 'harmony', 'harsh', 'strength'], // Softness
  'software': ['bakery', 'winery'], // Software
  'solar': ['darkness', 'lunar', 'night', 'shade', 'void'], // Solar
  'solemn': ['cheerful', 'exuberant', 'flippant', 'irreverent', 'jovial', 'joyful', 'lighthearted', 'playful', 'silly'], // Solemn
  'solemnity': ['flippant'], // solemnity
  'solid': ['2d', 'aero', 'aether', 'airiness', 'amorphous', 'aqueous', 'beverage', 'blobby', 'blotchy', 'broken', 'cellular', 'cloud', 'cloudy', 'coil', 'disembodied', 'disembodiment', 'erode', 'ethereal', 'evanescent', 'fabric', 'flaky', 'flawed', 'flexibility', 'flicker', 'flighty', 'flood', 'fluke', 'foamy', 'folding', 'fracture', 'frayed', 'hazy', 'hollow', 'impotence', 'intangible', 'interstitial', 'leak', 'lightweight', 'liquid', 'malleable', 'melt', 'modular', 'molten', 'morph', 'neumorphic', 'partial', 'patina', 'perforated', 'plasma', 'porous', 'powder', 'scrap', 'segmented', 'shaky', 'sheer', 'shifting', 'shifty', 'skeletal', 'smoky', 'spill', 'splash', 'splotchy', 'steam', 'strata', 'stratosphere', 'tear', 'thaw', 'translucency', 'translucent', 'tubular', 'undulating', 'unformed', 'unfounded', 'vague', 'vapor', 'vapour', 'viscous', 'wave', 'waver', 'wavering', 'wavy', 'wire', 'wobbly', 'y2k'], // Solid
  'solid-color': ['splotchy'], // solid-color
  'solidarity': ['dissipation', 'disunity'], // solidarity
  'solidify': ['bleed', 'chaos', 'collapse', 'dissolve', 'fluid', 'informal', 'melt', 'random', 'soften', 'vague'], // solidify
  'solidifying': ['diluting', 'dissolving', 'fluid', 'liquefying', 'melting', 'obliterating', 'vanishing'], // solidifying
  'solidity': ['abstract', 'chaotic', 'disordered', 'fluid', 'fragility', 'lattice', 'metaverse', 'soft', 'temporary', 'uncertain', 'vague', 'whirlwind'], // solidity
  'solipsism': ['dependence'], // solipsism
  'solitary': ['collaborative', 'collective', 'public', 'shared', 'urban'], // solitary
  'solitude': ['collectivism', 'community', 'companion', 'companionship', 'connection', 'dependence', 'dialogue', 'embrace', 'engagement', 'flotilla', 'interaction', 'togetherness'], // Solitude
  'solo': ['multi', 'team-building'], // solo
  'solutions': ['challenges', 'chaos', 'complication', 'confusion', 'disorder', 'failure', 'frustration', 'inefficiency', 'obstacle', 'obstacles', 'problems'], // Solutions
  'somber': ['bright', 'cheerful', 'festive', 'joyful', 'lively', 'vibrant'], // Somber
  'somewhere': ['nowhere'], // somewhere
  'somnolent': ['stimulating'], // somnolent
  'soothing': ['jarring'], // soothing
  'sophisticated': ['artless', 'cheap', 'childlike', 'comic', 'composition', 'contrast', 'crude', 'faddish', 'folk', 'frivolous', 'kitsch', 'naive', 'primal', 'primitive', 'rudimentary', 'tacky', 'vulgar', 'wacky'], // Sophisticated
  'sophistication': ['cartoon', 'naivety'], // sophistication
  'sorrow': ['aether', 'bliss', 'celebration', 'comfort', 'delight', 'euphoria', 'happiness', 'hope', 'joy', 'levity', 'pleasure', 'prosperity'], // sorrow
  'sorrowful': ['jovial'], // sorrowful
  'soulful': ['bland', 'cold', 'detached', 'mechanical', 'sterile'], // Soulful
  'sound': ['silence'], // sound
  'sour': ['bakery', 'sweet'], // sour
  'source': ['absence', 'chaos', 'dispersal', 'end', 'void'], // Source
  'sovereignty': ['anarchy', 'control', 'dependence', 'subjugation', 'subordination'], // Sovereignty
  'space': ['composition', 'contrast'], // Space
  'spacious': ['composition', 'constrict', 'contrast', 'dense'], // Spacious
  'spare': ['merchandise'], // spare
  'spark': ['dull', 'stagnant', 'static'], // Spark
  'sparse': ['adorned', 'clustering', 'elaborate', 'excessive', 'filled', 'full', 'fullness', 'indulgent', 'lavish', 'volume'], // sparse
  'sparse-elegance': ['garnish'], // sparse-elegance
  'sparsity': ['abundance', 'chaos', 'complexity', 'crowded', 'density', 'fullness', 'lavish', 'richness', 'textured-abundance'], // Sparsity
  'spatial': ['editorial', 'harmony'], // Spatial
  'special': ['common', 'ubiquitous'], // special
  'specific': ['abstracted', 'abstraction', 'aggregate', 'ambiguous', 'broad', 'diffuse', 'general', 'imprecise', 'indistinct', 'interstitial', 'massproduced', 'random', 'ubiquitous', 'unclear', 'ungendered', 'vague'], // specific
  'speckled': ['plain', 'smooth', 'uniform'], // Speckled
  'spectacle': ['minimal', 'mundane', 'subtle'], // Spectacle
  'speed': ['gradual', 'leisurely', 'sloth', 'slowness', 'stasis', 'stillness'], // Speed
  'spent': ['renew'], // spent
  'sphere': ['boxy', 'cube', 'line', 'plane', 'pyramid', 'rectangle'], // Sphere
  'spherical': ['angular', 'flat', 'irregular', 'linear', 'octagonal', 'planar'], // Spherical
  'spill': ['contain', 'containment', 'fixed', 'hold', 'neat', 'orderly', 'secure', 'solid', 'stable'], // spill
  'spiral': ['flat', 'linear', 'rigid', 'static', 'straight'], // Spiral
  'spirit': ['concrete', 'earth', 'matter', 'physical', 'tangible'], // Spirit
  'spirited': ['weary'], // spirited
  'spirituality': ['geology'], // spirituality
  'splash': ['absorb', 'calm', 'clear', 'dry', 'flat', 'quiet', 'solid', 'still', 'typeset'], // splash
  'splat': ['clean', 'controlled', 'focused', 'neat', 'orderly', 'precise', 'smooth', 'subtle', 'typesetting'], // splat
  'split': ['align', 'bond', 'combine', 'connect', 'harmony', 'integrate', 'interlink', 'join', 'merge', 'unify', 'unite', 'wholeness'], // split
  'splotchy': ['clear', 'consistent', 'even', 'neat', 'polished', 'smooth', 'solid', 'solid-color', 'uniform'], // splotchy
  'spoken': ['nonverbal'], // spoken
  'spontaneity': ['academia', 'algorithm', 'architecture', 'captivity', 'coding', 'cubism', 'discipline', 'editorial', 'engineering', 'grind', 'harmony', 'imposition', 'mechanism', 'method', 'outlining', 'planned', 'planning', 'ritual'], // Spontaneity
  'spontaneous': ['adulting', 'analytical', 'automated', 'behavioral', 'calculated', 'coded', 'computational', 'deliberate', 'doctrinal', 'engineered', 'fabricated', 'factory', 'formality', 'mechanic', 'mechanical', 'methodical', 'modelling', 'planned', 'predefined', 'predetermined', 'predictable', 'premeditated', 'procedural', 'regulated', 'repetitive', 'restrained', 'restricted', 'robotic', 'scheduled', 'sequential', 'staged', 'stilted', 'strategic'], // spontaneous
  'sports': ['cool', 'coolness', 'idle', 'unfocused'], // Sports
  'spotless': ['chaotic', 'dirty', 'flawed', 'imperfect', 'messy', 'rough', 'stained', 'tattered', 'worn'], // Spotless
  'sprawl': ['cohesive', 'compact', 'dashboard', 'dense', 'neat', 'orderly', 'organized', 'structured', 'uniform'], // sprawl
  'sprawled': ['cohesive', 'compact', 'focused', 'grounded', 'neat', 'organized', 'sculpted', 'stable', 'structured'], // sprawled
  'spread': ['block', 'centralized', 'compact', 'constricted', 'contained', 'focused', 'point', 'tight'], // spread
  'spreading': ['compressing'], // spreading
  'spring': ['fall'], // spring
  'squalor': ['brightness', 'cleanliness', 'elegance', 'harmony', 'idyll', 'neatness', 'order', 'purity', 'serenity', 'utopia'], // squalor
  'square': ['chaotic', 'circle', 'curved', 'fluid', 'random', 'round'], // Square
  'squiggly': ['orderly', 'predictable', 'serif', 'simple', 'standard', 'straight', 'uniform'], // squiggly
  'stability': ['breakdown', 'chaos', 'chaotic', 'disorder', 'disruption', 'drift', 'flexibility', 'fluke', 'flux', 'fragility', 'impermanence', 'instability', 'liminality', 'mobility', 'rebellion', 'risk', 'shakiness', 'transience', 'turbulence', 'turmoil', 'uncertainty', 'verticality', 'whirlwind'], // Stability
  'stabilize': ['bleed', 'disrupt'], // stabilize
  'stable': ['anarchic', 'broken', 'cellular', 'deconstructivism', 'disruptive', 'evanescent', 'explosive', 'faddish', 'fickle', 'flawed', 'fleeting', 'flicker', 'flighty', 'folding', 'fugitive', 'lost', 'molten', 'morph', 'murky', 'mutable', 'plasma', 'postlude', 'reactive', 'serpentine', 'shaky', 'shift', 'shifting', 'shifty', 'spill', 'sprawled', 'tangential', 'temporary', 'transient', 'undulating', 'ungrounded', 'unhinged', 'unsettled', 'unstable', 'unsteady', 'vague', 'variable', 'volatile', 'wave', 'waver', 'wavering', 'wobbly'], // stable
  'staccato': ['calm', 'continuous', 'fluid', 'gentle', 'leisurely-flow', 'smooth', 'steady'], // staccato
  'stack': ['disperse', 'dissolve', 'divide', 'flatten', 'loosen', 'scatter', 'separate'], // Stack
  'staged': ['candid', 'chaotic', 'dynamic', 'fluid', 'genuine', 'natural', 'organic', 'raw', 'spontaneous'], // staged
  'staging': ['illustration', 'led'], // Staging
  'stagnant': ['aerodynamic', 'alive', 'beat', 'catalyst', 'forward', 'innovative', 'inventive', 'live', 'molten', 'propulsive', 'raised', 'responsive', 'spark', 'steam', 'swift', 'vanguard'], // stagnant
  'stagnate': ['evolve', 'flourish', 'innovate', 'motivate', 'renew', 'thrive', 'yield'], // stagnate
  'stagnation': ['activity', 'adaptability', 'advancement', 'awakening', 'catalyst', 'creativity', 'day', 'development', 'dialogue', 'discovery', 'dream', 'education', 'emergence', 'energy', 'event', 'evolution', 'expression', 'flotilla', 'freshness', 'future', 'growth', 'improvement', 'interplay', 'invention', 'lifestyle', 'logistics', 'metaverse', 'microcosm', 'mobility', 'moment', 'passion', 'potential', 'progress', 'pursuit', 'quest', 'rebirth', 'redefinition', 'reinvention', 'renewal', 'ripple', 'self-expression', 'stream', 'transformation', 'vigor', 'vitality', 'watches', 'wind'], // stagnation
  'stain': ['wash'], // stain
  'stained': ['spotless'], // stained
  'stale': ['beverage', 'bistro', 'bold', 'breezy', 'bright', 'colorful', 'cool', 'dynamic', 'exciting', 'fable', 'fresh', 'groovy', 'lively', 'new', 'novel', 'oceanic', 'vibrant', 'youth', 'youthfulness'], // stale
  'staleness': ['freshness'], // staleness
  'stamina': ['weakness'], // stamina
  'standard': ['anomaly', 'boutique', 'exotic', 'extraordinary', 'improvised', 'novel', 'offbeat', 'personalized', 'rare', 'singular', 'squiggly', 'subjective', 'uncommon', 'unfamiliar', 'unique', 'uniqueness', 'variant'], // standard
  'standardization': ['customization', 'idiosyncrasy', 'localism'], // standardization
  'standardize': ['disrupt'], // standardize
  'stark': ['aqueous', 'bistro', 'earthen', 'emerald', 'sweet'], // Stark
  'start': ['closed', 'end', 'ended', 'endgame', 'expire', 'final', 'finale', 'finish', 'stop'], // start
  'startup': ['cool', 'coolness'], // Startup
  'starvation': ['nourishment'], // starvation
  'starve': ['abundance', 'feed', 'full', 'nourish', 'plenty', 'rich', 'satiate', 'thrive'], // starve
  'stasis': ['becoming', 'flux', 'journey', 'mobility', 'momentum', 'movement', 'passage', 'pulse', 'rhythm', 'speed', 'time', 'trajectory', 'velocity', 'voyage'], // Stasis
  'stately': ['frenzied', 'heavy'], // Stately
  'statement': ['ambiguity', 'confusion', 'disregard', 'invisibility', 'neutral', 'obscurity', 'passive', 'plain', 'silence', 'subtle', 'uncertainty'], // Statement
  'states': ['composition', 'contrast', 'shift'], // States
  'static': ['3d-rendering', 'accordion', 'acoustic', 'activating', 'active', 'adventurous', 'animated', 'arcade', 'automotive', 'beat', 'becoming', 'biomorphic', 'breezy', 'brushstroke', 'carousel', 'catalyst', 'cellular', 'cinematic', 'cloud', 'composition', 'cybernetic', 'cycle', 'digitalization', 'driven', 'evolution', 'experiential', 'exploratory', 'explosive', 'fi', 'fintech', 'fleeting', 'flex', 'flexibility', 'folding', 'forward', 'frontier', 'gamified', 'globe', 'graded', 'groovy', 'interactive', 'kaleidoscopic', 'labyrinthine', 'loop', 'mobile', 'mobility', 'morph', 'motorsport', 'nomadic', 'parallax', 'performative', 'planetary', 'plasma', 'postdigital', 'propulsive', 'radial', 'reactive', 'responsive', 'restless', 'retrofuturism', 'seasons', 'shift', 'shifting', 'smoky', 'spark', 'spiral', 'strata', 'streak', 'stream', 'swirl', 'techno-futurism', 'thrive', 'thunders', 'transient', 'trend', 'twist', 'undulating', 'undulation', 'vanguard', 'variable', 'variant', 'vr', 'wave', 'wavy', 'wearables', 'xr', 'youthfulness'], // Static
  'stationary': ['carousel', 'hover', 'mobile', 'mobility', 'wandering', 'watches', 'wearables', 'yachting'], // stationary
  'statuary': ['dynamic', 'ephemeral', 'fluid', 'temporary', 'transient'], // Statuary
  'status': ['ignored', 'premium'], // Status
  'statusquo': ['counterculture'], // statusquo
  'staying': ['fleeing'], // staying
  'steadfast': ['chaotic', 'fickle', 'messy', 'random', 'transitory-visuals', 'unstable', 'volatile'], // steadfast
  'steady': ['anxious', 'bumpy', 'clatter', 'dragged', 'fickle', 'flashy', 'flicker', 'flighty', 'frantic', 'harried', 'hasty', 'mutable', 'overflow', 'rushed', 'shaky', 'shift', 'shifting', 'staccato', 'sudden', 'suddenness', 'uncertain', 'uneven', 'unreliable', 'unsettled', 'unstable', 'unsteady', 'volatile', 'wavering'], // steady
  'steam': ['calm', 'dry', 'solid', 'stagnant', 'still'], // Steam
  'steampunk': ['techno-futurism'], // Steampunk
  'steel': ['brittle', 'flexible', 'flora', 'fluid', 'natural', 'organic', 'soft', 'warm'], // Steel
  'stellar': ['banal', 'common', 'dull', 'earthbound', 'earthly', 'grounded', 'mundane', 'ordinary', 'terrestrial'], // Stellar
  'sterile': ['atmospheric', 'biophilic', 'bistro', 'chaotic', 'earthiness', 'fertile', 'foliage', 'gritty', 'homely', 'lively', 'messy', 'murals', 'organic', 'pastoral', 'rich', 'romantic', 'rough', 'soft', 'soulful', 'verdant', 'vibrant', 'warm', 'worn'], // Sterile
  'stern': ['cheerful', 'easy', 'flexible', 'gentle', 'light', 'playful', 'silly', 'soft', 'warm'], // stern
  'stewardship': ['abandon', 'disregard', 'dissipation', 'neglect', 'waste'], // Stewardship
  'sticker': ['bare', 'empty', 'minimal', 'plain', 'smooth', 'void'], // Sticker
  'stiff': ['casual', 'dynamic', 'easy', 'flexibility', 'flexible', 'fluid', 'foamy', 'groovy', 'informal', 'light', 'loose', 'malleable', 'melt', 'pillow', 'playful', 'plush', 'porous', 'silk', 'skillful', 'soft', 'supple', 'vapour', 'velvet', 'yielding'], // stiff
  'stiffen': ['thaw'], // stiffen
  'stiffness': ['flexibility'], // Stiffness
  'stifle': ['encourage'], // stifle
  'stifled': ['bold', 'dynamic', 'expressive', 'freed', 'limitless', 'lively', 'radiant', 'unsettled', 'vibrant'], // stifled
  'stifling': ['empowering'], // stifling
  'still': ['activating', 'blaring', 'blasts', 'boisterous', 'burst', 'bustling', 'buzz', 'erupt', 'flood', 'frenzy', 'hover', 'hustle', 'live', 'liveliness', 'melt', 'mobile', 'molten', 'plasma', 'rush', 'shouting', 'splash', 'steam', 'streak', 'unleash', 'uproarious', 'vibration', 'wave'], // still
  'stillness': ['action', 'activity', 'agitation', 'beat', 'chaos', 'clamor', 'day', 'din', 'energy', 'flotilla', 'flux', 'force', 'gym', 'life', 'momentum', 'movement', 'noise', 'orbit', 'passage', 'pulse', 'ripple', 'shouts', 'speed', 'stimulation', 'stream', 'trajectory', 'turbulence', 'velocity', 'vortex', 'voyage', 'whirlwind', 'wind'], // Stillness
  'stillness-tone': ['vibration'], // stillness-tone
  'stilted': ['dynamic', 'easy', 'flowing', 'fluid', 'free', 'natural', 'natural-flow', 'smooth', 'spontaneous'], // Stilted
  'stimulate': ['bore'], // stimulate
  'stimulated': ['bored', 'unmoved'], // stimulated
  'stimulating': ['bland', 'boring', 'drab', 'draining', 'dull', 'flat', 'idle', 'insipid', 'lame', 'lethargic', 'lifeless', 'monotonous', 'somnolent', 'tedious', 'tiring', 'uninspiring'], // stimulating
  'stimulation': ['apathy', 'boredom', 'calm', 'dullness', 'inactivity', 'passivity', 'rest', 'serenity', 'silence', 'stillness'], // Stimulation
  'stoic': ['chaotic', 'comic', 'elaborate', 'emotional', 'expressive', 'fervent', 'passionate', 'reactive', 'unstable', 'volatile', 'vulnerable', 'zesty'], // Stoic
  'stone': ['flesh', 'fluid', 'light', 'paper', 'plastic', 'smooth', 'soft', 'translucent'], // Stone
  'stop': ['active', 'flow', 'fresh', 'go', 'launch', 'loop', 'move', 'repeat', 'rise', 'scroll', 'start'], // stop
  'stopped': ['active', 'continuous', 'dynamic', 'flowing', 'fluid', 'moving', 'open', 'scrolling', 'unstoppable'], // stopped
  'storm': ['breeze', 'calm', 'clear', 'peace', 'sunny'], // storm
  'story': ['absence', 'silence', 'void'], // Story
  'storyful': ['abstract-non-narrative', 'bland', 'chaotic', 'dull', 'flat', 'random', 'simple', 'unstructured', 'vague'], // storyful
  'straight': ['circuitous', 'circular', 'coil', 'crooked', 'curvilinear', 'curvy', 'diagonal', 'distorted', 'labyrinthine', 'oblique', 'serpentine', 'spiral', 'squiggly', 'swirl', 'tangle', 'twist', 'twisted', 'undulating', 'wavy', 'wobbly'], // straight
  'straight-dynamics': ['serpentine', 'wobbly'], // straight-dynamics
  'straightforward': ['ambiguous', 'complex', 'confusing', 'enigmatic', 'indirect', 'obscure', 'strange', 'uncertain', 'vague', 'wobbly'], // straightforward
  'strain': ['comfort', 'ease', 'flow', 'freedom', 'joy', 'lightness', 'relaxation', 'release'], // strain
  'strange': ['clear', 'easy', 'familiar', 'familiarity', 'normal', 'obvious', 'plain', 'simple', 'straightforward'], // strange
  'strata': ['flat', 'monolith', 'simple', 'single', 'solid', 'static', 'surface', 'unified', 'uniform'], // Strata
  'strategic': ['chaotic', 'disorganized', 'impulsive', 'random', 'spontaneous'], // Strategic
  'stratosphere': ['chaos', 'dense', 'earth', 'flat', 'ground', 'heavy', 'low', 'solid', 'substance', 'void'], // Stratosphere
  'stratum': ['base', 'surface', 'void'], // Stratum
  'streak': ['fade', 'static', 'still'], // Streak
  'stream': ['blockage', 'obstruction', 'stagnation', 'static', 'stillness'], // Stream
  'streamline': ['awkwardness', 'cluttered', 'complex'], // Streamline
  'streamlined': ['chunky', 'clunky', 'fussy'], // streamlined
  'street': ['enclosure', 'interior', 'sanctuary'], // Street
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
  'structural': ['chaotic', 'fluid', 'organic'], // Structural
  'structuralism': ['deconstructivism'], // Structuralism
  'structure': ['blurb', 'disorder', 'flux', 'fuzz', 'impressionist', 'jumble', 'mess', 'muddle', 'scribble', 'tumult', 'wilderness'], // structure
  'structured': ['amorphous', 'anarchic', 'anti', 'arbitrary', 'artless', 'biomorphic', 'blobby', 'disarrayed', 'disheveled', 'disorderly', 'disorganized', 'doodle', 'feral', 'formless', 'freeform', 'freestyle', 'haphazard', 'improvised', 'impure', 'informal', 'jumbled', 'loosen', 'messy', 'negligent', 'null', 'random', 'scrap', 'scrawl', 'sloppy', 'smeared', 'sprawl', 'sprawled', 'terrain', 'unconfined', 'undefined', 'unformed', 'unfounded', 'ungendered', 'unplanned', 'untamed', 'unvalued', 'wild'], // structured
  'struggle': ['calm', 'comfort', 'ease', 'harmony', 'joy', 'peace', 'prosperity', 'success', 'thrive', 'victory'], // struggle
  'stuck': ['advance', 'dynamic', 'escape', 'flow', 'free', 'motion', 'progress', 'release'], // stuck
  'studious': ['carefree', 'chaotic', 'disorderly', 'distracted', 'frivolous'], // Studious
  'stuffy': ['casual-chic', 'clear', 'dynamic', 'fluid', 'fresh', 'lively', 'open', 'smooth', 'vibrant'], // stuffy
  'stupid': ['ingenuity'], // stupid
  'stupidity': ['clarity', 'education', 'insight', 'intelligence', 'scholarship', 'wisdom'], // stupidity
  'sturdy': ['brittle', 'fragile', 'light', 'loose', 'soft', 'thin', 'translucency', 'unstable', 'vapor', 'weak'], // sturdy
  'styled': ['untouched'], // styled
  'styling': ['illustration', 'led'], // Styling
  'stylish': ['frumpy', 'tacky'], // stylish
  'stylization': ['naturalism', 'realism', 'unembellished', 'verisimilitude'], // Stylization
  'subdue': ['amplify', 'burst', 'erupt', 'highlight', 'intensify', 'overpower', 'unleash'], // subdue
  'subdued': ['accent', 'arcade', 'blaring', 'blasts', 'blazing', 'boisterous', 'brilliant', 'camp', 'emissive', 'erupt', 'excess', 'excessive', 'explosive', 'faddish', 'fiery', 'flamboyant', 'flare', 'ignited', 'indulgent', 'noisy', 'performative', 'provocative', 'punchy', 'raucous', 'screaming', 'shouted', 'shouts', 'strident', 'uproarious', 'wacky'], // subdued
  'subdued-illumination': ['dazzling'], // subdued-illumination
  'subduing': ['assertive', 'bold', 'clear', 'distinct', 'dynamic', 'highlighting', 'intensifying', 'loud', 'vibrant'], // subduing
  'subjective': ['analytical', 'analytics', 'certain', 'conventional', 'external', 'fixed', 'functionalism', 'objective', 'objectivist', 'predictable', 'scientific', 'standard', 'uniform', 'universal'], // subjective
  'subjectivity': ['algorithm', 'analytics', 'clarity', 'consensus', 'detachment', 'logic', 'objectivity', 'simplicity', 'universality'], // Subjectivity
  'subjugation': ['autonomy', 'empowerment', 'liberation', 'sovereignty'], // subjugation
  'sublime': ['banal', 'mundane', 'trivial'], // Sublime
  'submerge': ['float', 'hover'], // submerge
  'submerged': ['aerial'], // submerged
  'submersion': ['ascendancy'], // Submersion
  'submission': ['assertion', 'autonomy', 'control', 'defiance', 'dominance', 'freedom', 'independence', 'rebellion', 'resistance'], // submission
  'submissive': ['defiant', 'empowering', 'rebel'], // submissive
  'submissiveness': ['assertiveness', 'power'], // submissiveness
  'subordinate': ['main'], // subordinate
  'subordination': ['agency', 'sovereignty'], // subordination
  'subpar': ['elite', 'ideal', 'perfect'], // subpar
  'subside': ['intensify'], // subside
  'substance': ['absence', 'ephemera', 'facade', 'fleshless', 'husk', 'illusion', 'nonexist', 'nullity', 'stratosphere', 'transience', 'void'], // Substance
  'substantial': ['frivolous', 'intangible', 'superficial'], // substantial
  'subsurface': ['clear', 'exposed', 'open', 'surface', 'visible'], // Subsurface
  'subterranean': ['celestial', 'skyward'], // subterranean
  'subtext': ['explicit'], // subtext
  'subtextual': ['overt'], // subtextual
  'subtle': ['blatant', 'blinding', 'brash', 'burnt', 'fierce', 'flashy', 'foreground', 'fussy', 'garish', 'garnish', 'gaudy', 'imposing', 'janky', 'jarring', 'kitsch', 'loud', 'macro', 'obtrusive', 'obvious', 'overlook', 'overt', 'overwrought', 'spectacle', 'splat', 'statement', 'thunders', 'visible', 'vulgar', 'weighty'], // subtle
  'subtle-hues': ['screaming'], // subtle-hues
  'subtlety': ['authoritative', 'cartoon', 'exaggeration', 'exuberance', 'gesture', 'maximalism'], // Subtlety
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
  'superficiality': ['scholarship'], // Superficiality
  'superimposition': ['clarity', 'disjointed', 'isolation', 'separation', 'simplicity'], // Superimposition
  'superior': ['inferior', 'low'], // superior
  'supple': ['brittle', 'coarse', 'hard', 'harsh', 'rigid', 'rough', 'sharp', 'stiff'], // Supple
  'supply': ['deplete'], // supply
  'support': ['abandon', 'block', 'cruelty', 'disapproval', 'dislike', 'dismiss', 'exploitation', 'harm', 'hinder', 'ignore', 'mockery', 'neglect', 'obstacle', 'oppose', 'reject', 'rejecting', 'resign', 'resistance', 'ridicule', 'scorn'], // Support
  'supportive': ['burdensome'], // supportive
  'suppress': ['amplify', 'emit', 'manifesting', 'unveiling'], // suppress
  'suppressed': ['bold', 'clear', 'dynamic', 'empowered', 'expressed', 'free', 'open', 'released', 'visible'], // suppressed
  'suppressing': ['amplifying', 'emphasizing', 'expressing', 'freeing', 'highlighting', 'liberating', 'revealing', 'unleashing'], // suppressing
  'suppression': ['emanation', 'emergence', 'expansion', 'expression', 'flow', 'freedom', 'growth', 'liberation', 'manifestation', 'promotion', 'release', 'self-expression'], // suppression
  'surface': ['3d', 'core', 'disappear', 'dome', 'dot', 'line', 'polyhedron', 'root', 'strata', 'stratum', 'subsurface', 'tunnel'], // surface
  'surge': ['drown', 'heavy', 'plummet'], // Surge
  'surplus': ['deplete', 'depletion', 'hunger', 'need', 'reduction'], // surplus
  'surprise': ['anticipation', 'boring', 'familiar', 'mundane', 'predictable'], // surprise
  'surprising': ['predictable'], // surprising
  'surreal': ['hyperreal', 'skeuomorphic'], // Surreal
  'surrealism': ['clarity', 'conformity', 'order', 'ordinary', 'realism', 'simplicity'], // Surrealism
  'surrealist-vision': ['normal'], // surrealist-vision
  'surrender': ['confront', 'grasp', 'quest', 'victory'], // surrender
  'surveillance': ['premium'], // Surveillance
  'survival': ['premium'], // Survival
  'suspense': ['heavy', 'safety'], // Suspense
  'suspension': ['action', 'completion', 'resolution'], // Suspension
  'sustain': ['consume', 'expire', 'premium'], // Sustain
  'sustainability': ['consumerism', 'premium', 'wasteful'], // Sustainability
  'sustainable': ['disposable', 'wasteful'], // sustainable
  'sustenance': ['abandonment', 'deprivation', 'neglect'], // Sustenance
  'sweet': ['bitter', 'bland', 'brutal', 'dry', 'edgy', 'harsh', 'plain', 'rough', 'sharp', 'sour', 'stark'], // Sweet
  'swift': ['clumsy', 'heavy', 'inactive', 'lethargic', 'ponderous', 'slow', 'sluggish', 'stagnant'], // swift
  'swirl': ['center', 'static', 'straight'], // Swirl
  'swiss': ['brutal', 'chaotic', 'excessive'], // Swiss
  'symbiosis': ['conflict', 'detachment', 'disorder', 'dominance'], // Symbiosis
  'symbolic': ['clear', 'direct', 'literal', 'literal-interpretation', 'mundane', 'obvious', 'ordinary', 'plain', 'simple'], // symbolic
  'symbolism': ['ambiguous', 'chaotic', 'literal', 'non-representation', 'random'], // symbolism
  'symmetry': ['asymmetrical', 'asymmetry', 'clustering', 'curvature', 'deconstructivist', 'scribble'], // Symmetry
  'symphonic': ['bland', 'chaotic', 'discordant', 'dissonant', 'dry', 'isolated', 'random', 'simple'], // symphonic
  'synchronicitic': ['chaos', 'disconnection', 'disorder', 'fragmentation', 'randomness'], // Synchronicitic
  'synchronicitical': ['chaos', 'detachment', 'disorder', 'isolation', 'randomness'], // Synchronicitical
  'synchronicity': ['asynchrony', 'disconnect', 'discord', 'randomness'], // Synchronicity
  'synchronized': ['asynchronous', 'chaotic', 'disjointed', 'fragmented', 'fragmented-visions', 'isolated', 'random', 'uncoordinated', 'uneven'], // Synchronized
  'synergy': ['disunity', 'premium'], // Synergy
  'synthesis': ['curation', 'deconstruction', 'detail', 'divide'], // Synthesis
  'synthesize': ['break', 'deconstruct', 'disperse', 'dissolve', 'divide', 'fragment', 'isolate', 'scatter', 'separate'], // Synthesize
  'synthetic': ['artifact', 'artisanal', 'bio', 'biomorphic', 'botanical', 'cottagecore', 'earthiness', 'environment', 'fibrous', 'flora', 'fluid', 'natura', 'naturalistic', 'nature', 'primal'], // Synthetic
  'synthetics': ['wine'], // Synthetics
  'system-centric': ['user-centric'], // System-centric
  'systematic': ['arbitrary', 'disarrayed', 'disorderly', 'disorganized', 'haphazard', 'random', 'unplanned'], // systematic
  'systemic': ['heavy'], // Systemic
  'systems': ['chaos', 'disorder', 'fragmentation'], // Systems
  'tabs': ['carousel', 'cluttered', 'complex', 'detached', 'dispersal'], // Tabs
  'tacky': ['alluring', 'artistry', 'chic', 'classy', 'elegant', 'polished', 'refined', 'sophisticated', 'stylish', 'tasteful'], // tacky
  'tail': ['header'], // tail
  'tainted': ['clear', 'fresh', 'innovative', 'novel', 'original', 'pristine', 'pure', 'unexpected'], // tainted
  'tame': ['bold', 'captivating', 'chaotic', 'disorderly', 'feral', 'fierce', 'free', 'raw', 'untamed', 'uproarious', 'vivid', 'wild', 'zesty'], // tame
  'tamed': ['untamed'], // tamed
  'tangential': ['central', 'constant', 'direct', 'focused', 'linear', 'permanent', 'primary', 'stable'], // tangential
  'tangibility': ['abstract', 'disembodied', 'ethereal', 'immaterial', 'intangible', 'metaverse', 'vacuum', 'virtualization'], // Tangibility
  'tangible': ['2d', 'abstraction', 'astral', 'behavioral', 'digitalization', 'disembodied', 'disembodiment', 'e-commerce', 'ecommerce', 'ethereal', 'illusory', 'intangible', 'spirit', 'virtual', 'vr'], // tangible
  'tangle': ['aligned', 'calm', 'clear', 'neat', 'order', 'schematic', 'simple', 'smooth', 'straight'], // tangle
  'tangled': ['untouched-space'], // tangled
  'tarnished': ['calm', 'flourishing', 'polished', 'pristine', 'protected', 'renewed', 'thriving', 'vibrant'], // tarnished
  'task': ['freetime', 'hobby'], // task
  'tasteful': ['gaudy', 'tacky', 'vulgar'], // tasteful
  'tattered': ['spotless'], // tattered
  'team-building': ['individual', 'solo'], // Team-building
  'tear': ['build', 'complete', 'connect', 'heal', 'restore', 'solid', 'union', 'weave', 'whole'], // tear
  'technic': ['amateur', 'fluid', 'free', 'natural', 'organic', 'soft'], // Technic
  'techno': ['minimalist', 'natural', 'organic', 'rustic', 'traditional'], // Techno
  'techno-futurism': ['ancient', 'artnouveau', 'chaotic', 'gothic', 'mundane', 'natural', 'primitive', 'retro', 'simple', 'static', 'steampunk', 'traditional'], // Techno-futurism
  'techno-futurist': ['art-nouveau', 'organic', 'retro', 'rustic'], // Techno-futurist
  'technographic': ['analog', 'artisanal', 'basic', 'chaotic', 'hand-drawn', 'manual', 'natural', 'organic', 'primitive', 'rustic', 'simple'], // Technographic
  'technology': ['premium'], // Technology
  'techwear': ['basic', 'chaotic', 'heritage', 'informal', 'natural', 'primitive', 'rustic', 'traditional', 'unstructured', 'vintage'], // Techwear
  'tedious': ['colorful', 'convenience', 'dynamic', 'engaging', 'exciting', 'fresh', 'lively', 'stimulating', 'vibrant'], // tedious
  'telecommunications': ['isolation', 'silence'], // Telecommunications
  'temporal': ['endless'], // temporal
  'temporary': ['endless', 'endlessness', 'enduring', 'eternal', 'eternity', 'infinity', 'marble', 'permanent', 'perpetual', 'perpetuity', 'solidity', 'stable', 'statuary', 'timeless'], // temporary
  'tense': ['calm', 'chill', 'easy', 'gentle', 'laid-back', 'loose', 'mellow', 'quiet', 'reassuring', 'relaxed', 'smooth', 'soft'], // tense
  'tension': ['breeze', 'editorial', 'equilibrium', 'harmony', 'levity', 'relaxation'], // Tension
  'tentativeness': ['decisive'], // tentativeness
  'terrain': ['abstract', 'artificial', 'civilized', 'cultivated', 'flat', 'ordered', 'sky', 'smooth', 'structured', 'urban', 'void', 'water'], // Terrain
  'terrestrial': ['aether', 'alien', 'astral', 'astronomical', 'celestial', 'cosmic', 'ethereal', 'heavenly', 'lunar', 'marine', 'planetary', 'stellar', 'yachting'], // Terrestrial
  'text': ['authoritative', 'corporate', 'gesture', 'layout', 'premium', 'saas'], // Text
  'textile': ['electronics', 'plastic'], // Textile
  'textual': ['pictorial'], // Textual
  'textuality': ['nonverbal'], // textuality
  'textural': ['flat', 'minimal', 'plain', 'sleek', 'smooth'], // Textural
  'texture': ['editorial', 'flattening', 'harmony'], // Texture
  'textured': ['flat', 'glassy', 'plain', 'planar', 'slick', 'smoothness'], // textured
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
  'threshold': ['boundary', 'end', 'limit'], // Threshold
  'thrifty': ['wasteful'], // thrifty
  'thrill': ['heavy'], // Thrill
  'thrive': ['dead', 'decay', 'decline', 'drown', 'dull', 'fail', 'halt', 'harm', 'husk', 'shrivel', 'stagnate', 'starve', 'static', 'struggle', 'wilt', 'wither'], // Thrive
  'thriving': ['desolate', 'tarnished', 'withering'], // thriving
  'thunders': ['calm', 'dull', 'flat', 'gentle', 'quiet', 'soft', 'static', 'subtle', 'whispers'], // thunders
  'tidy': ['disarrayed', 'disheveled', 'disorganized', 'mess', 'messy'], // tidy
  'tiered': ['flat', 'single', 'uniform'], // Tiered
  'tight': ['extraneous', 'loose', 'loosen', 'porous', 'spread'], // tight
  'tightened': ['calm', 'connected', 'easy', 'fluid', 'gentle', 'loosened', 'relaxed', 'smooth', 'unraveled'], // Tightened
  'time': ['eternity', 'stasis', 'timelessness'], // Time
  'timeless': ['disposable', 'ephemeral', 'faddish', 'fleeting', 'modern', 'momentary', 'seasons', 'temporary', 'transient', 'trend'], // Timeless
  'timelessness': ['chronos', 'ephemeral', 'fleeting', 'time', 'transient'], // Timelessness
  'timeline': ['composition', 'contrast'], // Timeline
  'timely': ['obsolete'], // timely
  'timid': ['assertive', 'bold', 'brave', 'confident', 'dynamic', 'energetic', 'loud', 'vivid'], // timid
  'timidity': ['assertiveness', 'valor'], // timidity
  'tiny': ['colossal', 'enormous', 'gargantuan', 'huge', 'immense', 'massive', 'scale', 'tremendous', 'vast'], // tiny
  'tired': ['active', 'alert', 'dynamic', 'energized', 'lively', 'refreshed', 'vibrant', 'youthfulness'], // tired
  'tiring': ['energizing', 'engaging', 'exciting', 'invigorating', 'refreshing', 'stimulating'], // tiring
  'togetherness': ['alienation', 'detachment', 'disconnection', 'distance', 'disunity', 'division', 'isolation', 'loneliness', 'segregation', 'separation', 'solitude'], // togetherness
  'tones': ['complementary', 'coolness', 'mute'], // Tones
  'tools': ['jewelry'], // Tools
  'top': ['base', 'below', 'bottom', 'down', 'low', 'lower'], // Top
  'topography': ['flat', 'linear', 'simple', 'smooth', 'uniform'], // Topography
  'torment': ['bliss', 'calm', 'comfort', 'ease', 'harmony', 'joy', 'peace', 'serenity'], // torment
  'torpor': ['vigor'], // torpor
  'total': ['partial'], // total
  'touched': ['untouched'], // touched
  'toxic': ['clean', 'clear', 'eco-tech', 'fresh', 'healthy', 'natural', 'pure', 'safe', 'wholesome'], // toxic
  'toxin': ['beverage'], // Toxin
  'trace': ['conceal', 'erase', 'obscure'], // Trace
  'tradition': ['counterculture', 'future', 'invention', 'nonconformity', 'reinvention'], // tradition
  'traditional': ['brutalist', 'conceptual', 'cryptocurrency', 'deconstructivism', 'deeptech', 'digitalization', 'disruptive', 'edtech', 'faddish', 'fintech', 'gamified', 'glassmorphism', 'informal', 'innovative', 'irreverent', 'modern', 'new', 'novel', 'offbeat', 'postdigital', 'rebel', 'retrofuturism', 'streetwear', 'techno', 'techno-futurism', 'techwear', 'vanguard', 'wacky'], // Traditional
  'trajectory': ['inertia', 'pause', 'rest', 'stasis', 'stillness'], // Trajectory
  'tranquil': ['agitated', 'din', 'frantic', 'frenzied', 'frenzy', 'murky'], // tranquil
  'tranquility': ['agitation', 'anguish', 'cacophony', 'chaos', 'discomfort', 'disorder', 'draining', 'dynamism', 'hassle', 'panic', 'stress', 'tumult', 'turmoil', 'whirlwind'], // Tranquility
  'transcendence': ['base', 'geology', 'mundane', 'ordinary'], // Transcendence
  'transcendent': ['chthonic'], // transcendent
  'transformation': ['constancy', 'fixity', 'stagnation', 'uniformity'], // Transformation
  'transience': ['constancy', 'endurance', 'legacy', 'permanence', 'perpetuity', 'persistence', 'stability', 'substance'], // Transience
  'transient': ['archival', 'artifact', 'enduring', 'eternal', 'eternity', 'fixed', 'lingering', 'permanent', 'perpetual', 'root', 'rooted', 'stable', 'static', 'statuary', 'timeless', 'timelessness', 'unchanging'], // Transient
  'transit': ['heavy', 'rooted'], // Transit
  'transition': ['unchanged'], // transition
  'transitory-experience': ['perpetual'], // transitory-experience
  'transitory-visuals': ['steadfast'], // transitory-visuals
  'translucency': ['dense', 'heavy', 'opaque', 'solid', 'sturdy', 'thick'], // Translucency
  'translucent': ['dense', 'opaque', 'solid', 'stone'], // Translucent
  'transparency': ['clutter', 'concealed', 'discretion', 'disguise', 'distrust', 'encasement', 'facade', 'fog', 'haze', 'mist', 'nocturn', 'obscurity', 'opacity', 'shield', 'shroud'], // Transparency
  'transparent': ['concealing', 'covert', 'deceptive', 'fibrous', 'fluid', 'fraudulent', 'graphite', 'insincere', 'investigative', 'opaque', 'private', 'shrouded'], // Transparent
  'travel': ['boarding', 'cool', 'coolness'], // Travel
  'treasure': ['waste'], // treasure
  'tremendous': ['tiny'], // tremendous
  'trend': ['obsolete', 'static', 'timeless'], // Trend
  'trendsetting': ['following', 'imitation', 'outdated'], // Trendsetting
  'trendy': ['ancient', 'historical'], // trendy
  'triadic': ['cool', 'coolness'], // Triadic
  'trim': ['frumpy'], // trim
  'triumph': ['failure', 'heavy'], // Triumph
  'triumphant': ['defeated'], // triumphant
  'trivial': ['complex', 'elevated', 'epic', 'important', 'meaning', 'meaningful', 'monumental', 'profound', 'rich', 'significant', 'sublime', 'valuable'], // trivial
  'triviality': ['grandeur', 'gravitas', 'immensity', 'significance'], // triviality
  'truce': ['war'], // truce
  'true': ['fake', 'false', 'fictional', 'insincere'], // true
  'trust': ['corruption', 'deceit', 'disguise', 'distrust', 'doubt', 'doubting', 'fear', 'guilt', 'malice', 'scorn', 'warning'], // trust
  'trusting': ['doubtful'], // trusting
  'trustworthy': ['corrupt', 'deceit', 'deceptive', 'dishonest', 'distrust', 'fraudulent', 'insincere', 'shifty', 'unreliable'], // Trustworthy
  'truth': ['ambiguity', 'artifice', 'deceit', 'deception', 'denial', 'disillusion', 'fable', 'facade', 'falsehood', 'illusion', 'illusory', 'impression', 'misrepresentation', 'myth', 'mythos', 'paradox', 'simulacrum'], // Truth
  'tubular': ['angular', 'blocky', 'flat', 'linear', 'rigid', 'solid'], // Tubular
  'tumult': ['calm', 'clarity', 'harmonious-order', 'harmony', 'order', 'serenity', 'simplicity', 'structure', 'tranquility'], // tumult
  'tunnel': ['brightness', 'expansion', 'exposure', 'openness', 'surface'], // Tunnel
  'turbulence': ['calm', 'order', 'peace', 'stability', 'stillness'], // turbulence
  'turmoil': ['balance', 'calm', 'composure', 'harmony', 'order', 'peace', 'relaxation', 'serenity', 'stability', 'tranquility'], // turmoil
  'twilight': ['dawn'], // twilight
  'twist': ['clear', 'flat', 'linear', 'rectangle', 'rigid', 'simple', 'static', 'straight', 'uniform'], // twist
  'twisted': ['clear', 'directness', 'flat', 'linear', 'orderly', 'plain', 'simple', 'smooth', 'straight'], // twisted
  'type': ['authoritative', 'corporate'], // Type
  'typecraft': ['amateur', 'automation', 'chaos', 'default', 'disorder', 'generative', 'generic', 'ignorance', 'mess', 'random', 'simplicity'], // Typecraft
  'typed': ['handwritten'], // typed
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
  'unadorned-truth': ['fabricated'], // unadorned-truth
  'unanchored': ['anchored'], // unanchored
  'unappealing': ['alluring', 'attractive', 'captivating'], // unappealing
  'unassuming': ['imposing', 'pretentious'], // unassuming
  'unattainable': ['achievable', 'obtainable', 'reachable'], // unattainable
  'unaware': ['awake', 'awakening', 'perceptive'], // unaware
  'unbalanced': ['centered'], // unbalanced
  'unblemished': ['scratched'], // unblemished
  'unblock': ['lock'], // unblock
  'unbound': ['bind', 'bondage', 'bound', 'burdened', 'confined', 'confining', 'constrained', 'constraint', 'enclosed', 'limited', 'restricted', 'restrictive', 'rooted'], // unbound
  'unbounded': ['bottom', 'bounded', 'contained', 'editorial', 'harmony', 'regulated', 'restricted'], // Unbounded
  'unbroken': ['refraction'], // unbroken
  'uncertain': ['accept', 'cast', 'certain', 'charted', 'clear', 'concentrated', 'confident', 'conquer', 'constant', 'corner', 'decisive', 'definite', 'evident', 'explicit', 'fixed', 'fortified', 'identified', 'instant', 'labeled', 'obvious', 'outward', 'reassuring', 'remote', 'resolved', 'robust', 'settled', 'solidity', 'steady', 'straightforward'], // uncertain
  'uncertainty': ['approval', 'belief', 'captivity', 'certain', 'consensus', 'consequence', 'constancy', 'finality', 'fixity', 'fortitude', 'hopeful', 'resolve', 'safety', 'settle', 'stability', 'statement'], // uncertainty
  'unchanged': ['certain', 'chaotic', 'clear', 'colorful', 'dynamic', 'evolving', 'transition', 'variable', 'vibrant'], // unchanged
  'unchanging': ['changeable', 'dynamic', 'evolving', 'fluid', 'mutable', 'seasons', 'shift', 'shifting', 'transient', 'variable'], // unchanging
  'uncharted-terrain': ['charted'], // uncharted-terrain
  'unclear': ['explicit', 'obvious', 'reachable', 'specific'], // unclear
  'uncomfortable': ['pillow'], // uncomfortable
  'uncommon': ['common', 'everyday-eats', 'familiar', 'mainstream', 'ordinary', 'predictable', 'routine', 'standard', 'typical', 'usual'], // uncommon
  'unconfined': ['bound', 'confined', 'contained', 'fixed', 'formed', 'formulated-limits', 'gendered', 'limited', 'structured'], // unconfined
  'unconscious': ['conscious'], // unconscious
  'uncontrolled': ['cultivated', 'obedient'], // uncontrolled
  'uncooked': ['baked'], // uncooked
  'uncoordinated': ['synchronized'], // uncoordinated
  'uncover': ['cloak', 'conceal', 'cover', 'envelop', 'hide', 'mask', 'obscure', 'shelter', 'shield', 'shroud'], // uncover
  'uncovered': ['covered', 'shrouded'], // uncovered
  'undefended': ['armored'], // undefended
  'undefined': ['defined', 'definite', 'formed', 'ordered', 'structured'], // Undefined
  'under': ['above', 'header', 'higher', 'over', 'overlook', 'up', 'upper'], // under
  'underline': ['carousel', 'composition', 'ignore', 'overlook'], // Underline
  'understanding': ['ambiguity', 'confusion', 'disorder', 'ignorance', 'misunderstanding', 'ridicule'], // Understanding
  'understated': ['confident', 'cool', 'coolness', 'flashy', 'garish', 'gaudy', 'overwrought'], // Understated
  'understated-tranquility': ['clatter'], // understated-tranquility
  'understatement': ['exaggeration'], // understatement
  'understood': ['confused'], // understood
  'undocumented': ['annotation'], // Undocumented
  'undulating': ['fixed', 'flat', 'rigid', 'solid', 'stable', 'static', 'straight', 'uniform'], // Undulating
  'undulation': ['flat', 'rigid', 'static'], // Undulation
  'uneasy': ['calm', 'comfortable', 'confident', 'content', 'contented', 'easy', 'peaceful', 'relaxed', 'secure'], // uneasy
  'unembellished': ['stylization'], // Unembellished
  'uneven': ['balanced', 'consistent', 'even', 'harmonious', 'level', 'regular', 'round', 'seamless', 'slick', 'smooth', 'smoothness', 'steady', 'synchronized', 'uniform'], // uneven
  'unexpected': ['tainted'], // unexpected
  'unfamiliar': ['common', 'familiar', 'known', 'ordinary', 'relatable', 'standard', 'typical', 'usual'], // unfamiliar
  'unfashionable': ['watches'], // unfashionable
  'unfavor': ['favor'], // unfavor
  'unfeeling': ['empathetic'], // unfeeling
  'unfettered': ['bound', 'contained'], // unfettered
  'unfiltered': ['filtered'], // unfiltered
  'unfinished': ['finished', 'glazed'], // unfinished
  'unfinished-thought': ['resolved'], // unfinished-thought
  'unfit': ['capable'], // unfit
  'unfocus': ['fixation'], // unfocus
  'unfocused': ['clear', 'crisp', 'defined', 'distinct', 'focused', 'logical', 'precise', 'sharp', 'sports', 'vivid'], // unfocused
  'unfold': ['closed', 'hold'], // unfold
  'unfolded': ['folded'], // unfolded
  'unfolding': ['clamping', 'closing', 'compressing', 'concealing', 'confining', 'endgame', 'folding', 'narrowing', 'restricting'], // Unfolding
  'unformed': ['baked', 'bound', 'confined', 'defined', 'formed', 'organized', 'shaped', 'solid', 'structured'], // unformed
  'unfounded': ['based', 'bound', 'certain', 'confined', 'defined', 'established', 'founded', 'solid', 'structured'], // unfounded
  'ungendered': ['defined', 'gender', 'gendered', 'specific', 'structured'], // ungendered
  'ungrounded': ['bound', 'centered', 'defined', 'defined-space', 'fixed', 'grounded', 'rooted', 'secure', 'stable'], // ungrounded
  'unhappiness': ['euphoria'], // unhappiness
  'unhappy': ['pleased', 'satisfied'], // unhappy
  'unhealthy': ['healthy'], // Unhealthy
  'unhinged': ['calm', 'clear', 'familiar', 'grounded', 'ordinary', 'predictable', 'sane', 'simple', 'stable'], // unhinged
  'unhurried': ['burdened', 'chaotic', 'compressed', 'confined', 'fast', 'hasty', 'instant-delivery', 'rushed', 'urgent'], // unhurried
  'unified': ['broken', 'chaotic', 'clatter', 'confined', 'conflicted', 'discordant', 'disjointed', 'disorderly', 'dispersed', 'distributed', 'divided', 'fracture', 'fragmented', 'individual', 'interrupted', 'isolated', 'modular', 'partial', 'scattered', 'segmented', 'segregated', 'strata'], // Unified
  'uniform': ['artisanal', 'asymmetry', 'blotchy', 'boutique', 'brushstroke', 'brushwork', 'bump', 'bumpy', 'cellular', 'chaotic', 'chiaroscuro', 'cracked', 'deconstructivism', 'disparate', 'distinction', 'diverse', 'faceted', 'flaky', 'flicker', 'graded', 'grading', 'grained', 'granular', 'handwritten', 'hybrid', 'improvised', 'jagged', 'kaleidoscopic', 'mosaic', 'multi', 'oblique', 'offbeat', 'parallax', 'particulate', 'personalized', 'poly', 'random', 'reactive', 'rebel', 'relief', 'seasons', 'serpentine', 'shift', 'singular', 'speckled', 'splotchy', 'sprawl', 'squiggly', 'strata', 'subjective', 'tiered', 'topography', 'twist', 'undulating', 'uneven', 'unique', 'uniqueness', 'variable', 'variant', 'varied', 'xr'], // Uniform
  'uniform-brightness': ['flicker'], // uniform-brightness
  'uniformity': ['adaptability', 'anomaly', 'artistry', 'asymmetry', 'counterculture', 'creativity', 'customization', 'discovery', 'distinctness', 'diversity', 'editorial', 'emergence', 'fluke', 'harmony', 'idiosyncrasy', 'invention', 'jumble', 'lifestyle', 'localism', 'microcosm', 'nonconformity', 'paradox', 'pattern', 'plurality', 'reinvention', 'self-expression', 'transformation'], // Uniformity
  'unify': ['chaos', 'collapse', 'conflict', 'detach', 'disassemble', 'disorder', 'disrupt', 'dissonance', 'divide', 'fragment', 'layering', 'separate', 'split'], // unify
  'unifying': ['divisive'], // unifying
  'unimpeded': ['interference'], // Unimpeded
  'uninhibited': ['restrained'], // uninhibited
  'uninquisitive': ['investigative'], // Uninquisitive
  'uninspired': ['evocative'], // uninspired
  'uninspiring': ['alluring', 'stimulating'], // uninspiring
  'unintentional': ['involvement'], // unintentional
  'uninterrupted': ['bounded', 'chaotic', 'cluttered', 'confined', 'disrupted', 'fragmented', 'interrupted', 'restricted'], // uninterrupted
  'uninviting': ['bistro'], // uninviting
  'uninvolved': ['engaged'], // uninvolved
  'union': ['tear'], // union
  'unique': ['aggregate', 'banal', 'commodity', 'common', 'conform', 'everyday', 'factory', 'generic', 'impersonal', 'massproduced', 'mediocre', 'mundane', 'ordinary', 'pedestrian', 'plain', 'repetitive', 'standard', 'typical', 'ubiquitous', 'uniform'], // unique
  'uniqueness': ['average', 'common', 'conformity', 'generic', 'homogeneity', 'monoculture', 'mundane', 'ordinary', 'repetition', 'standard', 'typical', 'uniform'], // Uniqueness
  'unison': ['chaos', 'contrast', 'discord', 'dissonance', 'division', 'fractured-harmony', 'fragmentation', 'isolation', 'separation'], // Unison
  'unite': ['break', 'destroy', 'disband', 'disconnect', 'divide', 'fragment', 'isolate', 'scatter', 'separate', 'split'], // unite
  'united': ['divided', 'fragmented', 'isolated', 'separate'], // united
  'uniting': ['dissolving', 'dividing', 'obliterating'], // uniting
  'units': ['chaos', 'disorder', 'dispersal', 'fragmentation', 'indeterminacy'], // Units
  'unity': ['alienation', 'breakdown', 'complication', 'conflict', 'contradiction', 'contrast', 'curvature', 'deceit', 'deconstruction', 'destruction', 'disconnect', 'disempowerment', 'disorder', 'displeasure', 'dissipation', 'distance', 'disunity', 'divergence', 'duality', 'exile', 'exploitation', 'fragment', 'fragmentation', 'juxtaposition', 'mismatch', 'obliteration', 'particle', 'remnant', 'resistance', 'rupture', 'shunning', 'unruly', 'war'], // Unity
  'universal': ['subjective'], // universal
  'universality': ['exclusivity', 'subjectivity'], // universality
  'unknown': ['celebrity', 'certain', 'clear', 'defined', 'familiar', 'famous', 'identified', 'known', 'obvious', 'present', 'visible'], // unknown
  'unlabeled': ['annotation', 'labeled'], // Unlabeled
  'unleash': ['dull', 'empty', 'lack', 'mute', 'quiet', 'restrain', 'still', 'subdue'], // Unleash
  'unleashing': ['suppressing'], // unleashing
  'unlimited': ['finite', 'limit'], // unlimited
  'unlit': ['ignited', 'phosphor'], // unlit
  'unmark': ['branding'], // unmark
  'unmoved': ['active', 'affected', 'animated', 'dynamic', 'electrified', 'engaged', 'moved', 'responsive', 'stimulated'], // unmoved
  'unmoving': ['mobile'], // unmoving
  'unmuted': ['withholding'], // unmuted
  'unnoticed': ['fame', 'famous'], // unnoticed
  'unobservant': ['investigative'], // Unobservant
  'unplanned': ['deliberate', 'deliberate-composition', 'intentional', 'methodical', 'organized', 'planned', 'predictable', 'premeditated', 'scheduled', 'structured', 'systematic'], // unplanned
  'unpleasant': ['pleasant'], // unpleasant
  'unpredictable': ['approval', 'behavioral', 'planned', 'predetermined', 'predictable', 'rational', 'regression', 'scheduled'], // unpredictable
  'unprotected': ['guarded', 'shielded'], // unprotected
  'unravel': ['construct', 'weave'], // unravel
  'unraveled': ['tightened'], // unraveled
  'unreachable': ['obtainable', 'reachable'], // unreachable
  'unreal': ['fact'], // unreal
  'unrealistic': ['achievable'], // unrealistic
  'unreality': ['earth'], // unreality
  'unrefined': ['cgi', 'cosmetics', 'cultivated', 'post-process'], // unrefined
  'unreliable': ['certain', 'consistent', 'dependable', 'predictable', 'reliable', 'secure', 'steady', 'trustworthy'], // unreliable
  'unremarkable': ['dazzling', 'enchanting', 'exceptional'], // unremarkable
  'unresponsive': ['reactive'], // unresponsive
  'unrest': ['composure'], // unrest
  'unrestricted': ['contained', 'restricted', 'restrictive'], // unrestricted
  'unruly': ['authoritative', 'calm', 'compliant', 'controlled', 'gentle', 'harmony', 'obedient', 'orderly', 'peaceful', 'regulated', 'smooth', 'unity'], // unruly
  'unscripted': ['script'], // unscripted
  'unseen': ['advertising', 'apparent', 'appearing', 'exposed', 'visible'], // Unseen
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
  'uplifting': ['burdensome', 'despairing', 'dismal', 'draining', 'ominous'], // uplifting
  'uplifting-contrast': ['dreary'], // uplifting-contrast
  'upper': ['beneath', 'bottom', 'descend', 'footer', 'lower', 'under'], // Upper
  'uproarious': ['calm', 'dull', 'gentle', 'quiet', 'serene', 'still', 'subdued', 'tame', 'vulnerable-silence'], // uproarious
  'urban': ['botanical', 'coastal', 'cottagecore', 'environment', 'flora', 'interior', 'marine', 'natura', 'natural', 'nature', 'nautical', 'pastoral', 'quiet', 'remote', 'rural', 'solitary', 'terrain', 'wilderness'], // Urban
  'urban-distopia': ['utopia'], // urban-distopia
  'urgency': ['delay', 'heavy', 'slowness'], // Urgency
  'urgent': ['calm', 'complacency', 'delayed', 'leisurely', 'paused', 'slack', 'slow', 'unhurried'], // urgent
  'usable': ['impractical'], // usable
  'used': ['renew'], // used
  'useless': ['essential', 'functional', 'meaningful', 'practical-function', 'purposeful', 'reliable', 'significant', 'valuable', 'vibrant'], // useless
  'user-centric': ['alienated', 'detached', 'developer-centric', 'disconnected', 'impersonal', 'isolated', 'neglectful', 'product-centric', 'selfish', 'system-centric'], // User-Centric
  'usual': ['rare', 'uncommon', 'unfamiliar'], // usual
  'utilitarian': ['artistic', 'chaotic', 'cosmetics', 'extravagant', 'impractical', 'jewelry', 'ornate'], // Utilitarian
  'utility': ['aesthetics', 'futile', 'obsolescence', 'premium', 'yachting'], // Utility
  'utility-design': ['artless'], // utility-design
  'utility-driven': ['pointless'], // utility-driven
  'utopia': ['blight', 'chaos', 'despair', 'disorder', 'dystopia', 'failure', 'neglect', 'squalor', 'urban-distopia'], // Utopia
  'utopian': ['bleak', 'chaotic', 'desolate', 'dystopian', 'dystopic', 'grim'], // Utopian
  'utopic': ['dystopic'], // utopic
  'vacancy': ['active', 'alive', 'crowded', 'dynamic', 'filled', 'hotels', 'occupied', 'populated', 'potency', 'vibrant'], // vacancy
  'vacant': ['assertive', 'certain', 'complete', 'complete-manifestation', 'confident', 'filled', 'full', 'occupied', 'present'], // vacant
  'vacate': ['assert', 'clarify', 'commit', 'define', 'dwelling', 'engage', 'focus', 'integrate', 'occupy'], // vacate
  'vacillation': ['resolve'], // vacillation
  'vacuum': ['abundance', 'accumulation', 'certainty', 'chaos', 'clarity', 'context', 'fullness', 'presence', 'purity', 'tangibility'], // vacuum
  'vague': ['bounded', 'certain', 'charted', 'clear', 'concentrated', 'concrete', 'concreteness', 'decisive', 'definite', 'depictive', 'directness', 'distinct', 'exact', 'explicit', 'fixed', 'fixity', 'foreground', 'genuineness', 'hyperreal', 'identified', 'imprint', 'informative', 'labeled', 'logical', 'macro', 'meaning', 'outward', 'practical', 'precise', 'reachable', 'resolved', 'rooted', 'solid', 'solidify', 'solidity', 'specific', 'stable', 'storyful', 'straightforward', 'visible'], // vague
  'vagueness': ['definition', 'depiction', 'lucidity', 'sense'], // vagueness
  'valid': ['fake'], // valid
  'validated': ['unvalued'], // validated
  'validation': ['ridicule'], // validation
  'valley': ['summit'], // valley
  'valor': ['cowardice', 'doubt', 'fear', 'hesitation', 'insecurity', 'perceived-weakness', 'timidity', 'vulnerability', 'weakness'], // valor
  'valuable': ['futile', 'irrelevant', 'petty', 'pointless', 'trivial', 'useless', 'wasteful', 'worthless'], // valuable
  'value': ['damage', 'dismiss', 'disregard', 'insignificance', 'insipid', 'neglect', 'waste', 'worthless', 'worthlessness'], // Value
  'valued': ['dismissive', 'disposable', 'disregarded', 'ignored', 'unvalued'], // valued
  'valuing': ['devalue', 'disdainful', 'dismiss', 'disregard', 'ignore', 'neglect', 'overlook', 'reject'], // valuing
  'vanguard': ['common', 'conservative', 'conventional', 'mundane', 'ordinary', 'simple', 'stagnant', 'static', 'traditional'], // Vanguard
  'vanish': ['remain'], // vanish
  'vanishing': ['appearing', 'emerging', 'manifesting', 'perpetuity', 'solidifying'], // Vanishing
  'vapor': ['dense', 'solid', 'sturdy', 'weighty'], // Vapor
  'vapour': ['dense', 'solid', 'stiff'], // Vapour
  'variability': ['captivity', 'constancy', 'finality'], // variability
  'variable': ['consistent', 'constant', 'fixed', 'fixed-horizon', 'monolithic', 'predefined', 'predetermined', 'predictable', 'simple', 'stable', 'static', 'unchanged', 'unchanging', 'uniform'], // variable
  'variant': ['archetype', 'constant', 'fixed', 'monotonous', 'plain', 'simple', 'standard', 'static', 'uniform'], // variant
  'variation': ['archetype', 'repetition'], // variation
  'varied': ['earthen', 'emerald', 'mono', 'monolithic', 'monotonous', 'repetitive', 'uniform'], // Varied
  'variety': ['editorial', 'harmony', 'minimize', 'monoculture', 'monopoly', 'repetitive', 'sameness', 'singular'], // Variety
  'vary': ['repeat'], // vary
  'vast': ['confined', 'confining', 'diminutive', 'finite', 'insignificant', 'limit', 'limited', 'micro', 'minuscule', 'narrow', 'petty', 'small', 'tiny'], // Vast
  'vastness': ['closure', 'confinement', 'limitation', 'microcosm', 'narrowness', 'petiteness', 'restriction'], // Vastness
  'vector': ['ascii', 'illustration', 'led', 'pixel'], // Vector
  'vector-graphics': ['bitmap', 'pixel', 'raster'], // Vector Graphics
  'veil': ['unveiling'], // veil
  'veiled': ['blatant', 'clear', 'direct', 'exposed', 'open', 'open-crowns', 'plain', 'revealed', 'simple', 'visible'], // Veiled
  'veiling': ['clear', 'defined', 'direct', 'exposed', 'flat', 'revealing', 'revelation', 'sharp', 'simple'], // veiling
  'velocity': ['calm', 'pause', 'slowness', 'stasis', 'stillness'], // Velocity
  'velvet': ['brittle', 'coarse', 'harsh', 'rough', 'stiff'], // Velvet
  'veneration': ['apathy', 'aversion', 'contempt', 'disdain', 'dismissal', 'indifference', 'irreverence', 'neglect', 'scorn'], // veneration
  'veracity': ['falsehood'], // veracity
  'verbal': ['abstract', 'non-textual', 'nonverbal', 'silent', 'visual'], // verbal
  'verbosity': ['brevity', 'clarity', 'conciseness', 'simplicity'], // verbosity
  'verdant': ['barren', 'bleak', 'desolate', 'dry', 'sterile'], // Verdant
  'verisimilitude': ['stylization'], // Verisimilitude
  'vertex': ['base', 'flat', 'horizontal', 'low', 'pit'], // Vertex
  'vertical': ['diagonal', 'rows'], // vertical
  'verticality': ['flatness', 'groundedness', 'horizontality', 'levelness', 'stability'], // Verticality
  'viable': ['impractical'], // viable
  'vibrance': ['bleakness'], // vibrance
  'vibrancy': ['bleak', 'bleakness', 'boredom', 'coldness', 'dimness', 'drab', 'drudgery', 'dull', 'faded', 'gloom', 'lack', 'muted'], // Vibrancy
  'vibrant': ['apathetic', 'banal', 'barren', 'bland', 'bleak', 'blunt', 'bore', 'bored', 'boring', 'cool', 'coolness', 'darkmode', 'desolate', 'despairing', 'dismal', 'dispassionate', 'dormant', 'downcast', 'drab', 'drag', 'drain', 'drained', 'draining', 'dreary', 'dry', 'dull', 'dullard', 'expire', 'foul', 'glacial', 'halt', 'halted', 'haunting', 'idle', 'insipid', 'introverted', 'lame', 'lazy', 'lethargic', 'lifeless', 'mediocre', 'monochrome', 'monotonous', 'mundane', 'mute', 'muted', 'neumorphic', 'noir', 'null', 'obsolete', 'passive', 'pastel', 'paused', 'pedestrian', 'plain', 'ponderous', 'repellent', 'resigned', 'rusty', 'shrivel', 'sluggish', 'sober', 'somber', 'stale', 'sterile', 'stifled', 'stuffy', 'subduing', 'tarnished', 'tedious', 'tired', 'unchanged', 'useless', 'vacancy', 'weak', 'weary', 'wilt', 'withering'], // Vibrant
  'vibration': ['bland', 'dull', 'flat', 'inactive', 'lifeless', 'muted', 'quiet', 'still', 'stillness-tone'], // vibration
  'vice': ['innocence'], // vice
  'victorious': ['defeated'], // victorious
  'victory': ['collapse', 'defeat', 'failure', 'loss', 'setback', 'struggle', 'surrender', 'weakness'], // victory
  'video': ['frozen', 'illustration', 'led'], // Video
  'vigilance': ['carefree', 'complacency', 'negligence', 'relaxation'], // Vigilance
  'vigilant': ['complacent'], // vigilant
  'vigor': ['apathy', 'inertia', 'lethargy', 'sloth', 'stagnation', 'torpor', 'weakness'], // Vigor
  'vintage': ['futuristic', 'heavy', 'joy', 'modern', 'techwear'], // Vintage
  'violet': ['amber'], // violet
  'virtual': ['concrete', 'physical', 'reality', 'tangible'], // Virtual
  'virtualization': ['materiality', 'physicality', 'presence', 'tangibility'], // Virtualization
  'virtuous': ['corrupt'], // virtuous
  'visceral': ['heavy'], // Visceral
  'viscous': ['airy', 'clear', 'crisp', 'dry', 'fluid', 'gaseous', 'light', 'simple', 'smooth', 'solid', 'thin'], // Viscous
  'visibility': ['eclipse', 'erasure', 'obscurity', 'premium'], // Visibility
  'visible': ['blind', 'blurred', 'concealed', 'covert', 'dim', 'distant', 'erased', 'faint', 'false', 'forgotten', 'fugitive', 'hidden', 'hiding', 'invisible', 'isolating', 'masked', 'nowhere', 'obscure', 'obscured', 'obscuring', 'opaque', 'private', 'sealed', 'shrouded', 'subsurface', 'subtle', 'suppressed', 'unknown', 'unseen', 'vague', 'veiled'], // visible
  'vision': ['blindness', 'confusion', 'darkness', 'ignorance', 'obscurity'], // Vision
  'vista': ['confinement', 'narrowness', 'obscurity'], // Vista
  'visual': ['acoustic', 'verbal'], // visual
  'visualization': ['ambiguity', 'concealment', 'confusion', 'disorder', 'invisibility', 'obscurity'], // Visualization
  'vital': ['insignificant', 'lifeless'], // vital
  'vitality': ['blackout', 'blight', 'death', 'decay', 'deterioration', 'diminution', 'dormancy', 'fatigue', 'futility', 'husk', 'impotence', 'inertia', 'nonexist', 'obsolescence', 'pollution', 'ruin', 'stagnation'], // Vitality
  'vivid': ['artifact', 'blended', 'bokeh', 'cloudy', 'cold', 'colorless', 'cumbersome', 'dimming', 'dismissive', 'faceless', 'fading', 'faint', 'filtered', 'forgettable', 'frayed', 'frozen', 'grim', 'hushing', 'indistinct', 'matt', 'muffled', 'mute', 'nocturn', 'numb', 'ochre', 'ordinary', 'reserved', 'sameness', 'shallow', 'shrivel', 'tame', 'timid', 'unfocused', 'wash', 'washed', 'wither'], // vivid
  'vividness': ['bleak', 'darkness', 'dim', 'drab', 'dull', 'faded', 'fog', 'haze'], // Vividness
  'vocal': ['nonverbal'], // vocal
  'void': ['advertising', 'alive', 'atmosphere', 'aura', 'aurora', 'beacon', 'being', 'beverage', 'block', 'bubble', 'buzz', 'canvas', 'chronos', 'completion', 'conception', 'context', 'corner', 'corridor', 'cosmos', 'creation', 'cylinder', 'day', 'domain', 'dome', 'earth', 'echo', 'element', 'ember', 'energy', 'event', 'existence', 'expression', 'field', 'filled', 'flotilla', 'form', 'frame', 'full', 'fullness', 'genesis', 'gift', 'globe', 'horizon', 'impact', 'imprint', 'ingredients', 'life', 'manifesting', 'mass', 'materials', 'merchandise', 'microcosm', 'might', 'molecular', 'mosaic', 'museum', 'nebula', 'nucleus', 'object', 'origin', 'payments', 'peak', 'point', 'polyhedron', 'presence', 'present', 'publishing', 'pyramid', 'realm', 'richness', 'sculptural', 'shape', 'sky', 'solar', 'source', 'sticker', 'story', 'stratosphere', 'stratum', 'substance', 'summit', 'terrain', 'world'], // Void
  'void-spectrum': ['brilliant'], // void-spectrum
  'volatile': ['calm', 'consistent', 'dull', 'perpetual', 'predictable', 'quiet', 'reliability', 'reliable', 'slow', 'stable', 'steadfast', 'steady', 'stoic'], // volatile
  'volume': ['flat', 'flatness', 'flatten', 'flattening', 'fleshless', 'line', 'minimal', 'sparse', 'whisper'], // Volume
  'volumetrics': ['illustration', 'led'], // Volumetrics
  'voluminous': ['2d', 'planar'], // voluminous
  'vortex': ['calm', 'dispersal', 'flat', 'order', 'stillness'], // Vortex
  'voyage': ['inertia', 'pause', 'rest', 'stasis', 'stillness'], // Voyage
  'vr': ['realistic', 'static', 'tangible'], // VR
  'vulgar': ['academia', 'cultured', 'elegant', 'graceful', 'polished', 'refined', 'sightful', 'sophisticated', 'subtle', 'tasteful'], // vulgar
  'vulgarity': ['dignity'], // Vulgarity
  'vulnerability': ['armored', 'cybersecurity', 'defiant', 'fortitude', 'power', 'protection', 'resilience', 'safety', 'sanctuary', 'shelter', 'shield', 'shielded', 'strength', 'valor'], // Vulnerability
  'vulnerable': ['armored', 'confident', 'defended', 'fortified', 'guarded', 'protected', 'resilient', 'robust', 'secure', 'shielded', 'stoic', 'strong'], // vulnerable
  'vulnerable-silence': ['boisterous', 'raucous', 'uproarious'], // vulnerable-silence
  'vulnerable-space': ['fortified'], // vulnerable-space
  'wacky': ['conceptual-formalism', 'elegant', 'serious', 'simple', 'sophisticated', 'subdued', 'traditional'], // wacky
  'wander': ['anchor', 'arrive', 'focus', 'settle'], // wander
  'wandering': ['anchored', 'fixed', 'focused', 'settled', 'stationary'], // wandering
  'wanderlust': ['premium'], // Wanderlust
  'want': ['affluence', 'bounty', 'need'], // want
  'war': ['calm', 'cooperation', 'harmony', 'order', 'peace', 'serenity', 'truce', 'unity'], // war
  'warm': ['bitter', 'bleak', 'clinical', 'cold', 'cool', 'coolness', 'cyberpunk', 'distant', 'dramatic', 'frost', 'glacial', 'harsh', 'robotic', 'steel', 'sterile', 'stern'], // Warm
  'warmth': ['bleakness', 'coldness', 'cruelty', 'frost', 'glacial', 'impersonal'], // warmth
  'warning': ['assurance', 'benefit', 'calm', 'comfort', 'ease', 'freedom', 'invitation', 'reassurance', 'safety', 'security', 'trust'], // Warning
  'wash': ['chaotic', 'dark', 'harsh', 'messy', 'neat', 'saturation', 'sharp', 'stain', 'vivid'], // wash
  'washed': ['bold', 'indigo', 'intense', 'saturated', 'vivid'], // washed
  'waste': ['clean', 'conservation', 'eco-tech', 'economy', 'efficacy', 'food', 'ingredients', 'logistics', 'nourish', 'nourishment', 'produce', 'profit', 'renew', 'resource', 'stewardship', 'treasure', 'value'], // waste
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
  'weave': ['break', 'detach', 'disperse', 'tear', 'unravel'], // Weave
  'web': ['illustration', 'led'], // Web
  'weight': ['airiness', 'breeze', 'ease', 'float', 'levity', 'light', 'mirth', 'soft'], // weight
  'weighted': ['flippant', 'weightless'], // weighted
  'weightiness': ['airiness', 'freeness', 'levity'], // weightiness
  'weightless': ['anchored', 'burdened', 'grounded', 'heavy', 'weighted'], // Weightless
  'weighty': ['airy', 'delicate', 'feathery', 'fluid', 'light', 'sheer', 'soft', 'subtle', 'thin', 'vapor'], // Weighty
  'welcome': ['dismiss', 'expulsion', 'heavy', 'rejecting', 'resign', 'shunning'], // Welcome
  'welcoming': ['cool', 'coolness', 'repellent', 'repelling'], // Welcoming
  'welfare': ['premium'], // Welfare
  'well-being': ['distress', 'hardship', 'illness', 'misery', 'pain', 'suffering'], // Well-being
  'wellbeing': ['pain', 'professional'], // Wellbeing
  'wet': ['arid', 'dry', 'heat'], // wet
  'whimsical': ['melancholy'], // Whimsical
  'whimsical-flow': ['boring'], // whimsical-flow
  'whimsy': ['analysis', 'heavy'], // Whimsy
  'whirlwind': ['calm', 'certainty', 'chronicle', 'order', 'predictability', 'solidity', 'stability', 'stillness', 'tranquility'], // whirlwind
  'whisper': ['blare', 'chaos', 'clutter', 'expose', 'loud', 'mess', 'noise', 'scream', 'shout', 'shouting', 'volume'], // whisper
  'whispered': ['shouted'], // whispered
  'whispered-shades': ['shouted'], // whispered-shades
  'whispering': ['screaming'], // whispering
  'whispers': ['blasts', 'roars', 'shouts', 'thunders'], // whispers
  'whole': ['aftermath', 'broken', 'chipped', 'cracked', 'divided', 'dividing', 'divisive', 'folded', 'fracture', 'fragment', 'incomplete', 'modular', 'part', 'partial', 'particle', 'piece', 'remnant', 'scattered', 'scrap', 'section', 'segmented', 'segregated', 'tear'], // whole
  'wholeness': ['breakdown', 'damage', 'detachment', 'disempowerment', 'disorder', 'dispersal', 'duality', 'fragmentation', 'glimpse', 'incompleteness', 'obliteration', 'pollution', 'ruin', 'rupture', 'scrap', 'shatter', 'split'], // Wholeness
  'wholesale': ['boutique'], // Wholesale
  'wholesome': ['brutal', 'cluttered', 'dislike', 'disorder', 'dreary', 'toxic'], // Wholesome
  'wickedness': ['innocence'], // wickedness
  'wide': ['pointed', 'slender', 'thin'], // wide
  'width': ['narrowness'], // width
  'wild': ['calm', 'controlled', 'cultivated', 'dentistry', 'formality', 'normal', 'obedient', 'orderly', 'predictable', 'regulated', 'restrained', 'rooted', 'sober', 'structured', 'tame'], // Wild
  'wilderness': ['boarding', 'civilization', 'cultivated', 'domestication', 'order', 'structure', 'urban'], // Wilderness
  'wilt': ['alive', 'bloom', 'flourish', 'fresh', 'grow', 'prosper', 'thrive', 'vibrant'], // wilt
  'wind': ['calm', 'stagnation', 'stillness'], // Wind
  'wine': ['beer', 'bitter', 'grain', 'non-alcoholic', 'soda', 'synthetics', 'water'], // Wine
  'winery': ['chaos', 'destruction', 'digital', 'factory', 'mining', 'poverty', 'service', 'software'], // Winery
  'winning': ['defeated'], // winning
  'wire': ['airy', 'fabric', 'flexible', 'fluid', 'light', 'loose', 'natural', 'smooth', 'soft', 'solid', 'wood'], // Wire
  'wisdom': ['fleshless', 'foolishness', 'ignorance', 'naivety', 'stupidity'], // wisdom
  'wise': ['foolish'], // wise
  'withdrawal': ['penetration', 'recruitment'], // withdrawal
  'wither': ['bloom', 'expand', 'flourish', 'germination', 'grow', 'prosper', 'radiate', 'thrive', 'vivid'], // wither
  'withering': ['blooming', 'flourishing', 'growing', 'growth', 'lively', 'prospering', 'radiant', 'thriving', 'vibrant'], // withering
  'withhold': ['yield'], // withhold
  'withholding': ['embracing', 'expressing', 'free', 'full', 'giving', 'open', 'revealing', 'sharing', 'unmuted'], // withholding
  'within': ['beyond'], // Within
  'wobbly': ['definite', 'firm', 'fixed', 'rigid', 'solid', 'stable', 'straight', 'straight-dynamics', 'straightforward'], // wobbly
  'wonder': ['heavy', 'playful'], // Wonder
  'wood': ['concrete', 'fabric', 'glass', 'metal', 'plastic', 'wire'], // Wood
  'work': ['freetime', 'hobby', 'leisure', 'rest'], // work
  'world': ['bubble', 'chaos', 'isolation', 'void'], // World
  'worldliness': ['naivety'], // worldliness
  'worldly': ['naive'], // worldly
  'worn': ['fresh', 'freshness', 'new', 'pristine', 'renew', 'smooth', 'spotless', 'sterile', 'untouched', 'youthfulness'], // Worn
  'worthless': ['beneficial', 'essential', 'impactful', 'important', 'meaningful', 'purposeful', 'significant', 'valuable', 'value'], // worthless
  'worthlessness': ['value'], // worthlessness
  'woven': ['bare', 'flat', 'plain', 'rigid', 'smooth'], // Woven
  'wrought': ['basic', 'natural', 'plain', 'raw', 'simple'], // Wrought
  'xr': ['analog', 'chaotic', 'dull', 'flat', 'manual', 'mundane', 'ordinary', 'physical', 'simple', 'static', 'uniform'], // XR
  'y2k': ['gentle', 'grainy', 'solid'], // Y2K
  'yachting': ['basic', 'common', 'dull', 'fixed', 'industrial', 'land', 'mass', 'mundane', 'simple', 'stationary', 'terrestrial', 'utility'], // Yachting
  'yearning': ['completion', 'contentment', 'fulfillment', 'satisfaction'], // Yearning
  'yield': ['hold', 'refuse', 'resist', 'stagnate', 'withhold'], // Yield
  'yielding': ['bare', 'coarse', 'crude', 'defiant', 'hard', 'harsh', 'plain', 'rigid', 'stiff', 'unadorned'], // yielding
  'youth': ['aged', 'modernity', 'obsolete', 'retrofuture', 'stale'], // Youth
  'youthfulness': ['aged', 'antiquity', 'dull', 'formality', 'maturity', 'old', 'seriousness', 'stale', 'static', 'tired', 'weary', 'worn'], // Youthfulness
  'zeal': ['apathy', 'boredom', 'complacency', 'disinterest', 'dullness', 'indifference', 'laziness', 'lethargy'], // zeal
  'zen': ['aggression', 'chaos', 'clutter', 'disorder', 'noise'], // Zen
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