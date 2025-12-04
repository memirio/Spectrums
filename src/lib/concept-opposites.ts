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
  '3d-printed': ['handcrafted', 'traditional'], // 3D-Printed
  '3d-rendering': ['2d', 'abstract', 'flat', 'minimal', 'static'], // 3D Rendering
  'abandon': ['attachment', 'catering', 'childcare', 'commitment', 'connection', 'demand', 'embrace', 'engagement', 'healthcare', 'hotels', 'inclusion', 'journey', 'nurture', 'nurturing', 'ownership', 'presence', 'pursuit', 'remain', 'stewardship', 'support'], // abandon
  'abandonment': ['adoption', 'advertising', 'attachment', 'awareness', 'commitment', 'connection', 'cultivation', 'engagement', 'focus', 'inclusion', 'presence', 'preservation', 'protection', 'shelter', 'sustenance'], // abandonment
  'abnormal': ['normal', 'normalcy'], // Abnormal
  'abound': ['deplete'], // Abound
  'above': ['below', 'bottom', 'down', 'lower', 'under'], // Above
  'abrasive': ['plush'], // abrasive
  'abrupt': ['gradual'], // Abrupt
  'absence': ['abundance', 'advertising', 'beacon', 'being', 'canvas', 'clarity', 'completeness', 'completion', 'earth', 'echo', 'element', 'event', 'existence', 'field', 'fullness', 'gift', 'horology', 'impact', 'imprint', 'ingredients', 'involvement', 'marketing', 'materials', 'merchandise', 'metaverse', 'might', 'museum', 'nucleus', 'object', 'observation', 'origin', 'peak', 'point', 'presence', 'present', 'pressure', 'publishing', 'recruitment', 'source', 'story', 'substance', 'summit'], // Absence
  'absent': ['appearing', 'attentive', 'available', 'aware', 'connected', 'engaged', 'engaged-presence', 'existent', 'involved', 'present'], // Absent
  'absolute': ['partial'], // Absolute
  'absorb': ['cast', 'emit', 'splash'], // Absorb
  'absorbent': ['dry', 'emissive', 'glossy', 'hard', 'impermeable', 'repellent', 'sealed', 'slick', 'smooth'], // absorbent
  'absorption': ['detachment', 'dispersal', 'dispersion', 'emission', 'exclusion', 'expulsion', 'reflectivity', 'refraction', 'rejection'], // Absorption
  'abstinence': ['consumption'], // Abstinence
  'abstract': ['3d-rendering', 'animalism', 'annotation', 'biographical', 'concreteness', 'depictive', 'earthiness', 'edutainment', 'embodiment', 'engineering', 'experiential', 'figurative', 'folk', 'foreground', 'geology', 'hyperreal', 'mineral', 'molecular', 'naturalistic', 'obtainable', 'pictorial', 'practical', 'relatable', 'roots', 'solidity', 'tangibility', 'terrain', 'verbal'], // Abstract
  'abstract-non-narrative': ['storyful'], // Abstract-Non-Narrative
  'abstracted': ['specific'], // Abstracted
  'abstraction': ['concrete', 'defined', 'literal', 'skeuomorphism', 'specific', 'tangible'], // Abstraction
  'absurdity': ['clarity', 'meaning', 'order', 'sense'], // Absurdity
  'abundance': ['absence', 'deficiency', 'depletion', 'deprivation', 'hunger', 'insufficiency', 'lack', 'poverty', 'reduction', 'scarcity', 'sparsity', 'starve', 'strife', 'thirst', 'vacuum'], // Abundance
  'abundant': ['barren', 'meager', 'mono', 'rare'], // Abundant
  'abyss': ['clarity', 'light', 'summit'], // Abyss
  'academia': ['casual', 'chaos', 'disorder', 'foolish', 'impractical', 'informal', 'naive', 'primitive', 'spontaneity', 'vulgar'], // Academia
  'academic': ['childcare', 'edutainment'], // Academic
  'acausal': ['consequence'], // Acausal
  'acceleration': ['deceleration', 'slowness', 'stagnation'], // Acceleration
  'accent': ['base', 'minimal', 'neutral', 'plain', 'subdued'], // Accent
  'accept': ['aspire', 'confront', 'deny', 'disagree', 'dislike', 'dismiss', 'doubt', 'neglect', 'refuse', 'reject', 'resign', 'uncertain'], // Accept
  'acceptance': ['denial', 'disapproval', 'dismissal', 'doubting', 'exile', 'expulsion', 'negation', 'resistance', 'ridicule', 'shame', 'shunning'], // Acceptance
  'accepting': ['rejecting'], // Accepting
  'access': ['barrier', 'denial', 'deprivation', 'exclusion', 'lock', 'obstacle', 'obstruction', 'restriction'], // Access
  'accessibility': ['exclusivity'], // accessibility
  'accessible': ['arduous', 'cloistered', 'cluttered', 'complex', 'distant', 'exclusive', 'guarded', 'inaccessible', 'obscured', 'premium', 'private'], // Accessible
  'accord': ['conflict'], // Accord
  'accordion': ['flat', 'open', 'static'], // Accordion
  'accountability': ['irresponsibility', 'negligence'], // Accountability
  'accumulation': ['decline', 'detachment', 'dispersal', 'dissipation', 'obliteration', 'reduction', 'vacuum'], // Accumulation
  'accuracy': ['mismatch'], // Accuracy
  'achievable': ['impossible', 'inaccessible', 'unattainable', 'unrealistic'], // Achievable
  'achievement': ['failure'], // Achievement
  'achromatic': ['chromatic'], // achromatic
  'acknowledge': ['dismiss', 'disregard', 'forget', 'ignore'], // Acknowledge
  'acknowledged': ['disregarded', 'ignored'], // Acknowledged
  'acknowledgment': ['denial'], // Acknowledgment
  'acoustic': ['digital', 'mechanical', 'silent', 'static', 'visual'], // Acoustic
  'acridity': ['sweetness'], // Acridity
  'action': ['hesitation', 'passivity', 'reflection', 'rest', 'sloth', 'stillness', 'suspension'], // Action
  'activating': ['dormant', 'inert', 'lethargic', 'lethargy', 'passive', 'quiet', 'sluggish', 'static', 'still'], // Activating
  'active': ['aimless', 'bored', 'chill', 'complacent', 'defeated', 'delay', 'delayed', 'disinterested', 'dormant', 'expire', 'frozen', 'glacial', 'halt', 'halted', 'hushing', 'idle', 'inactive', 'laziness', 'lazy', 'lethargic', 'null', 'obsolete', 'passive', 'paused', 'reserved', 'resigned', 'rest', 'slack', 'slacker', 'sluggish', 'static', 'stop', 'stopped', 'tired', 'unmoved', 'vacancy', 'weary'], // Active
  'activity': ['dormancy', 'evening', 'idleness', 'inactivity', 'passive', 'passivity', 'silence', 'slowness', 'stagnation', 'stillness'], // Activity
  'actual': ['fictional', 'retrofuturism'], // Actual
  'adaptability': ['constancy', 'inflexibility', 'monotony', 'rigidity', 'sameness', 'stagnation', 'uniformity'], // Adaptability
  'adaptable': ['backward'], // Adaptable
  'adaptation': ['fixation', 'premium', 'resistance'], // Adaptation
  'adding': ['erasing'], // Adding
  'admiration': ['detached', 'disapproval', 'disdain', 'dislike', 'disregard', 'ridicule', 'scorn'], // Admiration
  'admire': ['disapproval', 'dislike', 'dismissive', 'disorder', 'negative'], // Admire
  'admiring': ['apathy', 'contempt', 'disdain', 'disdainful', 'dismissal', 'indifference', 'neglect'], // Admiring
  'adopt': ['dismiss', 'refuse', 'reject', 'resist'], // Adopt
  'adoption': ['abandonment', 'detachment', 'disconnection', 'isolation', 'rejection'], // Adoption
  'adorned': ['minimalistic', 'naked', 'plain', 'sparse'], // Adorned
  'adult': ['babyproducts', 'childlike', 'children-s'], // Adult
  'adult-services': ['childcare'], // Adult-Services
  'adulthood': ['childhood'], // adulthood
  'adulting': ['carefree', 'casual', 'childhood', 'fun', 'messy', 'naive', 'simple', 'spontaneous'], // adulting
  'advance': ['hinder', 'past', 'regress', 'retreat', 'stuck'], // Advance
  'advanced': ['amateur', 'primitive'], // Advanced
  'advancement': ['backward', 'decline', 'deterioration', 'regression', 'retrogression', 'stagnation'], // Advancement
  'adventurous': ['boring', 'cautious', 'dull', 'mundane', 'predictable', 'routine', 'safe', 'static'], // Adventurous
  'advertising': ['abandonment', 'absence', 'disregard', 'distraction', 'ignored', 'invisibility', 'neglect', 'silence', 'unseen', 'void'], // Advertising
  'advocacy': ['neglect', 'opposition'], // Advocacy
  'aerial': ['concealed', 'grounded', 'root', 'submerged'], // Aerial
  'aero': ['cluttered', 'dense', 'grounded', 'heavy', 'solid'], // Aero
  'aerodynamic': ['awkward', 'boxy', 'bulky', 'clunky', 'cumbersome', 'heavy', 'inefficient', 'rough', 'slow', 'stagnant', 'unwieldy'], // Aerodynamic
  'aerospace': ['marine'], // Aerospace
  'aesthetic': ['grotesque'], // Aesthetic
  'aesthetics': ['basic', 'blandness', 'chaos', 'clutter', 'disorder', 'dullness', 'functionality', 'gritty', 'messiness', 'practicality', 'ugliness', 'utility'], // Aesthetics
  'aether': ['chaos', 'dull', 'earth', 'gloom', 'heaviness', 'mundane', 'solid', 'sorrow', 'terrestrial'], // Aether
  'affected': ['unmoved'], // Affected
  'affection': ['alienation', 'aloof', 'aversion', 'detachment', 'disapproval', 'dislike', 'dismissive', 'distrust', 'scorn', 'shunning'], // Affection
  'affirm': ['deny', 'disapproval', 'dislike', 'refute', 'reject', 'rejecting'], // Affirm
  'affirmation': ['doubting', 'negation'], // Affirmation
  'affirmative': ['delay', 'disapproval', 'dismissive'], // Affirmative
  'affluence': ['deprivation', 'dirt', 'lack', 'need', 'poverty', 'scarcity', 'want'], // Affluence
  'aftermath': ['beginning', 'clear', 'fresh', 'intact', 'new', 'origin', 'pure', 'whole'], // Aftermath
  'aged': ['youth', 'youthfulness'], // Aged
  'agency': ['detachment', 'disempowerment', 'inactivity', 'passivity', 'subordination'], // Agency
  'aggregate': ['dispersed', 'distinct', 'fragmented', 'individual', 'isolated', 'scattered', 'segregated', 'specific', 'unique'], // Aggregate
  'aggression': ['zen'], // aggression
  'aggressive': ['ambient', 'calm', 'chill', 'feminine', 'gentle', 'passive', 'peaceful', 'serene', 'soft'], // Aggressive
  'agitated': ['calm', 'chill', 'easy', 'gentle', 'mellow', 'peaceful', 'relaxed', 'serene', 'smooth', 'tranquil'], // agitated
  'agitation': ['calm', 'complacent-serenity', 'composure', 'ease', 'peace', 'quiet', 'relaxation', 'rest', 'serenity', 'stillness', 'tranquility'], // Agitation
  'agony': ['bliss', 'calm', 'comfort', 'ease', 'happiness', 'joy', 'peace', 'serenity'], // Agony
  'agree': ['resign'], // Agree
  'agreeable': ['defiant'], // Agreeable
  'agreement': ['conflict', 'contradiction', 'disapproval', 'disunity', 'resistance'], // Agreement
  'agriculture': ['aquaculture', 'manufacturing'], // Agriculture
  'ai': ['chaotic', 'human', 'intuitive', 'natural', 'organic'], // AI
  'aimless': ['active', 'aware', 'bright', 'clear', 'engaged', 'focused', 'intent', 'intentional', 'purposeful'], // Aimless
  'aimlessness': ['purpose'], // aimlessness
  'aion': ['chronos'], // aion
  'airiness': ['density', 'heaviness', 'mass', 'solid', 'weight', 'weightiness'], // Airiness
  'airy': ['blocky', 'boxy', 'concrete', 'confining', 'constrict', 'viscous', 'weighty', 'wire'], // Airy
  'album': ['live', 'single'], // Album
  'alcohol': ['non-alcoholic', 'sobriety'], // Alcohol
  'alert': ['apathetic', 'blind', 'complacent', 'dormant', 'hypnotic', 'oblivious', 'shallow', 'sluggish', 'tired'], // Alert
  'alertness': ['drowsiness', 'lethargy'], // Alertness
  'algorithm': ['chaos', 'imprecision', 'intuition', 'spontaneity', 'subjectivity'], // Algorithm
  'alien': ['common', 'earthiness', 'earthy', 'familiar', 'friendly', 'local', 'mundane', 'native', 'ordinary', 'relatable', 'terrestrial'], // Alien
  'alienated': ['embraced', 'genuineness', 'user-centric'], // Alienated
  'alienation': ['affection', 'attachment', 'belonging', 'closeness', 'connect', 'connection', 'embrace', 'empathy', 'engagement', 'fandom', 'hospitality', 'humanism', 'inclusion', 'inclusivity', 'intimacy', 'togetherness', 'unity'], // Alienation
  'align': ['chaos', 'disarray', 'disorder', 'disrupt', 'diverge', 'random', 'scatter', 'separate', 'split'], // Align
  'aligned': ['disparate', 'tangle'], // Aligned
  'alignment': ['conflict', 'detachment', 'disorder', 'dispersal', 'mismatch'], // Alignment
  'alive': ['dead', 'defeated', 'despairing', 'dormant', 'drained', 'dry', 'empty', 'glacial', 'haunting', 'hollow', 'inactive', 'lifeless', 'numb', 'shrivel', 'stagnant', 'vacancy', 'void', 'wilt'], // alive
  'alluring': ['bland', 'dull', 'garish', 'mundane', 'repulsive', 'tacky', 'unappealing', 'uninspiring'], // Alluring
  'aloof': ['affection', 'approachable', 'empathetic', 'engaged'], // Aloof
  'altered': ['untouched'], // Altered
  'alternative': ['mainstream'], // Alternative
  'altruism': ['greed'], // Altruism
  'amateur': ['advanced', 'competent', 'expert', 'masterful', 'polished', 'professional', 'refined', 'skilled', 'technic', 'typecraft', 'watchmaking'], // Amateur
  'amber': ['blue', 'cyan', 'green', 'indigo', 'violet'], // Amber
  'ambient': ['aggressive', 'chaotic', 'harsh', 'intense', 'jarring'], // Ambient
  'ambiguity': ['annotation', 'assertion', 'context', 'definition', 'depiction', 'distinctness', 'flowchart', 'gesture', 'insight', 'integrity', 'interpretation', 'meaning', 'measure', 'objectivity', 'outlining', 'principle', 'resolve', 'revelation', 'sense', 'statement', 'truth', 'understanding', 'visualization'], // Ambiguity
  'ambiguous': ['certain', 'charted', 'decisive', 'definite', 'distinct', 'exact', 'explicit', 'identified', 'informative', 'instant', 'labeled', 'obvious', 'outward', 'practical', 'reachable', 'resolved', 'specific', 'straightforward', 'symbolism'], // Ambiguous
  'ambition': ['apathy', 'complacency', 'indifference', 'laziness', 'lethargy', 'resignation'], // Ambition
  'ambitious': ['slacker'], // Ambitious
  'amorphous': ['anatomy', 'crystalline', 'cubical', 'defined', 'fixed', 'formed', 'molecular', 'rigid', 'solid', 'structured'], // Amorphous
  'amplification': ['diminution', 'reduction'], // Amplification
  'amplify': ['dampen', 'diminish', 'lessen', 'muffle', 'mute', 'quiet', 'reduce', 'shrink', 'subdue', 'suppress', 'weaken'], // Amplify
  'amplifying': ['dimming', 'hushing', 'muting', 'suppressing'], // Amplifying
  'amplitude': ['petiteness'], // Amplitude
  'analog': ['fintech', 'metaverse', 'postdigital', 'technographic', 'xr'], // Analog
  'analog-experience': ['automated'], // Analog-Experience
  'analogous': ['contrasting', 'disparate', 'dissimilar', 'divergent', 'inconsistent'], // Analogous
  'analogue': ['digitalization', 'edtech'], // Analogue
  'analysis': ['chaos', 'fuzz', 'instinct', 'intuition', 'simplicity', 'whimsy'], // Analysis
  'analytical': ['emotional', 'imprecise', 'intuitive', 'spontaneous', 'subjective'], // Analytical
  'analytics': ['chaos', 'disorder', 'guesswork', 'haphazard', 'ignorance', 'instinct', 'intuition', 'negligence', 'qualitative', 'randomness', 'subjective', 'subjectivity'], // Analytics
  'anarchic': ['coherent', 'conformist', 'controlled', 'disciplined', 'harmonious', 'orderly', 'regulated', 'stable', 'structured'], // Anarchic
  'anarchy': ['ascendancy', 'authority', 'command', 'consensus', 'consulting', 'dentistry', 'government', 'hierarchy', 'obedience', 'principle', 'regulation', 'scholarship', 'sovereignty'], // Anarchy
  'anatomy': ['amorphous', 'chaos', 'disorder', 'fragmentation', 'simplicity'], // Anatomy
  'anchor': ['drift', 'float', 'wander', 'waver'], // Anchor
  'anchored': ['chaos', 'detached', 'dispersal', 'fluidity', 'lost', 'mobility', 'nomadic', 'shifting', 'unanchored', 'unsettled', 'wandering', 'weightless'], // Anchored
  'anchoring': ['fleeing', 'forgetting'], // Anchoring
  'ancient': ['contemporary', 'current', 'fresh', 'futurism', 'innovative', 'modern', 'new', 'novel', 'techno-futurism', 'trendy'], // Ancient
  'anger': ['calm', 'joy', 'serenity'], // Anger
  'angle': ['circle', 'curve', 'loop'], // Angle
  'anguish': ['bliss', 'calm', 'comfort', 'ease', 'happiness', 'joy', 'pleasure', 'serenity', 'tranquility'], // Anguish
  'angular': ['circular', 'curvature', 'curvy', 'cylindrical', 'round', 'roundness', 'shell-like', 'spherical', 'tubular'], // Angular
  'angular-form': ['round'], // Angular-Form
  'angularity': ['curved', 'rounded', 'smooth', 'soft'], // Angularity
  'animal-based': ['dairy-alternative'], // animal-based
  'animalism': ['abstract', 'artificiality', 'digital', 'mechanism'], // Animalism
  'animated': ['apathetic', 'dispassionate', 'dullard', 'lifeless', 'static', 'unmoved'], // Animated
  'animation': ['boredom'], // Animation
  'annotation': ['abstract', 'ambiguity', 'chaos', 'confusion', 'disconnection', 'implicit', 'undocumented', 'unlabeled'], // Annotation
  'annoyed': ['pleased'], // Annoyed
  'anomaly': ['archetype', 'consistency', 'normalcy', 'order', 'predictability', 'regularity', 'routine', 'standard', 'uniformity'], // anomaly
  'anonymity': ['branding', 'celebrity', 'companionship', 'fame', 'identity', 'milestone', 'premium', 'publicity', 'recognition'], // Anonymity
  'anonymous': ['famous', 'identified', 'known', 'premium'], // Anonymous
  'anti': ['calm', 'commercial-aesthetics', 'harmonious', 'orderly', 'pro', 'sane', 'structured'], // Anti
  'anti-form': ['formed'], // Anti-Form
  'anticipation': ['apathy', 'boredom', 'disappointment', 'disillusion', 'indifference', 'resignation', 'settled', 'sudden', 'surprise'], // Anticipation
  'antiquity': ['techno-culture', 'youthfulness'], // Antiquity
  'anxiety': ['calm', 'contentment', 'relaxation', 'safety', 'serenity'], // Anxiety
  'anxious': ['assured', 'calm', 'carefree', 'content', 'laid-back', 'peaceful', 'reassuring', 'relaxed', 'secure', 'steady'], // Anxious
  'apathetic': ['alert', 'animated', 'aspirant', 'driven', 'empathetic', 'engaged', 'enthusiastic', 'excited', 'passionate', 'responsive', 'vibrant'], // Apathetic
  'apathy': ['admiring', 'ambition', 'anticipation', 'assertiveness', 'attention', 'awakening', 'belief', 'cherishing', 'ebullience', 'empathy', 'engage', 'expressiveness', 'exuberance', 'fandom', 'fervor', 'humanism', 'humanity', 'hype', 'kindness', 'participation', 'passion', 'quest', 'respect', 'self-care', 'self-expression', 'stimulation', 'veneration', 'vigor', 'zeal'], // Apathy
  'apex': ['base', 'common', 'dull', 'flat', 'lowly', 'naive', 'pit', 'plain', 'simplicity'], // Apex
  'apparel': ['candles', 'jewelry'], // Apparel
  'apparent': ['concealed', 'covert', 'hidden', 'invisible', 'obscured', 'unseen'], // Apparent
  'appealing': ['repellent', 'repelling'], // Appealing
  'appear': ['disappear'], // Appear
  'appearing': ['absent', 'disappearing', 'dormant', 'hiding', 'inactive', 'null', 'unseen', 'vanishing'], // appearing
  'applied': ['theoretical'], // Applied
  'appreciate': ['disapproval', 'dislike', 'dismiss', 'dismissive', 'disregard', 'rejecting', 'scorn'], // Appreciate
  'appreciated': ['unvalued'], // Appreciated
  'appreciation': ['disapproval'], // Appreciation
  'appreciative': ['dismissive'], // Appreciative
  'apprehension': ['assurance', 'calmness', 'composure', 'confidence', 'serenity'], // Apprehension
  'approach': ['evade'], // Approach
  'approachable': ['aloof'], // approachable
  'approval': ['chaos', 'critique', 'disapproval', 'dislike', 'displeasure', 'dissatisfaction', 'failure', 'instability', 'rejecting', 'rejection', 'scorn', 'shame', 'uncertainty', 'unpredictable'], // approval
  'aquaculture': ['agriculture', 'forestry'], // Aquaculture
  'aquatic': ['arid', 'avian', 'terrestrial'], // Aquatic
  'aqueous': ['dry', 'harsh', 'rigid', 'solid', 'stark'], // Aqueous
  'arbitrary': ['basis', 'calculation', 'consequence', 'curated', 'intentional', 'methodical', 'ordered', 'procedural', 'relevance', 'structured', 'systematic'], // Arbitrary
  'arcade': ['minimal', 'quiet', 'serene', 'static', 'subdued'], // Arcade
  'arch': ['collapse', 'flat', 'level', 'linear', 'plane', 'simple'], // Arch
  'archaic': ['contemporary', 'futuristic', 'humanist', 'innovative', 'modern', 'nouveau'], // Archaic
  'archetype': ['anomaly', 'chaos', 'disorder', 'individuality', 'variant', 'variation'], // Archetype
  'architecture': ['chaos', 'deconstruction', 'disorder', 'fluidity', 'spontaneity'], // Architecture
  'archival': ['ephemeral', 'fleeting', 'mutable', 'transient'], // Archival
  'arduous': ['accessible', 'casual', 'convenience', 'easy', 'effortless', 'light', 'pleasant', 'simple', 'smooth'], // arduous
  'arid': ['aquatic', 'fertile', 'flourishing', 'foliage', 'green', 'lush', 'moist', 'oceanic', 'wet'], // Arid
  'aridity': ['juiciness'], // aridity
  'armored': ['bare', 'exposed', 'fragile', 'open', 'soft', 'undefended', 'vulnerability', 'vulnerable', 'weak'], // armored
  'aromatherapy': ['chemical', 'odorless', 'unscented'], // Aromatherapy
  'arranged': ['disorderly'], // Arranged
  'arrangement': ['cluttered', 'disorder', 'dispersal'], // Arrangement
  'array': ['cluttered', 'complex', 'detached', 'disorder', 'dispersal'], // Array
  'arrival': ['fleeing'], // Arrival
  'arrive': ['disappear', 'wander'], // Arrive
  'arrogant': ['humble'], // Arrogant
  'art': ['banal', 'banality', 'bland', 'brutality', 'chaos', 'coding', 'commodity', 'disorder', 'dull', 'emptiness', 'haphazard', 'industry', 'lack', 'mundane'], // Art
  'art-deco': ['neo-grotesque'], // Art-Deco
  'art-nouveau': ['techno-futurist'], // art-nouveau
  'artful': ['artless'], // Artful
  'articulate': ['illiterate', 'nonverbal'], // Articulate
  'artifact': ['current', 'dynamic', 'fluid', 'fresh', 'modern', 'novel', 'organic', 'synthetic', 'transient', 'vivid'], // Artifact
  'artifice': ['authentic', 'authenticity', 'earth', 'genuine', 'genuineness', 'natural', 'nature', 'simplicity', 'truth'], // Artifice
  'artificial': ['authentic', 'bio', 'biomorphic', 'biophilic', 'candid', 'earthen', 'earthiness', 'environment', 'fruity', 'genuine', 'genuineness', 'natura', 'natural', 'naturalistic', 'primal', 'real', 'terrain'], // Artificial
  'artificiality': ['animalism', 'earthiness', 'wholesomeness'], // Artificiality
  'artisan': ['computational'], // Artisan
  'artisanal': ['factory', 'generic', 'industrial', 'mass-produced', 'massproduced', 'synthetic', 'technographic', 'uniform'], // Artisanal
  'artistic': ['commercial', 'functional', 'functionalism', 'legal', 'mechanic', 'mechanical', 'mundane', 'scientific', 'utilitarian'], // Artistic
  'artistry': ['banality', 'crudeness', 'disorder', 'mediocrity', 'tacky', 'uniformity'], // Artistry
  'artless': ['artful', 'complex', 'deliberate', 'detailed', 'intentional', 'refined', 'sophisticated', 'structured', 'utility-design'], // Artless
  'artnouveau': ['techno-futurism'], // Artnouveau
  'arts': ['engineering'], // Arts
  'artsy': ['mainstream'], // Artsy
  'ascend': ['descend', 'low', 'lower', 'plummet', 'plunge', 'regress'], // Ascend
  'ascendancy': ['anarchy', 'chaos', 'collapse', 'decline', 'disorder', 'failure', 'fall', 'grounded', 'loss', 'submersion'], // Ascendancy
  'ascension': ['decline', 'descent', 'diminution', 'fall', 'gravity', 'reduction'], // Ascension
  'ascent': ['decline', 'descent', 'fall'], // Ascent
  'ascii': ['fluid', 'modern', 'vector'], // ASCII
  'asleep': ['awake'], // Asleep
  'aspirant': ['apathetic', 'defeated', 'heavy', 'resigned'], // Aspirant
  'aspiration': ['heavy', 'mediocre'], // Aspiration
  'aspire': ['accept', 'heavy', 'resign', 'settle'], // Aspire
  'assemblage': ['detachment', 'disorder', 'dispersal', 'isolation', 'separation'], // Assemblage
  'assemble': ['disassemble', 'disband', 'discard', 'disperse', 'divide'], // Assemble
  'assembly': ['detachment', 'disorder', 'dispersal', 'dissipation', 'dissolution', 'separation'], // Assembly
  'assert': ['retreat', 'vacate', 'waver'], // Assert
  'assertion': ['ambiguity', 'disapproval', 'dismissal', 'doubt', 'erasure', 'negation', 'passivity', 'submission'], // Assertion
  'assertive': ['hesitant', 'passive', 'resigned', 'shy', 'subduing', 'timid', 'vacant'], // Assertive
  'assertiveness': ['apathy', 'hesitation', 'indecision', 'insecurity', 'meekness', 'passivity', 'submissiveness', 'timidity', 'weakness'], // Assertiveness
  'assurance': ['apprehension', 'doubt', 'doubting', 'risk', 'warning'], // Assurance
  'assured': ['anxious', 'doubtful'], // Assured
  'astral': ['concrete', 'earthly', 'material', 'tangible', 'terrestrial'], // Astral
  'astronomical': ['grounded', 'terrestrial'], // Astronomical
  'asymmetrical': ['balance', 'boxy', 'centered', 'centrality', 'symmetry'], // Asymmetrical
  'asymmetry': ['axial', 'balance', 'centrality', 'concentricity', 'conformity', 'proportion', 'rectilinear', 'regularity', 'rows', 'symmetry', 'uniform', 'uniformity'], // Asymmetry
  'asynchronous': ['synchronized'], // Asynchronous
  'asynchrony': ['synchronicity'], // Asynchrony
  'athlete': ['couch', 'inactive', 'lazy', 'lethargic', 'sluggish'], // Athlete
  'atmosphere': ['chaos', 'desolation', 'void'], // Atmosphere
  'atmospheric': ['bland', 'minimal', 'sterile'], // Atmospheric
  'attach': ['detach'], // Attach
  'attached': ['detached'], // Attached
  'attachment': ['abandon', 'abandonment', 'alienation', 'detached', 'detachment', 'disconnection', 'dismiss', 'escape', 'expulsion', 'separation'], // Attachment
  'attack': ['retreat'], // Attack
  'attention': ['apathy', 'disregard', 'distraction', 'indifference', 'neglect', 'negligence', 'obscurity', 'sloppiness'], // Attention
  'attentive': ['absent', 'careless', 'distracted', 'oblivious', 'selfish'], // Attentive
  'attract': ['regress'], // Attract
  'attracting': ['disengaging', 'dull', 'invisible', 'repelling', 'repelling-hues'], // Attracting
  'attraction': ['aversion', 'dislike', 'rejection', 'repulsion'], // Attraction
  'attractive': ['bland', 'deterring', 'drab', 'dull', 'mundane', 'ordinary', 'repellent', 'repulsive', 'ugly', 'unappealing'], // Attractive
  'attrition': ['recruitment'], // Attrition
  'atypical': ['common'], // Atypical
  'audacious': ['cautious'], // Audacious
  'augmentation': ['depletion', 'diminution', 'reduction', 'simplification'], // Augmentation
  'aura': ['chaos', 'clarity', 'density', 'obscurity', 'void'], // Aura
  'aurora': ['dusk', 'obscurity', 'void'], // Aurora
  'authentic': ['artifice', 'artificial', 'deceptive', 'fabricated', 'facade', 'fake', 'false', 'falsehood', 'fraudulent', 'imperfect', 'insincere', 'pretentious', 'racket', 'simulacrum', 'simulated', 'superficial'], // Authentic
  'authenticity': ['artifice', 'deception', 'disguise', 'facade', 'falsity', 'illusion', 'insincerity', 'pretense', 'simulation'], // Authenticity
  'authoritative': ['gentle', 'irreverent', 'muted', 'subtlety', 'text', 'type', 'unruly'], // Authoritative
  'authority': ['anarchy', 'chaos', 'disorder', 'freedom', 'rebellion'], // Authority
  'authorship': ['premium'], // Authorship
  'automated': ['analog-experience', 'chaotic', 'human', 'imperfect', 'manual', 'natural', 'organic', 'random', 'spontaneous'], // Automated
  'automation': ['premium', 'recruitment', 'typecraft'], // Automation
  'automotive': ['electronics', 'manual', 'natural', 'organic', 'pedestrian', 'personalcare', 'primitive', 'static'], // Automotive
  'autonomy': ['collectivism', 'conformity', 'dependence', 'subjugation', 'submission'], // Autonomy
  'available': ['absent'], // Available
  'avant-garde': ['retrofuturism'], // Avant-Garde
  'avatar': ['individual', 'premium', 'real'], // Avatar
  'average': ['elite', 'exceptional', 'uniqueness'], // Average
  'aversion': ['affection', 'attraction', 'demand', 'favor', 'pleasure', 'veneration'], // Aversion
  'avian': ['aquatic', 'terrestrial'], // Avian
  'avoid': ['confront'], // Avoid
  'avoidance': ['therapy'], // avoidance
  'awake': ['asleep', 'drowsy', 'hypnotic', 'night', 'unaware'], // Awake
  'awakening': ['apathy', 'delusion', 'dormancy', 'dullness', 'evening', 'ignorance', 'inattention', 'sleeping', 'slumber', 'stagnation', 'unaware'], // Awakening
  'aware': ['absent', 'aimless', 'blind', 'clueless', 'complacent', 'distracted', 'fumble', 'illiterate', 'mindless', 'nowhere', 'oblivious', 'shallow'], // Aware
  'awareness': ['abandonment', 'blackout', 'blindness', 'ignorance', 'negligence', 'oblivion', 'premium'], // Awareness
  'awe': ['heavy', 'playful'], // Awe
  'awkward': ['aerodynamic', 'clear', 'coherent', 'confident', 'coolness', 'familiar', 'graceful', 'harmonious', 'intentional', 'polished', 'skillful', 'smooth'], // Awkward
  'awkwardness': ['chic', 'clarity', 'elegant', 'ergonomic', 'grace', 'poise', 'prestige', 'refinement', 'streamline'], // Awkwardness
  'axial': ['asymmetry', 'dispersed', 'nonlinear', 'radial', 'random'], // Axial
  'axis': ['chaos', 'disorder', 'fluid', 'freeform', 'irregular', 'random', 'scattered', 'unstructured'], // Axis
  'babyproducts': ['adult', 'grownup', 'senior'], // BabyProducts
  'background': ['foreground'], // Background
  'backward': ['adaptable', 'advancement', 'behavioral', 'confident', 'ease', 'fluid', 'forward', 'progress', 'soft'], // backward
  'baked': ['cold', 'fresh', 'moist', 'raw', 'uncooked', 'unformed'], // Baked
  'bakery': ['bitter', 'chaotic', 'disorderly', 'dry', 'durables', 'harsh', 'mining', 'raw', 'savory', 'software', 'sour'], // Bakery
  'balance': ['asymmetrical', 'asymmetry', 'based', 'complication', 'conflict', 'disorder', 'turmoil'], // Balance
  'balanced': ['discordant', 'jagged', 'jarring', 'uneven'], // Balanced
  'banal': ['art', 'bold', 'dynamic', 'epic', 'exciting', 'expressive', 'innovative', 'original', 'stellar', 'sublime', 'unique', 'vibrant'], // Banal
  'banality': ['art', 'artistry', 'gravitas'], // Banality
  'bare': ['armored', 'caps', 'cosmetics', 'crowned', 'curtained', 'elaborate', 'eyewear', 'filled', 'full', 'garnish', 'glamour', 'plump', 'shielded', 'sticker', 'woven', 'yielding'], // Bare
  'barefoot': ['footwear'], // Barefoot
  'baroque': ['cleanliness', 'functionality', 'minimalism', 'modernism', 'scandinavian', 'simplicity'], // Baroque
  'barren': ['abundant', 'beverage', 'colorful', 'dynamic', 'fertile', 'flourishing', 'foliage', 'fruition', 'fullness', 'immerse', 'inviting', 'lush', 'oceanic', 'rich', 'richness', 'verdant', 'vibrant'], // Barren
  'barrier': ['access', 'connection', 'freedom', 'integration', 'openness', 'portal'], // Barrier
  'barter': ['payments'], // Barter
  'base': ['accent', 'apex', 'complex', 'decorated', 'elaborate', 'elevated', 'elevation', 'horizon', 'intricate', 'luxe', 'ornamentation', 'peak', 'pinnacle', 'prestige', 'stratum', 'summit', 'top', 'transcendence', 'vertex'], // Base
  'based': ['balance', 'fluid', 'masonry', 'organic', 'serif', 'unfounded', 'wavering'], // Based
  'basement': ['sky'], // basement
  'basic': ['aesthetics', 'boutique', 'cgi', 'cluttered', 'complex', 'decorated', 'deeptech', 'eclectic', 'edtech', 'elaborate', 'elite', 'exceptional', 'excessive', 'extraordinary', 'figurative', 'fine', 'fintech', 'garnish', 'gastronomy', 'gourmet', 'indulgent', 'lavish', 'macro', 'perfect', 'personalized', 'prime', 'retrofuturism', 'technographic', 'techwear', 'wealth', 'wearables', 'wrought', 'yachting'], // Basic
  'basic-bites': ['indulgent'], // Basic-Bites
  'basis': ['arbitrary', 'cluttered', 'disheveled', 'disorder', 'messy'], // Basis
  'bauhaus': ['chaotic', 'eclectic', 'ornate'], // Bauhaus
  'beacon': ['absence', 'darkness', 'shadow', 'void'], // Beacon
  'beat': ['silence', 'stagnant', 'static', 'stillness'], // Beat
  'beauty': ['chaos', 'clutter', 'dullness', 'mess', 'ugliness'], // Beauty
  'becoming': ['being', 'ended', 'stasis', 'static'], // Becoming
  'beer': ['whiskey', 'wine'], // Beer
  'begin': ['closed', 'expire', 'finish'], // Begin
  'beginning': ['aftermath', 'closure', 'death', 'end', 'ended', 'endgame', 'final', 'finale', 'finality', 'finish'], // Beginning
  'behavioral': ['backward', 'chaotic', 'disorderly', 'erratic', 'hardware', 'impulsive', 'irrational', 'mechanical', 'physical', 'random', 'spontaneous', 'tangible', 'unpredictable'], // Behavioral
  'being': ['absence', 'becoming', 'nonbeing', 'nonexist', 'nothingness', 'null', 'void'], // Being
  'belief': ['apathy', 'confusion', 'denial', 'disbelief', 'disillusion', 'disillusionment', 'doubt', 'indifference', 'skepticism', 'uncertainty'], // Belief
  'believing': ['doubtful'], // Believing
  'belonging': ['alienation', 'detachment', 'disconnection', 'exile', 'forgetting', 'isolation', 'separation'], // Belonging
  'below': ['above', 'high', 'skyward', 'top', 'up'], // below
  'beneath': ['upper'], // Beneath
  'beneficial': ['worthless'], // Beneficial
  'benefit': ['harm', 'warning'], // Benefit
  'benevolence': ['malice'], // Benevolence
  'benevolent': ['greed'], // Benevolent
  'bespoke': ['generic', 'massproduced', 'premium'], // Bespoke
  'betrayal': ['cherishing'], // Betrayal
  'beverage': ['barren', 'dry', 'dull', 'empty', 'equipment', 'inedible', 'solid', 'stale', 'toxin', 'void'], // Beverage
  'beverages': ['snacks'], // beverages
  'beyond': ['limit', 'within'], // Beyond
  'bias': ['objectivity'], // Bias
  'bigness': ['petiteness'], // Bigness
  'binary': ['complex', 'diverse', 'fluid', 'monochrome'], // Binary
  'bind': ['chaos', 'detach', 'disorder', 'fluid', 'free', 'loose', 'open', 'release', 'unbound'], // Bind
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
  'bitter': ['bakery', 'bright', 'cheerful', 'gentle', 'jubilant', 'smooth', 'soft', 'sweet', 'warm', 'wine'], // Bitter
  'bitterness': ['sweetness'], // Bitterness
  'bizarre': ['familiar'], // Bizarre
  'blackout': ['awareness', 'brightness', 'clarity', 'dawn', 'energy', 'illumination', 'light', 'radiance', 'vitality'], // Blackout
  'bland': ['alluring', 'art', 'atmospheric', 'attractive', 'bistro', 'bold', 'brilliant', 'captivating', 'colorful', 'dazzling', 'depictive', 'distinct', 'distinction', 'dynamic', 'enchanted', 'enchanting', 'evocative', 'exceptional', 'exciting', 'expressive', 'fanciful', 'fierce', 'fiery', 'gleaming', 'graded', 'groovy', 'highlight', 'ignited', 'lively', 'lustrous', 'macro', 'murals', 'personalized', 'phosphor', 'pleasant', 'provocative', 'rich', 'richness', 'shimmer', 'shine', 'shiny', 'soulful', 'spicy', 'stimulating', 'storyful', 'sweet', 'symphonic', 'vibrant', 'vibration', 'zesty'], // Bland
  'blandness': ['aesthetics'], // Blandness
  'blank': ['complex', 'decorated', 'defined', 'detailed', 'filled', 'multi'], // Blank
  'blare': ['whisper'], // Blare
  'blaring': ['calm', 'gentle', 'muted', 'peaceful', 'quiet', 'silent', 'soft', 'still', 'subdued'], // blaring
  'blasts': ['calm', 'gentle', 'muted', 'peaceful', 'quiet', 'soft', 'still', 'subdued', 'whispers'], // Blasts
  'blatancy': ['discretion'], // Blatancy
  'blatant': ['covert', 'discreet', 'hidden', 'mystery', 'nuanced', 'obscure', 'subtle', 'veiled'], // Blatant
  'blazing': ['calm', 'cool', 'dimming', 'dull', 'faint', 'frosted-hue', 'mellow', 'pale', 'soft', 'subdued'], // Blazing
  'bleak': ['bright', 'cheerful', 'colorful', 'festive', 'foliage', 'inviting', 'lush', 'optimistic', 'positive', 'rich', 'utopian', 'verdant', 'vibrancy', 'vibrant', 'vividness', 'warm'], // Bleak
  'bleakness': ['brightness', 'color', 'fullness', 'joy', 'liveliness', 'richness', 'vibrance', 'vibrancy', 'warmth'], // bleakness
  'bleed': ['conceal', 'contain', 'heal', 'solidify', 'stabilize'], // Bleed
  'blend': ['divide', 'highlight', 'separate'], // Blend
  'blended': ['chaotic', 'clashing', 'conflicting', 'contrasted', 'distinct', 'individual', 'pure', 'sharp', 'vivid'], // Blended
  'blending': ['dividing', 'outlining'], // Blending
  'blessing': ['misfortune'], // Blessing
  'blight': ['brightness', 'flourish', 'nourish', 'prosperity', 'utopia', 'vitality'], // blight
  'blind': ['alert', 'aware', 'bright', 'clear', 'focused', 'led', 'luminous', 'sighted', 'sightful', 'visible'], // Blind
  'blinding': ['calm', 'dim', 'faint', 'gentle', 'muted', 'quiet', 'shading', 'soft', 'subtle'], // Blinding
  'blindness': ['awareness', 'brightness', 'clarity', 'focus', 'insight', 'observation', 'perception', 'sight', 'vision'], // blindness
  'bliss': ['agony', 'anguish', 'heavy', 'pain', 'sorrow', 'torment'], // Bliss
  'blob': ['edge', 'line', 'point'], // Blob
  'blobby': ['clear', 'defined', 'firm', 'precise', 'sculpted', 'sharp', 'smooth', 'solid', 'structured'], // Blobby
  'block': ['fluid', 'fringe', 'leak', 'open', 'spread', 'support', 'void'], // Block
  'blockage': ['catalyst', 'conduit', 'stream'], // Blockage
  'blockchain': ['centralized', 'confined', 'isolated', 'linear', 'restricted'], // Blockchain
  'blocky': ['airy', 'curved', 'dynamic', 'fluid', 'light', 'organic', 'smooth', 'soft', 'tubular'], // blocky
  'bloom': ['decay', 'diminish', 'drown', 'fade', 'shrivel', 'wilt', 'wither'], // Bloom
  'blooming': ['withering'], // Blooming
  'blotchy': ['clean', 'clear', 'crisp-white', 'neat', 'precise', 'smooth', 'solid', 'uniform'], // Blotchy
  'blue': ['amber'], // Blue
  'blunt': ['bright', 'clear', 'discretion', 'dynamic', 'engaging', 'expressive', 'intense', 'pointed', 'reflective', 'sharp', 'sheen', 'vibrant'], // Blunt
  'blur': ['clear', 'crispness', 'defined', 'imprint', 'sharp'], // Blur
  'blurb': ['clarity', 'definition', 'focus', 'order', 'precision', 'sharpness', 'simplicity', 'structure', 'typesetting'], // Blurb
  'blurred': ['clear', 'visible'], // Blurred
  'blurriness': ['crispness', 'distinctness'], // Blurriness
  'blurring': ['outlining'], // Blurring
  'blurry': ['crisp', 'key'], // Blurry
  'boarding': ['homecare', 'residential', 'travel', 'wilderness'], // Boarding
  'body': ['psyche'], // body
  'boiling': ['glacial'], // Boiling
  'boisterous': ['calm', 'gentle', 'peaceful', 'quiet', 'reserved', 'soft', 'still', 'subdued', 'vulnerable-silence'], // Boisterous
  'bokeh': ['bright', 'clear', 'crisp', 'defined', 'detailed', 'focused', 'sharp', 'vivid'], // Bokeh
  'bold': ['banal', 'bland', 'boring', 'cautious', 'drab', 'drain', 'dull', 'dullard', 'fading', 'faint', 'filtered', 'gentle', 'hesitant', 'hiding', 'humble', 'hushing', 'idle', 'introverted', 'lame', 'lethargic', 'mediocre', 'muffled', 'mundane', 'mute', 'neumorphic', 'pedestrian', 'plain', 'reserved', 'shy', 'stale', 'stifled', 'subduing', 'suppressed', 'tame', 'timid', 'washed', 'weak'], // Bold
  'bold-adventure': ['cautious'], // Bold-Adventure
  'boldness': ['hesitation'], // Boldness
  'bond': ['detach', 'disengage', 'disperse', 'split'], // Bond
  'bondage': ['escape', 'expansive-freedom', 'flexible', 'fluid', 'freedom', 'liberation', 'open', 'release', 'unbound'], // Bondage
  'bore': ['colorful', 'delight', 'dynamic', 'engage', 'excite', 'lively', 'motivate', 'stimulate', 'vibrant'], // Bore
  'bored': ['active', 'curious', 'dynamic', 'engaged', 'excited', 'fascinated', 'interested', 'pleased', 'stimulated', 'vibrant'], // Bored
  'boredom': ['animation', 'anticipation', 'curiosity', 'edutainment', 'engagement', 'enthusiasm', 'euphoria', 'excitement', 'fervor', 'hype', 'interest', 'joy', 'passion', 'stimulation', 'vibrancy', 'zeal'], // Boredom
  'boring': ['adventurous', 'bold', 'captivating', 'colorful', 'dynamic', 'engaging', 'exciting', 'ingenuity', 'lively', 'stimulating', 'surprise', 'vibrant', 'whimsical-flow'], // Boring
  'botanical': ['geometric', 'industrial', 'mechanical', 'minimalist', 'synthetic', 'urban'], // Botanical
  'bottom': ['above', 'peak', 'summit', 'top', 'unbounded', 'up', 'upper'], // bottom
  'bounce': ['flatness', 'stillness'], // Bounce
  'bound': ['detached', 'free', 'freedom', 'freeness', 'independent', 'loose', 'loosen', 'mobility', 'open', 'released', 'unbound', 'unconfined', 'unfettered', 'unformed', 'unfounded', 'ungrounded'], // Bound
  'boundary': ['threshold'], // boundary
  'bounded': ['boundless', 'chaos', 'endless', 'endlessness', 'expansion', 'fluid', 'freedom', 'infinite', 'infinity', 'limitless', 'open', 'unbounded', 'uninterrupted', 'vague'], // bounded
  'boundless': ['bounded', 'finite', 'limit', 'limitation', 'limited', 'restricted'], // Boundless
  'boundless-exploration': ['limitation'], // Boundless-Exploration
  'bounty': ['deficiency', 'depletion', 'emptiness', 'lack', 'loss', 'poverty', 'scarcity', 'want'], // Bounty
  'boutique': ['basic', 'common', 'generic', 'industrial', 'mass', 'mass-market', 'monotonous', 'standard', 'uniform', 'wholesale'], // Boutique
  'boxy': ['aerodynamic', 'airy', 'asymmetrical', 'curvy', 'dynamic', 'fluid', 'light', 'organic', 'sphere'], // boxy
  'braided': ['flat', 'linear', 'smooth'], // Braided
  'branching': ['convergent', 'direct', 'linear'], // Branching
  'branding': ['anonymity', 'disorder', 'neglect', 'obscurity', 'simplicity', 'unmark'], // Branding
  'brash': ['calm', 'cautious', 'gentle', 'muted', 'quiet', 'reserved', 'shy', 'simple', 'soft', 'subtle'], // Brash
  'brave': ['hiding', 'timid'], // Brave
  'brazen': ['discretion'], // Brazen
  'break': ['build', 'connect', 'create', 'establish', 'fix', 'loop', 'repeat', 'restore', 'strengthen', 'synthesize', 'unite', 'weave'], // break
  'breakdown': ['clarity', 'coherence', 'harmony', 'resilience', 'serenity', 'stability', 'strength', 'unity', 'wholeness'], // breakdown
  'breeze': ['burden', 'chaos', 'heaviness', 'heavyweight', 'pressure', 'storm', 'stress', 'tension', 'weight'], // Breeze
  'breezy': ['certain', 'confined', 'dark', 'fixed', 'gloomy', 'heavy', 'ponderous', 'stale', 'static'], // breezy
  'brevity': ['lengthy', 'rambling', 'verbosity'], // Brevity
  'brewing': ['winemaking'], // brewing
  'brief': ['eternal', 'lengthy', 'lingering', 'perpetual'], // Brief
  'bright': ['aimless', 'bitter', 'bleak', 'blind', 'blunt', 'bokeh', 'cloudy', 'cold', 'cumbersome', 'darkmode', 'despairing', 'dimming', 'dirt', 'dismal', 'dismissive', 'drag', 'drain', 'drained', 'dreary', 'dry', 'dull', 'dystopic', 'fall', 'foul', 'frayed', 'gothic', 'grim', 'grime', 'grungy', 'haunting', 'hushing', 'lethargic', 'matt', 'muddy', 'muffled', 'murky', 'mute', 'noir', 'obscuring', 'ochre', 'ominous', 'opaque', 'patina', 'pessimistic', 'repellent', 'reserved', 'rusty', 'shrouded', 'sluggish', 'smoky', 'somber', 'stale', 'weary'], // Bright
  'brightness': ['blackout', 'bleakness', 'blight', 'blindness', 'coldness', 'darkness', 'dimness', 'dormancy', 'eclipse', 'evening', 'filth', 'fog', 'gloom', 'haze', 'mist', 'nocturn', 'shade', 'squalor', 'tunnel'], // Brightness
  'brilliant': ['bland', 'dark', 'drab', 'dull', 'faded', 'flat', 'muted', 'subdued', 'void-spectrum'], // Brilliant
  'brisk': ['slow'], // Brisk
  'brittle': ['ductile', 'flexible', 'malleable', 'resilient', 'robust', 'silk', 'soft', 'steel', 'sturdy', 'supple', 'velvet'], // Brittle
  'broad': ['micro', 'specific', 'thin'], // Broad
  'broadening': ['narrowing'], // Broadening
  'broken': ['cast', 'complete', 'dome', 'functional', 'intact', 'loop', 'solid', 'stable', 'unified', 'whole'], // broken
  'brushed': ['flat', 'glossy', 'polished', 'scratched', 'sleek', 'smooth'], // Brushed
  'brushstroke': ['clear', 'defined', 'digital', 'orderly', 'photographic', 'polished', 'precise', 'sharp', 'smooth', 'static', 'uniform'], // Brushstroke
  'brushwork': ['clean', 'flat', 'polished', 'smooth', 'uniform'], // Brushwork
  'brutal': ['delicate', 'elegant', 'feminine', 'gentle', 'humanist', 'literary', 'nouveau', 'poetic', 'pure', 'refined', 'romantic', 'soft', 'sweet', 'swiss', 'wholesome'], // Brutal
  'brutalism': ['deco', 'elegant', 'fluid', 'ornate', 'refined', 'soft'], // Brutalism
  'brutalist': ['elegant', 'kawaii', 'maximalist', 'traditional'], // Brutalist
  'brutality': ['art', 'craft', 'delicacy', 'elegance', 'grace', 'harmony', 'idyll', 'refinement'], // Brutality
  'bubble': ['empty', 'flat', 'scatter', 'void', 'world'], // Bubble
  'build': ['break', 'collapse', 'damage', 'destroy', 'disassemble', 'erode', 'tear'], // Build
  'building': ['destruction', 'dissolving', 'erasing', 'obliterating'], // Building
  'bulge': ['flatten'], // Bulge
  'bulk': ['petiteness'], // Bulk
  'bulky': ['aerodynamic', 'petite', 'slender', 'thin'], // Bulky
  'bump': ['even', 'flat', 'flatness', 'linear', 'plain', 'smooth', 'uniform'], // bump
  'bumpiness': ['smoothness'], // bumpiness
  'bumpy': ['even', 'flat', 'plain', 'slick', 'smooth', 'smoothness', 'steady', 'uniform'], // bumpy
  'bundle': ['disperse', 'scatter'], // Bundle
  'burden': ['breeze', 'ease', 'flow', 'freedom', 'joy', 'levity', 'lightness', 'openness', 'pleasure', 'release', 'selfcare'], // Burden
  'burdened': ['clear', 'easy', 'ethereal-lightness', 'free', 'light', 'open', 'pure', 'simple', 'unbound', 'unhurried', 'weightless'], // Burdened
  'burdensome': ['carefree', 'easy', 'effortless', 'free', 'joyful', 'light', 'lightweight', 'simple', 'supportive', 'uplifting'], // Burdensome
  'buried': ['overlook'], // Buried
  'burnished': ['raw', 'unpolished'], // Burnished
  'burnout': ['selfcare'], // Burnout
  'burnt': ['calm', 'clear', 'cool', 'faint', 'frosted-blue', 'gentle', 'pale', 'soft', 'subtle'], // Burnt
  'burst': ['calm', 'contain', 'diminish', 'still', 'subdue'], // Burst
  'business': ['non-profit'], // Business
  'businessattire': ['casualfootwear'], // businessattire
  'bustling': ['calm', 'desolate', 'dormant', 'inactive', 'lethargic', 'quiet', 'serene', 'sluggish', 'still'], // bustling
  'busy': ['empty', 'lazy', 'leisurely', 'paused', 'rest', 'rural', 'simplify', 'untouched'], // Busy
  'buzz': ['calm', 'empty', 'light', 'loose', 'quiet', 'silence', 'soft', 'still', 'void'], // buzz
  'cacophony': ['delicacy', 'harmony', 'melody', 'order', 'resonance', 'silence', 'silent', 'tranquility'], // Cacophony
  'cage': ['freeness'], // Cage
  'calculated': ['chaotic', 'imprecise', 'instinctive', 'irrational', 'random', 'spontaneous'], // Calculated
  'calculated-precision': ['imprecise'], // Calculated-Precision
  'calculation': ['arbitrary', 'imprecise', 'improvisation', 'instinct', 'intuition'], // Calculation
  'callous': ['empathetic'], // Callous
  'calm': ['aggressive', 'agitated', 'agitation', 'agony', 'anger', 'anguish', 'anti', 'anxiety', 'anxious', 'blaring', 'blasts', 'blazing', 'blinding', 'boisterous', 'brash', 'burnt', 'burst', 'bustling', 'buzz', 'chaotic', 'clamor', 'clatter', 'confront', 'din', 'dragged', 'dramatic', 'emotion', 'energetic', 'erupt', 'exaggeration', 'explosive', 'fear', 'feral', 'fierce', 'fiery', 'force', 'frantic', 'frenzied', 'frenzy', 'frustration', 'garish', 'harried', 'harsh', 'hasty', 'heated', 'heavy', 'hustle', 'hype', 'ignite', 'intensify', 'jarring', 'joy', 'jumbled', 'loud', 'messy', 'molten', 'motorsport', 'movement', 'murky', 'negation', 'noisy', 'overwrought', 'panic', 'plasma', 'postlude', 'punchy', 'racket', 'raucous', 'reckless', 'restless', 'risk', 'roars', 'roughness', 'rush', 'rushed', 'savage', 'scream', 'screaming', 'shouted', 'shouting', 'shouts', 'splash', 'staccato', 'steam', 'stimulation', 'storm', 'strenuous', 'stress', 'strident', 'struggle', 'sudden', 'tangle', 'tarnished', 'tense', 'thunders', 'tightened', 'torment', 'tumult', 'turbulence', 'turmoil', 'uneasy', 'unhinged', 'unruly', 'unsettled', 'unstable', 'unsteady', 'uproarious', 'urgent', 'velocity', 'volatile', 'vortex', 'war', 'warning', 'whirl', 'whirlwind', 'wild', 'wind', 'zesty'], // Calm
  'calmness': ['apprehension', 'explosion', 'exuberance'], // Calmness
  'camp': ['formal', 'minimal', 'restrained', 'serious', 'sober', 'subdued'], // Camp
  'camping': ['hotels'], // Camping
  'candid': ['artificial', 'contrived', 'filtered', 'staged'], // Candid
  'candles': ['apparel', 'electronics'], // Candles
  'canning': ['fresh', 'unpackaged'], // Canning
  'canvas': ['absence', 'chaos', 'dispersal', 'emptiness', 'void'], // Canvas
  'capable': ['clumsy', 'inactive', 'incompetent', 'inept', 'limited', 'unable', 'unfit', 'weak'], // Capable
  'capitalism': ['communism', 'cooperative', 'egalitarian', 'socialism'], // Capitalism
  'capricious': ['reliable'], // capricious
  'caps': ['bare', 'flat', 'minimal', 'naked', 'plain'], // Caps
  'captivating': ['bland', 'boring', 'dull', 'lackluster', 'mundane', 'ordinary', 'repelling', 'repulsive', 'tame', 'unappealing'], // Captivating
  'captivity': ['expansive-freedom', 'exploration', 'freedom', 'liberation', 'openness', 'release', 'spontaneity', 'uncertainty', 'variability'], // Captivity
  'capture': ['disperse', 'evade', 'forget', 'led', 'rendering'], // Capture
  'cardboard': ['glass', 'metal', 'plastic'], // Cardboard
  'cardiology': ['orthodontics'], // Cardiology
  'care': ['cruelty', 'exploitation', 'malice', 'negligence', 'premium'], // Care
  'carefree': ['adulting', 'anxious', 'burdensome', 'cautious', 'grind', 'serious', 'studious', 'vigilance'], // Carefree
  'careful': ['careless', 'hasty', 'negligent', 'reckless'], // Careful
  'carefulness': ['sloppiness'], // Carefulness
  'careless': ['attentive', 'careful', 'certain', 'considerate', 'deliberate', 'guarded', 'mindful', 'precise', 'premeditated', 'thoughtful'], // Careless
  'carelessness': ['eco-conscious', 'gravitas'], // Carelessness
  'caring': ['selfish'], // Caring
  'carmine': ['pale', 'pastel'], // Carmine
  'carousel': ['discrete', 'linear', 'minimalistic', 'static', 'stationary', 'tabs', 'underline'], // Carousel
  'cartoon': ['minimalism', 'realism', 'seriousness', 'sophistication', 'subtlety'], // Cartoon
  'cast': ['absorb', 'broken', 'chaotic', 'discard', 'flexible', 'fluid', 'partial', 'soft', 'uncertain'], // Cast
  'casual': ['academia', 'adulting', 'arduous', 'ceremonial', 'clinical', 'conferences', 'formal', 'formality', 'grind', 'horology', 'impersonal', 'investigative', 'official', 'pretentious', 'stiff'], // Casual
  'casual-chaos': ['formality'], // Casual-Chaos
  'casual-chic': ['pretentious', 'stuffy'], // Casual-Chic
  'casual-collection': ['elite'], // Casual-Collection
  'casualdining': ['finedining', 'luxury'], // CasualDining
  'casualfootwear': ['businessattire', 'formalwear'], // CasualFootwear
  'catalog': ['chaos', 'disorder', 'randomness'], // Catalog
  'catalyst': ['blockage', 'halt', 'impediment', 'inhibitor', 'obstruction', 'passive', 'resistance', 'stagnant', 'stagnation', 'static'], // Catalyst
  'categorization': ['chaos', 'disorder', 'dispersal'], // Categorization
  'catering': ['abandon', 'chaos', 'disorder', 'diy', 'lack', 'manufacturing', 'mess', 'neglect', 'restaurant', 'retail', 'scarcity', 'simple'], // Catering
  'caution': ['hasty', 'heavy', 'reckless'], // Caution
  'cautious': ['adventurous', 'audacious', 'bold', 'bold-adventure', 'brash', 'carefree', 'daring', 'fearless', 'impulsive', 'reckless'], // Cautious
  'cease': ['remain', 'repeat'], // Cease
  'celebrate': ['dismiss'], // Celebrate
  'celebrated': ['ignored'], // Celebrated
  'celebration': ['despair', 'detachment', 'disapproval', 'disorder', 'memorial', 'mourning', 'ridicule', 'shame', 'sorrow'], // Celebration
  'celebrity': ['anonymity', 'humility', 'obscurity', 'ordinariness', 'simplicity', 'unknown'], // Celebrity
  'celestial': ['chthonic', 'earthly', 'grounded', 'mundane', 'subterranean', 'terrestrial'], // Celestial
  'cellular': ['centralized', 'fixed', 'simple', 'solid', 'stable', 'static', 'uniform'], // Cellular
  'center': ['drift', 'horizon', 'scatter', 'sidebar', 'swirl'], // center
  'centered': ['asymmetrical', 'cluttered', 'disorder', 'dispersed', 'distracted', 'editorial', 'music', 'offbeat', 'screen', 'unbalanced', 'ungrounded'], // Centered
  'central': ['peripheral', 'tangential'], // Central
  'centrality': ['asymmetrical', 'asymmetry', 'decentralization', 'decentralized', 'disorder', 'dispersion', 'editorial', 'periphery', 'screen'], // Centrality
  'centralized': ['blockchain', 'cellular', 'decentralized', 'dispersed', 'distributed', 'fragmented', 'obscured', 'scattered', 'scroll', 'spread'], // Centralized
  'centric': ['fringe', 'marginal', 'peripheral', 'scroll'], // Centric
  'centrifugal': ['centripetal', 'linear'], // Centrifugal
  'centripetal': ['centrifugal'], // Centripetal
  'ceramic': ['flesh', 'glass', 'metal', 'plastic'], // Ceramic
  'cerebral': ['chaotic', 'emotional', 'impulsive', 'instinctive', 'intuitive', 'scatterbrained'], // Cerebral
  'ceremonial': ['casual'], // Ceremonial
  'certain': ['ambiguous', 'breezy', 'careless', 'clatter', 'clueless', 'confused', 'corrupt', 'delay', 'delayed', 'doubtful', 'false', 'fictional', 'flighty', 'fugitive', 'fumble', 'hesitant', 'hollow', 'imaginary', 'imprecise', 'lost', 'nebulous', 'nowhere', 'peripheral', 'sealed', 'subjective', 'uncertain', 'uncertainty', 'unchanged', 'unfounded', 'unknown', 'unreliable', 'unsettled', 'unsteady', 'vacant', 'vague'], // Certain
  'certainty': ['confusion', 'contradiction', 'deceit', 'denial', 'discomfort', 'doubt', 'doubting', 'falsehood', 'fluke', 'hesitation', 'hypothesis', 'ignorance', 'impotence', 'limbo', 'liminality', 'myth', 'paradox', 'possibility', 'risk', 'vacuum', 'waver', 'whirlwind'], // Certainty
  'cgi': ['basic', 'handmade', 'imperfect', 'natural', 'organic', 'primitive', 'raw', 'rough', 'simple', 'unrefined'], // CGI
  'ch-teau-style': ['rebel'], // Ch-Teau-Style
  'challenge': ['comfort', 'ease', 'simplicity'], // Challenge
  'challenges': ['solutions'], // Challenges
  'challenging': ['clear', 'easy', 'gentle', 'light', 'pleasant', 'simple', 'smooth', 'soft'], // Challenging
  'chance': ['insurance'], // Chance
  'change': ['constancy', 'fixity'], // Change
  'changeable': ['permanent', 'unchanging'], // Changeable
  'changing': ['constant'], // Changing
  'chaos': ['academia', 'aesthetics', 'aether', 'algorithm', 'align', 'analysis', 'analytics', 'anatomy', 'anchored', 'annotation', 'approval', 'archetype', 'architecture', 'art', 'ascendancy', 'atmosphere', 'aura', 'authority', 'axis', 'beauty', 'bind', 'bounded', 'breeze', 'canvas', 'catalog', 'categorization', 'catering', 'childcare', 'circuit', 'classicism', 'climate', 'coding', 'command', 'completion', 'composure', 'conception', 'conquer', 'consensus', 'consequence', 'consolidate', 'constancy', 'constellation', 'constraint', 'consulting', 'context', 'contour', 'corner', 'cosmos', 'craft', 'craftsmanship', 'cubism', 'dashboard', 'dentistry', 'depiction', 'discipline', 'domain', 'earth', 'eco-tech', 'economy', 'ecosystem', 'edtech', 'education', 'edutainment', 'efficacy', 'element', 'engineering', 'equilibrium', 'fact', 'field', 'finality', 'finance', 'fixation', 'fixity', 'flowchart', 'focused', 'formation', 'fortitude', 'foundation', 'frame', 'framework', 'functionalism', 'globe', 'government', 'grading', 'healthtech', 'hierarchy', 'horology', 'hud', 'idyll', 'industry', 'integrity', 'interpretation', 'lattice', 'line', 'literary', 'logic', 'logistics', 'lucidity', 'marketing', 'mastery', 'matrix', 'meaning', 'measure', 'mechanism', 'method', 'microcosm', 'minimize', 'modelling', 'module', 'molecular', 'monoculture', 'monopoly', 'mosaic', 'museum', 'nodes', 'normalcy', 'nucleus', 'obedience', 'optimization', 'orbit', 'order', 'outlining', 'pattern', 'payments', 'planning', 'point', 'polygon', 'principle', 'productivity', 'proportion', 'publishing', 'purity', 'purpose', 'pyramid', 'realm', 'rectilinear', 'regulation', 'relaxation', 'resolve', 'restraint', 'restriction', 'rhythm', 'richness', 'ritual', 'rows', 'safety', 'sameness', 'sanctuary', 'scholarship', 'script', 'selfcare', 'sense', 'settle', 'shape', 'sightful', 'signal', 'solidify', 'solutions', 'source', 'sparsity', 'stability', 'stillness', 'stratosphere', 'synchronicitic', 'synchronicitical', 'systems', 'tranquility', 'typecraft', 'unify', 'unison', 'units', 'utopia', 'vacuum', 'watches', 'watchmaking', 'whisper', 'winery', 'world', 'zen'], // Chaos
  'chaotic': ['ai', 'ambient', 'automated', 'bakery', 'bauhaus', 'behavioral', 'bistro', 'blended', 'calculated', 'calm', 'cast', 'cerebral', 'charted', 'chill', 'clinical', 'coded', 'coherent', 'columnar', 'compliant', 'concentrated', 'concreteness', 'constant', 'cultivated', 'decisive', 'deeptech', 'definite', 'deliberate', 'depictive', 'discretion', 'doctrinal', 'easy', 'enclosed', 'exact', 'factory', 'filtered', 'fintech', 'flawless', 'formality', 'formed', 'functionalist', 'harmonic', 'hotels', 'hushing', 'intact', 'integrated', 'japandi', 'labeled', 'led', 'leisurely', 'level', 'logical', 'mechanic', 'mechanical', 'mellow', 'methodical', 'modelling', 'mono', 'neat', 'nordic', 'normal', 'obedient', 'parametric', 'pastoral', 'peace', 'peaceful', 'perfect', 'planned', 'pleasant', 'practical', 'predefined', 'predetermined', 'predictable', 'premeditated', 'prime', 'procedural', 'rational', 'reassuring', 'regression', 'regulated', 'remote', 'reserved', 'resolved', 'rest', 'restrained', 'robotic', 'robotics', 'rooted', 'rural', 'sane', 'scheduled', 'scholarly', 'scientific', 'seamless', 'sequential', 'serene', 'serious', 'settled', 'simplify', 'simplifying', 'sober', 'solidity', 'spotless', 'square', 'stability', 'staged', 'steadfast', 'sterile', 'stoic', 'storyful', 'strategic', 'structural', 'studious', 'swiss', 'symbolism', 'symphonic', 'synchronized', 'tame', 'techno-futurism', 'technographic', 'techwear', 'unchanged', 'unhurried', 'unified', 'uniform', 'uninterrupted', 'utilitarian', 'utopian', 'wash', 'xr'], // Chaotic
  'chaotic-abundance': ['limit'], // Chaotic-Abundance
  'charge': ['retreat'], // Charge
  'charity': ['malice'], // Charity
  'charming': ['repelling'], // Charming
  'charted': ['ambiguous', 'chaotic', 'disordered', 'fluid', 'improvised', 'random', 'uncertain', 'uncharted-terrain', 'vague'], // Charted
  'cheap': ['elite', 'exclusive', 'expensive', 'lavish', 'luxury', 'opulent', 'premium', 'refined', 'sophisticated', 'wealth'], // cheap
  'checkered': ['plain', 'single', 'solid'], // Checkered
  'cheeky': ['polite', 'respectful'], // Cheeky
  'cheer': ['gloom', 'heavy'], // Cheer
  'cheerful': ['bitter', 'bleak', 'dismal', 'drag', 'drain', 'dreary', 'gothic', 'grim', 'haunting', 'ominous', 'pessimistic', 'solemn', 'somber', 'stern'], // Cheerful
  'cheerfulness': ['dimness'], // Cheerfulness
  'chemical': ['aromatherapy'], // Chemical
  'chemicals': ['nutraceuticals'], // Chemicals
  'cherish': ['despise', 'disapproval', 'disdain', 'dislike', 'neglect'], // Cherish
  'cherished': ['disposable', 'forgotten'], // Cherished
  'cherishing': ['apathy', 'betrayal', 'despair', 'detachment', 'disdain', 'disdainful', 'dismissive', 'indifferent', 'neglecting'], // Cherishing
  'chiaroscuro': ['flat', 'minimalistic', 'plain', 'uniform'], // Chiaroscuro
  'chic': ['awkwardness', 'clumsy', 'crude', 'frumpy', 'tacky'], // Chic
  'childcare': ['abandon', 'academic', 'adult-services', 'chaos', 'corporate', 'detachment', 'disorder', 'elderly-care', 'ignorance', 'indifference', 'neglect'], // Childcare
  'childhood': ['adulthood', 'adulting', 'independence', 'maturity', 'responsibility', 'seriousness'], // Childhood
  'childless': ['motherhood'], // childless
  'childlike': ['adult', 'mature', 'serious', 'sophisticated'], // Childlike
  'children-s': ['adult', 'mature'], // Children's
  'chill': ['active', 'aggressive', 'agitated', 'chaotic', 'frantic', 'heat', 'intense', 'melt', 'tense'], // Chill
  'chilled-contrast': ['heated'], // Chilled-Contrast
  'chipped': ['complete', 'polished', 'refined', 'smooth', 'whole'], // Chipped
  'chore': ['hobby'], // Chore
  'chromatic': ['achromatic', 'monochrome', 'neutral'], // Chromatic
  'chronicle': ['premium', 'whirlwind'], // Chronicle
  'chronos': ['aion', 'eternal', 'eternity', 'evanescent', 'infinity', 'timelessness', 'void'], // Chronos
  'chthonic': ['celestial', 'ethereal', 'transcendent'], // Chthonic
  'chunky': ['minimal', 'refined', 'sleek', 'streamlined', 'thin'], // Chunky
  'cider': ['spirits', 'wine'], // Cider
  'cinematic': ['documentary', 'minimal', 'mundane', 'ordinary', 'static'], // Cinematic
  'cinematography': ['led', 'photography', 'rendering'], // Cinematography
  'circle': ['angle', 'corner', 'line', 'point', 'rectangle', 'square'], // Circle
  'circuit': ['chaos', 'disorder', 'fluidity', 'organic', 'random'], // Circuit
  'circuitous': ['direct', 'linear', 'linear-path', 'simple', 'straight'], // circuitous
  'circular': ['angular', 'hexagonal', 'linear', 'octagonal', 'pointed', 'straight'], // Circular
  'civilization': ['wilderness'], // civilization
  'civilized': ['terrain'], // Civilized
  'clamor': ['calm', 'clarity', 'harmony', 'order', 'serenity', 'silence', 'silent', 'simplicity', 'stillness'], // clamor
  'clamping': ['unfolding'], // clamping
  'clarify': ['muffle', 'vacate'], // Clarify
  'clarifying': ['diluting'], // Clarifying
  'clarity': ['absence', 'absurdity', 'abyss', 'aura', 'awkwardness', 'blackout', 'blindness', 'blurb', 'breakdown', 'clamor', 'complexity', 'complication', 'confusion', 'contradiction', 'darkness', 'deceit', 'denial', 'dimness', 'discomfort', 'disempowerment', 'disguise', 'disillusion', 'disorder', 'distortion', 'dream', 'eclipse', 'emission', 'erasure', 'filth', 'fog', 'foolishness', 'fuzz', 'fuzzy', 'glitch', 'gloom', 'guilt', 'hassle', 'haze', 'heavy', 'idiosyncrasy', 'ignorance', 'illusion', 'imposition', 'impotence', 'impression', 'impressionist', 'insignificance', 'interference', 'jumble', 'limbo', 'mess', 'mismatch', 'mist', 'muddle', 'myth', 'narrowness', 'nebula', 'nocturn', 'obliteration', 'oblivion', 'obscurity', 'obsolescence', 'obstacle', 'paradox', 'pixelation', 'pollution', 'postlude', 'pressure', 'scribble', 'silhouette', 'sloppiness', 'stupidity', 'subjectivity', 'superimposition', 'surrealism', 'tumult', 'vacuum', 'verbosity'], // Clarity
  'clash': ['sameness'], // Clash
  'clashing': ['blended', 'harmonic'], // Clashing
  'classic': ['faddish', 'new', 'nouveau', 'retrofuturism', 'streetwear', 'trendiness'], // Classic
  'classic-integrity': ['faddish'], // Classic-Integrity
  'classical': ['jazz', 'pop-culture'], // Classical
  'classicism': ['chaos', 'deconstructivist', 'disorder', 'eclectic', 'experimental', 'grunge', 'memphis', 'modern', 'pop-art', 'postmodernism'], // Classicism
  'classy': ['tacky'], // Classy
  'clatter': ['calm', 'certain', 'cohesive', 'orderly', 'quiet', 'smooth', 'steady', 'understated-tranquility', 'unified'], // Clatter
  'clean': ['blotchy', 'brushwork', 'dirt', 'dust', 'fussy', 'gothic', 'grime', 'grungy', 'impure', 'mess', 'messy', 'muddy', 'murky', 'ochre', 'painterly', 'patina', 'polluted', 'pulp', 'rusty', 'shifty', 'sloppy', 'smeared', 'splat', 'toxic', 'waste'], // Clean
  'clean-cut': ['ragged'], // Clean-Cut
  'cleanliness': ['baroque', 'cluttered', 'disorder', 'filth', 'fuzz', 'grime', 'grunge', 'maximalism', 'messy', 'ruin', 'squalor'], // Cleanliness
  'cleansing': ['contamination', 'dirtiness', 'pollution'], // Cleansing
  'clear': ['aftermath', 'aimless', 'awkward', 'blind', 'blobby', 'blotchy', 'blunt', 'blur', 'blurred', 'bokeh', 'brushstroke', 'burdened', 'burnt', 'challenging', 'closed', 'cloudy', 'clueless', 'concealed', 'concealing', 'conflicted', 'confused', 'confusing', 'corrupt', 'crooked', 'darkmode', 'deceptive', 'despairing', 'diffused', 'dirt', 'distorted', 'doubtful', 'dust', 'enigmatic', 'extraneous', 'false', 'flicker', 'flood', 'foolish', 'fraudulent', 'frayed', 'fugitive', 'fumble', 'fuzzy', 'grim', 'grime', 'harried', 'hazy', 'hesitant', 'illogical', 'illusory', 'imprecise', 'impure', 'incomplete', 'indistinct', 'intangible', 'interstitial', 'invisible', 'jumbled', 'labyrinthine', 'lost', 'masked', 'muddy', 'muffled', 'murky', 'mysterious', 'nebulous', 'neumorphic', 'noisy', 'nowhere', 'numb', 'oblique', 'obscured', 'obscuring', 'opaque', 'pixelation', 'polluted', 'rambling', 'roughness', 'scatterbrained', 'scratched', 'scrawl', 'sealed', 'serpentine', 'shifty', 'shroud', 'shrouded', 'smeared', 'smoky', 'splash', 'splotchy', 'storm', 'strange', 'stuffy', 'subduing', 'subsurface', 'suppressed', 'symbolic', 'tainted', 'tangle', 'toxic', 'twist', 'twisted', 'uncertain', 'unchanged', 'unfocused', 'unhinged', 'unknown', 'vague', 'veiled', 'veiling', 'viscous', 'wavering'], // Clear
  'climate': ['chaos', 'disorder', 'instability', 'randomness', 'rupture'], // Climate
  'climb': ['plummet'], // Climb
  'clinging': ['fleeing'], // Clinging
  'clinical': ['casual', 'chaotic', 'homely', 'intuitive', 'organic', 'romantic', 'warm'], // Clinical
  'cloak': ['uncover'], // Cloak
  'cloistered': ['accessible', 'dispersed', 'exposed', 'open'], // Cloistered
  'closed': ['begin', 'clear', 'empty', 'expose', 'free', 'frontier', 'open', 'openness', 'start', 'unfold'], // closed
  'closeness': ['alienation', 'detachment', 'disconnection', 'distance', 'estrangement', 'isolation', 'loneliness', 'remoteness', 'separation'], // Closeness
  'closing': ['connection', 'continuity', 'eternity', 'expansion', 'growth', 'opening', 'permanence', 'presence', 'unfolding'], // closing
  'closure': ['beginning', 'expanse', 'openness', 'opportunity', 'passage', 'portal', 'prelude', 'vastness'], // Closure
  'cloud': ['ground', 'solid', 'static'], // Cloud
  'cloudy': ['bright', 'clear', 'dry', 'gleaming', 'open', 'sharp', 'solid', 'sunny', 'vivid'], // cloudy
  'clueless': ['aware', 'certain', 'clear', 'expertise', 'focused', 'informed', 'insightful', 'knowledgeable', 'sharp'], // clueless
  'clumsiness': ['delicacy', 'expertise'], // clumsiness
  'clumsy': ['capable', 'chic', 'coordinated', 'elegant', 'ergonomic', 'feminine', 'flawless', 'graceful', 'perceptive', 'polished', 'refined', 'skillful', 'swift'], // Clumsy
  'clunky': ['aerodynamic', 'elegant', 'refined', 'sleek', 'streamlined'], // Clunky
  'cluster': ['disperse', 'scatter'], // Cluster
  'clustered': ['detached', 'dispersal', 'dispersed', 'isolated', 'scattered', 'separated'], // Clustered
  'clustering': ['disorder', 'dispersion', 'minimalistic', 'sparse', 'symmetry'], // Clustering
  'clutter': ['aesthetics', 'beauty', 'proportion', 'transparency', 'whisper', 'zen'], // Clutter
  'cluttered': ['accessible', 'aero', 'arrangement', 'array', 'basic', 'basis', 'centered', 'cleanliness', 'complex', 'composition', 'constellation', 'curated', 'dashboard', 'diorama', 'efficiency', 'essentialism', 'fintech', 'focused', 'japandi', 'minimalism', 'minimalistic', 'neat', 'nexus', 'ordered', 'organized', 'poetic', 'prestige', 'pristine', 'pure', 'resonance', 'simple', 'simplify', 'simplifying', 'streamline', 'tabs', 'uninterrupted', 'untouched', 'wholesome'], // Cluttered
  'coarse': ['fine', 'plush', 'polished', 'powder', 'refined', 'silk', 'sleek', 'slick', 'smooth', 'soft', 'supple', 'velvet', 'watchmaking', 'yielding'], // Coarse
  'coarseness': ['smoothness'], // coarseness
  'coastal': ['industrial', 'urban'], // Coastal
  'coda': ['prelude'], // coda
  'coded': ['chaotic', 'fluid', 'natural', 'organic', 'spontaneous'], // Coded
  'coding': ['art', 'chaos', 'disorder', 'improvisation', 'spontaneity'], // Coding
  'coexistence': ['conflict', 'detachment', 'isolation'], // Coexistence
  'coffee': ['decaf', 'juice', 'tea'], // Coffee
  'cognition': ['premium'], // Cognition
  'cohere': ['collapse', 'separate'], // Cohere
  'coherence': ['breakdown', 'confusion', 'contradiction', 'dissipation', 'mismatch', 'muddle', 'paradox'], // Coherence
  'coherent': ['anarchic', 'awkward', 'chaotic', 'confused', 'confusing', 'disarrayed', 'disjoint', 'disjointed', 'disordered', 'disorderly', 'disorganized', 'fragmented', 'haphazard', 'illogical', 'impure', 'incoherent', 'interstitial', 'jumbled', 'postmodernism', 'random', 'scattered'], // Coherent
  'cohesion': ['detachment', 'disorder', 'dispersal', 'disunity', 'fragmentation', 'obliterating'], // Cohesion
  'cohesive': ['clatter', 'conflicted', 'deconstructed', 'deconstructivism', 'discordant', 'disjointed', 'disparate', 'dividing', 'divisive', 'interrupted', 'jarring', 'scrap', 'segmented', 'sprawl', 'sprawled'], // Cohesive
  'coil': ['flat', 'linear', 'rigid', 'solid', 'straight'], // Coil
  'cold': ['baked', 'bright', 'cozy', 'empathetic', 'fiery', 'fullness', 'heat', 'heated', 'homely', 'hot', 'humanist', 'ignited', 'intimate', 'lively', 'molten', 'pillow', 'radiant', 'romantic', 'soulful', 'sunny', 'vivid', 'warm'], // Cold
  'coldness': ['brightness', 'comfort', 'empathy', 'enthusiasm', 'intimacy', 'joy', 'life', 'passion', 'vibrancy', 'warmth'], // coldness
  'collaboration': ['detachment', 'disunity', 'isolation', 'monopoly'], // Collaboration
  'collaborative': ['detached', 'disjointed', 'exclusive', 'individual', 'isolated', 'isolating', 'isolationist', 'lonely', 'separate', 'solitary'], // Collaborative
  'collage': ['led'], // Collage
  'collapse': ['arch', 'ascendancy', 'build', 'cohere', 'connect', 'expand', 'integrate', 'scaffold', 'solidify', 'strength', 'strengthen', 'unify', 'victory'], // collapse
  'collect': ['disband', 'discard', 'isolate'], // Collect
  'collective': ['divisive', 'individual', 'singular', 'solitary'], // Collective
  'collectivism': ['autonomy', 'detachment', 'independence', 'individualism', 'isolation', 'self-reliance', 'solitude'], // Collectivism
  'color': ['bleakness'], // Color
  'colorful': ['barren', 'bland', 'bleak', 'bore', 'boring', 'colorless', 'drab', 'drain', 'dry', 'dull', 'dullard', 'insipid', 'lame', 'lifeless', 'monochrome', 'monotonous', 'mute', 'muted', 'nocturn', 'ordinary', 'plain', 'sober', 'stale', 'tedious', 'unchanged'], // Colorful
  'colorfulness': ['desaturation', 'monochrome'], // Colorfulness
  'colorless': ['colorful', 'saturated', 'vivid'], // Colorless
  'colossal': ['diminutive', 'small', 'tiny'], // Colossal
  'columnar': ['chaotic', 'fluid', 'irregular', 'organic', 'random'], // Columnar
  'combine': ['disassemble', 'divide', 'isolate', 'separate', 'split'], // Combine
  'combined': ['segregated'], // Combined
  'combining': ['dividing'], // Combining
  'comfort': ['agony', 'anguish', 'challenge', 'coldness', 'discomfort', 'dissatisfaction', 'hassle', 'heavy', 'pain', 'panic', 'sorrow', 'strain', 'stress', 'struggle', 'torment', 'warning'], // Comfort
  'comfortable': ['numb', 'uneasy'], // Comfortable
  'comic': ['minimal', 'serious', 'sophisticated', 'stoic'], // Comic
  'command': ['anarchy', 'chaos', 'decentralization', 'disorder', 'informal'], // Command
  'commencement': ['finale'], // Commencement
  'commercial': ['artistic', 'experimental', 'indie', 'non-profit', 'nonprofit', 'residential'], // Commercial
  'commercial-aesthetics': ['anti'], // Commercial-Aesthetics
  'commercial-chic': ['grungy'], // Commercial-Chic
  'commit': ['resign', 'vacate', 'waver'], // Commit
  'commitment': ['abandon', 'abandonment', 'freetime'], // Commitment
  'commodity': ['art', 'deeptech', 'individual', 'rare', 'unique', 'watchmaking'], // Commodity
  'common': ['alien', 'apex', 'atypical', 'boutique', 'distinct', 'distinction', 'elite', 'exceptional', 'exclusive', 'exotic', 'extraordinary', 'fame', 'famous', 'gourmet', 'incomplete', 'individual', 'lofty', 'majestic', 'mystic', 'mythic', 'novel', 'personalized', 'prime', 'private', 'rare', 'singular', 'special', 'stellar', 'uncommon', 'unfamiliar', 'unique', 'uniqueness', 'vanguard', 'yachting'], // Common
  'commonality': ['exclusivity'], // commonality
  'communal': ['isolating', 'premium'], // Communal
  'communication': ['premium'], // Communication
  'communicative': ['nonverbal'], // Communicative
  'communism': ['capitalism'], // communism
  'community': ['exile', 'premium', 'solitude'], // Community
  'compact': ['flaky', 'loosen', 'porous', 'sprawl', 'sprawled', 'spread'], // Compact
  'companion': ['exclusion', 'isolation', 'separation', 'solitude'], // Companion
  'companionship': ['anonymity', 'independence', 'isolation', 'solitude'], // Companionship
  'compassion': ['cruelty', 'heavy', 'scorn'], // Compassion
  'competence': ['heavy', 'lost'], // Competence
  'competent': ['amateur'], // Competent
  'competition': ['monopoly'], // Competition
  'complacency': ['ambition', 'urgent', 'vigilance', 'zeal'], // Complacency
  'complacent': ['active', 'alert', 'aware', 'curious', 'driven', 'dynamic', 'engaged', 'responsive', 'vigilant'], // Complacent
  'complacent-serenity': ['agitation'], // Complacent-Serenity
  'complementary': ['disparate', 'saturation', 'tones'], // Complementary
  'complete': ['broken', 'chipped', 'deconstructed', 'empty', 'flawed', 'folded', 'fracture', 'fragmented', 'incomplete', 'incomplete-can-be-replaced-with-unfinished-for-better-mutual-exclusivity', 'interrupted', 'leak', 'partial', 'scrap', 'tear', 'vacant'], // Complete
  'complete-manifestation': ['incomplete', 'vacant'], // Complete-Manifestation
  'completeness': ['absence', 'flaw', 'fragmentation', 'glimpse', 'imperfection', 'liminality'], // Completeness
  'completing': ['obliterating'], // Completing
  'completion': ['absence', 'chaos', 'deconstruction', 'disarray', 'disruption', 'fragment', 'incompletion', 'journey', 'limbo', 'neglect', 'quest', 'suspension', 'void', 'yearning'], // completion
  'complex': ['accessible', 'array', 'artless', 'base', 'basic', 'binary', 'blank', 'cluttered', 'easy', 'essentialism', 'lightweight', 'minimalism', 'minimalistic', 'mono', 'naive', 'null', 'obvious', 'plain', 'primitive', 'pure', 'relatable', 'rudimentary', 'simple', 'simplify', 'single', 'straightforward', 'streamline', 'tabs', 'trivial'], // Complex
  'complexity': ['clarity', 'flattening', 'fleshless', 'lucidity', 'minimize', 'monoculture', 'neat', 'order', 'simplicity', 'singularity', 'sparsity'], // Complexity
  'compliance': ['rebellion', 'resistance'], // Compliance
  'compliant': ['chaotic', 'contrary', 'defiant', 'disorderly', 'nonconformist', 'rebellious', 'resistant', 'unruly'], // Compliant
  'complicate': ['simplify'], // Complicate
  'complicating': ['simplifying'], // Complicating
  'complication': ['balance', 'clarity', 'ease', 'harmony', 'simplicity', 'solutions', 'unity'], // Complication
  'composed': ['frantic', 'heavy'], // Composed
  'compositing': ['illustration', 'isolate', 'led', 'photography'], // Compositing
  'composition': ['cluttered', 'disheveled', 'disorder', 'disorganized', 'display', 'docs', 'drawer', 'drop', 'effects', 'elegant', 'elements', 'experimental', 'fashion', 'font', 'fonts', 'header', 'image', 'interactions', 'interactive', 'light', 'like', 'loading', 'luxurious', 'magazine', 'measurement', 'menu', 'messy', 'minimalistic', 'modal', 'modern', 'monospace', 'music', 'old', 'page', 'portfolio', 'product', 'random', 'sophisticated', 'space', 'spacious', 'states', 'static', 'timeline', 'ui', 'underline'], // Composition
  'composure': ['agitation', 'apprehension', 'chaos', 'confusion', 'disorder', 'distress', 'panic', 'restlessness', 'turmoil', 'unrest'], // Composure
  'compress': ['magnify'], // Compress
  'compressed': ['unhurried'], // Compressed
  'compressing': ['diffusing', 'expanding', 'freeing', 'loosening', 'releasing', 'spreading', 'unfolding'], // compressing
  'compression': ['expansion'], // Compression
  'computational': ['artisan', 'improvised', 'intuitive', 'natural', 'organic', 'spontaneous'], // Computational
  'computing': ['premium'], // Computing
  'conceal': ['bleed', 'trace', 'uncover', 'unveiling'], // Conceal
  'concealed': ['aerial', 'apparent', 'clear', 'exposed', 'manifest', 'obvious', 'open', 'publishing', 'revealed', 'transparency', 'visible'], // concealed
  'concealing': ['clear', 'displaying', 'exposing', 'obvious', 'open', 'revealing', 'showing', 'transparent', 'unfolding'], // Concealing
  'concealment': ['exposure', 'glimpse', 'revelation', 'self-expression', 'unveiling', 'visualization'], // Concealment
  'concentrate': ['disperse'], // Concentrate
  'concentrated': ['chaotic', 'diffuse', 'diffused', 'dispersed', 'dispersed-tone', 'distracted', 'loose', 'random', 'scattered', 'uncertain', 'vague'], // Concentrated
  'concentrating': ['diluting', 'dissolving'], // Concentrating
  'concentration': ['diffusion', 'dissipation'], // Concentration
  'concentricity': ['asymmetry', 'decentralization', 'disorder', 'dispersion', 'eccentricity'], // Concentricity
  'conception': ['chaos', 'disorder', 'disruption', 'emptiness', 'fragmentation', 'void'], // Conception
  'conceptual': ['literal', 'pictorial', 'practical', 'traditional'], // Conceptual
  'conceptual-formalism': ['wacky'], // Conceptual-Formalism
  'concise': ['extraneous', 'rambling'], // Concise
  'conciseness': ['verbosity'], // Conciseness
  'conclusion': ['hypothesis', 'prelude'], // conclusion
  'concord': ['contradiction', 'deceit', 'disunity', 'harmonic-clash'], // Concord
  'concrete': ['abstraction', 'airy', 'astral', 'biophilic', 'disembodiment', 'dreamlike', 'endless', 'ethereal', 'flexible', 'fluid', 'freeform', 'gardening', 'imaginary', 'intangible', 'light', 'mystic', 'natural', 'organic', 'rural', 'soft', 'spirit', 'theoretical', 'vague', 'virtual', 'wood'], // Concrete
  'concreteness': ['abstract', 'chaotic', 'disjointed', 'fleeting', 'fluid', 'imagination', 'incoherent', 'indeterminate', 'liminality', 'vague'], // concreteness
  'condensed': ['serif'], // Condensed
  'condiments': ['dessert', 'main-course'], // Condiments
  'conduit': ['blockage', 'disconnection', 'obstruction'], // Conduit
  'cone': ['cube', 'sphere'], // Cone
  'confectionery': ['health', 'savory'], // Confectionery
  'conferences': ['casual', 'informal'], // Conferences
  'confidence': ['apprehension', 'discomfort', 'disillusion', 'distrust', 'doubt', 'doubting', 'fear', 'guilt', 'heavy', 'hesitation', 'shame'], // Confidence
  'confident': ['awkward', 'backward', 'confused', 'doubtful', 'gentle', 'hesitant', 'humble', 'muted', 'shy', 'timid', 'uncertain', 'understated', 'uneasy', 'vacant', 'vulnerable'], // Confident
  'confine': ['expand', 'freeness'], // Confine
  'confined': ['blockchain', 'breezy', 'freeform', 'limitless', 'unbound', 'unconfined', 'unformed', 'unfounded', 'unhurried', 'unified', 'uninterrupted', 'unsteady', 'untamed', 'vast'], // Confined
  'confinement': ['escape', 'expanse', 'expansion', 'freedom', 'liberation', 'openness', 'release', 'vastness', 'vista'], // Confinement
  'confining': ['airy', 'expansive', 'fluid', 'free', 'liberated', 'open', 'unbound', 'unfolding', 'vast'], // confining
  'confirming': ['diluting'], // Confirming
  'conflict': ['accord', 'agreement', 'alignment', 'balance', 'coexistence', 'consensus', 'cooperation', 'harmony', 'peace', 'symbiosis', 'unify', 'unity'], // conflict
  'conflicted': ['clear', 'cohesive', 'direct', 'effortless', 'focused', 'harmonious', 'resolved', 'settled', 'simple', 'unified'], // Conflicted
  'conflicting': ['blended', 'harmonic'], // Conflicting
  'conform': ['disrupt', 'diverge', 'individual', 'innovate', 'nonconform', 'unique'], // conform
  'conformist': ['anarchic', 'defiant', 'rebel'], // Conformist
  'conformity': ['asymmetry', 'autonomy', 'counterculture', 'creativity', 'customization', 'discovery', 'diversity', 'idiosyncrasy', 'lifestyle', 'nonconformity', 'quest', 'rebellion', 'redefinition', 'reinvention', 'resistance', 'self-expression', 'surrealism', 'uniqueness'], // Conformity
  'confront': ['accept', 'avoid', 'calm', 'embrace', 'escape', 'evade', 'gentle', 'harmony', 'peace', 'retreat', 'surrender'], // confront
  'confused': ['certain', 'clear', 'coherent', 'confident', 'direct', 'focused', 'identified', 'literacy', 'logical', 'lucid', 'sane', 'simple', 'understood'], // confused
  'confusing': ['clear', 'coherent', 'defined', 'direct', 'focused', 'informative', 'organized', 'simple', 'simplifying', 'straightforward'], // Confusing
  'confusion': ['annotation', 'belief', 'certainty', 'clarity', 'coherence', 'composure', 'depiction', 'edutainment', 'efficacy', 'flowchart', 'focus', 'fortitude', 'harmony', 'insight', 'integrity', 'interpretation', 'lucidity', 'marketing', 'meaning', 'messaging', 'method', 'objectivity', 'order', 'outlining', 'resolve', 'scholarship', 'sense', 'signal', 'simplicity', 'solutions', 'statement', 'understanding', 'vision', 'visualization'], // Confusion
  'conglomerating': ['dividing', 'isolating', 'simplifying'], // Conglomerating
  'connect': ['alienation', 'break', 'collapse', 'detachment', 'disassemble', 'disconnect', 'disunity', 'divide', 'division', 'estrangement', 'evade', 'isolate', 'isolation', 'separate', 'separation', 'split', 'tear'], // connect
  'connected': ['absent', 'detached', 'disjoint', 'disjointed', 'distant', 'divisive', 'fracture', 'segregated', 'tightened'], // Connected
  'connectedness': ['detachment', 'disconnection', 'isolation'], // Connectedness
  'connecting': ['isolating'], // Connecting
  'connection': ['abandon', 'abandonment', 'alienation', 'barrier', 'closing', 'detachment', 'disconnect', 'exile', 'expulsion', 'heavy', 'negation', 'shunning', 'solitude'], // Connection
  'connectivity': ['premium'], // Connectivity
  'conquer': ['chaos', 'defeat', 'disorder', 'division', 'fail', 'fear', 'hesitation', 'uncertain', 'weakness'], // Conquer
  'conscience': ['detached', 'disapproval', 'dislike', 'disorder', 'distrust'], // Conscience
  'conscientious': ['premium'], // Conscientious
  'conscious': ['detached', 'disengaged', 'ignorant', 'mindless', 'oblivious', 'unconscious'], // Conscious
  'consensus': ['anarchy', 'chaos', 'conflict', 'counterculture', 'disagreement', 'dissent', 'disunity', 'diversity', 'indifference', 'subjectivity', 'uncertainty'], // consensus
  'consequence': ['acausal', 'arbitrary', 'chaos', 'disorder', 'impunity', 'random', 'uncertainty'], // Consequence
  'conservation': ['consumption', 'destruction', 'development', 'exploitation', 'neglect', 'waste'], // Conservation
  'conservative': ['psychedelic', 'vanguard'], // Conservative
  'consider': ['dismiss', 'disregard'], // Consider
  'considerate': ['careless', 'selfish'], // Considerate
  'consideration': ['negligence'], // Consideration
  'consistency': ['anomaly', 'contradiction', 'divergence', 'fluke', 'juxtaposition', 'mismatch', 'paradox'], // Consistency
  'consistent': ['discordant', 'disjointed', 'disparate', 'disruptive', 'dragged', 'fickle', 'postlude', 'reactive', 'shaky', 'splotchy', 'uneven', 'unreliable', 'unstable', 'variable', 'volatile'], // Consistent
  'consolidate': ['chaos', 'disperse', 'disunity', 'divide', 'fragment', 'loose', 'radial-break', 'scatter', 'separate'], // Consolidate
  'consolidated': ['distributed'], // consolidated
  'constancy': ['adaptability', 'change', 'chaos', 'disorder', 'fluctuation', 'flux', 'impermanence', 'instability', 'metamorphosis', 'transformation', 'transience', 'uncertainty', 'variability'], // Constancy
  'constant': ['changing', 'chaotic', 'dynamic', 'evanescent', 'fickle', 'fleeting', 'flicker', 'fluid', 'folding', 'morph', 'mutable', 'random', 'seasons', 'shift', 'sudden', 'suddenness', 'tangential', 'uncertain', 'variable', 'variant', 'wavering'], // constant
  'constellation': ['chaos', 'cluttered', 'disorder', 'dispersal', 'randomness'], // Constellation
  'constrain': ['expand'], // Constrain
  'constrained': ['endlessness', 'freestyle', 'heavy', 'limitless', 'loose', 'unbound'], // Constrained
  'constraining': ['empowering'], // Constraining
  'constraint': ['chaos', 'expansion', 'fluidity', 'freedom', 'freeness', 'freetime', 'liberty', 'openness', 'release', 'unbound'], // Constraint
  'constrict': ['airy', 'expand', 'flexible', 'fluid', 'free', 'loose', 'open', 'overflow', 'release', 'spacious'], // Constrict
  'constricted': ['spread'], // Constricted
  'construct': ['destroy', 'disassemble', 'disband', 'dissolve', 'erase', 'erode', 'negate', 'unravel'], // Construct
  'constructed': ['deconstructed', 'environment'], // Constructed
  'construction': ['deconstruction', 'destruction'], // Construction
  'constructive': ['futile'], // Constructive
  'constructivism': ['deconstructivism'], // Constructivism
  'consulting': ['anarchy', 'chaos', 'disorder', 'ignorance', 'randomness'], // Consulting
  'consume': ['create', 'disperse', 'generate', 'gift', 'offer', 'produce', 'share', 'sustain'], // consume
  'consumerism': ['detachment', 'frugality', 'minimalism', 'simplicity', 'sustainability'], // Consumerism
  'consumption': ['abstinence', 'conservation', 'creation', 'frugality', 'production'], // Consumption
  'contain': ['bleed', 'burst', 'emit', 'overflow', 'spill'], // Contain
  'contained': ['dispersed', 'distributed', 'endlessness', 'erupt', 'expansive', 'open', 'spread', 'unbounded', 'unconfined', 'unfettered', 'unrestricted'], // Contained
  'containment': ['diffusion', 'dispersal', 'emission', 'expansion', 'freedom', 'openness', 'release', 'spill'], // Containment
  'contamination': ['cleansing', 'purity'], // Contamination
  'contemplation': ['heavy'], // Contemplation
  'contemplative': ['heavy'], // Contemplative
  'contemporary': ['ancient', 'archaic', 'ethnic', 'historical', 'museum', 'retrofuturism'], // Contemporary
  'contempt': ['admiring', 'favor', 'respect', 'veneration'], // Contempt
  'content': ['anxious', 'frustration', 'restless', 'uneasy'], // Content
  'contented': ['restless', 'uneasy'], // Contented
  'contentment': ['anxiety', 'displeasure', 'dissatisfaction', 'guilt', 'heavy', 'panic', 'shame', 'yearning'], // Contentment
  'context': ['ambiguity', 'chaos', 'disconnect', 'disorder', 'ignorance', 'narrative-absence', 'random', 'vacuum', 'void'], // Context
  'continental': ['marine'], // Continental
  'continuation': ['end', 'ended'], // Continuation
  'continue': ['deadend'], // Continue
  'continuity': ['closing', 'detachment', 'disorder', 'dispersal', 'disruption', 'finality', 'fracture', 'fragment', 'moment', 'rupture'], // Continuity
  'continuous': ['fracture', 'interrupted', 'pixel', 'pixelated', 'segmented', 'staccato', 'stopped'], // Continuous
  'continuum': ['discontinuity', 'fragment', 'isolation', 'separation', 'singularity'], // Continuum
  'contour': ['chaos', 'disorder', 'flat'], // Contour
  'contract': ['expand'], // Contract
  'contraction': ['expanse', 'expansion'], // contraction
  'contradiction': ['agreement', 'certainty', 'clarity', 'coherence', 'concord', 'consistency', 'harmony', 'simplicity', 'unity'], // Contradiction
  'contrary': ['compliant'], // Contrary
  'contrast': ['cool', 'cozy', 'display', 'docs', 'drawer', 'drop', 'effects', 'elegant', 'elements', 'experimental', 'fashion', 'font', 'fonts', 'header', 'image', 'interactions', 'interfacing', 'like', 'loading', 'luxurious', 'magazine', 'measurement', 'menu', 'minimalistic', 'minimize', 'modal', 'modern', 'monoculture', 'monospace', 'old', 'page', 'portfolio', 'product', 'sameness', 'sophisticated', 'space', 'spacious', 'states', 'timeline', 'ui', 'unison', 'unity'], // Contrast
  'contrasted': ['blended'], // Contrasted
  'contrasting': ['analogous', 'neumorphic'], // Contrasting
  'contrived': ['candid', 'genuine', 'naturalistic'], // Contrived
  'control': ['disempowerment', 'drift', 'freeness', 'heavy', 'liberation', 'overflow', 'risk', 'sovereignty', 'submission'], // Control
  'controlled': ['anarchic', 'feral', 'fumbled', 'loose', 'postlude', 'splat', 'unruly', 'unstable', 'untamed', 'wild'], // Controlled
  'convenience': ['arduous', 'cumbersome', 'premium', 'tedious'], // Convenience
  'convention': ['invention'], // Convention
  'conventional': ['disruptive', 'exploratory', 'frontier', 'improvised', 'informal', 'innovative', 'inventive', 'irreverent', 'offbeat', 'revolutionary', 'subjective', 'underground', 'vanguard'], // Conventional
  'convergence': ['dispersal', 'divergence', 'fragmentation', 'isolation', 'refraction', 'separation'], // Convergence
  'convergent': ['branching'], // Convergent
  'conviction': ['doubt', 'doubting'], // Conviction
  'convolution': ['linearity', 'minimalistic', 'order', 'simplification'], // Convolution
  'cooking': ['laundry'], // cooking
  'cool': ['blazing', 'burnt', 'contrast', 'cozy', 'cyberpunk', 'dramatic', 'duotone', 'energetic', 'fiery', 'food', 'friendly', 'gradient', 'heat', 'heated', 'ignite', 'intensify', 'inviting', 'melt', 'molten', 'monochromatic', 'monochrome', 'muted', 'neon', 'nonprofit', 'ochre', 'pastel', 'powerful', 'rainbow', 'saturation', 'sepia', 'sports', 'stale', 'startup', 'strict', 'travel', 'triadic', 'understated', 'vibrant', 'warm', 'welcoming'], // Cool
  'coolness': ['awkward', 'energetic', 'expressive', 'fervor', 'food', 'friendly', 'gradient', 'inviting', 'lame', 'monochromatic', 'monochrome', 'muted', 'neon', 'nonprofit', 'pastel', 'rainbow', 'sepia', 'sports', 'startup', 'strict', 'tones', 'travel', 'triadic', 'understated', 'vibrant', 'warm', 'welcoming'], // Coolness
  'cooperation': ['conflict', 'war'], // Cooperation
  'cooperative': ['capitalism'], // Cooperative
  'coordinated': ['clumsy'], // Coordinated
  'copy': ['invention'], // Copy
  'core': ['facade', 'husk', 'margin', 'periphery', 'surface'], // Core
  'corner': ['chaos', 'circle', 'disperse', 'edge', 'isolation', 'scatter', 'simplicity', 'uncertain', 'void'], // corner
  'corporate': ['childcare', 'media', 'non-profit', 'playful', 'text', 'type'], // Corporate
  'corridor': ['expanse', 'open', 'void'], // Corridor
  'corrugated': ['polished', 'smooth'], // Corrugated
  'corrupt': ['certain', 'clear', 'honest', 'integrity', 'pure', 'purity', 'right', 'trustworthy', 'virtuous'], // corrupt
  'corruption': ['honesty', 'innocence', 'integrity', 'purity', 'trust'], // corruption
  'cosmetics': ['bare', 'essential', 'heavy', 'natural', 'plain', 'raw', 'rough', 'simple', 'unadorned', 'unrefined', 'utilitarian'], // Cosmetics
  'cosmic': ['earthy', 'grounded', 'mundane', 'ordinary', 'petty', 'terrestrial'], // Cosmic
  'cosmos': ['chaos', 'disorder', 'fragmentation', 'nihility', 'void'], // Cosmos
  'cost': ['rewards'], // Cost
  'cottagecore': ['industrial', 'synthetic', 'urban'], // Cottagecore
  'couch': ['athlete'], // Couch
  'counterculture': ['conformity', 'consensus', 'mainstream', 'norms', 'orthodoxy', 'statusquo', 'tradition', 'uniformity'], // Counterculture
  'courage': ['fear'], // Courage
  'courteous': ['rude'], // Courteous
  'cover': ['uncover'], // Cover
  'covered': ['exposed', 'obscured', 'revealed', 'uncovered', 'untouched'], // Covered
  'covert': ['apparent', 'blatant', 'exhibition', 'exposed', 'obvious', 'open', 'overlook', 'overt', 'revealed', 'transparent', 'visible'], // Covert
  'cowardice': ['valor'], // Cowardice
  'cozy': ['cold', 'contrast', 'cool', 'cyberpunk', 'dramatic', 'duotone', 'expressive'], // Cozy
  'cracked': ['intact', 'polished', 'smooth', 'uniform', 'whole'], // Cracked
  'craft': ['brutality', 'chaos', 'deeptech', 'disorder', 'edtech', 'manufacturing', 'neglect', 'robotics', 'simplicity'], // Craft
  'crafted': ['massproduced'], // Crafted
  'craftsmanship': ['chaos', 'disarray', 'haphazard', 'negligence', 'sloppiness'], // Craftsmanship
  'craggy': ['even', 'polished', 'smooth', 'soft'], // Craggy
  'craving': ['heavy'], // Craving
  'crazy': ['sane'], // Crazy
  'creamy': ['grainy', 'rough'], // Creamy
  'create': ['break', 'consume', 'damage', 'destroy', 'erode', 'finish'], // Create
  'creating': ['erasing', 'obliterating'], // Creating
  'creation': ['consumption', 'destruction', 'erasure', 'negation', 'obliteration', 'oblivion', 'ruin', 'void'], // Creation
  'creative': ['legal'], // Creative
  'creativity': ['conformity', 'drudgery', 'idleness', 'monotony', 'rigidity', 'stagnation', 'uniformity'], // Creativity
  'crisp': ['blurry', 'bokeh', 'dull', 'messy', 'rough', 'smoky', 'soft', 'thaw', 'unfocused', 'viscous'], // Crisp
  'crisp-white': ['blotchy'], // Crisp-White
  'crispness': ['blur', 'blurriness', 'softness'], // Crispness
  'critical': ['naive'], // Critical
  'critique': ['approval', 'embrace', 'premium'], // Critique
  'crooked': ['clear', 'honest', 'integral', 'orderly', 'pure', 'simple', 'smooth', 'straight'], // crooked
  'crowded': ['rural', 'single', 'sparsity', 'vacancy'], // Crowded
  'crowned': ['bare', 'humble', 'plain', 'simple', 'unadorned'], // Crowned
  'crude': ['chic', 'dignity', 'elaborate', 'elegant', 'ergonomic', 'fine', 'gourmet', 'literary', 'luxe', 'minimalistic', 'polished', 'prestige', 'pristine', 'refined', 'sophisticated', 'yielding'], // Crude
  'crudeness': ['artistry', 'delicacy'], // crudeness
  'cruelty': ['care', 'compassion', 'empathy', 'gentleness', 'kindness', 'love', 'support', 'warmth'], // Cruelty
  'crunch': ['smoothness', 'softness'], // Crunch
  'cryptocurrency': ['fiat', 'traditional'], // Cryptocurrency
  'crystal': ['formless', 'opaque', 'organic', 'rough'], // Crystal
  'crystalline': ['amorphous', 'dull', 'mundane', 'murky', 'opaque', 'rough'], // Crystalline
  'crystallization': ['dissolution', 'erosion', 'liquefaction'], // Crystallization
  'cube': ['cone', 'cylinder', 'sphere'], // Cube
  'cubical': ['amorphous', 'spherical'], // Cubical
  'cubism': ['chaos', 'disorder', 'field', 'flatness', 'fluidity', 'literal', 'randomness', 'simplicity', 'spontaneity'], // Cubism
  'cubist': ['fluid', 'organic'], // Cubist
  'cultivate': ['disheveled', 'disorder', 'filth', 'messy', 'neglect'], // Cultivate
  'cultivated': ['chaotic', 'disordered', 'neglected', 'primal', 'raw', 'terrain', 'uncontrolled', 'unrefined', 'untamed', 'wild', 'wilderness'], // cultivated
  'cultivation': ['abandonment', 'decay', 'destruction', 'disorder', 'neglect'], // Cultivation
  'culture': ['premium', 'savage'], // Culture
  'cultured': ['vulgar'], // Cultured
  'cumbersome': ['aerodynamic', 'bright', 'convenience', 'dynamic', 'easy', 'fluid', 'light', 'playful', 'simple', 'vivid'], // cumbersome
  'curated': ['arbitrary', 'cluttered', 'disorder'], // Curated
  'curation': ['design', 'illustration', 'led', 'synthesis'], // Curation
  'curatorial': ['premium'], // Curatorial
  'curiosity': ['boredom', 'disinterest', 'heavy'], // Curiosity
  'curious': ['bored', 'complacent', 'disinterested', 'heavy'], // Curious
  'current': ['ancient', 'artifact', 'historical', 'obsolete'], // Current
  'curse': ['gift'], // Curse
  'curtained': ['bare', 'exposed', 'naked', 'open', 'revealed'], // Curtained
  'curvature': ['angular', 'flat', 'flatness', 'flatten', 'linearity', 'rectilinear', 'symmetry', 'unity'], // Curvature
  'curve': ['angle', 'edge', 'line', 'polygon', 'rectangle'], // Curve
  'curved': ['angularity', 'blocky', 'hexagonal', 'planar', 'square'], // Curved
  'curvilinear': ['flat', 'geometric', 'linear', 'rectangular', 'rigid', 'straight'], // Curvilinear
  'curvilinear-harmony': ['disarrayed'], // Curvilinear-Harmony
  'curvy': ['angular', 'boxy', 'even', 'flat', 'linear', 'narrow', 'rectangular', 'rigid', 'sharp', 'straight'], // curvy
  'customization': ['conformity', 'generic', 'impersonality', 'monotony', 'ordinariness', 'sameness', 'standardization', 'uniformity'], // Customization
  'cute': ['harsh', 'rugged'], // Cute
  'cyan': ['amber'], // cyan
  'cyanic': ['muddy'], // Cyanic
  'cybernetic': ['manual', 'natural', 'organic', 'primitive', 'static'], // Cybernetic
  'cyberpunk': ['cool', 'cozy', 'warm'], // Cyberpunk
  'cybersecurity': ['exposure', 'vulnerability'], // Cybersecurity
  'cycle': ['end', 'finality', 'singularity', 'static'], // Cycle
  'cylinder': ['cube', 'flat', 'hollow', 'plane', 'void'], // Cylinder
  'cylindrical': ['angular', 'flat', 'irregular', 'planar', 'polygonal'], // Cylindrical
  'cynical': ['naive', 'optimistic'], // Cynical
  'cynicism': ['hopeful', 'naivety', 'optimism'], // Cynicism
  'dairy': ['dairy-alternative'], // Dairy
  'dairy-alternative': ['animal-based', 'dairy'], // Dairy-alternative
  'damage': ['build', 'create', 'enhance', 'nurture', 'repair', 'restore', 'skincare', 'strength', 'value', 'wholeness'], // damage
  'damaged': ['intact'], // Damaged
  'dampen': ['amplify', 'motivate'], // Dampen
  'danger': ['safety'], // Danger
  'dangerous': ['healthy'], // Dangerous
  'daring': ['cautious'], // Daring
  'dark': ['breezy', 'brilliant', 'glare', 'highlight', 'light', 'ochre', 'phosphor', 'positive', 'shine', 'shiny', 'wash'], // Dark
  'darken': ['ignite'], // Darken
  'darkmode': ['bright', 'clear', 'lightmode', 'luminous', 'vibrant'], // Darkmode
  'darkness': ['beacon', 'brightness', 'clarity', 'dawn', 'glow', 'illumination', 'light', 'lightness', 'lucidity', 'luminance', 'morning', 'radiance', 'reflectivity', 'shine', 'solar', 'vision', 'vividness'], // Darkness
  'dashboard': ['chaos', 'cluttered', 'disorder', 'disorganization', 'dispersal', 'sprawl'], // Dashboard
  'data': ['premium'], // Data
  'data-driven': ['pictorial'], // Data-Driven
  'dated': ['trendiness'], // Dated
  'dawn': ['blackout', 'darkness', 'dimness', 'dusk', 'evening', 'night', 'twilight'], // Dawn
  'day': ['dusk', 'end', 'evening', 'lunar', 'night', 'pause', 'rest', 'sleep', 'stagnation', 'stillness', 'void'], // Day
  'daylight': ['eclipse', 'nocturn'], // Daylight
  'dazzling': ['bland', 'drab', 'dull', 'faded', 'flat', 'muted', 'plain', 'subdued-illumination', 'unremarkable'], // Dazzling
  'dead': ['alive', 'bio', 'live', 'liveliness', 'phosphor', 'thrive'], // Dead
  'deadend': ['continue', 'expansion', 'flow', 'journey', 'open', 'path', 'pathway', 'progress', 'rise'], // deadend
  'death': ['beginning', 'growth', 'hope', 'immortality', 'joy', 'life', 'light', 'rebirth', 'vitality'], // death
  'debossing': ['embossing'], // Debossing
  'debt': ['payments', 'profit'], // Debt
  'decadent': ['health-conscious'], // Decadent
  'decaf': ['coffee'], // Decaf
  'decay': ['bloom', 'cultivation', 'development', 'evolution', 'flourish', 'freshness', 'germination', 'growth', 'longevity', 'rejuvenation', 'renew', 'renewal', 'thrive', 'vitality'], // Decay
  'deceit': ['certainty', 'clarity', 'concord', 'honesty', 'integrity', 'sincerity', 'trust', 'trustworthy', 'truth', 'unity'], // deceit
  'deceleration': ['acceleration'], // Deceleration
  'decentralization': ['centrality', 'command', 'concentricity', 'dominance', 'monopoly'], // Decentralization
  'decentralized': ['centrality', 'centralized'], // Decentralized
  'deception': ['authenticity', 'truth'], // deception
  'deceptive': ['authentic', 'clear', 'genuine', 'honest', 'open', 'real', 'sincere', 'transparent', 'trustworthy'], // deceptive
  'decide': ['waver'], // Decide
  'decisive': ['ambiguous', 'chaotic', 'delay', 'delayed', 'hesitant', 'indecisive', 'random', 'tentativeness', 'uncertain', 'unstable', 'vague'], // Decisive
  'decisiveness': ['hesitation'], // Decisiveness
  'decline': ['accumulation', 'advancement', 'ascendancy', 'ascension', 'ascent', 'development', 'elevation', 'evolve', 'expansion', 'flourish', 'growth', 'improvement', 'peak', 'pinnacle', 'progress', 'prosperity', 'raise', 'rise', 'soar', 'success', 'thrive'], // Decline
  'deco': ['brutalism', 'disjointed', 'minimalism', 'simplicity'], // Deco
  'deconstruct': ['integrate', 'preserve', 'scaffold', 'synthesize'], // Deconstruct
  'deconstructed': ['cohesive', 'complete', 'constructed', 'defined', 'ordered'], // Deconstructed
  'deconstruction': ['architecture', 'completion', 'construction', 'integration', 'synthesis', 'unity'], // Deconstruction
  'deconstructivism': ['cohesive', 'constructivism', 'harmony', 'integrated', 'minimalism', 'order', 'ordered', 'simple', 'stable', 'structuralism', 'traditional', 'uniform'], // Deconstructivism
  'deconstructivist': ['classicism', 'intact', 'order', 'symmetry'], // Deconstructivist
  'decorated': ['base', 'basic', 'blank', 'minimalistic', 'plain', 'simple', 'unadorned', 'untouched'], // Decorated
  'decrease': ['raise', 'rise'], // Decrease
  'deemphasize': ['highlight'], // Deemphasize
  'deep': ['shallow', 'superficial', 'weak'], // Deep
  'deeptech': ['basic', 'chaotic', 'commodity', 'craft', 'disorderly', 'dull', 'low-tech', 'naive', 'ordinary', 'shallow', 'simple', 'traditional'], // Deeptech
  'default': ['typecraft'], // Default
  'defeat': ['conquer', 'optimism', 'success', 'victory'], // Defeat
  'defeated': ['active', 'alive', 'aspirant', 'empowered', 'hopeful', 'successful', 'triumphant', 'victorious', 'winning'], // Defeated
  'defended': ['vulnerable'], // Defended
  'defenseless': ['shielded'], // Defenseless
  'defiance': ['heavy', 'obedience', 'submission'], // Defiance
  'defiant': ['agreeable', 'compliant', 'conformist', 'docile', 'obedient', 'passive', 'submissive', 'vulnerability', 'yielding'], // defiant
  'deficiency': ['abundance', 'bounty', 'excellence', 'might', 'wealth'], // Deficiency
  'deficient': ['fertile', 'filled', 'fortified'], // Deficient
  'deficit': ['produce', 'profit'], // Deficit
  'define': ['vacate'], // Define
  'defined': ['abstraction', 'amorphous', 'blank', 'blobby', 'blur', 'bokeh', 'brushstroke', 'confusing', 'deconstructed', 'diffused', 'disembodied', 'distorted', 'endless', 'endlessness', 'erased', 'faceless', 'formless', 'freeform', 'freestyle', 'fuzzy', 'hazy', 'imprecise', 'impure', 'indistinct', 'interstitial', 'lost', 'muffled', 'nebulous', 'neumorphic', 'nowhere', 'obscuring', 'pixelation', 'scrap', 'scrawl', 'shifty', 'smeared', 'smoky', 'undefined', 'unfocused', 'unformed', 'unfounded', 'ungendered', 'ungrounded', 'unknown', 'unvalued', 'veiling'], // Defined
  'defined-space': ['ungrounded'], // Defined-Space
  'definite': ['ambiguous', 'chaotic', 'disorderly', 'fictional', 'fluid', 'imaginary', 'intangible', 'interstitial', 'nebulous', 'random', 'uncertain', 'undefined', 'unstable', 'vague', 'wobbly'], // definite
  'definition': ['ambiguity', 'blurb', 'distortion', 'erasure', 'fog', 'fuzz', 'imprecise', 'impression', 'indeterminacy', 'messy', 'mist', 'redefinition', 'silhouette', 'vagueness'], // Definition
  'deforestation': ['gardening'], // deforestation
  'delay': ['active', 'affirmative', 'certain', 'decisive', 'immediate', 'prompt', 'resolved', 'rush', 'urgency'], // Delay
  'delayed': ['active', 'certain', 'decisive', 'immediate', 'instant', 'prompt', 'resolved', 'sudden', 'suddenness', 'urgent'], // delayed
  'deliberate': ['artless', 'careless', 'chaotic', 'erratic', 'frivolous', 'fumbled', 'hasty', 'improvised', 'impulsive', 'instinct', 'random', 'spontaneous', 'unplanned'], // Deliberate
  'deliberate-chaos': ['method'], // Deliberate-Chaos
  'deliberate-composition': ['unplanned'], // Deliberate-Composition
  'delicacy': ['brutality', 'cacophony', 'clumsiness', 'crudeness', 'disorder'], // Delicacy
  'delicate': ['brutal', 'garish', 'grotesque', 'resilient', 'rugged', 'thick', 'weighty'], // Delicate
  'delight': ['bore', 'displeasure', 'dissatisfaction', 'pain', 'sorrow'], // Delight
  'delusion': ['awakening'], // Delusion
  'demand': ['abandon', 'aversion', 'disdain', 'disinterest', 'distraction', 'indifference', 'leisure', 'neglect', 'rejection'], // demand
  'demanding': ['easy', 'leisurely'], // Demanding
  'demotivate': ['encourage'], // Demotivate
  'denial': ['acceptance', 'access', 'acknowledgment', 'belief', 'certainty', 'clarity', 'faith', 'reality', 'therapy', 'truth'], // denial
  'dense': ['aero', 'empty', 'flaky', 'foamy', 'hollow', 'lightweight', 'loosen', 'minimalistic', 'perforated', 'plasma', 'porous', 'powder', 'sheer', 'simplify', 'skeletal', 'spacious', 'sprawl', 'stratosphere', 'thin', 'translucency', 'translucent', 'vapor', 'vapour'], // Dense
  'density': ['airiness', 'aura', 'sparsity'], // Density
  'dentistry': ['anarchy', 'chaos', 'disorder', 'neglect', 'pain', 'wild'], // Dentistry
  'deny': ['accept', 'affirm'], // Deny
  'depart': ['remain'], // Depart
  'dependable': ['unreliable'], // Dependable
  'dependence': ['autonomy', 'detachment', 'freedom', 'independence', 'liberty', 'self', 'solipsism', 'solitude', 'sovereignty'], // dependence
  'dependency': ['entrepreneurship'], // dependency
  'depiction': ['ambiguity', 'chaos', 'confusion', 'non-representation', 'vagueness'], // Depiction
  'depictive': ['abstract', 'bland', 'chaotic', 'dull', 'indistinct', 'non-representational', 'random', 'simple', 'vague'], // Depictive
  'deplete': ['abound', 'enhance', 'enrich', 'fill', 'increase', 'multiply', 'nourish', 'supply', 'surplus'], // deplete
  'depletion': ['abundance', 'augmentation', 'bounty', 'fullness', 'growth', 'ingredients', 'materials', 'plenty', 'rejuvenation', 'richness', 'saturation', 'surplus', 'wealth'], // Depletion
  'depravity': ['innocence'], // depravity
  'depress': ['encourage'], // Depress
  'depressed': ['raised'], // Depressed
  'depression': ['elevation'], // depression
  'deprivation': ['abundance', 'access', 'affluence', 'expansion', 'freedom', 'growth', 'liberation', 'nourishment', 'privilege', 'prosperity', 'release', 'sustenance'], // deprivation
  'depth': ['2d', 'facade', 'flatness', 'flatten', 'flattening', 'fleshless', 'horizon', 'sky', 'summit'], // Depth
  'dermatology': ['orthodontics'], // Dermatology
  'desaturation': ['colorfulness'], // desaturation
  'descend': ['ascend', 'elevate', 'evolve', 'float', 'forward', 'rise', 'soar', 'upper'], // Descend
  'descent': ['ascension', 'ascent', 'elevation', 'near', 'pinnacle', 'rise', 'up'], // descent
  'desert': ['jungle', 'nautical'], // Desert
  'deserted': ['hotels'], // Deserted
  'design': ['curation', 'detail', 'irrational', 'muddle', 'scribble', 'sloppiness'], // Design
  'desire': ['heavy'], // Desire
  'desktop': ['wearables'], // Desktop
  'desolate': ['bustling', 'fertile', 'flourishing', 'lively', 'radiant', 'thriving', 'utopian', 'verdant', 'vibrant'], // Desolate
  'desolation': ['atmosphere', 'flotilla'], // Desolation
  'despair': ['celebration', 'cherishing', 'dream', 'euphoria', 'exuberance', 'fullness', 'hopeful', 'might', 'optimism', 'prosperity', 'utopia'], // Despair
  'despairing': ['alive', 'bright', 'clear', 'energized', 'hopeful', 'joyful', 'optimistic', 'uplifting', 'vibrant'], // despairing
  'despise': ['cherish'], // Despise
  'dessert': ['condiments', 'main-course', 'savory'], // Dessert
  'destroy': ['build', 'construct', 'create', 'foster', 'harmony', 'nurturing', 'preserve', 'repair', 'restore', 'sculpt', 'unite'], // destroy
  'destruction': ['building', 'conservation', 'construction', 'creation', 'cultivation', 'development', 'genesis', 'germination', 'growth', 'harmony', 'museum', 'preservation', 'produce', 'rebirth', 'renewal', 'repair', 'shaping', 'unity', 'winery'], // destruction
  'destructive': ['eco-conscious'], // Destructive
  'detach': ['attach', 'bind', 'bond', 'interlock', 'intersect', 'join', 'merge', 'unify', 'weave'], // Detach
  'detached': ['admiration', 'anchored', 'array', 'attached', 'attachment', 'biophilic', 'bound', 'clustered', 'collaborative', 'connected', 'conscience', 'conscious', 'diorama', 'embodiment', 'embraced', 'empathetic', 'engaged', 'experiential', 'framing', 'grounded', 'grounding', 'humanist', 'immerse', 'immersive', 'integrated', 'intentional', 'interconnectedness', 'intertwined', 'interwoven', 'intimate', 'involved', 'nexus', 'resonance', 'root', 'rooting', 'soulful', 'tabs', 'user-centric'], // Detached
  'detaching': ['rooting'], // Detaching
  'detachment': ['absorption', 'accumulation', 'adoption', 'affection', 'agency', 'alignment', 'assemblage', 'assembly', 'attachment', 'belonging', 'celebration', 'cherishing', 'childcare', 'closeness', 'coexistence', 'cohesion', 'collaboration', 'collectivism', 'connect', 'connectedness', 'connection', 'consumerism', 'continuity', 'dependence', 'dwelling', 'embrace', 'emotion', 'empathy', 'engage', 'engagement', 'envelopment', 'experience', 'expressiveness', 'fandom', 'fervor', 'formation', 'grouping', 'inclusion', 'integration', 'interaction', 'interconnection', 'interdependence', 'interplay', 'intimacy', 'involvement', 'layering', 'lifestyle', 'linkage', 'messaging', 'nurturing', 'observation', 'participation', 'passion', 'penetration', 'presence', 'roots', 'selection', 'self-expression', 'shaping', 'subjectivity', 'symbiosis', 'synchronicitical', 'togetherness', 'wholeness'], // Detachment
  'detail': ['design', 'erasure', 'illustration', 'led', 'painting', 'pixelation', 'silhouette', 'synthesis', 'typography'], // Detail
  'detailed': ['artless', 'blank', 'bokeh', 'pixelation', 'rudimentary'], // Detailed
  'deteriorate': ['renew'], // Deteriorate
  'deterioration': ['advancement', 'enhancement', 'flourishing', 'growth', 'improvement', 'preservation', 'prosperity', 'renewal', 'revival', 'strength', 'vitality'], // deterioration
  'determined': ['resigned'], // Determined
  'deterring': ['attractive'], // Deterring
  'detrimental': ['healthy'], // Detrimental
  'devalue': ['valuing'], // Devalue
  'develop': ['finish', 'past'], // Develop
  'developer-centric': ['user-centric'], // Developer-Centric
  'development': ['conservation', 'decay', 'decline', 'destruction', 'ended', 'obsolete', 'stagnation'], // Development
  'devoid': ['fertile'], // Devoid
  'diagnostics': ['guesswork', 'speculation'], // Diagnostics
  'diagonal': ['horizontal', 'level', 'straight', 'vertical'], // Diagonal
  'dialogue': ['disconnection', 'isolation', 'monologue', 'silence', 'solitude', 'stagnation'], // Dialogue
  'die-cut': ['embossed', 'engraved'], // Die-cut
  'difference': ['monoculture'], // Difference
  'difficulty': ['success'], // Difficulty
  'diffuse': ['concentrated', 'labeled', 'specific'], // Diffuse
  'diffused': ['clear', 'concentrated', 'defined', 'focused', 'sharp'], // Diffused
  'diffusing': ['compressing'], // Diffusing
  'diffusion': ['concentration', 'containment', 'isolation'], // Diffusion
  'digital': ['acoustic', 'animalism', 'brushstroke', 'drafting', 'freight', 'handwritten', 'homegoods', 'horology', 'illustration', 'led', 'painting', 'paper-craft', 'postal', 'signage', 'stationery', 'typography', 'vinyl', 'winery'], // Digital
  'digital art': ['murals'], // digital art
  'digital-art': ['murals'], // Digital Art
  'digitalization': ['analogue', 'manual', 'static', 'tangible', 'traditional'], // Digitalization
  'digitization': ['premium'], // Digitization
  'dignity': ['crude', 'disgrace', 'humiliation', 'indecency', 'informality', 'shame', 'vulgarity'], // Dignity
  'diligence': ['negligence'], // Diligence
  'diligent': ['laziness', 'negligent'], // Diligent
  'diluting': ['clarifying', 'concentrating', 'confirming', 'embodying', 'enhancing', 'fortifying', 'intensifying', 'saturating', 'solidifying'], // Diluting
  'dim': ['blinding', 'flare', 'glare', 'gleaming', 'heat', 'highlight', 'ignite', 'phosphor', 'radiance', 'shine', 'visible', 'vividness'], // Dim
  'dimension': ['flatness', 'flatten', 'flattening'], // Dimension
  'dimensional': ['2d', 'flat', 'planar'], // Dimensional
  'diminish': ['amplify', 'bloom', 'burst', 'evolve', 'expand', 'flourish', 'magnify', 'nourish', 'overpower', 'raise', 'rise', 'scale'], // Diminish
  'diminished': ['empowering', 'overlook'], // Diminished
  'diminishing': ['emerging'], // Diminishing
  'diminution': ['amplification', 'ascension', 'augmentation', 'enrichment', 'enthusiasm', 'expansion', 'fullness', 'growth', 'intensification', 'presence', 'vitality'], // Diminution
  'diminutive': ['colossal', 'enormous', 'expansive', 'giant', 'huge', 'immense', 'massive', 'scale', 'vast'], // diminutive
  'dimming': ['amplifying', 'blazing', 'bright', 'flashy', 'glare', 'loud', 'radiant', 'shining', 'vivid'], // Dimming
  'dimness': ['brightness', 'cheerfulness', 'clarity', 'dawn', 'lightness', 'liveliness', 'lumen', 'luminance', 'luminescence', 'radiance', 'vibrancy'], // dimness
  'din': ['calm', 'harmony', 'order', 'peace', 'quiet', 'quietude', 'silence', 'stillness', 'tranquil'], // Din
  'diorama': ['cluttered', 'detached', 'dismantled', 'disorder', 'dispersal'], // Diorama
  'dip': ['peak'], // Dip
  'direct': ['branching', 'circuitous', 'conflicted', 'confused', 'confusing', 'enigmatic', 'filtered', 'heavy', 'interference', 'labyrinthine', 'oblique', 'symbolic', 'tangential', 'veiled', 'veiling'], // Direct
  'directness': ['editorial', 'idiosyncrasy', 'interference', 'obscured', 'twisted', 'vague'], // Directness
  'dirt': ['affluence', 'bright', 'clean', 'clear', 'eco-tech', 'fresh', 'polished', 'pure', 'refined', 'skincare', 'smooth'], // dirt
  'dirtiness': ['cleansing', 'freshness'], // dirtiness
  'dirty': ['spotless'], // Dirty
  'disadvantage': ['privilege'], // disadvantage
  'disagree': ['accept'], // Disagree
  'disagreement': ['consensus'], // Disagreement
  'disappear': ['appear', 'arrive', 'emerge', 'exist', 'manifest', 'materialize', 'presence', 'present', 'remain', 'surface'], // disappear
  'disappearing': ['appearing', 'emerging'], // Disappearing
  'disappointment': ['anticipation', 'hopeful'], // Disappointment
  'disapproval': ['acceptance', 'admiration', 'admire', 'affection', 'affirm', 'affirmative', 'agreement', 'appreciate', 'appreciation', 'approval', 'assertion', 'celebration', 'cherish', 'conscience', 'endorsement', 'favor', 'satisfaction', 'support'], // Disapproval
  'disarray': ['align', 'completion', 'craftsmanship', 'selfcare'], // Disarray
  'disarrayed': ['coherent', 'curvilinear-harmony', 'harmonious', 'neat', 'orderly', 'organized', 'structured', 'systematic', 'tidy'], // Disarrayed
  'disassemble': ['assemble', 'build', 'combine', 'connect', 'construct', 'form', 'gather', 'integrate', 'scaffold', 'sculpt', 'unify'], // disassemble
  'disband': ['assemble', 'binding', 'collect', 'construct', 'gather', 'manifesting', 'nexus', 'unite'], // disband
  'disbelief': ['belief'], // Disbelief
  'discard': ['assemble', 'cast', 'collect', 'merchandise', 'organize', 'preserve', 'retain'], // discard
  'discipline': ['chaos', 'freedom', 'indulgence', 'negligence', 'spontaneity', 'temptation'], // Discipline
  'disciplined': ['anarchic', 'slacker'], // Disciplined
  'disclosure': ['envelopment'], // Disclosure
  'discomfort': ['certainty', 'clarity', 'comfort', 'confidence', 'ease', 'harmony', 'relaxation', 'serenity', 'tranquility'], // Discomfort
  'disconnect': ['connect', 'connection', 'context', 'engage', 'harmony', 'integrate', 'interlink', 'synchronicity', 'unite', 'unity'], // Disconnect
  'disconnected': ['integrated', 'user-centric', 'wearables'], // Disconnected
  'disconnection': ['adoption', 'annotation', 'attachment', 'belonging', 'closeness', 'conduit', 'connectedness', 'dialogue', 'embrace', 'empathy', 'experience', 'fandom', 'fusion', 'identity', 'interaction', 'interfacing', 'interplay', 'linkage', 'memory', 'messaging', 'metaverse', 'nexus', 'synchronicitic', 'togetherness'], // Disconnection
  'discontent': ['fulfillment', 'pleased', 'satisfied', 'success'], // Discontent
  'discontinuity': ['continuum'], // discontinuity
  'discord': ['harmony', 'synchronicity', 'unison'], // Discord
  'discordant': ['balanced', 'cohesive', 'consistent', 'harmonic', 'harmonious', 'harmonious-blend', 'melodic', 'serene', 'symphonic', 'unified'], // Discordant
  'discourage': ['encourage', 'expand', 'motivate', 'positive'], // Discourage
  'discovery': ['conformity', 'ignorance', 'oblivion', 'obscurity', 'stagnation', 'uniformity'], // Discovery
  'discreet': ['blatant', 'obtrusive', 'overt'], // Discreet
  'discrete': ['carousel'], // Discrete
  'discretion': ['blatancy', 'blunt', 'brazen', 'chaotic', 'exposed', 'indiscretion', 'loud', 'obvious', 'obviousness', 'outspoken', 'reckless', 'transparency'], // Discretion
  'disdain': ['admiration', 'admiring', 'cherish', 'cherishing', 'demand', 'favor', 'fervor', 'kindness', 'regard', 'sightful', 'veneration'], // Disdain
  'disdainful': ['admiring', 'cherishing', 'valuing'], // Disdainful
  'disease': ['wellness'], // Disease
  'disembodied': ['defined', 'embodied', 'embodied-experience', 'embodiment', 'experiential', 'grounding', 'immersive', 'presence', 'solid', 'tangibility', 'tangible'], // Disembodied
  'disembodiment': ['concrete', 'embodiment', 'existing', 'material', 'presence', 'real', 'solid', 'tangible'], // disembodiment
  'disempowering': ['empowering'], // Disempowering
  'disempowerment': ['agency', 'clarity', 'control', 'empowerment', 'presence', 'strength', 'unity', 'wholeness'], // disempowerment
  'disenfranchisement': ['empowerment'], // disenfranchisement
  'disengage': ['bond', 'engage'], // Disengage
  'disengaged': ['conscious', 'engaged', 'immerse'], // Disengaged
  'disengagement': ['experience', 'involvement', 'participation'], // Disengagement
  'disengaging': ['attracting'], // Disengaging
  'disfavor': ['favor'], // Disfavor
  'disgrace': ['dignity'], // Disgrace
  'disguise': ['authenticity', 'clarity', 'gesture', 'honesty', 'identity', 'openness', 'representation', 'reveal', 'transparency', 'trust'], // disguise
  'disheveled': ['basis', 'composition', 'cultivate', 'elegant', 'formal', 'neat', 'orderly', 'polished', 'pristine', 'refined', 'sleekness', 'structured', 'tidy'], // Disheveled
  'dishonest': ['trustworthy'], // dishonest
  'dishonesty': ['integrity', 'sincerity'], // Dishonesty
  'disillusion': ['anticipation', 'belief', 'clarity', 'confidence', 'faith', 'hope', 'reality', 'satisfaction', 'truth'], // Disillusion
  'disillusionment': ['belief'], // Disillusionment
  'disintegration': ['emergence'], // disintegration
  'disinterest': ['curiosity', 'demand', 'engage', 'engagement', 'enthusiasm', 'excitement', 'fandom', 'fascination', 'fervor', 'fixation', 'interest', 'involvement', 'marketing', 'need', 'participation', 'passion', 'recruitment', 'zeal'], // Disinterest
  'disinterested': ['active', 'curious', 'engaged', 'enthusiastic', 'interested', 'invested', 'involved', 'passionate'], // Disinterested
  'disjoint': ['coherent', 'connected', 'empathetic', 'engaged', 'harmonious', 'inclusive', 'integrate', 'interested', 'intertwined', 'merged', 'passionate'], // disjoint
  'disjointed': ['coherent', 'cohesive', 'collaborative', 'concreteness', 'connected', 'consistent', 'deco', 'flowing', 'harmonious', 'integrated', 'seamless', 'smooth', 'superimposition', 'synchronized', 'unified'], // Disjointed
  'dislike': ['accept', 'admiration', 'admire', 'affection', 'affirm', 'appreciate', 'approval', 'attraction', 'cherish', 'conscience', 'embrace', 'enjoy', 'favor', 'like', 'support', 'wholesome'], // Dislike
  'dislocation': ['dwelling'], // dislocation
  'dismal': ['bright', 'cheerful', 'euphoric', 'hopeful', 'joyful', 'lively', 'radiant', 'uplifting', 'vibrant'], // Dismal
  'dismantle': ['scaffold', 'sculpt'], // Dismantle
  'dismantled': ['diorama'], // dismantled
  'dismiss': ['accept', 'acknowledge', 'adopt', 'appreciate', 'attachment', 'celebrate', 'consider', 'embrace', 'encourage', 'engage', 'grasp', 'like', 'nurturing', 'regard', 'selection', 'support', 'value', 'valuing', 'welcome'], // Dismiss
  'dismissal': ['acceptance', 'admiring', 'assertion', 'embrace', 'engagement', 'evaluation', 'favor', 'inclusion', 'memorial', 'recognition', 'recruitment', 'respect', 'veneration'], // Dismissal
  'dismissed': ['embraced'], // Dismissed
  'dismissive': ['admire', 'affection', 'affirmative', 'appreciate', 'appreciative', 'bright', 'cherishing', 'engaged', 'expansive', 'inclusive', 'receptive', 'valued', 'vivid'], // Dismissive
  'disobedience': ['obedience'], // Disobedience
  'disobedient': ['obedient'], // Disobedient
  'disorder': ['academia', 'admire', 'aesthetics', 'align', 'alignment', 'analytics', 'anatomy', 'archetype', 'architecture', 'arrangement', 'array', 'art', 'artistry', 'ascendancy', 'assemblage', 'assembly', 'authority', 'axis', 'balance', 'basis', 'bind', 'branding', 'catalog', 'categorization', 'catering', 'celebration', 'centered', 'centrality', 'childcare', 'circuit', 'clarity', 'classicism', 'cleanliness', 'climate', 'clustering', 'coding', 'cohesion', 'command', 'composition', 'composure', 'concentricity', 'conception', 'conquer', 'conscience', 'consequence', 'constancy', 'constellation', 'consulting', 'context', 'continuity', 'contour', 'cosmos', 'craft', 'cubism', 'cultivate', 'cultivation', 'curated', 'dashboard', 'delicacy', 'dentistry', 'diorama', 'domain', 'economy', 'ecosystem', 'edtech', 'education', 'efficacy', 'efficiency', 'engineering', 'equilibrium', 'ergonomic', 'expertise', 'finance', 'flowchart', 'focused', 'formation', 'fortitude', 'foundation', 'framework', 'framing', 'freight', 'grading', 'grounded', 'grounding', 'grouping', 'harmony', 'healthcare', 'healthtech', 'hierarchy', 'horology', 'hud', 'idyll', 'integration', 'integrity', 'intentional', 'interconnectedness', 'intersect', 'lattice', 'literary', 'luxe', 'marketing', 'mastery', 'matrix', 'measure', 'melody', 'method', 'modelling', 'module', 'monopoly', 'mosaic', 'museum', 'nexus', 'normalcy', 'nourishment', 'nucleus', 'optimization', 'order', 'organization', 'outlining', 'pathway', 'pattern', 'payments', 'planning', 'poetic', 'presence', 'prestige', 'principle', 'pristine', 'productivity', 'proportion', 'purity', 'purpose', 'realm', 'regulation', 'relevance', 'repetition', 'resolve', 'resonance', 'rows', 'sanctuary', 'scholarship', 'selection', 'sense', 'settle', 'shaping', 'sightful', 'solutions', 'stability', 'structure', 'symbiosis', 'synchronicitic', 'synchronicitical', 'systems', 'tranquility', 'typecraft', 'understanding', 'unify', 'units', 'unity', 'utopia', 'visualization', 'watches', 'watchmaking', 'wholeness', 'wholesome', 'zen'], // Disorder
  'disordered': ['charted', 'coherent', 'cultivated', 'doctrinal', 'exact', 'formed', 'intact', 'level', 'logical', 'planned', 'practical', 'procedural', 'resolved', 'scheduled', 'sequential', 'settled', 'simplifying', 'solidity'], // Disordered
  'disorderly': ['arranged', 'bakery', 'behavioral', 'coherent', 'compliant', 'deeptech', 'definite', 'formality', 'functionalist', 'harmonic', 'methodical', 'modelling', 'neat', 'orderly', 'organized', 'rational', 'regulated', 'remote', 'structured', 'studious', 'systematic', 'tame', 'unified'], // Disorderly
  'disorganization': ['dashboard'], // disorganization
  'disorganized': ['coherent', 'composition', 'methodical', 'neat', 'orderly', 'organized', 'pragmatic-visuals', 'strategic', 'structured', 'systematic', 'tidy'], // Disorganized
  'disparate': ['aligned', 'analogous', 'cohesive', 'complementary', 'consistent', 'harmonious', 'integrated', 'matched', 'similar', 'uniform'], // Disparate
  'dispassionate': ['animated', 'emotional', 'engaged', 'expressive', 'intense', 'involved', 'passionate', 'sensory', 'vibrant'], // Dispassionate
  'dispersal': ['absorption', 'accumulation', 'alignment', 'anchored', 'arrangement', 'array', 'assemblage', 'assembly', 'canvas', 'categorization', 'clustered', 'cohesion', 'constellation', 'containment', 'continuity', 'convergence', 'dashboard', 'diorama', 'dwelling', 'editorial', 'encasement', 'enclosure', 'envelopment', 'field', 'fixation', 'focused', 'formation', 'framing', 'fusion', 'grounding', 'grouping', 'harmony', 'integration', 'intentional', 'interconnectedness', 'interconnection', 'intertwined', 'interwoven', 'layering', 'linkage', 'network', 'nexus', 'nodes', 'orbit', 'pathway', 'preservation', 'resonance', 'roots', 'selection', 'shaping', 'singularity', 'source', 'tabs', 'units', 'vortex', 'wholeness'], // Dispersal
  'disperse': ['assemble', 'bond', 'bundle', 'capture', 'cluster', 'concentrate', 'consolidate', 'consume', 'corner', 'gather', 'imprint', 'integrate', 'interlock', 'intersect', 'manifesting', 'point', 'preserve', 'pyramid', 'scaffold', 'stack', 'synthesize', 'weave'], // Disperse
  'dispersed': ['aggregate', 'axial', 'centered', 'centralized', 'cloistered', 'clustered', 'concentrated', 'contained', 'merged', 'regression', 'sculptural', 'unified'], // Dispersed
  'dispersed-tone': ['concentrated'], // Dispersed-Tone
  'dispersing': ['rooting'], // Dispersing
  'dispersion': ['absorption', 'centrality', 'clustering', 'concentricity', 'editorial', 'harmony'], // Dispersion
  'display': ['composition', 'contrast', 'hide', 'shroud'], // Display
  'displaying': ['concealing', 'hiding'], // Displaying
  'displeased': ['pleased', 'satisfied'], // Displeased
  'displeasure': ['approval', 'contentment', 'delight', 'harmony', 'joy', 'pleasure', 'satisfaction', 'unity'], // Displeasure
  'disposability': ['legacy', 'recyclability'], // disposability
  'disposable': ['cherished', 'durable', 'enduring', 'essential', 'heritage-craft', 'permanent', 'sustainable', 'timeless', 'valued', 'watchmaking'], // Disposable
  'disposal': ['souvenirs'], // Disposal
  'disregard': ['acknowledge', 'admiration', 'advertising', 'appreciate', 'attention', 'consider', 'engrave', 'evaluation', 'focus', 'inquiry', 'memorial', 'milestone', 'nurture', 'nurturing', 'observation', 'promotion', 'publishing', 'recognition', 'regard', 'respect', 'statement', 'stewardship', 'value', 'valuing'], // Disregard
  'disregarded': ['acknowledged', 'embraced', 'emphasized', 'focused', 'highlighted', 'identified', 'noted', 'organized', 'presented', 'profit-driven', 'valued'], // Disregarded
  'disrespect': ['respect'], // Disrespect
  'disrupt': ['align', 'conform', 'harmonize', 'integrate', 'loop', 'render', 'repeat', 'settle', 'stabilize', 'standardize', 'unify'], // Disrupt
  'disrupted': ['uninterrupted'], // Disrupted
  'disruption': ['completion', 'conception', 'continuity', 'order', 'stability'], // Disruption
  'disruptive': ['consistent', 'conventional', 'harmonious', 'stable', 'traditional'], // Disruptive
  'dissatisfaction': ['approval', 'comfort', 'contentment', 'delight', 'fulfillment', 'happiness', 'joy', 'pleasure', 'satisfaction'], // Dissatisfaction
  'dissatisfied': ['pleased', 'satisfied', 'settled'], // Dissatisfied
  'dissent': ['consensus'], // Dissent
  'dissimilar': ['analogous'], // dissimilar
  'dissipate': ['manifesting'], // Dissipate
  'dissipation': ['accumulation', 'assembly', 'coherence', 'concentration', 'fixation', 'focus', 'harmony', 'integration', 'solidarity', 'stewardship', 'unity'], // dissipation
  'dissolution': ['assembly', 'crystallization', 'ecosystem', 'formation', 'germination', 'realm', 'shaping'], // Dissolution
  'dissolve': ['construct', 'imprint', 'preserve', 'solidify', 'stack', 'synthesize'], // Dissolve
  'dissolving': ['building', 'concentrating', 'enhancing', 'focusing', 'intensifying', 'sculpting', 'solidifying', 'strengthening', 'uniting'], // Dissolving
  'dissonance': ['equilibrium', 'museum', 'unify', 'unison'], // Dissonance
  'dissonant': ['harmonic', 'symphonic'], // Dissonant
  'dissuade': ['encourage'], // Dissuade
  'distance': ['closeness', 'embrace', 'intimacy', 'proximity', 'togetherness', 'unity'], // Distance
  'distant': ['accessible', 'connected', 'empathetic', 'engaged', 'experiential', 'familiar', 'foreground', 'immerse', 'intimate', 'near', 'obtainable', 'present', 'relatable', 'visible', 'warm'], // Distant
  'distilling': ['winemaking'], // distilling
  'distinct': ['aggregate', 'ambiguous', 'bland', 'blended', 'common', 'faceless', 'false', 'generic', 'indistinct', 'interstitial', 'merged', 'muffled', 'nebulous', 'pedestrian', 'sameness', 'smeared', 'subduing', 'unfocused', 'vague'], // Distinct
  'distinction': ['bland', 'common', 'indistinct', 'overlapping', 'uniform'], // distinction
  'distinctive': ['ordinary'], // Distinctive
  'distinctness': ['ambiguity', 'blurriness', 'indistinct', 'uniformity'], // Distinctness
  'distorted': ['clear', 'defined', 'orderly', 'smooth', 'straight'], // Distorted
  'distortion': ['clarity', 'definition', 'integrity', 'objectivity', 'order'], // Distortion
  'distracted': ['attentive', 'aware', 'centered', 'concentrated', 'engaged', 'focused', 'immersive', 'intent', 'intentional', 'mindful', 'observant', 'perceptive', 'studious'], // Distracted
  'distracting': ['hypnotic'], // Distracting
  'distraction': ['advertising', 'attention', 'demand', 'edutainment', 'heavy', 'relevance'], // Distraction
  'distress': ['composure', 'flawless', 'polished', 'pristine', 'smooth', 'well-being'], // Distress
  'distressed': ['fresh', 'neat', 'orderly', 'perfect', 'polished', 'pristine', 'refined', 'smooth'], // Distressed
  'distributed': ['centralized', 'consolidated', 'contained', 'unified'], // Distributed
  'distribution': ['editorial', 'harmony'], // Distribution
  'distrust': ['affection', 'confidence', 'conscience', 'faith', 'grounding', 'honesty', 'interest', 'like', 'literary', 'openness', 'presence', 'selection', 'sincerity', 'transparency', 'trust', 'trustworthy'], // Distrust
  'disunity': ['agreement', 'cohesion', 'collaboration', 'concord', 'connect', 'consensus', 'consolidate', 'fusion', 'harmony', 'solidarity', 'synergy', 'togetherness', 'unity'], // disunity
  'diurnus': ['nocturn'], // Diurnus
  'diverge': ['align', 'conform', 'integrate'], // Diverge
  'divergence': ['consistency', 'convergence', 'unity'], // Divergence
  'divergent': ['analogous', 'normalcy'], // Divergent
  'diverse': ['binary', 'homogeneous', 'mono', 'monochrome', 'monolithic', 'monotonous', 'repetitive', 'similar', 'uniform'], // Diverse
  'diversity': ['conformity', 'consensus', 'homogeneity', 'minimize', 'monoculture', 'monopoly', 'repetition', 'sameness', 'singularity', 'uniformity'], // Diversity
  'divide': ['assemble', 'blend', 'combine', 'connect', 'consolidate', 'harmonize', 'integrate', 'interlink', 'merge', 'stack', 'synthesis', 'synthesize', 'unify', 'unite'], // Divide
  'divided': ['integrated', 'shared', 'unified', 'united', 'whole'], // Divided
  'dividing': ['blending', 'cohesive', 'combining', 'conglomerating', 'harmonizing', 'integrating', 'merging', 'uniting', 'whole'], // Dividing
  'division': ['connect', 'conquer', 'fusion', 'inclusivity', 'interfacing', 'togetherness', 'unison'], // Division
  'divisive': ['cohesive', 'collective', 'connected', 'harmonious', 'inclusive', 'inclusivity', 'integrated', 'unifying', 'whole'], // divisive
  'diy': ['catering'], // DIY
  'docile': ['defiant', 'rebel'], // Docile
  'docs': ['composition', 'contrast', 'messy'], // Docs
  'doctrinal': ['chaotic', 'disordered', 'flexible', 'fluid', 'informal', 'informal-inquiry', 'open', 'random', 'spontaneous'], // Doctrinal
  'documentary': ['cinematic'], // documentary
  'dogma': ['interpretation'], // Dogma
  'domain': ['chaos', 'disorder', 'void'], // Domain
  'dome': ['broken', 'flat', 'level', 'plane', 'surface', 'void'], // Dome
  'domestic': ['nautical', 'premium'], // Domestic
  'domesticated': ['feral'], // Domesticated
  'domestication': ['wilderness'], // domestication
  'dominance': ['decentralization', 'editorial', 'feminine', 'harmony', 'humble', 'submission', 'symbiosis'], // Dominance
  'dominant': ['peripheral'], // Dominant
  'donation': ['payments'], // Donation
  'doodle': ['formal', 'precise', 'structured'], // Doodle
  'dormancy': ['activity', 'awakening', 'brightness', 'energy', 'flourish', 'fruition', 'growth', 'life', 'movement', 'pulse', 'vitality'], // dormancy
  'dormant': ['activating', 'active', 'alert', 'alive', 'appearing', 'bustling', 'dynamic', 'energized', 'energy', 'flourishing', 'moving', 'vibrant'], // dormant
  'dot': ['line', 'plane', 'surface', 'wave'], // Dot
  'doubt': ['accept', 'assertion', 'assurance', 'belief', 'certainty', 'confidence', 'conviction', 'faith', 'hopeful', 'security', 'trust', 'valor'], // Doubt
  'doubtful': ['assured', 'believing', 'certain', 'clear', 'confident', 'positive', 'reassuring', 'robust', 'secure', 'trusting'], // doubtful
  'doubting': ['acceptance', 'affirmation', 'assurance', 'certainty', 'confidence', 'conviction', 'faith', 'skyward', 'trust'], // doubting
  'douse': ['ignite'], // Douse
  'down': ['above', 'elevated', 'rise', 'top', 'up'], // down
  'downcast': ['elevated', 'engaged', 'enthusiastic', 'excited', 'harmonious', 'joyful', 'passionate', 'upbeat', 'vibrant'], // downcast
  'drab': ['attractive', 'bold', 'brilliant', 'colorful', 'dazzling', 'dynamic', 'enchanted', 'fullness', 'glamour', 'highlight', 'liveliness', 'lively', 'luxe', 'radiance', 'radiant', 'rich', 'stimulating', 'vibrancy', 'vibrant', 'vividness'], // Drab
  'drafting': ['digital', 'freehand'], // Drafting
  'drag': ['bright', 'cheerful', 'dynamic', 'energize', 'exciting', 'lift', 'lively', 'uplift', 'vibrant'], // Drag
  'dragged': ['calm', 'consistent', 'easy', 'free', 'gentle', 'predictable', 'smooth', 'steady', 'uplift'], // Dragged
  'drain': ['bold', 'bright', 'cheerful', 'colorful', 'lively', 'radiant', 'rich', 'saturation', 'vibrant'], // Drain
  'drained': ['alive', 'bright', 'dynamic', 'energetic', 'energized', 'full', 'lively', 'rich', 'vibrant'], // Drained
  'draining': ['energizing', 'enriching', 'exciting', 'invigorating', 'refreshing', 'stimulating', 'tranquility', 'uplifting', 'vibrant'], // Draining
  'dramatic': ['calm', 'cool', 'cozy', 'harmony', 'play', 'warm'], // Dramatic
  'drawer': ['composition', 'contrast'], // Drawer
  'drawing': ['engraving', 'erased', 'illustration', 'led'], // Drawing
  'dream': ['clarity', 'despair', 'dullness', 'fact', 'failure', 'reality', 'stagnation'], // Dream
  'dreamlike': ['concrete', 'led', 'literal', 'mundane', 'ordinary', 'realistic'], // Dreamlike
  'dreariness': ['exuberance'], // Dreariness
  'dreary': ['bright', 'cheerful', 'enchanting', 'festive', 'jovial', 'joyful', 'lively', 'radiant', 'uplifted', 'uplifting-contrast', 'vibrant', 'wholesome'], // Dreary
  'drift': ['anchor', 'center', 'control', 'focus', 'root', 'stability'], // Drift
  'drifting': ['rooting'], // Drifting
  'drive': ['heavy', 'idleness', 'passivity', 'rest', 'sloth'], // Drive
  'driven': ['apathetic', 'complacent', 'indifferent', 'laziness', 'lazy', 'passive', 'slack', 'slacker', 'static'], // Driven
  'drop': ['composition', 'contrast', 'elevation', 'peak', 'raise', 'rise', 'soar'], // Drop
  'dropped': ['raised'], // Dropped
  'drought': ['produce', 'profit'], // Drought
  'drown': ['bloom', 'expand', 'float', 'rise', 'shine', 'surge', 'thrive', 'uplift'], // Drown
  'drowsiness': ['alertness'], // drowsiness
  'drowsy': ['awake'], // Drowsy
  'drudgery': ['creativity', 'dynamism', 'energy', 'excitement', 'freedom', 'hobby', 'idyll', 'joy', 'leisure', 'playfulness', 'vibrancy'], // drudgery
  'dry': ['absorbent', 'alive', 'aqueous', 'bakery', 'beverage', 'bright', 'cloudy', 'colorful', 'dynamic', 'flood', 'foliage', 'lush', 'muddy', 'oceanic', 'plump', 'rich', 'splash', 'steam', 'sweet', 'symphonic', 'verdant', 'vibrant', 'viscous', 'wet'], // Dry
  'dryness': ['juiciness'], // dryness
  'duality': ['singularity', 'unity', 'wholeness'], // Duality
  'ductile': ['brittle'], // ductile
  'dull': ['adventurous', 'aether', 'alluring', 'apex', 'art', 'attracting', 'attractive', 'beverage', 'blazing', 'bold', 'bright', 'brilliant', 'captivating', 'colorful', 'crisp', 'crystalline', 'dazzling', 'deeptech', 'depictive', 'dynamic', 'elaborate', 'enchanted', 'evocative', 'exceptional', 'exciting', 'extraordinary', 'fi', 'fiery', 'flamboyant', 'flare', 'flashy', 'flawless', 'glare', 'glassy', 'glazed', 'gleaming', 'graded', 'heated', 'highlight', 'ignited', 'ingenuity', 'intensify', 'kaleidoscopic', 'lavish', 'liveliness', 'lively', 'luminescent', 'lustrous', 'macro', 'murals', 'novel', 'perfect', 'phosphor', 'pleasant', 'propulsive', 'radiance', 'rich', 'scholarly', 'sharp', 'sheen', 'shimmer', 'shine', 'shiny', 'spark', 'stellar', 'stimulating', 'storyful', 'striking', 'thrive', 'thunders', 'unleash', 'uproarious', 'vibrancy', 'vibrant', 'vibration', 'vividness', 'volatile', 'wearables', 'xr', 'yachting', 'youthfulness', 'zesty'], // Dull
  'dullard': ['animated', 'bold', 'colorful', 'dynamic', 'engaging', 'exciting', 'intellect', 'lively', 'vibrant'], // Dullard
  'dullness': ['aesthetics', 'awakening', 'beauty', 'dream', 'edutainment', 'euphoria', 'exuberance', 'hype', 'liveliness', 'luminescence', 'might', 'reflectivity', 'richness', 'stimulation', 'tingle', 'zeal'], // Dullness
  'duotone': ['cool', 'cozy', 'harmony', 'key', 'play'], // Duotone
  'duplicity': ['sincerity'], // Duplicity
  'durable': ['disposable'], // Durable
  'durables': ['bakery'], // Durables
  'dusk': ['aurora', 'dawn', 'day', 'light', 'morning', 'sunrise'], // Dusk
  'dust': ['clean', 'clear', 'polished', 'refined', 'smooth'], // Dust
  'duty': ['freetime', 'hobby', 'leisure'], // Duty
  'dwelling': ['detachment', 'dislocation', 'dispersal', 'vacate'], // Dwelling
  'dynamic': ['2d', 'artifact', 'banal', 'barren', 'bland', 'blocky', 'blunt', 'bore', 'bored', 'boring', 'boxy', 'complacent', 'constant', 'cumbersome', 'dormant', 'drab', 'drag', 'drained', 'dry', 'dull', 'dullard', 'faceless', 'frozen', 'glacial', 'halt', 'halted', 'hushing', 'idle', 'insipid', 'introverted', 'lame', 'lazy', 'lethargic', 'lifeless', 'mediocre', 'mono', 'monotonous', 'mundane', 'null', 'ordinary', 'passive', 'paused', 'pedestrian', 'plain', 'ponderous', 'regression', 'repetitive', 'reserved', 'slack', 'slacker', 'sluggish', 'staged', 'stale', 'statuary', 'stiff', 'stifled', 'stilted', 'stopped', 'stuck', 'stuffy', 'subduing', 'suppressed', 'tedious', 'timid', 'tired', 'unchanged', 'unchanging', 'unmoved', 'vacancy', 'weak', 'weary'], // Dynamic
  'dynamism': ['drudgery', 'editorial', 'harmony', 'tranquility'], // Dynamism
  'dysfunction': ['efficacy'], // Dysfunction
  'dystopia': ['idyll', 'utopia'], // Dystopia
  'dystopian': ['utopian'], // dystopian
  'dystopic': ['bright', 'hopeful', 'ideal', 'joyful', 'optimistic', 'peaceful', 'positive', 'utopian', 'utopic'], // dystopic
  'e-commerce': ['local', 'physical', 'tangible'], // E-Commerce
  'earnest': ['heavy', 'insincere', 'silly', 'superficial'], // Earnest
  'earth': ['absence', 'aether', 'artifice', 'chaos', 'ether', 'futility', 'sky', 'spirit', 'stratosphere', 'unreality', 'void'], // earth
  'earthbound': ['skyward', 'stellar'], // Earthbound
  'earthen': ['artificial', 'emerald', 'energetic', 'hues', 'indigo', 'iridescent', 'key', 'limited', 'nocturne', 'palette', 'pop', 'primary', 'shadow', 'silver', 'stark', 'varied'], // Earthen
  'earthiness': ['abstract', 'alien', 'artificial', 'artificiality', 'otherworldly', 'sterile', 'synthetic'], // Earthiness
  'earthly': ['astral', 'celestial', 'stellar'], // Earthly
  'earthy': ['alien', 'cosmic', 'ethereal'], // Earthy
  'ease': ['agitation', 'agony', 'anguish', 'backward', 'burden', 'challenge', 'complication', 'discomfort', 'frustration', 'grind', 'guilt', 'hassle', 'heavy', 'imposition', 'narrowness', 'obstacle', 'pain', 'panic', 'strain', 'stress', 'strife', 'struggle', 'torment', 'warning', 'weight'], // Ease
  'easy': ['agitated', 'arduous', 'burdened', 'burdensome', 'challenging', 'chaotic', 'complex', 'cumbersome', 'demanding', 'dragged', 'hard', 'harried', 'intense', 'laborious', 'stern', 'stiff', 'stilted', 'strange', 'strenuous', 'stressful', 'tense', 'tightened', 'uneasy'], // Easy
  'ebullience': ['apathy', 'indifference', 'stoicism'], // Ebullience
  'eccentric': ['grounded', 'mainstream', 'normal'], // Eccentric
  'eccentricity': ['concentricity'], // Eccentricity
  'echo': ['absence', 'silence', 'void'], // Echo
  'eclectic': ['basic', 'bauhaus', 'classicism', 'editorial', 'functionalist', 'harmony', 'japandi', 'monotonous', 'nordic', 'predictable'], // Eclectic
  'eclipse': ['brightness', 'clarity', 'daylight', 'exposure', 'light', 'origin', 'radiance', 'shine', 'visibility'], // Eclipse
  'eco-conscious': ['carelessness', 'destructive', 'indifference', 'negligence'], // Eco-conscious
  'eco-consciousness': ['indifference', 'neglect', 'wastefulness'], // Eco-consciousness
  'eco-design': ['exploitative', 'industrial', 'mechanical'], // Eco-design
  'eco-friendliness': ['harmfulness', 'neglect'], // Eco-friendliness
  'eco-friendly': ['harmful', 'polluting'], // Eco-friendly
  'eco-tech': ['chaos', 'dirt', 'fossil', 'heavy', 'obsolete', 'pollute', 'polluting', 'toxic', 'unsustainable', 'waste', 'wasteful'], // Eco-Tech
  'ecology': ['pollution', 'premium'], // Ecology
  'ecommerce': ['local', 'physical', 'tangible'], // Ecommerce
  'economy': ['chaos', 'disorder', 'excess', 'inefficiency', 'waste'], // Economy
  'ecosystem': ['chaos', 'disorder', 'dissolution', 'fragmentation', 'isolation'], // Ecosystem
  'edge': ['blob', 'corner', 'curve', 'editorial', 'harmony'], // Edge
  'edgy': ['shell-like', 'sweet'], // Edgy
  'editorial': ['centered', 'centrality', 'directness', 'dispersal', 'dispersion', 'distribution', 'dominance', 'dynamism', 'eclectic', 'edge', 'focus', 'geometry', 'grace', 'intricate', 'linearity', 'luminosity', 'monumental', 'negative', 'ornamentation', 'perspective', 'polish', 'portrait', 'simplicity', 'simplification', 'sleekness', 'softness', 'spatial', 'spontaneity', 'tension', 'texture', 'unbounded', 'uniformity', 'variety'], // Editorial
  'edtech': ['analogue', 'basic', 'chaos', 'craft', 'disorder', 'ignorance', 'industrial', 'manual', 'obsolete', 'traditional'], // Edtech
  'educated': ['illiterate'], // Educated
  'education': ['chaos', 'disorder', 'ignorance', 'neglect', 'stagnation', 'stupidity'], // Education
  'edutainment': ['abstract', 'academic', 'boredom', 'chaos', 'confusion', 'distraction', 'dullness', 'ignorance', 'neglect', 'professional', 'pure entertainment', 'pure-entertainment'], // Edutainment
  'eerie': ['heavy', 'sane'], // Eerie
  'effective': ['futile', 'impractical', 'pointless'], // Effective
  'effects': ['composition', 'contrast'], // Effects
  'efficacy': ['chaos', 'confusion', 'disorder', 'dysfunction', 'emptiness', 'failure', 'ineffectiveness', 'inefficacy', 'inefficiency', 'waste'], // Efficacy
  'efficiency': ['cluttered', 'disorder', 'excessive', 'sloppiness'], // Efficiency
  'efficient': ['impractical', 'wasteful'], // Efficient
  'effort': ['idleness'], // Effort
  'effortful': ['imperfect'], // Effortful
  'effortless': ['arduous', 'burdensome', 'conflicted', 'heavy', 'strenuous'], // Effortless
  'egalitarian': ['capitalism'], // Egalitarian
  'ehs': ['entertainment', 'peril', 'recreation'], // EHS
  'elaborate': ['bare', 'base', 'basic', 'crude', 'dull', 'minimal', 'plain', 'rudimentary', 'simple', 'sparse', 'stoic'], // elaborate
  'elderly-care': ['childcare'], // Elderly-Care
  'electrified': ['heavy', 'unmoved'], // Electrified
  'electronic': ['postal'], // electronic
  'electronics': ['automotive', 'biotech', 'candles', 'grocery', 'hospitality', 'jewelry', 'textile'], // Electronics
  'elegance': ['brutality', 'filth', 'squalor'], // Elegance
  'elegant': ['awkwardness', 'brutal', 'brutalism', 'brutalist', 'clumsy', 'clunky', 'composition', 'contrast', 'crude', 'disheveled', 'faddish', 'frumpy', 'fussy', 'gaudy', 'gritty', 'grotesque', 'grunge', 'grungy', 'industrial', 'janky', 'kitsch', 'ragged', 'scrappy', 'shabby', 'sloppy', 'streetwear', 'tacky', 'vulgar', 'wacky'], // Elegant
  'element': ['absence', 'chaos', 'void'], // Element
  'elements': ['composition', 'contrast'], // Elements
  'elevate': ['descend', 'low', 'lower', 'plummet', 'plunge', 'regress'], // Elevate
  'elevated': ['base', 'down', 'downcast', 'flat', 'low', 'lower', 'mundane', 'ordinary', 'petty', 'trivial'], // Elevated
  'elevation': ['base', 'decline', 'depression', 'descent', 'drop', 'flattening', 'plummet'], // Elevation
  'elite': ['average', 'basic', 'casual-collection', 'cheap', 'common', 'inferior', 'mediocre', 'ordinary', 'simple', 'subpar'], // Elite
  'elusive': ['obtainable'], // Elusive
  'emanation': ['ice', 'suppression'], // Emanation
  'ember': ['frost', 'light', 'void'], // Ember
  'emblematic': ['inconspicuous', 'plain', 'unadorned'], // Emblematic
  'embodied': ['disembodied'], // Embodied
  'embodied-experience': ['disembodied'], // Embodied-Experience
  'embodiment': ['abstract', 'detached', 'disembodied', 'disembodiment'], // Embodiment
  'embodying': ['diluting'], // Embodying
  'embossed': ['die-cut'], // embossed
  'embossing': ['debossing', 'flat', 'plain'], // Embossing
  'embrace': ['abandon', 'alienation', 'confront', 'critique', 'detachment', 'disconnection', 'dislike', 'dismiss', 'dismissal', 'distance', 'evade', 'expulsion', 'isolation', 'reject', 'rejecting', 'resign', 'separation', 'shunning', 'solitude'], // embrace
  'embraced': ['alienated', 'detached', 'dismissed', 'disregarded', 'excluded', 'ignored', 'neglected', 'rejected', 'repelled'], // Embraced
  'embracing': ['fleeing', 'rejecting', 'shunning', 'withholding'], // Embracing
  'emerald': ['earthen', 'energetic', 'hues', 'indigo', 'iridescent', 'limited', 'nocturne', 'palette', 'pop', 'primary', 'shadow', 'silver', 'stark', 'varied'], // Emerald
  'emerge': ['disappear', 'hide', 'past'], // Emerge
  'emergence': ['disintegration', 'ended', 'endgame', 'stagnation', 'suppression', 'uniformity'], // Emergence
  'emerging': ['diminishing', 'disappearing', 'fading', 'vanishing'], // emerging
  'emission': ['absorption', 'clarity', 'containment', 'inhalation', 'purity', 'retention'], // Emission
  'emissive': ['absorbent', 'muted', 'opaque', 'subdued'], // Emissive
  'emit': ['absorb', 'contain', 'restrict', 'suppress'], // Emit
  'emotion': ['calm', 'detachment', 'indifference', 'logic', 'objectivity'], // Emotion
  'emotional': ['analytical', 'cerebral', 'dispassionate', 'rational', 'scientific', 'stoic'], // Emotional
  'emotional-design': ['rational'], // Emotional-Design
  'emotionalist': ['logical'], // Emotionalist
  'empathetic': ['aloof', 'apathetic', 'callous', 'cold', 'detached', 'disjoint', 'distant', 'harsh', 'indifferent', 'selfish', 'unfeeling'], // Empathetic
  'empathy': ['alienation', 'apathy', 'coldness', 'cruelty', 'detachment', 'disconnection', 'hostility', 'indifference'], // Empathy
  'emphasis': ['erasure'], // Emphasis
  'emphasize': ['forget', 'ignore', 'minimize'], // Emphasize
  'emphasized': ['disregarded'], // Emphasized
  'emphasizing': ['muting', 'suppressing'], // Emphasizing
  'empirical': ['theoretical'], // Empirical
  'employment': ['entrepreneurship'], // employment
  'empowered': ['defeated', 'heavy', 'suppressed', 'weakened'], // Empowered
  'empowering': ['constraining', 'diminished', 'disempowering', 'helpless', 'ineffective', 'oppressive', 'powerless', 'restricting', 'stifling', 'submissive', 'weak'], // Empowering
  'empowerment': ['disempowerment', 'disenfranchisement', 'marginalization', 'oppression', 'subjugation'], // Empowerment
  'emptiness': ['art', 'bounty', 'canvas', 'conception', 'efficacy', 'energy', 'euphoria', 'experience', 'flotilla', 'fulfillment', 'fullness', 'gravitas', 'identity', 'ingredients', 'materials', 'microcosm', 'might', 'narrowness', 'need', 'nourishment', 'pressure', 'purpose', 'richness', 'sense', 'significance', 'success'], // Emptiness
  'empty': ['alive', 'beverage', 'bubble', 'busy', 'buzz', 'closed', 'complete', 'dense', 'fertile', 'filled', 'flood', 'freight', 'full', 'genuineness', 'humble', 'layered', 'meaning', 'merchandise', 'mosaic', 'murals', 'rich', 'skillful', 'sticker', 'unleash'], // Empty
  'encapsulated': ['exposed', 'open'], // Encapsulated
  'encapsulation': ['exposure', 'openness'], // Encapsulation
  'encasement': ['dispersal', 'exposure', 'freedom', 'openness', 'transparency'], // Encasement
  'enchanted': ['bland', 'drab', 'dull', 'mundane', 'ordinary'], // Enchanted
  'enchanting': ['bland', 'dreary', 'mundane', 'ordinary', 'unremarkable'], // Enchanting
  'enclosed': ['chaotic', 'exposed', 'fluid', 'free', 'open', 'open-top', 'scattered', 'unbound'], // Enclosed
  'enclosure': ['dispersal', 'expansion', 'exposure', 'freedom', 'openness', 'street'], // Enclosure
  'encourage': ['demotivate', 'depress', 'discourage', 'dismiss', 'dissuade', 'hinder', 'neglect', 'stifle'], // Encourage
  'end': ['beginning', 'continuation', 'cycle', 'day', 'genesis', 'growth', 'immortality', 'inception', 'life', 'loop', 'open', 'origin', 'prelude', 'repeat', 'rise', 'source', 'start', 'threshold'], // end
  'ended': ['becoming', 'beginning', 'continuation', 'development', 'emergence', 'expansion', 'flourish', 'growth', 'start'], // ended
  'endgame': ['beginning', 'emergence', 'exploration', 'growth', 'introduction', 'journey', 'prelude', 'start', 'unfolding'], // Endgame
  'endless': ['bounded', 'concrete', 'defined', 'ephemeral', 'finite', 'fixed', 'limit', 'limited', 'momentary', 'restrictive', 'temporal', 'temporary'], // Endless
  'endlessness': ['bounded', 'constrained', 'contained', 'defined', 'finite', 'limited', 'momentary', 'mortality', 'temporary'], // endlessness
  'endorsement': ['disapproval'], // Endorsement
  'endurance': ['fleeing', 'fragility', 'instability', 'transience'], // Endurance
  'enduring': ['disposable', 'ephemeral', 'evanescent', 'fleeting', 'folding', 'momentary', 'mutable', 'temporary', 'transient'], // Enduring
  'energetic': ['calm', 'cool', 'coolness', 'drained', 'earthen', 'emerald', 'laziness', 'lazy', 'lethargic', 'lifeless', 'monotonous', 'passive', 'peace', 'peaceful', 'rest', 'serene', 'sluggish', 'timid'], // Energetic
  'energize': ['drag'], // Energize
  'energized': ['despairing', 'dormant', 'drained', 'tired', 'weary'], // Energized
  'energizing': ['draining', 'tiring'], // Energizing
  'energy': ['blackout', 'dormancy', 'dormant', 'drudgery', 'emptiness', 'inertia', 'sloth', 'sluggish', 'stagnation', 'stillness', 'void'], // Energy
  'engage': ['apathy', 'bore', 'detachment', 'disconnect', 'disengage', 'disinterest', 'dismiss', 'escape', 'evade', 'halt', 'ignore', 'indifference', 'neglect', 'retreat', 'vacate'], // engage
  'engaged': ['absent', 'aimless', 'aloof', 'apathetic', 'bored', 'complacent', 'detached', 'disengaged', 'disinterested', 'disjoint', 'dismissive', 'dispassionate', 'distant', 'distracted', 'downcast', 'idle', 'indifferent', 'laziness', 'mindless', 'oblivious', 'passive', 'resigned', 'shallow', 'slacker', 'uninvolved', 'unmoved'], // Engaged
  'engaged-presence': ['absent'], // Engaged-Presence
  'engagement': ['abandon', 'abandonment', 'alienation', 'boredom', 'detachment', 'disinterest', 'dismissal', 'escape', 'heavy', 'idleness', 'negation', 'negligence', 'passivity', 'reflection', 'shunning', 'solitude'], // Engagement
  'engaging': ['blunt', 'boring', 'dullard', 'insipid', 'isolating', 'lame', 'repellent', 'repelling', 'tedious', 'tiring'], // Engaging
  'engineered': ['natural', 'organic', 'primitive', 'raw', 'spontaneous'], // Engineered
  'engineering': ['abstract', 'arts', 'chaos', 'disorder', 'humanities', 'improvisation', 'instability', 'mess', 'randomness', 'services', 'spontaneity'], // Engineering
  'engrave': ['disregard', 'erase', 'fade', 'ignore', 'neglect', 'obliterate', 'remove', 'simplify'], // Engrave
  'engraved': ['die-cut'], // engraved
  'engraving': ['drawing', 'painting', 'removal'], // Engraving
  'enhance': ['damage', 'deplete', 'erode', 'hinder', 'muffle', 'shrink'], // Enhance
  'enhanced': ['erased'], // Enhanced
  'enhancement': ['deterioration'], // Enhancement
  'enhancing': ['diluting', 'dissolving', 'erasing'], // Enhancing
  'enigmatic': ['clear', 'direct', 'familiar', 'obvious', 'simple', 'straightforward'], // Enigmatic
  'enjoy': ['dislike'], // Enjoy
  'enlightenment': ['ignorance'], // Enlightenment
  'enormous': ['diminutive', 'tiny'], // Enormous
  'enrich': ['deplete'], // Enrich
  'enriching': ['draining'], // Enriching
  'enrichment': ['diminution'], // Enrichment
  'enter': ['evade'], // Enter
  'entertainment': ['ehs'], // entertainment
  'enthusiasm': ['boredom', 'coldness', 'diminution', 'disinterest'], // Enthusiasm
  'enthusiastic': ['apathetic', 'disinterested', 'downcast', 'lazy'], // Enthusiastic
  'enticing': ['repelling'], // Enticing
  'entire': ['partial'], // Entire
  'entrepreneurship': ['dependency', 'employment'], // Entrepreneurship
  'envelop': ['expose', 'reveal', 'strip', 'uncover', 'unveiling'], // Envelop
  'envelopment': ['detachment', 'disclosure', 'dispersal', 'exposure', 'freedom', 'isolation', 'openness', 'release', 'scattering', 'separation'], // Envelopment
  'environment': ['artificial', 'constructed', 'manmade', 'synthetic', 'urban'], // Environment
  'ephemera': ['horology', 'substance'], // Ephemera
  'ephemeral': ['archival', 'endless', 'enduring', 'eternal', 'lingering', 'museum', 'permanent', 'perpetual', 'publishing', 'root', 'rooting', 'statuary', 'timeless', 'timelessness'], // Ephemeral
  'ephemerality': ['legacy', 'perpetuity', 'persistence'], // Ephemerality
  'epic': ['banal', 'insignificant', 'mundane', 'ordinary', 'small', 'trivial'], // Epic
  'equality': ['hierarchy', 'inferior'], // Equality
  'equilibrium': ['chaos', 'disorder', 'dissonance', 'imbalance', 'tension'], // Equilibrium
  'equipment': ['beverage'], // Equipment
  'erase': ['construct', 'engrave', 'imprint', 'sculpt', 'trace'], // Erase
  'erased': ['defined', 'drawing', 'enhanced', 'expressed', 'filled', 'highlighted', 'marked', 'present', 'visible'], // Erased
  'erasing': ['adding', 'building', 'creating', 'enhancing', 'filling', 'layering', 'sculpting'], // Erasing
  'erasure': ['assertion', 'clarity', 'creation', 'definition', 'detail', 'emphasis', 'expression', 'painting', 'presence', 'visibility'], // Erasure
  'ergonomic': ['awkwardness', 'clumsy', 'crude', 'disorder', 'excessive', 'restrictive'], // Ergonomic
  'erode': ['build', 'construct', 'create', 'enhance', 'expand', 'preserve', 'restore', 'solid', 'strengthen'], // erode
  'erosion': ['crystallization'], // erosion
  'erratic': ['behavioral', 'deliberate', 'methodical', 'predictable', 'reliable'], // Erratic
  'erupt': ['calm', 'contained', 'gentle', 'peaceful', 'quiet', 'smooth', 'still', 'subdue', 'subdued'], // Erupt
  'escape': ['attachment', 'bondage', 'confinement', 'confront', 'engage', 'engagement', 'immerse', 'inclusion', 'presence', 'remain', 'stuck'], // Escape
  'escapism': ['premium'], // Escapism
  'essence': ['facade', 'husk'], // Essence
  'essential': ['cosmetics', 'disposable', 'extraneous', 'insignificant', 'irrelevant', 'obsolescence', 'obsolete', 'pointless', 'useless', 'worthless'], // Essential
  'essentialism': ['cluttered', 'complex', 'excess', 'excessive'], // Essentialism
  'essentials': ['merchandise', 'souvenirs'], // Essentials
  'establish': ['break'], // Establish
  'established': ['unfounded', 'unvalued'], // Established
  'estate': ['layout', 'serif'], // Estate
  'estrangement': ['closeness', 'connect'], // Estrangement
  'eternal': ['brief', 'chronos', 'ephemeral', 'finite', 'fleeting', 'limited', 'momentary', 'perishable', 'seasons', 'temporary', 'transient'], // Eternal
  'eternal-now': ['fugitive'], // Eternal-Now
  'eternity': ['chronos', 'closing', 'fleeting', 'moment', 'mortality', 'temporary', 'time', 'transient'], // eternity
  'ether': ['earth'], // Ether
  'ethereal': ['chthonic', 'concrete', 'earthy', 'geology', 'mineral', 'mundane', 'solid', 'tangibility', 'tangible', 'terrestrial'], // Ethereal
  'ethereal-lightness': ['burdened'], // Ethereal-Lightness
  'ethnic': ['contemporary', 'generic'], // Ethnic
  'euphoria': ['boredom', 'despair', 'dullness', 'emptiness', 'gloom', 'misery', 'sadness', 'sorrow', 'unhappiness'], // Euphoria
  'euphoric': ['dismal', 'heavy'], // Euphoric
  'european': ['exotic', 'premium'], // European
  'evade': ['approach', 'capture', 'confront', 'connect', 'embrace', 'engage', 'enter', 'expose', 'reveal'], // Evade
  'evaluation': ['dismissal', 'disregard', 'neglect'], // Evaluation
  'evanescent': ['chronos', 'constant', 'enduring', 'fixed', 'immovable', 'lasting', 'permanent', 'solid', 'stable'], // Evanescent
  'even': ['bump', 'bumpy', 'craggy', 'curvy', 'jagged', 'oblique', 'splotchy', 'uneven', 'wavy'], // Even
  'evening': ['activity', 'awakening', 'brightness', 'dawn', 'day', 'morning'], // Evening
  'event': ['absence', 'monotony', 'silence', 'stagnation', 'void'], // Event
  'everyday': ['exceptional', 'extraordinary', 'rare', 'unique'], // Everyday
  'everyday-eats': ['uncommon'], // Everyday-Eats
  'everyday-practicality': ['fictional'], // Everyday-Practicality
  'evidence': ['myth'], // Evidence
  'evident': ['invisible', 'uncertain'], // Evident
  'evocative': ['bland', 'dull', 'flat', 'mundane', 'uninspired'], // Evocative
  'evolution': ['decay', 'obsolescence', 'regression', 'stagnation', 'static'], // Evolution
  'evolve': ['decline', 'descend', 'diminish', 'regress', 'stagnate'], // Evolve
  'evolving': ['unchanged', 'unchanging'], // Evolving
  'exact': ['ambiguous', 'chaotic', 'disordered', 'imprecise', 'imprecision', 'inexact', 'loose', 'postlude', 'random', 'vague'], // Exact
  'exactness': ['impression'], // Exactness
  'exaggeration': ['calm', 'focus', 'minimalism', 'order', 'restraint', 'simplicity', 'subtlety', 'understatement'], // Exaggeration
  'excellence': ['deficiency', 'failure', 'inferiority', 'mediocrity', 'ordinariness'], // Excellence
  'exceptional': ['average', 'basic', 'bland', 'common', 'dull', 'everyday', 'mediocre', 'ordinary', 'pedestrian', 'unremarkable'], // Exceptional
  'excess': ['economy', 'essentialism', 'minimalism', 'moderation', 'plain', 'proportion', 'restraint', 'scarcity', 'simplicity', 'subdued'], // Excess
  'excessive': ['basic', 'efficiency', 'ergonomic', 'essentialism', 'functionalism', 'minimal', 'minimalism', 'minimalistic', 'modest', 'ordinary', 'plain', 'pristine', 'simple', 'sparse', 'subdued', 'swiss'], // Excessive
  'excite': ['bore', 'heavy'], // Excite
  'excited': ['apathetic', 'bored', 'downcast', 'numb'], // Excited
  'excitement': ['boredom', 'disinterest', 'drudgery', 'heavy'], // Excitement
  'exciting': ['banal', 'bland', 'boring', 'drag', 'draining', 'dull', 'dullard', 'insipid', 'lame', 'lifeless', 'mediocre', 'monotonous', 'mundane', 'repetitive', 'stale', 'tedious', 'tiring'], // Exciting
  'exclude': ['integrate'], // Exclude
  'excluded': ['embraced', 'immerse'], // Excluded
  'exclusion': ['absorption', 'access', 'companion', 'hospitality', 'penetration', 'privilege'], // Exclusion
  'exclusive': ['accessible', 'cheap', 'collaborative', 'common', 'peripheral', 'public', 'ubiquitous'], // Exclusive
  'exclusivity': ['accessibility', 'commonality', 'inclusivity', 'openness', 'universality'], // Exclusivity
  'exhaustion': ['invigoration', 'recyclability', 'rejuvenation'], // Exhaustion
  'exhibition': ['covert', 'illustration', 'led', 'private'], // Exhibition
  'exile': ['acceptance', 'belonging', 'community', 'connection', 'homecoming', 'inclusion', 'integration', 'sanctuary', 'unity'], // exile
  'exist': ['disappear', 'nonexist'], // Exist
  'existence': ['absence', 'nonexist', 'nothing', 'nullity', 'obliteration', 'oblivion', 'void'], // existence
  'existent': ['absent'], // Existent
  'existing': ['disembodiment', 'imaginary'], // Existing
  'exit': ['remain'], // Exit
  'exotic': ['common', 'european', 'familiar', 'mundane', 'ordinary', 'plain', 'predictable', 'simple', 'standard'], // exotic
  'expand': ['collapse', 'confine', 'constrain', 'constrict', 'contract', 'diminish', 'discourage', 'drown', 'erode', 'limit', 'plunge', 'reduce', 'regress', 'restrict', 'shrink', 'shrivel', 'thaw', 'wither'], // Expand
  'expanded': ['folded'], // Expanded
  'expanding': ['compressing', 'narrowing'], // Expanding
  'expanse': ['closure', 'confinement', 'contraction', 'corridor', 'limitation', 'narrowness'], // Expanse
  'expansion': ['bounded', 'closing', 'compression', 'confinement', 'constraint', 'containment', 'contraction', 'deadend', 'decline', 'deprivation', 'diminution', 'enclosure', 'ended', 'limitation', 'minimize', 'narrowing', 'narrowness', 'negation', 'reduction', 'restriction', 'suppression', 'tunnel'], // Expansion
  'expansive': ['confining', 'contained', 'diminutive', 'dismissive', 'finite', 'limit', 'micro', 'restrictive', 'small'], // Expansive
  'expansive-freedom': ['bondage', 'captivity', 'restriction'], // Expansive-Freedom
  'expansiveness': ['petiteness'], // Expansiveness
  'expected': ['offbeat'], // Expected
  'expensive': ['cheap'], // Expensive
  'experience': ['detachment', 'disconnection', 'disengagement', 'emptiness', 'isolation', 'naivety'], // Experience
  'experiences': ['merchandise'], // Experiences
  'experiential': ['abstract', 'detached', 'disembodied', 'distant', 'static', 'theoretical'], // Experiential
  'experimental': ['classicism', 'commercial', 'composition', 'contrast', 'mainstream', 'mundane'], // Experimental
  'expert': ['amateur'], // Expert
  'expertise': ['clueless', 'clumsiness', 'disorder', 'ignorance', 'inexperience', 'naivety'], // Expertise
  'expire': ['active', 'begin', 'fresh', 'live', 'present', 'renew', 'start', 'sustain', 'vibrant'], // expire
  'explicit': ['ambiguous', 'general', 'subtext', 'uncertain', 'unclear', 'vague'], // Explicit
  'exploitation': ['care', 'conservation', 'freedom', 'inclusion', 'nurture', 'philanthropy', 'support', 'unity'], // exploitation
  'exploitative': ['eco-design'], // Exploitative
  'exploration': ['captivity', 'endgame'], // Exploration
  'exploratory': ['conventional', 'fixed', 'predictable', 'routine', 'static'], // Exploratory
  'explosion': ['calmness', 'implosion'], // Explosion
  'explosive': ['calm', 'gentle', 'muted-emotion', 'peaceful', 'quiet', 'smooth', 'stable', 'static', 'subdued'], // Explosive
  'expose': ['closed', 'envelop', 'evade', 'hide', 'lock', 'muffle', 'shroud', 'whisper'], // Expose
  'exposed': ['armored', 'cloistered', 'concealed', 'covered', 'covert', 'curtained', 'discretion', 'encapsulated', 'enclosed', 'fortified', 'guarded', 'invisible', 'masked', 'obscuring', 'private', 'sealed', 'shielded', 'shrouded', 'subsurface', 'unseen', 'veiled', 'veiling'], // Exposed
  'exposing': ['concealing', 'hiding'], // Exposing
  'exposure': ['concealment', 'cybersecurity', 'eclipse', 'encapsulation', 'encasement', 'enclosure', 'envelopment', 'hiding', 'obscurity', 'protection', 'safety', 'sanctuary', 'seclusion', 'shade', 'shelter', 'shield', 'tunnel'], // Exposure
  'express': ['muffle'], // Express
  'expressed': ['erased', 'suppressed'], // Expressed
  'expressing': ['suppressing', 'withholding'], // Expressing
  'expression': ['erasure', 'silence', 'stagnation', 'suppression', 'void'], // Expression
  'expressive': ['banal', 'bland', 'blunt', 'coolness', 'cozy', 'dispassionate', 'hushing', 'impersonal', 'introverted', 'nonverbal', 'reserved', 'stifled', 'stoic'], // Expressive
  'expressiveness': ['apathy', 'detachment', 'indifference', 'inhibition', 'silence'], // Expressiveness
  'expulsion': ['absorption', 'acceptance', 'attachment', 'connection', 'embrace', 'inclusion', 'integration', 'reception', 'welcome'], // expulsion
  'exterior': ['interior'], // Exterior
  'external': ['hidden', 'internal', 'intimate', 'introspective', 'inward', 'local', 'personal', 'private', 'subjective'], // External
  'extinguish': ['ignite'], // Extinguish
  'extinguished': ['ignited'], // Extinguished
  'extraneous': ['clear', 'concise', 'essential', 'focused', 'fundamental', 'integral', 'necessary', 'simple', 'tight'], // Extraneous
  'extraordinary': ['basic', 'common', 'dull', 'everyday', 'mundane', 'normal', 'ordinary', 'pedestrian', 'standard', 'typical'], // Extraordinary
  'extravagant': ['meager', 'sober', 'utilitarian'], // Extravagant
  'extroverted': ['introverted', 'shy'], // Extroverted
  'exuberance': ['apathy', 'calmness', 'despair', 'dreariness', 'dullness', 'gloom', 'indifference', 'melancholy', 'monotony', 'restraint', 'sadness', 'subtlety'], // Exuberance
  'exuberant': ['meager', 'restrained', 'solemn'], // Exuberant
  'eyewear': ['bare', 'internal', 'natural'], // Eyewear
  'fable': ['fixed', 'literal', 'reality', 'rigid', 'serious', 'stale', 'truth'], // fable
  'fabric': ['hard', 'paper', 'rigid', 'solid', 'wire', 'wood'], // Fabric
  'fabricated': ['authentic', 'genuine', 'natural', 'real', 'simple', 'spontaneous', 'unadorned-truth'], // Fabricated
  'facade': ['authentic', 'authenticity', 'core', 'depth', 'essence', 'genuine', 'inner', 'reality', 'substance', 'transparency', 'truth'], // Facade
  'face': ['fleshless'], // Face
  'faceless': ['defined', 'distinct', 'dynamic', 'fleshy', 'fresh', 'identity', 'personable', 'sensible', 'vivid'], // faceless
  'faceted': ['flat', 'smooth', 'uniform'], // Faceted
  'facilitate': ['hinder'], // Facilitate
  'fact': ['chaos', 'dream', 'false', 'falsehood', 'fantasy', 'fiction', 'hypothesis', 'illusion', 'impression', 'interpretation', 'lie', 'myth', 'mythos', 'unreal'], // fact
  'factory': ['artisanal', 'chaotic', 'freeform', 'handcrafted', 'handmade', 'natural', 'organic', 'spontaneous', 'unique', 'winery'], // Factory
  'factual': ['fictional', 'imaginary'], // Factual
  'faddish': ['classic', 'classic-integrity', 'elegant', 'serious', 'sophisticated', 'stable', 'subdued', 'timeless', 'traditional'], // Faddish
  'fade': ['bloom', 'engrave', 'flourish', 'highlight', 'intensify', 'overpower', 'remain', 'streak'], // Fade
  'faded': ['brilliant', 'dazzling', 'fiery', 'gleaming', 'ignited', 'vibrancy', 'vividness'], // Faded
  'fading': ['bold', 'emerging', 'intense', 'saturating', 'sharp', 'vivid'], // Fading
  'fail': ['conquer', 'thrive'], // Fail
  'failure': ['achievement', 'approval', 'ascendancy', 'dream', 'efficacy', 'excellence', 'fulfillment', 'gain', 'improvement', 'mastery', 'milestone', 'payments', 'potential', 'produce', 'profit', 'prosperity', 'recognition', 'recruitment', 'resilience', 'satisfied', 'solutions', 'strength', 'success', 'triumph', 'utopia', 'victory'], // Failure
  'faint': ['blazing', 'blinding', 'bold', 'burnt', 'foreground', 'glare', 'imprint', 'intense', 'loud', 'strident', 'striking', 'visible', 'vivid'], // Faint
  'faith': ['denial', 'disillusion', 'distrust', 'doubt', 'doubting'], // Faith
  'fake': ['authentic', 'genuine', 'genuineness', 'honest', 'original', 'real', 'sincere', 'true', 'valid'], // Fake
  'fall': ['ascendancy', 'ascension', 'ascent', 'bright', 'full', 'life', 'prosperity', 'raise', 'rise', 'soar', 'spring'], // fall
  'false': ['authentic', 'certain', 'clear', 'distinct', 'fact', 'genuine', 'genuineness', 'honest', 'real', 'true', 'unveiled-truth', 'visible'], // False
  'falsehood': ['authentic', 'certainty', 'fact', 'genuine', 'reality', 'sincere', 'sincerity', 'truth', 'veracity'], // falsehood
  'falsity': ['authenticity'], // falsity
  'fame': ['anonymity', 'common', 'isolation', 'neglect', 'obscurity', 'ordinary', 'simple', 'unnoticed'], // fame
  'familiar': ['alien', 'awkward', 'bizarre', 'distant', 'enigmatic', 'exotic', 'foreign', 'forgotten', 'frontier', 'fugitive', 'mysterious', 'new', 'novel', 'strange', 'surprise', 'uncommon', 'unfamiliar', 'unhinged', 'unknown'], // familiar
  'familiarity': ['foreign', 'heavy', 'idiosyncrasy', 'strange'], // Familiarity
  'famous': ['anonymous', 'common', 'forgotten', 'ignored', 'insignificant', 'obscure', 'ordinary', 'unknown', 'unnoticed'], // famous
  'fanciful': ['bland', 'mundane', 'ordinary', 'practical', 'serious', 'simple'], // Fanciful
  'fandom': ['alienation', 'apathy', 'detachment', 'disconnection', 'disinterest', 'indifference', 'isolation', 'neglect'], // Fandom
  'fantasy': ['fact', 'hyperreal', 'normalcy', 'ordinariness', 'reality'], // Fantasy
  'fascinated': ['bored'], // Fascinated
  'fascination': ['disinterest'], // Fascination
  'fashion': ['composition', 'contrast', 'practical'], // Fashion
  'fast': ['slow', 'unhurried'], // Fast
  'fast food': ['nutraceuticals'], // fast food
  'fast-food': ['gastronomy', 'healthy'], // Fast-Food
  'fatigue': ['invigoration', 'vitality'], // Fatigue
  'fauna': ['flora'], // fauna
  'favor': ['aversion', 'contempt', 'disapproval', 'disdain', 'disfavor', 'dislike', 'dismissal', 'indifference', 'neglect', 'rejecting', 'rejection', 'unfavor'], // Favor
  'fear': ['calm', 'confidence', 'conquer', 'courage', 'hopeful', 'joy', 'peace', 'safety', 'trust', 'valor'], // Fear
  'fearful': ['reassuring'], // Fearful
  'fearless': ['cautious'], // Fearless
  'feather': ['heavyweight'], // Feather
  'feathery': ['weighty'], // Feathery
  'feed': ['starve'], // Feed
  'feminine': ['aggressive', 'brutal', 'clumsy', 'dominance', 'masculine'], // Feminine
  'feral': ['calm', 'controlled', 'domesticated', 'gentle', 'orderly', 'peaceful', 'refined', 'structured', 'tame'], // Feral
  'fertile': ['arid', 'barren', 'deficient', 'desolate', 'devoid', 'empty', 'lacking', 'poor', 'sterile'], // fertile
  'fervent': ['stoic'], // Fervent
  'fervor': ['apathy', 'boredom', 'coolness', 'detachment', 'disdain', 'disinterest', 'indifference'], // Fervor
  'festive': ['bleak', 'dreary', 'gloomy', 'mundane', 'somber'], // Festive
  'fi': ['dull', 'mundane', 'static'], // Fi
  'fiat': ['cryptocurrency'], // fiat
  'fibrous': ['fluid', 'layered', 'metallic', 'scrolling', 'soft', 'synthetic', 'transparent'], // Fibrous
  'fickle': ['consistent', 'constant', 'fixed', 'loyal', 'predictable', 'reliability', 'reliable', 'stable', 'steadfast', 'steady'], // Fickle
  'fiction': ['fact'], // Fiction
  'fictional': ['actual', 'biographical', 'certain', 'definite', 'everyday-practicality', 'factual', 'genuine', 'literal', 'real', 'true'], // Fictional
  'field': ['absence', 'chaos', 'cubism', 'dispersal', 'fragment', 'void'], // Field
  'fierce': ['bland', 'calm', 'gentle', 'gentle-hue', 'quiet', 'soft', 'subtle', 'tame', 'weak'], // Fierce
  'fiery': ['bland', 'calm', 'cold', 'cool', 'dull', 'faded', 'icy-palette', 'neutral', 'soft', 'subdued'], // Fiery
  'figurative': ['abstract', 'basic', 'flat', 'formless', 'geometric', 'literal', 'non-representational', 'plain', 'raw', 'rough', 'simple'], // Figurative
  'fill': ['deplete'], // Fill
  'filled': ['bare', 'blank', 'deficient', 'empty', 'erased', 'hollow', 'lacking', 'null', 'porous', 'sparse', 'thin', 'vacancy', 'vacant', 'void'], // Filled
  'filling': ['erasing', 'narrowing'], // Filling
  'filmic': ['illustration', 'led'], // Filmic
  'filtered': ['bold', 'candid', 'chaotic', 'direct', 'harsh', 'intense', 'raw', 'unfiltered', 'vivid'], // Filtered
  'filtering': ['flood', 'illustration', 'led', 'overflow'], // Filtering
  'filth': ['brightness', 'clarity', 'cleanliness', 'cultivate', 'elegance', 'freshness', 'neatness', 'order', 'purity', 'simplicity'], // Filth
  'final': ['beginning', 'initial', 'ongoing', 'open', 'sketching', 'start'], // Final
  'finale': ['beginning', 'commencement', 'initiation', 'introduction', 'launch', 'opening', 'prelude', 'premiere', 'start'], // Finale
  'finality': ['beginning', 'chaos', 'continuity', 'cycle', 'flux', 'freedom', 'infinity', 'journey', 'liminality', 'openness', 'possibility', 'uncertainty', 'variability'], // finality
  'finance': ['chaos', 'disorder', 'gift', 'hobby', 'inequity', 'media', 'poverty', 'simplicity'], // Finance
  'fine': ['basic', 'coarse', 'crude', 'janky', 'raw', 'rough', 'roughness', 'thick'], // Fine
  'fine art': ['murals'], // fine art
  'fine-art': ['murals'], // Fine Art
  'finedining': ['casualdining', 'streetfood'], // finedining
  'fines': ['rewards'], // fines
  'finish': ['begin', 'beginning', 'create', 'develop', 'generate', 'grow', 'initiate', 'open', 'start'], // finish
  'finished': ['incomplete', 'loading', 'ongoing', 'open', 'unfinished'], // Finished
  'finite': ['boundless', 'endless', 'endlessness', 'eternal', 'expansive', 'globe', 'infinite', 'infinity', 'limitless', 'loop', 'nebula', 'perpetual', 'perpetuity', 'planetary', 'unlimited', 'vast'], // finite
  'finitude': ['immortality'], // Finitude
  'fintech': ['analog', 'basic', 'chaotic', 'cluttered', 'legacy', 'manual', 'simple', 'static', 'traditional'], // Fintech
  'fire': ['frost', 'ice', 'water'], // Fire
  'firm': ['blobby', 'flexibility', 'hesitant', 'impotence', 'leak', 'malleable', 'melt', 'wavering', 'wobbly'], // Firm
  'fit': ['frumpy'], // Fit
  'fix': ['break'], // Fix
  'fixation': ['adaptation', 'chaos', 'disinterest', 'dispersal', 'dissipation', 'freedom', 'neglect', 'release', 'unfocus'], // fixation
  'fixed': ['amorphous', 'breezy', 'cellular', 'endless', 'evanescent', 'exploratory', 'fable', 'fickle', 'fleeting', 'flex', 'flexibility', 'flicker', 'flighty', 'folding', 'freeform', 'freestyle', 'hover', 'improvised', 'liquid', 'loose', 'loosen', 'malleable', 'mobile', 'mobility', 'modular', 'morph', 'mutable', 'nomadic', 'parametric', 'plasma', 'reactive', 'responsive', 'serpentine', 'shift', 'shifting', 'spill', 'stackability', 'stackable', 'subjective', 'transient', 'uncertain', 'unconfined', 'undulating', 'ungrounded', 'unsettled', 'unstable', 'unsteady', 'vague', 'variable', 'variant', 'wandering', 'wavering', 'wobbly', 'yachting'], // Fixed
  'fixed-horizon': ['variable'], // Fixed-Horizon
  'fixity': ['change', 'chaos', 'fluid', 'flux', 'mobility', 'random', 'shifting', 'transformation', 'uncertainty', 'vague'], // fixity
  'flaky': ['compact', 'dense', 'smooth', 'solid', 'uniform'], // Flaky
  'flamboyant': ['dull', 'modest', 'mute', 'neutral', 'ordinary', 'plain', 'reserved', 'simple', 'subdued', 'unadorned'], // Flamboyant
  'flare': ['dim', 'dull', 'flat', 'muted', 'subdued'], // Flare
  'flashy': ['dimming', 'dull', 'muted', 'plain', 'simple', 'steady', 'subtle', 'understated'], // Flashy
  'flat': ['3d', '3d-rendering', 'accordion', 'apex', 'arch', 'braided', 'brilliant', 'brushed', 'brushwork', 'bubble', 'bump', 'bumpy', 'caps', 'chiaroscuro', 'coil', 'contour', 'curvature', 'curvilinear', 'curvy', 'cylinder', 'cylindrical', 'dazzling', 'dimensional', 'dome', 'elevated', 'embossing', 'evocative', 'faceted', 'figurative', 'flare', 'foamy', 'folded', 'full', 'fuzzy', 'globe', 'graded', 'grading', 'grained', 'granular', 'kaleidoscopic', 'layered', 'layers', 'liveliness', 'lustrous', 'macro', 'neumorphic', 'oblique', 'painterly', 'paneled', 'panelled', 'parallax', 'particulate', 'phosphor', 'plump', 'pointed', 'punchy', 'pyramid', 'radial', 'raised', 'relief', 'round', 'sculptural', 'shape', 'sheen', 'shimmer', 'shine', 'shiny', 'skeuomorphism', 'spherical', 'spiral', 'splash', 'stimulating', 'storyful', 'strata', 'stratosphere', 'summit', 'terrain', 'textural', 'textured', 'thunders', 'tiered', 'topography', 'tubular', 'twist', 'twisted', 'undulating', 'undulation', 'veiling', 'vertex', 'vibration', 'volume', 'vortex', 'wave', 'wavy', 'woven', 'xr', 'zesty'], // Flat
  'flat-plane': ['raised'], // Flat-Plane
  'flatness': ['bounce', 'bump', 'cubism', 'curvature', 'depth', 'dimension', 'hierarchy', 'layering', 'raise', 'relief', 'ripple', 'verticality', 'volume'], // Flatness
  'flatten': ['bulge', 'curvature', 'depth', 'dimension', 'magnify', 'rise', 'sculpt', 'stack', 'volume'], // flatten
  'flattening': ['complexity', 'depth', 'dimension', 'elevation', 'layering', 'richness', 'sculpting', 'texture', 'volume'], // Flattening
  'flavorful': ['insipid'], // Flavorful
  'flaw': ['completeness', 'flawless', 'integrity', 'perfection', 'portfolio'], // Flaw
  'flawed': ['complete', 'flawless', 'ideal', 'perfect', 'polished', 'prime', 'pristine', 'retouching', 'solid', 'spotless', 'stable'], // Flawed
  'flawless': ['chaotic', 'clumsy', 'distress', 'dull', 'flaw', 'flawed', 'imperfect', 'imperfection', 'messy', 'rough', 'ugly'], // flawless
  'flawlessness': ['imperfection'], // flawlessness
  'fleeing': ['anchoring', 'arrival', 'clinging', 'embracing', 'endurance', 'holding', 'presence', 'settling', 'staying'], // fleeing
  'fleeting': ['archival', 'concreteness', 'constant', 'enduring', 'eternal', 'eternity', 'fixed', 'lasting', 'lingering', 'longevity', 'monumental', 'permanent', 'perpetual', 'perpetuity', 'stable', 'static', 'timeless', 'timelessness'], // Fleeting
  'flesh': ['ceramic', 'glass', 'metal', 'plastic', 'stone'], // Flesh
  'fleshless': ['complexity', 'depth', 'face', 'fleshy', 'psyche', 'richness', 'substance', 'volume', 'wisdom'], // fleshless
  'fleshy': ['faceless', 'fleshless'], // Fleshy
  'flex': ['fixed', 'rigid', 'static'], // Flex
  'flexibility': ['firm', 'fixed', 'immobility', 'inflexibility', 'inflexible', 'restriction', 'rigidity', 'solid', 'stability', 'static', 'stiff', 'stiffness'], // Flexibility
  'flexible': ['bondage', 'brittle', 'cast', 'concrete', 'constrict', 'doctrinal', 'halted', 'predefined', 'restrained', 'restricted', 'restrictive', 'steel', 'stern', 'stiff', 'wire'], // Flexible
  'flicker': ['clear', 'constant', 'fixed', 'smooth', 'solid', 'stable', 'steady', 'uniform', 'uniform-brightness'], // Flicker
  'flighty': ['certain', 'fixed', 'focused', 'grounded', 'grounding', 'serious', 'solid', 'stable', 'steady'], // flighty
  'flippant': ['intense', 'serious', 'solemn', 'solemnity', 'weighted'], // Flippant
  'float': ['anchor', 'descend', 'drown', 'ground', 'plummet', 'plunge', 'sink', 'submerge', 'weight'], // Float
  'floating': ['root', 'rooting'], // Floating
  'flood': ['clear', 'dry', 'empty', 'filtering', 'light', 'low', 'minimal', 'solid', 'still'], // Flood
  'flora': ['fauna', 'steel', 'synthetic', 'urban'], // Flora
  'flotilla': ['desolation', 'emptiness', 'isolation', 'monotony', 'singularity', 'solitude', 'stagnation', 'stillness', 'void'], // Flotilla
  'flourish': ['blight', 'decay', 'decline', 'diminish', 'dormancy', 'ended', 'fade', 'harm', 'ruin', 'shrivel', 'stagnate', 'wilt', 'wither'], // Flourish
  'flourishing': ['arid', 'barren', 'desolate', 'deterioration', 'dormant', 'tarnished', 'withering'], // Flourishing
  'flow': ['burden', 'deadend', 'freeze', 'halt', 'hassle', 'interference', 'modularity', 'obstacle', 'pressure', 'stop', 'strain', 'strife', 'stuck', 'suppression'], // Flow
  'flowchart': ['ambiguity', 'chaos', 'confusion', 'disorder', 'randomness'], // Flowchart
  'flowing': ['disjointed', 'frozen', 'halted', 'narrowing', 'stilted', 'stopped'], // Flowing
  'fluctuation': ['constancy'], // Fluctuation
  'fluid': ['artifact', 'ascii', 'axis', 'backward', 'based', 'binary', 'bind', 'block', 'blocky', 'bondage', 'bounded', 'boxy', 'brutalism', 'cast', 'charted', 'coded', 'columnar', 'concrete', 'concreteness', 'confining', 'constant', 'constrict', 'cubist', 'cumbersome', 'definite', 'doctrinal', 'enclosed', 'fibrous', 'fixity', 'frame', 'frozen', 'glacial', 'grid', 'interrupted', 'janky', 'layered', 'mechanic', 'mechanical', 'metallic', 'mineral', 'octagonal', 'pixel', 'pixelated', 'pixelation', 'polygon', 'predefined', 'predetermined', 'rectangle', 'rectangular', 'regression', 'resolved', 'restrictive', 'robotic', 'rocky', 'rooted', 'rows', 'script', 'scrolling', 'segmented', 'single', 'soft', 'solidify', 'solidifying', 'solidity', 'square', 'staccato', 'staged', 'statuary', 'steel', 'stiff', 'stilted', 'stone', 'stopped', 'structural', 'stuffy', 'synthetic', 'technic', 'tightened', 'transparent', 'unchanging', 'viscous', 'weighty', 'wire'], // Fluid
  'fluidity': ['anchored', 'architecture', 'circuit', 'constraint', 'cubism', 'framework', 'imposition', 'mass', 'matrix', 'measure', 'mechanism'], // Fluidity
  'fluke': ['certainty', 'consistency', 'predictability', 'principle', 'reliability', 'solid', 'stability', 'uniformity'], // fluke
  'flux': ['constancy', 'finality', 'fixity', 'order', 'permanence', 'stability', 'stasis', 'stillness', 'structure'], // Flux
  'foamy': ['dense', 'flat', 'smooth', 'solid', 'stiff'], // Foamy
  'focus': ['abandonment', 'blindness', 'blurb', 'confusion', 'disregard', 'dissipation', 'drift', 'editorial', 'exaggeration', 'fog', 'foolishness', 'forget', 'harmony', 'idleness', 'ignore', 'muddle', 'negligence', 'overflow', 'sidebar', 'sloppiness', 'sloth', 'vacate', 'wander', 'waver'], // Focus
  'focused': ['aimless', 'blind', 'bokeh', 'chaos', 'clueless', 'cluttered', 'conflicted', 'confused', 'confusing', 'diffused', 'disorder', 'dispersal', 'disregarded', 'distracted', 'extraneous', 'flighty', 'fumbled', 'imprecise', 'impure', 'interstitial', 'nebulous', 'negligent', 'noisy', 'oblivious', 'obscuring', 'peripheral', 'rambling', 'restless', 'scatterbrained', 'scrawl', 'slack', 'slacker', 'smeared', 'splat', 'sprawled', 'spread', 'tangential', 'unfocused', 'wandering'], // Focused
  'focusing': ['dissolving'], // Focusing
  'fog': ['brightness', 'clarity', 'definition', 'focus', 'insight', 'lightness', 'openness', 'transparency', 'vividness'], // fog
  'folded': ['complete', 'expanded', 'flat', 'open', 'smooth', 'unfolded', 'whole'], // Folded
  'folding': ['constant', 'enduring', 'fixed', 'permanent', 'solid', 'stable', 'static', 'unfolding'], // folding
  'foliage': ['arid', 'barren', 'bleak', 'dry', 'sterile'], // Foliage
  'folk': ['abstract', 'industrial', 'minimal', 'modern', 'sophisticated'], // Folk
  'following': ['trendsetting'], // following
  'font': ['composition', 'contrast', 'scribble'], // Font
  'fonts': ['composition', 'contrast'], // Fonts
  'food': ['cool', 'coolness', 'hunger', 'pharmaceutical', 'scarcity', 'supplements', 'waste'], // Food
  'foolish': ['academia', 'clear', 'intelligent', 'prudent', 'rational', 'sensible', 'thoughtful', 'wise'], // Foolish
  'foolishness': ['clarity', 'focus', 'intelligence', 'knowledge', 'logic', 'meaning', 'purpose', 'sense', 'wisdom'], // foolishness
  'footer': ['prime', 'upper'], // Footer
  'footwear': ['barefoot', 'headwear', 'outerwear', 'unclad'], // Footwear
  'for': ['non-profit'], // For
  'for-profit': ['non-profit'], // For-Profit
  'force': ['calm', 'rest', 'stillness', 'weakness'], // Force
  'forceful': ['passive'], // Forceful
  'foreground': ['abstract', 'background', 'distant', 'faint', 'hidden', 'invisible', 'subtle', 'vague'], // Foreground
  'foreign': ['familiar', 'familiarity', 'home', 'local', 'native'], // Foreign
  'forestry': ['aquaculture'], // forestry
  'forget': ['acknowledge', 'capture', 'emphasize', 'focus', 'grasp', 'highlight', 'notice', 'present', 'recognize', 'remember', 'retain'], // Forget
  'forgetfulness': ['memorial', 'remembrance'], // forgetfulness
  'forgettable': ['impactful', 'meaningful', 'memorable', 'mundane-spectacle', 'notable', 'significant', 'striking', 'vivid'], // Forgettable
  'forgetting': ['anchoring', 'belonging', 'holding', 'memory', 'remembering', 'remembrance'], // forgetting
  'forgotten': ['cherished', 'familiar', 'famous', 'icon', 'known', 'notable', 'present', 'remembered', 'visible'], // forgotten
  'form': ['disassemble', 'line', 'psyche', 'void'], // Form
  'formal': ['bistro', 'camp', 'casual', 'disheveled', 'doodle', 'freeform', 'freestyle', 'informal', 'irreverent', 'silly', 'streetwear'], // Formal
  'formality': ['casual', 'casual-chaos', 'chaotic', 'disorderly', 'impressionist', 'informal', 'messy', 'relaxed', 'scribble', 'spontaneous', 'wild', 'youthfulness'], // Formality
  'formalwear': ['casualfootwear'], // formalwear
  'formation': ['chaos', 'detachment', 'disorder', 'dispersal', 'dissolution'], // Formation
  'formed': ['amorphous', 'anti-form', 'chaotic', 'disordered', 'haphazard', 'messy', 'random', 'unconfined', 'undefined', 'unformed', 'unstructured', 'untamed', 'unvalued'], // Formed
  'forming': ['obliterating'], // Forming
  'formless': ['crystal', 'defined', 'figurative', 'shaped', 'structured'], // Formless
  'formulated-limits': ['unconfined'], // Formulated-Limits
  'fortified': ['deficient', 'exposed', 'fragile', 'open', 'uncertain', 'unstable', 'vulnerable', 'vulnerable-space', 'weak', 'weakened'], // Fortified
  'fortifying': ['diluting'], // Fortifying
  'fortitude': ['chaos', 'confusion', 'disorder', 'indecision', 'instability', 'uncertainty', 'vulnerability', 'weakness'], // fortitude
  'fortune': ['misfortune'], // Fortune
  'forward': ['backward', 'descend', 'retro', 'stagnant', 'static'], // Forward
  'fossil': ['eco-tech'], // Fossil
  'foster': ['destroy'], // Foster
  'foul': ['bright', 'fresh', 'freshness', 'friendly', 'generous', 'inviting', 'pure', 'rich', 'vibrant'], // foul
  'found': ['lost', 'nowhere'], // Found
  'foundation': ['chaos', 'disorder', 'fragment'], // Foundation
  'founded': ['unfounded'], // Founded
  'fracture': ['complete', 'connected', 'continuity', 'continuous', 'intact', 'smooth', 'solid', 'unified', 'whole'], // Fracture
  'fractured-harmony': ['unison'], // Fractured-Harmony
  'fragile': ['armored', 'fortified', 'freight', 'humble', 'resilient', 'robust', 'sturdy', 'thick'], // Fragile
  'fragility': ['endurance', 'resilience', 'robustness', 'shield', 'solidity', 'stability', 'strength'], // Fragility
  'fragment': ['completion', 'consolidate', 'continuity', 'continuum', 'field', 'foundation', 'integrate', 'module', 'mosaic', 'nucleus', 'realm', 'synthesize', 'unify', 'unite', 'unity', 'whole'], // Fragment
  'fragmentation': ['anatomy', 'cohesion', 'completeness', 'conception', 'convergence', 'cosmos', 'ecosystem', 'fusion', 'globalization', 'integration', 'singularity', 'synchronicitic', 'systems', 'unison', 'units', 'unity', 'wholeness'], // Fragmentation
  'fragmented': ['aggregate', 'centralized', 'coherent', 'complete', 'globe', 'intact', 'integrated', 'integrity', 'interwoven', 'level', 'main', 'monolithic', 'regression', 'seamless', 'shared', 'synchronized', 'unified', 'uninterrupted', 'united'], // Fragmented
  'fragmented-tones': ['harmonic'], // Fragmented-Tones
  'fragmented-visions': ['synchronized'], // Fragmented-Visions
  'fragrance': ['haircare'], // Fragrance
  'frame': ['chaos', 'fluid', 'void'], // Frame
  'framework': ['chaos', 'disorder', 'fluidity', 'freedom', 'improvisation'], // Framework
  'framing': ['detached', 'disorder', 'dispersal'], // Framing
  'frantic': ['calm', 'chill', 'composed', 'leisurely', 'peaceful', 'quiet', 'serene', 'steady', 'tranquil'], // Frantic
  'fraudulence': ['sincerity'], // Fraudulence
  'fraudulent': ['authentic', 'clear', 'genuine', 'honest', 'open', 'reliable', 'transparent', 'trustworthy'], // fraudulent
  'frayed': ['bright', 'clear', 'fresh', 'marble', 'neat', 'sharp', 'smooth', 'solid', 'vivid'], // frayed
  'free': ['bind', 'binding', 'bound', 'burdened', 'burdensome', 'closed', 'confining', 'constrict', 'dragged', 'enclosed', 'guarded', 'lock', 'mechanical', 'merchandise', 'payments', 'predetermined', 'regulated', 'restrained', 'restricted', 'restrictive', 'rooted', 'sealed', 'stilted', 'stuck', 'suppressed', 'tame', 'technic', 'withholding'], // Free
  'freed': ['stifled'], // Freed
  'freedom': ['authority', 'barrier', 'bondage', 'bound', 'bounded', 'burden', 'captivity', 'confinement', 'constraint', 'containment', 'dependence', 'deprivation', 'discipline', 'drudgery', 'encasement', 'enclosure', 'envelopment', 'exploitation', 'finality', 'fixation', 'framework', 'government', 'guilt', 'heavy', 'imposition', 'industry', 'inferior', 'limit', 'limitation', 'monopoly', 'narrowness', 'obedience', 'obstacle', 'pressure', 'regulation', 'restraint', 'restriction', 'ritual', 'shroud', 'strain', 'strife', 'submission', 'suppression', 'warning'], // Freedom
  'freeform': ['axis', 'concrete', 'confined', 'defined', 'factory', 'fixed', 'formal', 'grid', 'mechanic', 'ordered', 'rigid', 'strict', 'structured'], // Freeform
  'freehand': ['drafting'], // freehand
  'freeing': ['compressing', 'suppressing'], // Freeing
  'freeness': ['bound', 'cage', 'confine', 'constraint', 'control', 'limit', 'prison', 'restriction', 'weightiness'], // Freeness
  'freestyle': ['constrained', 'defined', 'fixed', 'formal', 'menu', 'orderly', 'precise', 'rigid', 'structured'], // Freestyle
  'freetime': ['commitment', 'constraint', 'duty', 'industry', 'obligation', 'routine', 'schedule', 'task', 'work'], // freetime
  'freeze': ['flow', 'heat', 'ignite', 'melt', 'thaw'], // Freeze
  'freight': ['digital', 'disorder', 'empty', 'fragile', 'lightweight', 'local', 'passenger', 'service'], // Freight
  'frenzied': ['calm', 'peaceful', 'serene', 'sober', 'stately', 'tranquil'], // Frenzied
  'frenzy': ['calm', 'ordered', 'quiet', 'serene', 'still', 'tranquil'], // Frenzy
  'frequent': ['rare'], // Frequent
  'fresh': ['aftermath', 'ancient', 'artifact', 'baked', 'canning', 'dirt', 'distressed', 'expire', 'faceless', 'foul', 'frayed', 'grime', 'grungy', 'muddy', 'patina', 'polluted', 'rusty', 'shallow', 'stale', 'stop', 'stuffy', 'tainted', 'tedious', 'toxic', 'weary', 'wilt', 'worn'], // Fresh
  'freshness': ['decay', 'dirtiness', 'filth', 'foul', 'obsolescence', 'pollution', 'stagnation', 'staleness', 'worn'], // Freshness
  'friction': ['relaxation'], // Friction
  'friendly': ['alien', 'cool', 'coolness', 'foul', 'harsh', 'impersonal'], // Friendly
  'fringe': ['block', 'centric'], // fringe
  'frivolity': ['gravitas'], // Frivolity
  'frivolous': ['deliberate', 'functionalism', 'intentional', 'meaningful', 'profound', 'serious', 'sober', 'sophisticated', 'studious', 'substantial', 'thoughtful'], // Frivolous
  'frontier': ['closed', 'conventional', 'familiar', 'settled', 'static'], // Frontier
  'frost': ['ember', 'fire', 'heat', 'melt', 'warm', 'warmth'], // Frost
  'frosted-blue': ['burnt'], // Frosted-Blue
  'frosted-hue': ['blazing'], // Frosted-Hue
  'frozen': ['active', 'dynamic', 'flowing', 'fluid', 'hot', 'liquid', 'molten', 'soft', 'video', 'vivid'], // Frozen
  'frugal': ['indulgent', 'lavish'], // Frugal
  'frugality': ['consumerism', 'consumption'], // Frugality
  'fruitful': ['futile'], // Fruitful
  'fruition': ['barren', 'dormancy'], // Fruition
  'fruity': ['artificial', 'synthetic'], // Fruity
  'frumpy': ['chic', 'elegant', 'fit', 'polished', 'refined', 'sleek', 'stylish', 'trim'], // frumpy
  'frustrated': ['pleased'], // Frustrated
  'frustration': ['calm', 'content', 'ease', 'happiness', 'joy', 'pleasure', 'satisfaction', 'solutions'], // Frustration
  'fugitive': ['certain', 'clear', 'eternal-now', 'familiar', 'known', 'safe', 'settled', 'stable', 'visible'], // Fugitive
  'fulfillment': ['discontent', 'dissatisfaction', 'emptiness', 'failure', 'neglect', 'yearning'], // Fulfillment
  'full': ['bare', 'drained', 'empty', 'fall', 'flat', 'hollow', 'incomplete', 'lack', 'leak', 'partial', 'ragged', 'skeletal', 'sparse', 'starve', 'thin', 'vacant', 'void', 'withholding'], // full
  'full-realization': ['partial'], // Full-Realization
  'full-scale': ['miniature'], // Full-Scale
  'fullness': ['absence', 'barren', 'bleakness', 'cold', 'depletion', 'despair', 'diminution', 'drab', 'emptiness', 'hunger', 'husk', 'lack', 'scarcity', 'sparse', 'sparsity', 'thirst', 'vacuum', 'void'], // fullness
  'fumble': ['aware', 'certain', 'clear', 'grasp', 'principle'], // fumble
  'fumbled': ['controlled', 'deliberate', 'focused', 'mastered', 'mastery', 'orderly', 'planned', 'precise', 'successful'], // fumbled
  'fun': ['adulting'], // Fun
  'functional': ['artistic', 'broken', 'impractical', 'pointless', 'theoretical', 'useless'], // Functional
  'functionalism': ['artistic', 'chaos', 'excessive', 'frivolous', 'ornate', 'subjective'], // Functionalism
  'functionalist': ['chaotic', 'disorderly', 'eclectic', 'ornate'], // Functionalist
  'functionality': ['aesthetics', 'baroque'], // Functionality
  'fundamental': ['extraneous'], // Fundamental
  'funny': ['serious'], // Funny
  'fusion': ['disconnection', 'dispersal', 'disunity', 'division', 'fragmentation', 'isolation', 'segregation', 'separation'], // Fusion
  'fussy': ['clean', 'elegant', 'refined', 'simple', 'simplicity', 'sleek', 'smooth', 'streamlined', 'subtle'], // Fussy
  'futile': ['constructive', 'effective', 'fruitful', 'impactful', 'meaningful', 'purposeful', 'significant', 'utility', 'valuable'], // futile
  'futility': ['earth', 'growth', 'hope', 'horology', 'joy', 'life', 'purpose', 'strength', 'success', 'vitality'], // Futility
  'future': ['nostalgia', 'obsolescence', 'past', 'roots', 'stagnation', 'tradition'], // Future
  'futurism': ['ancient', 'futurist', 'glassmorphism', 'neumorphism'], // Futurism
  'futurist': ['futurism', 'glassmorphism', 'neumorphism'], // Futurist
  'futuristic': ['archaic', 'historical', 'retro', 'vintage'], // Futuristic
  'fuzz': ['analysis', 'clarity', 'cleanliness', 'definition', 'order', 'precision', 'sharpness', 'simplicity', 'structure'], // fuzz
  'fuzzy': ['clarity', 'clear', 'defined', 'flat', 'precise', 'sharp', 'simple', 'smooth'], // Fuzzy
  'gain': ['failure', 'plummet'], // Gain
  'game': ['illustration', 'led'], // Game
  'gamification': ['professional'], // Gamification
  'gamified': ['mundane', 'serious', 'simple', 'static', 'traditional'], // Gamified
  'gaming': ['professional'], // Gaming
  'gap': ['loop', 'point'], // Gap
  'gardening': ['concrete', 'deforestation', 'urbanization'], // Gardening
  'gargantuan': ['tiny'], // Gargantuan
  'garish': ['alluring', 'calm', 'delicate', 'gentle', 'muted', 'pale', 'sober', 'soft', 'subtle', 'understated'], // Garish
  'garnish': ['bare', 'basic', 'muted', 'ordinary', 'plain', 'simple', 'sparse-elegance', 'subtle', 'unadorned'], // Garnish
  'gaseous': ['viscous'], // Gaseous
  'gastronomy': ['basic', 'fast-food'], // Gastronomy
  'gather': ['disassemble', 'disband', 'disperse', 'isolate', 'scatter'], // Gather
  'gathering': ['premium'], // Gathering
  'gaudy': ['elegant', 'modest', 'plain', 'refined', 'simple', 'subtle', 'tasteful', 'understated'], // Gaudy
  'gender': ['identity', 'role', 'sex', 'ungendered'], // Gender
  'gendered': ['unconfined', 'ungendered'], // Gendered
  'general': ['explicit', 'labeled', 'specific'], // General
  'generate': ['consume', 'finish'], // Generate
  'generation': ['illustration', 'led', 'null'], // Generation
  'generative': ['illustration', 'led', 'predefined', 'typecraft'], // Generative
  'generic': ['artisanal', 'bespoke', 'boutique', 'customization', 'distinct', 'ethnic', 'personalized', 'singular', 'typecraft', 'unique', 'uniqueness'], // generic
  'generosity': ['greed'], // Generosity
  'generous': ['foul', 'meager', 'selfish'], // Generous
  'genesis': ['destruction', 'end', 'void'], // Genesis
  'gentle': ['aggressive', 'agitated', 'authoritative', 'bitter', 'blaring', 'blasts', 'blinding', 'boisterous', 'bold', 'brash', 'brutal', 'burnt', 'challenging', 'confident', 'confront', 'dragged', 'erupt', 'explosive', 'feral', 'fierce', 'garish', 'glossy', 'gritty', 'hard', 'harsh', 'heated', 'jarring', 'loud', 'motorsport', 'powerful', 'raucous', 'roughness', 'rude', 'savage', 'screaming', 'sharp', 'shouted', 'staccato', 'stern', 'strenuous', 'strident', 'tense', 'thunders', 'tightened', 'unruly', 'uproarious', 'y2k'], // Gentle
  'gentle-expression': ['rude'], // Gentle-Expression
  'gentle-hue': ['fierce', 'harried'], // Gentle-Hue
  'gentle-influence': ['overpower'], // Gentle-Influence
  'gentleness': ['cruelty'], // Gentleness
  'genuine': ['artifice', 'artificial', 'contrived', 'deceptive', 'fabricated', 'facade', 'fake', 'false', 'falsehood', 'fictional', 'fraudulent', 'imperfect', 'insincere', 'manipulation', 'phony', 'pretentious', 'racket', 'sham', 'simulacrum', 'simulated', 'staged', 'superficial'], // Genuine
  'genuineness': ['alienated', 'artifice', 'artificial', 'empty', 'fake', 'false', 'illusion', 'insecure', 'superficial', 'vague'], // genuineness
  'geology': ['abstract', 'ethereal', 'metaphysics', 'spirituality', 'transcendence'], // Geology
  'geometric': ['biomorphic', 'botanical', 'curvilinear', 'figurative', 'naturalistic', 'organic'], // Geometric
  'geometry': ['editorial', 'harmony'], // Geometry
  'germination': ['decay', 'destruction', 'dissolution', 'wither'], // Germination
  'gesture': ['ambiguity', 'disguise', 'inactivity', 'indirectness', 'obscurity', 'passivity', 'silence', 'subtlety', 'text'], // gesture
  'giant': ['diminutive'], // Giant
  'gift': ['absence', 'consume', 'curse', 'finance', 'loss', 'void'], // gift
  'gigantic': ['miniature'], // Gigantic
  'giving': ['withholding'], // Giving
  'glacial': ['active', 'alive', 'boiling', 'dynamic', 'fluid', 'heated', 'hot', 'vibrant', 'warm', 'warmth'], // Glacial
  'glamour': ['bare', 'drab', 'mundane', 'raw', 'simple'], // Glamour
  'glare': ['dark', 'dim', 'dimming', 'dull', 'faint', 'muted', 'shadow', 'soft'], // Glare
  'glass': ['cardboard', 'ceramic', 'flesh', 'paper', 'wood'], // Glass
  'glassmorphism': ['futurism', 'futurist', 'maximalist', 'traditional'], // Glassmorphism
  'glassy': ['dull', 'matte', 'opaque', 'rough', 'textured'], // Glassy
  'glazed': ['dull', 'matte', 'raw', 'rough', 'unfinished'], // Glazed
  'gleaming': ['bland', 'cloudy', 'dim', 'dull', 'faded', 'matte', 'muddy', 'opaque', 'sepia'], // Gleaming
  'glimpse': ['completeness', 'concealment', 'obscurity', 'panorama', 'wholeness'], // Glimpse
  'glitch': ['clarity', 'harmony', 'order', 'perfect', 'perfection', 'seamless', 'simplicity'], // Glitch
  'global': ['individual', 'local', 'niche', 'private', 'restricted'], // Global
  'globalism': ['localism'], // Globalism
  'globalization': ['fragmentation', 'isolation', 'localism', 'narrowness', 'segregation'], // Globalization
  'globe': ['chaos', 'finite', 'flat', 'fragmented', 'infinite', 'isolated', 'linear', 'local', 'nothing', 'static', 'void'], // Globe
  'gloom': ['aether', 'brightness', 'cheer', 'clarity', 'euphoria', 'exuberance', 'joy', 'optimism', 'vibrancy'], // Gloom
  'gloomy': ['breezy', 'festive', 'jovial', 'optimistic', 'pleasant', 'positive'], // Gloomy
  'glossy': ['absorbent', 'brushed', 'gentle', 'graphite', 'matt', 'scrolling'], // Glossy
  'glow': ['darkness'], // Glow
  'go': ['stop'], // Go
  'goodness': ['malice'], // Goodness
  'gothic': ['bright', 'cheerful', 'clean', 'light', 'modern', 'neo-grotesque', 'playful', 'simple', 'soft', 'techno-futurism'], // Gothic
  'gourmet': ['basic', 'common', 'crude', 'mundane'], // Gourmet
  'government': ['anarchy', 'chaos', 'freedom', 'independence', 'liberty'], // Government
  'grace': ['awkwardness', 'brutality', 'editorial', 'harmony'], // Grace
  'graceful': ['awkward', 'clumsy', 'grotesque', 'janky', 'vulgar'], // Graceful
  'gracious': ['rude'], // Gracious
  'graded': ['bland', 'dull', 'flat', 'monochrome', 'plain', 'simplistic', 'static', 'uniform'], // Graded
  'gradient': ['cool', 'coolness'], // Gradient
  'grading': ['chaos', 'disorder', 'flat', 'random', 'uniform'], // Grading
  'gradual': ['abrupt', 'immediate', 'instant', 'jarring', 'rapid', 'speed', 'sudden', 'suddenness'], // gradual
  'graffiti': ['illustration', 'led'], // Graffiti
  'grain': ['wine'], // Grain
  'grained': ['flat', 'polished', 'sleek', 'smooth', 'uniform'], // Grained
  'graininess': ['silkiness'], // graininess
  'grainy': ['creamy', 'overlapping', 'scrolling', 'y2k'], // Grainy
  'grand': ['petite', 'petty', 'small'], // Grand
  'grandeur': ['insignificance', 'intimacy', 'microcosm', 'mundanity', 'ordinariness', 'petiteness', 'simplicity', 'triviality'], // Grandeur
  'grandiose': ['miniature'], // Grandiose
  'granular': ['flat', 'homogeneous', 'monolithic', 'smooth', 'uniform'], // Granular
  'graphic': ['painterly'], // Graphic
  'graphics': ['illustration', 'led'], // Graphics
  'graphite': ['glossy', 'light', 'smooth', 'soft', 'transparent'], // Graphite
  'grasp': ['dismiss', 'forget', 'fumble', 'neglect', 'release', 'surrender'], // Grasp
  'grave': ['silly'], // Grave
  'gravitas': ['banality', 'carelessness', 'emptiness', 'frivolity', 'insignificance', 'lightness', 'playfulness', 'silliness', 'triviality'], // Gravitas
  'gravity': ['ascension', 'levity', 'lightness'], // Gravity
  'greed': ['altruism', 'benevolent', 'generosity', 'humble', 'modest', 'non-profit', 'nonprofit', 'sacrifice', 'selfless', 'sharing'], // Greed
  'green': ['amber', 'arid'], // Green
  'grid': ['fluid', 'freeform', 'masonry', 'organic'], // Grid
  'grim': ['bright', 'cheerful', 'clear', 'humor', 'joyful', 'light', 'radiant', 'uplifted', 'utopian', 'vivid'], // Grim
  'grime': ['bright', 'clean', 'cleanliness', 'clear', 'fresh', 'polished', 'pure', 'refined', 'smooth'], // Grime
  'grind': ['carefree', 'casual', 'ease', 'leisure', 'relaxed', 'rest', 'simple', 'spontaneity'], // grind
  'gritty': ['aesthetics', 'elegant', 'gentle', 'sterile'], // Gritty
  'grocery': ['electronics', 'luxury'], // Grocery
  'groovy': ['bland', 'mundane', 'rigid', 'stale', 'static', 'stiff'], // Groovy
  'grotesque': ['aesthetic', 'delicate', 'elegant', 'graceful', 'harmonious', 'polished', 'refined', 'smooth'], // Grotesque
  'ground': ['cloud', 'float', 'horizon', 'sky', 'stratosphere'], // Ground
  'grounded': ['aerial', 'aero', 'ascendancy', 'astronomical', 'celestial', 'cosmic', 'detached', 'disorder', 'eccentric', 'flighty', 'hover', 'lofty', 'planetary', 'skyward', 'sprawled', 'stellar', 'ungrounded', 'unhinged', 'weightless', 'weightlessness'], // Grounded
  'groundedness': ['verticality'], // groundedness
  'grounding': ['detached', 'disembodied', 'disorder', 'dispersal', 'distrust', 'flighty'], // Grounding
  'group': ['individual'], // Group
  'grouping': ['detachment', 'disorder', 'dispersal'], // Grouping
  'grow': ['finish', 'shrink', 'thaw', 'wilt', 'wither'], // Grow
  'growing': ['narrowing', 'withering'], // Growing
  'grownup': ['babyproducts'], // Grownup
  'growth': ['closing', 'death', 'decay', 'decline', 'depletion', 'deprivation', 'destruction', 'deterioration', 'diminution', 'dormancy', 'end', 'ended', 'endgame', 'futility', 'limitation', 'reduction', 'shrink', 'stagnation', 'suppression', 'withering'], // Growth
  'grunge': ['classicism', 'cleanliness', 'elegant', 'neo-grotesque'], // Grunge
  'grungy': ['bright', 'clean', 'commercial-chic', 'elegant', 'fresh', 'polished', 'refined', 'simple', 'smooth'], // Grungy
  'guarded': ['accessible', 'careless', 'exposed', 'free', 'open', 'openness', 'revealed', 'unprotected', 'vulnerable'], // guarded
  'guesswork': ['analytics', 'diagnostics'], // Guesswork
  'guilt': ['clarity', 'confidence', 'contentment', 'ease', 'freedom', 'innocence', 'serenity', 'trust'], // guilt
  'gym': ['idleness', 'indulgence', 'laziness', 'leisure', 'passive', 'relaxation', 'rest', 'retirement', 'sedentary', 'sloth', 'stillness'], // Gym
  'haircare': ['fragrance', 'skincare'], // Haircare
  'halt': ['active', 'catalyst', 'dynamic', 'engage', 'flow', 'manifesting', 'move', 'progress', 'repeat', 'scroll', 'thrive', 'vibrant'], // Halt
  'halted': ['active', 'dynamic', 'flexible', 'flowing', 'scrolling', 'shiny', 'smooth', 'soft', 'vibrant'], // halted
  'hand-drawn': ['technographic'], // Hand-Drawn
  'handcrafted': ['3d-printed', 'factory', 'mechanic'], // Handcrafted
  'handcrafted-goods': ['massproduced'], // Handcrafted-Goods
  'handmade': ['cgi', 'factory', 'high-tech'], // Handmade
  'handwritten': ['digital', 'mechanical', 'printed', 'typed', 'uniform'], // Handwritten
  'haphazard': ['analytics', 'art', 'coherent', 'craftsmanship', 'formed', 'intentional', 'level', 'method', 'methodical', 'modelling', 'neat', 'orderly', 'planned', 'precise', 'premeditated', 'procedural', 'rational', 'sequential', 'structured', 'systematic'], // Haphazard
  'happiness': ['agony', 'anguish', 'dissatisfaction', 'frustration', 'misfortune', 'pain', 'sorrow'], // Happiness
  'hard': ['absorbent', 'easy', 'fabric', 'gentle', 'malleable', 'matte', 'melt', 'pillow', 'silk', 'soft', 'supple', 'yielding'], // Hard
  'harden': ['thaw'], // Harden
  'hardship': ['well-being'], // Hardship
  'hardware': ['behavioral'], // Hardware
  'harm': ['benefit', 'flourish', 'heal', 'healthcare', 'healthtech', 'nurture', 'restore', 'skincare', 'support', 'thrive', 'uplift'], // harm
  'harmful': ['eco-friendly', 'healthy'], // Harmful
  'harmfulness': ['eco-friendliness'], // harmfulness
  'harmonic': ['chaotic', 'clashing', 'conflicting', 'discordant', 'disorderly', 'dissonant', 'fragmented-tones', 'jarring', 'messy'], // Harmonic
  'harmonic-clash': ['concord'], // Harmonic-Clash
  'harmonious': ['anarchic', 'anti', 'awkward', 'conflicted', 'disarrayed', 'discordant', 'disjoint', 'disjointed', 'disparate', 'disruptive', 'divisive', 'downcast', 'grotesque', 'jarring', 'jumbled', 'segregated', 'uneven'], // Harmonious
  'harmonious-blend': ['discordant'], // Harmonious-Blend
  'harmonious-order': ['tumult'], // Harmonious-Order
  'harmonize': ['disrupt', 'divide'], // Harmonize
  'harmonizing': ['dividing'], // Harmonizing
  'harmony': ['breakdown', 'brutality', 'cacophony', 'clamor', 'complication', 'conflict', 'confront', 'confusion', 'contradiction', 'deconstructivism', 'destroy', 'destruction', 'din', 'discomfort', 'disconnect', 'discord', 'disorder', 'dispersal', 'dispersion', 'displeasure', 'dissipation', 'distribution', 'disunity', 'dominance', 'dramatic', 'duotone', 'dynamism', 'eclectic', 'edge', 'focus', 'geometry', 'glitch', 'grace', 'hassle', 'inferior', 'intricate', 'jumble', 'juxtaposition', 'linearity', 'luminosity', 'mess', 'mismatch', 'monumental', 'negative', 'ornamentation', 'perspective', 'polish', 'pollution', 'portrait', 'rebellion', 'simplicity', 'simplification', 'sleekness', 'softness', 'spatial', 'split', 'spontaneity', 'squalor', 'stress', 'strife', 'struggle', 'tension', 'texture', 'torment', 'tumult', 'turmoil', 'unbounded', 'uniformity', 'unruly', 'variety', 'war'], // Harmony
  'harried': ['calm', 'clear', 'easy', 'gentle-hue', 'orderly', 'relaxed', 'serene', 'smooth', 'steady'], // Harried
  'harsh': ['ambient', 'aqueous', 'bakery', 'calm', 'cute', 'empathetic', 'filtered', 'friendly', 'gentle', 'mellow', 'mild', 'neumorphic', 'pastoral', 'peaceful', 'pleasant', 'plush', 'romantic', 'smooth', 'soft', 'softness', 'supple', 'sweet', 'velvet', 'warm', 'wash', 'yielding'], // Harsh
  'harshness': ['sweetness'], // Harshness
  'hassle': ['clarity', 'comfort', 'ease', 'flow', 'harmony', 'simplicity', 'smoothness', 'tranquility'], // Hassle
  'haste': ['slowness'], // Haste
  'hasty': ['calm', 'careful', 'caution', 'deliberate', 'intentional', 'lingering', 'measured', 'slow', 'steady', 'thoughtful', 'unhurried'], // Hasty
  'hatred': ['kindness', 'respect'], // Hatred
  'haunting': ['alive', 'bright', 'cheerful', 'joyful', 'serene', 'vibrant'], // Haunting
  'hazard': ['insurance'], // Hazard
  'haze': ['brightness', 'clarity', 'sharpness', 'transparency', 'vividness'], // Haze
  'hazy': ['clear', 'defined', 'precise', 'sharp', 'solid'], // Hazy
  'header': ['composition', 'contrast', 'tail', 'under'], // Header
  'headwear': ['footwear'], // headwear
  'heal': ['bleed', 'harm', 'tear'], // Heal
  'health': ['confectionery'], // Health
  'health-conscious': ['decadent', 'indifference', 'negligence', 'unawareness'], // Health-conscious
  'healthcare': ['abandon', 'disorder', 'harm', 'neglect'], // Healthcare
  'healthtech': ['chaos', 'disorder', 'harm', 'inefficiency', 'neglect'], // Healthtech
  'healthy': ['dangerous', 'detrimental', 'fast-food', 'harmful', 'indulgent', 'poor', 'processed', 'sickly', 'toxic', 'unhealthy', 'weak'], // Healthy
  'heart': ['husk'], // Heart
  'heat': ['chill', 'cold', 'cool', 'dim', 'freeze', 'frost', 'ice', 'liquid', 'soft', 'wet'], // heat
  'heated': ['calm', 'chilled-contrast', 'cold', 'cool', 'dull', 'gentle', 'glacial', 'neutral', 'peaceful', 'soft'], // Heated
  'heavenly': ['terrestrial'], // heavenly
  'heaviness': ['aether', 'airiness', 'breeze', 'lucidity'], // Heaviness
  'heavy': ['aero', 'aerodynamic', 'aspirant', 'aspiration', 'aspire', 'awe', 'bliss', 'breezy', 'calm', 'caution', 'cheer', 'clarity', 'comfort', 'compassion', 'competence', 'composed', 'confidence', 'connection', 'constrained', 'contemplation', 'contemplative', 'contentment', 'control', 'cosmetics', 'craving', 'curiosity', 'curious', 'defiance', 'desire', 'direct', 'distraction', 'drive', 'earnest', 'ease', 'eco-tech', 'eerie', 'effortless', 'electrified', 'empowered', 'engagement', 'euphoric', 'excite', 'excitement', 'familiarity', 'freedom', 'humor', 'inquiry', 'inspiration', 'inspire', 'intellect', 'intensity', 'intent', 'intrigue', 'introspection', 'introspective', 'isolated', 'kinetic', 'light', 'lightness', 'lightweight', 'merriment', 'mirth', 'mystery', 'mystique', 'nostalgia', 'overload', 'peace', 'peaceful', 'petite', 'poised', 'potency', 'propulsive', 'prudence', 'reassurance', 'rebellious', 'reflective', 'refreshing', 'relax', 'reliability', 'retro', 'reverence', 'secure', 'serene', 'serenity', 'sheer', 'sincere', 'slender', 'social', 'stately', 'stratosphere', 'surge', 'suspense', 'swift', 'systemic', 'thin', 'thoughtful', 'thrill', 'transit', 'translucency', 'triumph', 'uplift', 'urgency', 'vintage', 'visceral', 'watches', 'weightless', 'weightlessness', 'welcome', 'whimsy', 'wonder', 'zest'], // Heavy
  'heavyweight': ['breeze', 'feather'], // Heavyweight
  'hectic': ['leisurely'], // Hectic
  'helpless': ['empowering'], // Helpless
  'heritage': ['invention', 'premium', 'techwear'], // Heritage
  'heritage-craft': ['disposable'], // Heritage-Craft
  'hesitant': ['assertive', 'bold', 'certain', 'clear', 'confident', 'decisive', 'firm', 'unwavering'], // hesitant
  'hesitation': ['action', 'assertiveness', 'boldness', 'certainty', 'confidence', 'conquer', 'decisiveness', 'readiness', 'valor'], // hesitation
  'hexagonal': ['circular', 'curved', 'round'], // Hexagonal
  'hidden': ['apparent', 'blatant', 'external', 'foreground', 'honest', 'identified', 'known', 'obvious', 'overlook', 'overt', 'premium', 'present', 'public', 'visible'], // Hidden
  'hide': ['display', 'emerge', 'expose', 'highlight', 'illustrate', 'reveal', 'show', 'uncover', 'unveiling'], // Hide
  'hiding': ['appearing', 'bold', 'brave', 'displaying', 'exposing', 'exposure', 'open', 'revealing', 'showing', 'visible'], // hiding
  'hierarchy': ['anarchy', 'chaos', 'disorder', 'equality', 'flatness'], // Hierarchy
  'high': ['below', 'hollow', 'low'], // High
  'high-tech': ['handmade', 'rustic'], // High-Tech
  'higher': ['lower', 'under'], // Higher
  'highlight': ['bland', 'blend', 'dark', 'deemphasize', 'dim', 'drab', 'dull', 'fade', 'forget', 'hide', 'ignore', 'obscure', 'shadow', 'subdue'], // Highlight
  'highlighted': ['disregarded', 'erased'], // Highlighted
  'highlighting': ['muting', 'obscuring', 'subduing', 'suppressing'], // Highlighting
  'hinder': ['advance', 'encourage', 'enhance', 'facilitate', 'inspire', 'liberate', 'nurture', 'promote', 'support', 'uplift'], // hinder
  'historical': ['contemporary', 'current', 'futuristic', 'instant', 'modern', 'new', 'novel', 'presentism', 'trendy'], // Historical
  'hobby': ['chore', 'drudgery', 'duty', 'finance', 'obligation', 'routine', 'task', 'work'], // hobby
  'hold': ['letgo', 'loose', 'release', 'scroll', 'spill', 'unfold', 'yield'], // Hold
  'holding': ['fleeing', 'forgetting'], // Holding
  'hollow': ['alive', 'certain', 'cylinder', 'dense', 'filled', 'full', 'high', 'sincere', 'solid'], // Hollow
  'home': ['foreign', 'hotels'], // Home
  'homecare': ['boarding'], // Homecare
  'homecoming': ['exile'], // Homecoming
  'homegoods': ['digital', 'technology'], // HomeGoods
  'homely': ['clinical', 'cold', 'impersonal', 'minimal', 'sterile'], // Homely
  'homeware': ['jewelry'], // Homeware
  'homogeneity': ['diversity', 'mismatch', 'uniqueness'], // Homogeneity
  'homogeneous': ['diverse', 'granular', 'hybrid', 'particulate'], // Homogeneous
  'honest': ['corrupt', 'crooked', 'deceptive', 'fake', 'false', 'fraudulent', 'hidden', 'insincere', 'misleading', 'obscure', 'shifty'], // Honest
  'honesty': ['corruption', 'deceit', 'disguise', 'distrust', 'malice'], // Honesty
  'honor': ['shame'], // Honor
  'hope': ['death', 'disillusion', 'futility', 'pain', 'pessimism', 'playful', 'sorrow'], // Hope
  'hopeful': ['cynicism', 'defeated', 'despair', 'despairing', 'disappointment', 'dismal', 'doubt', 'dystopic', 'fear', 'hopelessness', 'ominous', 'pessimism', 'pessimistic', 'resigned', 'uncertainty'], // hopeful
  'hopelessness': ['hopeful'], // Hopelessness
  'horizon': ['base', 'center', 'depth', 'ground', 'void'], // Horizon
  'horizontal': ['diagonal', 'vertex'], // Horizontal
  'horizontality': ['verticality'], // horizontality
  'horology': ['absence', 'casual', 'chaos', 'digital', 'disorder', 'ephemera', 'futility', 'imprecision', 'inefficiency', 'informal', 'instability', 'randomness'], // Horology
  'hospitality': ['alienation', 'electronics', 'exclusion', 'hostility', 'indifference', 'neglect'], // Hospitality
  'hostel': ['hotels'], // Hostel
  'hostile': ['reassuring'], // Hostile
  'hostility': ['empathy', 'hospitality', 'kindness', 'sanctuary'], // Hostility
  'hot': ['cold', 'frozen', 'glacial'], // Hot
  'hotels': ['abandon', 'camping', 'chaotic', 'deserted', 'home', 'hostel', 'industrial', 'office', 'residential', 'retail', 'unwelcoming', 'vacancy'], // Hotels
  'hover': ['fixed', 'grounded', 'plunge', 'quiet', 'settled', 'stationary', 'still', 'submerge'], // Hover
  'hud': ['chaos', 'disorder', 'simplicity'], // HUD
  'hues': ['earthen', 'emerald'], // Hues
  'huge': ['diminutive', 'miniature', 'small', 'tiny'], // Huge
  'human': ['ai', 'automated', 'impersonal', 'robotic', 'robotics'], // Human
  'humanism': ['alienation', 'apathy', 'indifference', 'inhumanity', 'selfishness'], // Humanism
  'humanist': ['archaic', 'brutal', 'cold', 'detached', 'rigid', 'robotic'], // Humanist
  'humanities': ['engineering'], // Humanities
  'humanity': ['apathy', 'indifference', 'inhumanity'], // Humanity
  'humble': ['arrogant', 'bold', 'confident', 'crowned', 'dominance', 'empty', 'fragile', 'greed', 'imposing', 'loud', 'ostentatious', 'pretentious', 'soft', 'wealth'], // Humble
  'humiliation': ['dignity'], // Humiliation
  'humility': ['celebrity', 'success'], // Humility
  'humor': ['grim', 'heavy'], // Humor
  'hunger': ['abundance', 'food', 'fullness', 'luxury', 'plenty', 'richness', 'satisfaction', 'surplus', 'wealth'], // Hunger
  'hurry': ['sloth'], // Hurry
  'hushed': ['shouted', 'shouts'], // Hushed
  'hushing': ['active', 'amplifying', 'bold', 'bright', 'chaotic', 'dynamic', 'expressive', 'loud', 'vivid'], // Hushing
  'husk': ['core', 'essence', 'fullness', 'heart', 'psyche', 'richness', 'substance', 'thrive', 'vitality'], // husk
  'hustle': ['calm', 'leisure', 'rest', 'rural-serenity', 'still'], // Hustle
  'hybrid': ['homogeneous', 'monolithic', 'pure', 'simple', 'single', 'singular', 'uniform'], // Hybrid
  'hydrate': ['shrivel'], // Hydrate
  'hype': ['apathy', 'boredom', 'calm', 'dullness', 'indifference'], // Hype
  'hyperreal': ['abstract', 'fantasy', 'imperfect', 'surreal', 'vague'], // Hyperreal
  'hypnotic': ['alert', 'awake', 'distracting'], // Hypnotic
  'hypocrisy': ['sincerity'], // Hypocrisy
  'hypothesis': ['certainty', 'conclusion', 'fact'], // Hypothesis
  'ice': ['emanation', 'fire', 'heat'], // Ice
  'icon': ['forgotten', 'premium'], // Icon
  'iconography': ['illustration', 'led'], // Iconography
  'icy-palette': ['fiery'], // Icy-Palette
  'ideal': ['dystopic', 'flawed', 'imperfect', 'inferior', 'mediocre', 'subpar'], // Ideal
  'identified': ['ambiguous', 'anonymous', 'confused', 'disregarded', 'hidden', 'ignored', 'uncertain', 'unknown', 'vague'], // identified
  'identity': ['anonymity', 'disconnection', 'disguise', 'emptiness', 'faceless', 'gender', 'masked', 'nullity', 'oblivion', 'obscurity'], // Identity
  'idiosyncrasy': ['clarity', 'conformity', 'directness', 'familiarity', 'ordinariness', 'predictability', 'simplicity', 'standardization', 'uniformity'], // Idiosyncrasy
  'idle': ['active', 'bold', 'dynamic', 'engaged', 'intense', 'lively', 'sports', 'stimulating', 'vibrant'], // Idle
  'idleness': ['activity', 'creativity', 'drive', 'effort', 'engagement', 'focus', 'gym', 'productivity', 'purpose', 'pursuit'], // idleness
  'idyll': ['brutality', 'chaos', 'disorder', 'drudgery', 'dystopia', 'squalor'], // Idyll
  'ignite': ['calm', 'cool', 'darken', 'dim', 'douse', 'extinguish', 'freeze', 'inertia', 'quench'], // Ignite
  'ignited': ['bland', 'cold', 'dull', 'extinguished', 'faded', 'muted', 'plain', 'subdued', 'unlit'], // Ignited
  'ignorance': ['analytics', 'awakening', 'awareness', 'certainty', 'childcare', 'clarity', 'consulting', 'context', 'discovery', 'edtech', 'education', 'edutainment', 'enlightenment', 'expertise', 'inquiry', 'insight', 'intelligence', 'interpretation', 'involvement', 'knowledge', 'mastery', 'messaging', 'museum', 'perception', 'publishing', 'revelation', 'scholarship', 'typecraft', 'understanding', 'vision', 'watches', 'wisdom'], // Ignorance
  'ignorant': ['conscious', 'perceptive', 'scholarly', 'sightful'], // Ignorant
  'ignore': ['acknowledge', 'emphasize', 'engage', 'engrave', 'focus', 'highlight', 'notice', 'observe', 'overlook', 'recognize', 'regard', 'support', 'underline', 'valuing'], // Ignore
  'ignored': ['acknowledged', 'advertising', 'celebrated', 'embraced', 'famous', 'identified', 'included', 'known', 'noticed', 'recognized', 'seen', 'status', 'valued'], // ignored
  'illegal': ['legal'], // Illegal
  'illiterate': ['articulate', 'aware', 'educated', 'informed', 'knowledgeable', 'literacy', 'literate', 'logical', 'precise'], // illiterate
  'illness': ['well-being', 'wellness'], // Illness
  'illogical': ['clear', 'coherent', 'logical', 'orderly', 'pragmatic-visuals'], // Illogical
  'illuminated': ['obscuring'], // Illuminated
  'illumination': ['blackout', 'darkness', 'obscurity', 'shadow'], // Illumination
  'illusion': ['authenticity', 'clarity', 'fact', 'genuineness', 'perception', 'reality', 'substance', 'truth'], // Illusion
  'illusory': ['clear', 'obvious', 'real', 'tangible', 'truth'], // Illusory
  'illustrate': ['hide'], // Illustrate
  'illustration': ['compositing', 'curation', 'detail', 'digital', 'drawing', 'exhibition', 'filmic', 'filtering', 'game', 'generation', 'generative', 'graffiti', 'graphics', 'iconography', 'imaging', 'interface', 'isometric', 'lens', 'manipulation', 'masking', 'modeling', 'photoreal', 'photorealistic', 'process', 'projection', 'render', 'retouching', 'schematic', 'shading', 'simulation', 'sketching', 'staging', 'styling', 'typeset', 'typesetting', 'ui-ux', 'vector', 'video', 'volumetrics', 'web'], // Illustration
  'image': ['composition', 'contrast'], // Image
  'imaginary': ['biographical', 'certain', 'concrete', 'definite', 'existing', 'factual', 'literal', 'practical', 'real'], // imaginary
  'imagination': ['concreteness', 'literal', 'reality'], // Imagination
  'imaginative': ['biographical'], // imaginative
  'imaging': ['illustration', 'invisible', 'led', 'negligent'], // Imaging
  'imbalance': ['equilibrium'], // imbalance
  'imitation': ['invention', 'trendsetting'], // Imitation
  'immaterial': ['mineral', 'tangibility'], // immaterial
  'immediate': ['delay', 'delayed', 'gradual', 'post-process', 'prolonged', 'scheduled', 'slow'], // Immediate
  'immense': ['diminutive', 'small', 'tiny'], // Immense
  'immensity': ['insignificance', 'minutiae', 'petiteness', 'triviality'], // Immensity
  'immerse': ['barren', 'detached', 'disengaged', 'distant', 'escape', 'excluded', 'isolated', 'shallow', 'superficial'], // immerse
  'immersion': ['premium'], // Immersion
  'immersive': ['detached', 'disembodied', 'distracted'], // Immersive
  'immobile': ['mobile', 'shift', 'wearables'], // Immobile
  'immobility': ['flexibility', 'mobility'], // Immobility
  'immortality': ['death', 'end', 'finitude', 'mortality'], // immortality
  'immovable': ['evanescent'], // Immovable
  'immutable': ['mutable'], // Immutable
  'impact': ['absence', 'neglect', 'void'], // Impact
  'impactful': ['forgettable', 'futile', 'irrelevant', 'pointless', 'worthless'], // Impactful
  'impediment': ['catalyst'], // Impediment
  'imperfect': ['authentic', 'automated', 'cgi', 'effortful', 'flawless', 'genuine', 'hyperreal', 'ideal', 'intact', 'neat', 'perfect', 'pure', 'refined', 'spotless'], // imperfect
  'imperfection': ['completeness', 'flawless', 'flawlessness', 'perfection'], // Imperfection
  'impermanence': ['constancy', 'permanence', 'stability'], // Impermanence
  'impermeable': ['absorbent', 'porous'], // Impermeable
  'impersonal': ['bistro', 'casual', 'expressive', 'friendly', 'homely', 'human', 'intimate', 'personal', 'personalized', 'unique', 'user-centric', 'warmth'], // Impersonal
  'impersonality': ['customization', 'intimacy'], // Impersonality
  'implicit': ['annotation'], // Implicit
  'implosion': ['explosion'], // implosion
  'importance': ['insignificance'], // Importance
  'important': ['insignificant', 'irrelevant', 'petty', 'trivial', 'worthless'], // Important
  'imposing': ['humble', 'insignificant', 'modest', 'subtle', 'unassuming'], // Imposing
  'imposition': ['clarity', 'ease', 'fluidity', 'freedom', 'liberation', 'lightness', 'purity', 'simplicity', 'spontaneity'], // Imposition
  'impossible': ['achievable', 'obtainable', 'reachable'], // Impossible
  'impotence': ['certainty', 'clarity', 'firm', 'potency', 'power', 'purity', 'solid', 'strength', 'vitality'], // Impotence
  'impractical': ['academia', 'effective', 'efficient', 'functional', 'practical', 'realistic', 'sensible', 'usable', 'utilitarian', 'viable'], // Impractical
  'imprecise': ['analytical', 'calculated', 'calculated-precision', 'calculation', 'certain', 'clear', 'defined', 'definition', 'exact', 'focused', 'precise', 'prime', 'seamless', 'sharp', 'specific'], // Imprecise
  'imprecision': ['algorithm', 'exact', 'horology', 'measure', 'watchmaking'], // Imprecision
  'impression': ['clarity', 'definition', 'exactness', 'fact', 'passion', 'photoreal', 'precision', 'reality', 'truth'], // Impression
  'impressionist': ['clarity', 'formality', 'precision', 'realism', 'structure'], // Impressionist
  'imprint': ['absence', 'blur', 'disperse', 'dissolve', 'erase', 'faint', 'scatter', 'vague', 'void'], // Imprint
  'impromptu': ['methodical'], // impromptu
  'impromptu-display': ['premeditated'], // Impromptu-Display
  'impromptu-gathering': ['scheduled'], // Impromptu-Gathering
  'improv': ['script'], // improv
  'improvement': ['decline', 'deterioration', 'failure', 'regression', 'stagnation'], // Improvement
  'improvisation': ['calculation', 'coding', 'engineering', 'framework', 'method', 'outlining', 'planning'], // Improvisation
  'improvised': ['charted', 'computational', 'conventional', 'deliberate', 'fixed', 'mechanic', 'modelling', 'planned', 'precise', 'predefined', 'procedural', 'standard', 'structured', 'uniform'], // Improvised
  'impulsive': ['behavioral', 'cautious', 'cerebral', 'deliberate', 'planned', 'premeditated', 'rational', 'strategic'], // Impulsive
  'impunity': ['consequence'], // Impunity
  'impure': ['clean', 'clear', 'coherent', 'defined', 'focused', 'intentional', 'pure', 'structured'], // Impure
  'impurity': ['purity'], // impurity
  'inaccessible': ['accessible', 'achievable', 'obtainable', 'reachable'], // Inaccessible
  'inaccuracy': ['watchmaking'], // Inaccuracy
  'inactive': ['active', 'alive', 'appearing', 'athlete', 'bustling', 'capable', 'live', 'swift', 'vibration'], // Inactive
  'inactivity': ['activity', 'agency', 'gesture', 'stimulation', 'watches'], // Inactivity
  'inadequacy': ['supplements'], // Inadequacy
  'inanimate': ['wearables'], // Inanimate
  'inattention': ['awakening'], // Inattention
  'inception': ['end'], // Inception
  'included': ['ignored'], // Included
  'inclusion': ['abandon', 'abandonment', 'alienation', 'detachment', 'dismissal', 'escape', 'exile', 'exploitation', 'expulsion', 'premium', 'shunning'], // Inclusion
  'inclusive': ['disjoint', 'dismissive', 'divisive', 'isolating', 'segregated', 'selfish'], // Inclusive
  'inclusivity': ['alienation', 'division', 'divisive', 'exclusivity', 'isolation', 'segregation'], // Inclusivity
  'incoherence': ['integrity'], // Incoherence
  'incoherent': ['coherent', 'concreteness'], // Incoherent
  'incompetence': ['intelligence', 'mastery', 'skillful'], // Incompetence
  'incompetent': ['capable', 'skillful'], // Incompetent
  'incomplete': ['clear', 'common', 'complete', 'complete-manifestation', 'finished', 'full', 'intact', 'simple', 'whole'], // Incomplete
  'incomplete-can-be-replaced-with-unfinished-for-better-mutual-exclusivity': ['complete'], // Incomplete" Can Be Replaced With "unfinished" For Better Mutual Exclusivity
  'incompleteness': ['wholeness'], // incompleteness
  'incompletion': ['completion'], // Incompletion
  'inconsistency': ['resolve'], // Inconsistency
  'inconsistent': ['analogous', 'reliable', 'seamless'], // Inconsistent
  'inconspicuous': ['emblematic'], // Inconspicuous
  'increase': ['deplete', 'plummet', 'reduction', 'shrink'], // Increase
  'indecency': ['dignity'], // Indecency
  'indecision': ['assertiveness', 'fortitude', 'resolve'], // Indecision
  'indecisive': ['decisive', 'resolved'], // Indecisive
  'independence': ['childhood', 'collectivism', 'companionship', 'dependence', 'government', 'interdependence', 'obedience', 'premium', 'submission'], // Independence
  'independent': ['bound', 'obedient'], // Independent
  'indeterminacy': ['definition', 'units'], // Indeterminacy
  'indeterminate': ['concreteness', 'reachable'], // Indeterminate
  'indie': ['commercial', 'mainstream', 'popular'], // Indie
  'indifference': ['admiring', 'ambition', 'anticipation', 'attention', 'belief', 'childcare', 'consensus', 'demand', 'ebullience', 'eco-conscious', 'eco-consciousness', 'emotion', 'empathy', 'engage', 'expressiveness', 'exuberance', 'fandom', 'favor', 'fervor', 'health-conscious', 'hospitality', 'humanism', 'humanity', 'hype', 'intimacy', 'involvement', 'kindness', 'marketing', 'participation', 'passion', 'recognition', 'respect', 'veneration', 'zeal'], // Indifference
  'indifferent': ['cherishing', 'driven', 'empathetic', 'engaged'], // Indifferent
  'indigo': ['amber', 'earthen', 'emerald', 'washed'], // Indigo
  'indirect': ['straightforward'], // Indirect
  'indirectness': ['gesture'], // Indirectness
  'indiscretion': ['discretion'], // Indiscretion
  'indistinct': ['clear', 'defined', 'depictive', 'distinct', 'distinction', 'distinctness', 'specific', 'vivid'], // indistinct
  'individual': ['aggregate', 'avatar', 'blended', 'collaborative', 'collective', 'commodity', 'common', 'conform', 'global', 'group', 'massproduced', 'team-building', 'unified'], // individual
  'individualism': ['collectivism', 'premium'], // Individualism
  'individuality': ['archetype', 'industry', 'monoculture'], // Individuality
  'indulgence': ['discipline', 'gym'], // Indulgence
  'indulgent': ['basic', 'basic-bites', 'frugal', 'healthy', 'minimal', 'modest', 'plain', 'simple', 'sparse', 'subdued'], // Indulgent
  'industrial': ['artisanal', 'bistro', 'botanical', 'boutique', 'coastal', 'cottagecore', 'eco-design', 'edtech', 'elegant', 'folk', 'hotels', 'minimal', 'natural', 'organic', 'pastoral', 'personalcare', 'residential', 'rural', 'soft', 'yachting'], // Industrial
  'industry': ['art', 'chaos', 'freedom', 'freetime', 'individuality', 'nature'], // Industry
  'inedible': ['beverage'], // Inedible
  'ineffective': ['empowering', 'practical'], // Ineffective
  'ineffectiveness': ['efficacy', 'power'], // Ineffectiveness
  'inefficacy': ['efficacy'], // Inefficacy
  'inefficiency': ['economy', 'efficacy', 'healthtech', 'horology', 'optimization', 'productivity', 'solutions'], // Inefficiency
  'inefficient': ['aerodynamic'], // Inefficient
  'inept': ['capable'], // Inept
  'inequity': ['finance'], // inequity
  'inert': ['activating'], // Inert
  'inertia': ['energy', 'ignite', 'momentum', 'trajectory', 'vigor', 'vitality', 'voyage'], // Inertia
  'inexact': ['exact'], // Inexact
  'inexperience': ['expertise'], // inexperience
  'inferior': ['elite', 'equality', 'freedom', 'harmony', 'ideal', 'justice', 'kindness', 'prestige', 'prime', 'prosperity', 'superior', 'uplift'], // inferior
  'inferiority': ['excellence'], // Inferiority
  'infinite': ['bounded', 'finite', 'globe', 'limit', 'limited'], // Infinite
  'infinity': ['bounded', 'chronos', 'finality', 'finite', 'limitation', 'limited', 'microcosm', 'mortality', 'temporary'], // Infinity
  'inflate': ['shrink'], // Inflate
  'inflexibility': ['adaptability', 'flexibility'], // Inflexibility
  'inflexible': ['flexibility', 'malleable', 'responsive'], // Inflexible
  'influence': ['premium'], // Influence
  'influential': ['insignificant'], // Influential
  'informal': ['academia', 'command', 'conferences', 'conventional', 'doctrinal', 'formal', 'formality', 'horology', 'official', 'rigid', 'serious', 'solidify', 'stiff', 'structured', 'techwear', 'traditional'], // Informal
  'informal-inquiry': ['doctrinal'], // Informal-Inquiry
  'informal-knowledge': ['scholarly'], // Informal-Knowledge
  'informality': ['dignity'], // Informality
  'informative': ['ambiguous', 'confusing', 'misleading', 'obscure', 'vague'], // Informative
  'informed': ['clueless', 'illiterate'], // Informed
  'infrastructure': ['premium'], // Infrastructure
  'ingenuity': ['boring', 'dull', 'lazy', 'mundane', 'stupid'], // Ingenuity
  'ingredients': ['absence', 'depletion', 'emptiness', 'void', 'waste'], // Ingredients
  'inhalation': ['emission'], // Inhalation
  'inhibition': ['expressiveness', 'self-expression'], // Inhibition
  'inhibitor': ['catalyst'], // Inhibitor
  'inhospitable': ['biophilic'], // inhospitable
  'inhumanity': ['humanism', 'humanity'], // Inhumanity
  'initial': ['final'], // Initial
  'initiate': ['finish'], // Initiate
  'initiation': ['finale'], // Initiation
  'initiative': ['passivity', 'sloth'], // Initiative
  'inland': ['marine', 'nautical'], // Inland
  'inner': ['facade'], // Inner
  'innocence': ['corruption', 'depravity', 'guilt', 'malice', 'vice', 'wickedness'], // Innocence
  'innovate': ['conform', 'repeat', 'replicate', 'restrict', 'simplify', 'stagnate'], // Innovate
  'innovative': ['ancient', 'archaic', 'banal', 'conventional', 'mediocre', 'mundane', 'obsolete', 'pedestrian', 'primitive', 'repetitive', 'stagnant', 'tainted', 'traditional'], // Innovative
  'inorganic': ['bio'], // Inorganic
  'inquiry': ['disregard', 'heavy', 'ignorance'], // Inquiry
  'insecure': ['genuineness', 'robust', 'settled'], // Insecure
  'insecurity': ['assertiveness', 'strength', 'success', 'valor'], // Insecurity
  'insight': ['ambiguity', 'blindness', 'confusion', 'fog', 'ignorance', 'misunderstanding', 'obscurity', 'stupidity'], // Insight
  'insightful': ['clueless'], // Insightful
  'insignificance': ['clarity', 'grandeur', 'gravitas', 'immensity', 'importance', 'meaning', 'prominence', 'relevance', 'significance', 'value'], // insignificance
  'insignificant': ['epic', 'essential', 'famous', 'important', 'imposing', 'influential', 'majestic', 'monumental', 'notable', 'prominent', 'remarkable', 'significant', 'vast', 'vital'], // Insignificant
  'insincere': ['authentic', 'earnest', 'genuine', 'honest', 'open', 'real', 'sincere', 'transparent', 'true', 'trustworthy'], // Insincere
  'insincerity': ['authenticity', 'sincerity'], // Insincerity
  'insipid': ['colorful', 'dynamic', 'engaging', 'exciting', 'flavorful', 'rich', 'stimulating', 'value', 'vibrant'], // insipid
  'inspiration': ['heavy'], // Inspiration
  'inspire': ['heavy', 'hinder'], // Inspire
  'instability': ['approval', 'climate', 'constancy', 'endurance', 'engineering', 'fortitude', 'horology', 'persistence', 'resilience', 'settle', 'stability'], // Instability
  'installed': ['wearables'], // Installed
  'instant': ['ambiguous', 'delayed', 'gradual', 'historical', 'lengthy', 'lingering', 'loading', 'slow', 'uncertain'], // Instant
  'instant-delivery': ['lingering', 'unhurried'], // Instant-Delivery
  'instinct': ['analysis', 'analytics', 'calculation', 'deliberate', 'mechanism', 'predetermined', 'reason'], // Instinct
  'instinctive': ['calculated', 'cerebral'], // instinctive
  'insufficiency': ['abundance'], // insufficiency
  'insurance': ['chance', 'hazard', 'risk', 'uninsured'], // Insurance
  'intact': ['aftermath', 'broken', 'chaotic', 'cracked', 'damaged', 'deconstructivist', 'disordered', 'fracture', 'fragmented', 'imperfect', 'incomplete', 'leak', 'scattered', 'scratched'], // Intact
  'intactness': ['obliteration'], // Intactness
  'intangible': ['clear', 'concrete', 'definite', 'literal', 'material', 'physicality', 'solid', 'substantial', 'tangibility', 'tangible'], // Intangible
  'integral': ['crooked', 'extraneous', 'modular'], // Integral
  'integrate': ['collapse', 'deconstruct', 'disassemble', 'disconnect', 'disjoint', 'disperse', 'disrupt', 'diverge', 'divide', 'exclude', 'fragment', 'scatter', 'separate', 'split', 'vacate'], // Integrate
  'integrated': ['chaotic', 'deconstructivism', 'detached', 'disconnected', 'disjointed', 'disparate', 'divided', 'divisive', 'fragmented', 'isolated', 'modular', 'scattered', 'segmented', 'segregated', 'separate'], // Integrated
  'integrating': ['dividing', 'isolating', 'obliterating'], // Integrating
  'integration': ['barrier', 'deconstruction', 'detachment', 'disorder', 'dispersal', 'dissipation', 'exile', 'expulsion', 'fragmentation', 'negation'], // Integration
  'integrity': ['ambiguity', 'chaos', 'confusion', 'corrupt', 'corruption', 'deceit', 'dishonesty', 'disorder', 'distortion', 'flaw', 'fragmented', 'incoherence', 'ruin', 'separation'], // integrity
  'intellect': ['dullard', 'heavy'], // Intellect
  'intellectual property': ['merchandise'], // intellectual property
  'intellectual-property': ['merchandise'], // Intellectual Property
  'intelligence': ['foolishness', 'ignorance', 'incompetence', 'naivety', 'stupidity'], // Intelligence
  'intelligent': ['foolish', 'silly'], // Intelligent
  'intense': ['ambient', 'blunt', 'chill', 'dispassionate', 'easy', 'fading', 'faint', 'filtered', 'flippant', 'idle', 'leisurely', 'mellow', 'mute', 'paused', 'shallow', 'slack', 'washed', 'weak'], // Intense
  'intensification': ['diminution', 'reduction'], // Intensification
  'intensify': ['calm', 'cool', 'dull', 'fade', 'lessen', 'reduce', 'subdue', 'subside', 'weaken'], // Intensify
  'intensifying': ['diluting', 'dissolving', 'subduing'], // Intensifying
  'intensity': ['heavy', 'levity'], // Intensity
  'intent': ['aimless', 'distracted', 'heavy'], // Intent
  'intention': ['negligence'], // Intention
  'intentional': ['aimless', 'arbitrary', 'artless', 'awkward', 'detached', 'disorder', 'dispersal', 'distracted', 'frivolous', 'haphazard', 'hasty', 'impure', 'massproduced', 'negligent', 'unplanned'], // Intentional
  'interaction': ['detachment', 'disconnection', 'isolation', 'monologue', 'separation', 'silence', 'solitude'], // interaction
  'interactions': ['composition', 'contrast'], // Interactions
  'interactive': ['composition', 'isolating', 'static'], // Interactive
  'interconnectedness': ['detached', 'disorder', 'dispersal'], // Interconnectedness
  'interconnection': ['detachment', 'dispersal', 'isolation', 'segregated'], // Interconnection
  'interdependence': ['detachment', 'independence', 'isolation'], // Interdependence
  'interest': ['boredom', 'disinterest', 'distrust'], // Interest
  'interested': ['bored', 'disinterested', 'disjoint'], // Interested
  'interface': ['illustration', 'led'], // Interface
  'interfacing': ['contrast', 'disconnection', 'division', 'isolation', 'separation'], // Interfacing
  'interference': ['clarity', 'direct', 'directness', 'flow', 'openness', 'unimpeded'], // Interference
  'interior': ['exterior', 'landscape', 'street', 'urban'], // Interior
  'interlink': ['disconnect', 'divide', 'isolate', 'separate', 'split'], // Interlink
  'interlock': ['detach', 'disperse', 'separate'], // Interlock
  'internal': ['external', 'eyewear'], // Internal
  'interplay': ['detachment', 'disconnection', 'isolation', 'monotony', 'stagnation'], // Interplay
  'interpretation': ['ambiguity', 'chaos', 'confusion', 'dogma', 'fact', 'ignorance', 'literalism', 'obscurity'], // Interpretation
  'interrupted': ['cohesive', 'complete', 'continuous', 'fluid', 'unified', 'uninterrupted', 'untamed'], // Interrupted
  'intersect': ['detach', 'disorder', 'disperse'], // Intersect
  'interstitial': ['clear', 'coherent', 'defined', 'definite', 'distinct', 'focused', 'personal', 'practical', 'solid', 'specific'], // Interstitial
  'intertwined': ['detached', 'disjoint', 'dispersal', 'separation'], // Intertwined
  'interwoven': ['detached', 'dispersal', 'fragmented', 'isolation', 'separate', 'separation'], // Interwoven
  'intimacy': ['alienation', 'coldness', 'detachment', 'distance', 'grandeur', 'impersonality', 'indifference', 'isolation', 'loneliness', 'separation'], // Intimacy
  'intimate': ['cold', 'detached', 'distant', 'external', 'impersonal', 'open', 'public'], // Intimate
  'intricacy': ['rudimentary'], // Intricacy
  'intricate': ['base', 'editorial', 'harmony', 'lightweight', 'rudimentary', 'simplify', 'simplifying'], // Intricate
  'intrigue': ['heavy', 'obvious'], // Intrigue
  'introduction': ['endgame', 'finale'], // Introduction
  'introspection': ['heavy', 'outward', 'shallow'], // Introspection
  'introspective': ['external', 'heavy', 'obtrusive'], // Introspective
  'introverted': ['bold', 'dynamic', 'expressive', 'extroverted', 'loud', 'outgoing', 'performative', 'social', 'vibrant'], // Introverted
  'intuition': ['algorithm', 'analysis', 'analytics', 'calculation', 'logic'], // Intuition
  'intuitive': ['ai', 'analytical', 'cerebral', 'clinical', 'computational', 'scientific', 'theoretical'], // Intuitive
  'invade': ['retreat'], // Invade
  'invention': ['convention', 'copy', 'heritage', 'imitation', 'repetition', 'routine', 'stagnation', 'tradition', 'uniformity'], // invention
  'inventive': ['conventional', 'mundane', 'ordinary', 'predictable', 'stagnant'], // Inventive
  'invested': ['disinterested'], // Invested
  'investigative': ['casual', 'known', 'obvious', 'transparent', 'uninquisitive', 'unobservant'], // Investigative
  'invigorated': ['weakened', 'weary'], // Invigorated
  'invigorating': ['draining', 'tiring'], // Invigorating
  'invigoration': ['exhaustion', 'fatigue', 'lethargy'], // Invigoration
  'invisibility': ['advertising', 'materials', 'observation', 'statement', 'visualization'], // Invisibility
  'invisible': ['apparent', 'attracting', 'clear', 'evident', 'exposed', 'foreground', 'imaging', 'manifest', 'murals', 'obvious', 'performative', 'showy', 'visible'], // Invisible
  'invitation': ['warning'], // Invitation
  'invite': ['lock'], // Invite
  'inviting': ['barren', 'bleak', 'cool', 'coolness', 'foul', 'ominous', 'repellent', 'repelling'], // Inviting
  'involved': ['absent', 'detached', 'disinterested', 'dispassionate'], // Involved
  'involvement': ['absence', 'detachment', 'disengagement', 'disinterest', 'ignorance', 'indifference', 'neglect', 'passive', 'unintentional'], // Involvement
  'inward': ['external', 'outward'], // Inward
  'iridescent': ['earthen', 'emerald', 'matt', 'opaque'], // Iridescent
  'irrational': ['behavioral', 'calculated', 'design', 'logical', 'practical', 'rational', 'realistic', 'sane', 'sensible'], // Irrational
  'irrationality': ['logic', 'sense'], // Irrationality
  'irregular': ['axis', 'columnar', 'cylindrical', 'mainstream', 'normal', 'normalcy', 'octagonal', 'rows', 'scheduled', 'sequential', 'spherical'], // Irregular
  'irrelevant': ['essential', 'impactful', 'important', 'meaningful', 'necessary', 'relevance', 'relevant', 'significant', 'valuable'], // irrelevant
  'irresponsibility': ['accountability'], // Irresponsibility
  'irreverence': ['veneration'], // Irreverence
  'irreverent': ['authoritative', 'conventional', 'formal', 'respectful', 'reverent', 'serious', 'sincere', 'solemn', 'traditional'], // Irreverent
  'irreversibility': ['recyclability'], // irreversibility
  'isolate': ['collect', 'combine', 'compositing', 'connect', 'gather', 'interlink', 'join', 'merge', 'share', 'synthesize', 'unite'], // Isolate
  'isolated': ['aggregate', 'blockchain', 'clustered', 'collaborative', 'globe', 'heavy', 'immerse', 'integrated', 'merged', 'public', 'shared', 'symphonic', 'synchronized', 'ubiquitous', 'unified', 'united', 'user-centric'], // Isolated
  'isolating': ['collaborative', 'communal', 'conglomerating', 'connecting', 'engaging', 'inclusive', 'integrating', 'interactive', 'visible'], // Isolating
  'isolation': ['adoption', 'assemblage', 'belonging', 'closeness', 'coexistence', 'collaboration', 'collectivism', 'companion', 'companionship', 'connect', 'connectedness', 'continuum', 'convergence', 'corner', 'dialogue', 'diffusion', 'ecosystem', 'embrace', 'envelopment', 'experience', 'fame', 'fandom', 'flotilla', 'fusion', 'globalization', 'inclusivity', 'interaction', 'interconnection', 'interdependence', 'interfacing', 'interplay', 'interwoven', 'intimacy', 'logistics', 'metaverse', 'microcosm', 'network', 'nodes', 'openness', 'participation', 'premium', 'superimposition', 'synchronicitical', 'telecommunications', 'togetherness', 'unison', 'world'], // Isolation
  'isolationist': ['collaborative'], // Isolationist
  'isometric': ['illustration'], // Isometric
  'jaded': ['naive'], // Jaded
  'jagged': ['balanced', 'even', 'linear', 'round', 'smooth', 'uniform'], // Jagged
  'jaggedness': ['smoothness'], // jaggedness
  'janky': ['elegant', 'fine', 'fluid', 'graceful', 'polished', 'refined', 'sleek', 'smooth', 'subtle'], // janky
  'japandi': ['chaotic', 'cluttered', 'eclectic'], // Japandi
  'jarring': ['ambient', 'balanced', 'calm', 'cohesive', 'gentle', 'gradual', 'harmonic', 'harmonious', 'neumorphism', 'pleasant', 'seamless', 'smooth', 'soothing', 'subtle'], // Jarring
  'jazz': ['classical', 'pop'], // Jazz
  'jewelry': ['apparel', 'electronics', 'homeware', 'tools', 'utilitarian'], // Jewelry
  'join': ['detach', 'isolate', 'resign', 'separate', 'split'], // Join
  'journey': ['abandon', 'completion', 'deadend', 'endgame', 'finality', 'stasis'], // Journey
  'jovial': ['dreary', 'gloomy', 'sad', 'solemn', 'sorrowful'], // Jovial
  'joy': ['agony', 'anger', 'anguish', 'bleakness', 'boredom', 'burden', 'calm', 'coldness', 'death', 'displeasure', 'dissatisfaction', 'drudgery', 'fear', 'frustration', 'futility', 'gloom', 'misfortune', 'pain', 'peaceful', 'pessimism', 'serene', 'shame', 'sorrow', 'strain', 'stress', 'strife', 'struggle', 'torment', 'vintage'], // Joy
  'joyful': ['burdensome', 'despairing', 'dismal', 'downcast', 'dreary', 'dystopic', 'grim', 'haunting', 'ominous', 'pessimistic', 'resigned', 'solemn', 'somber'], // Joyful
  'jubilant': ['bitter'], // Jubilant
  'juice': ['coffee'], // juice
  'juiciness': ['aridity', 'dryness', 'parched'], // Juiciness
  'jumble': ['clarity', 'harmony', 'layout', 'neatness', 'order', 'simplicity', 'smoothness', 'structure', 'uniformity'], // jumble
  'jumbled': ['calm', 'clear', 'coherent', 'harmonious', 'linearity', 'neat', 'ordered', 'simple', 'structured'], // Jumbled
  'jungle': ['desert', 'plains', 'tundra'], // Jungle
  'junk food': ['nutraceuticals'], // junk food
  'justice': ['inferior'], // Justice
  'juxtaposition': ['consistency', 'harmony', 'unity'], // Juxtaposition
  'kaleidoscope': ['monochrome-palette'], // Kaleidoscope
  'kaleidoscopic': ['dull', 'flat', 'linear', 'monochrome', 'monotony', 'quiet', 'simple', 'static', 'uniform'], // Kaleidoscopic
  'kawaii': ['brutalist', 'minimalist'], // Kawaii
  'key': ['blurry', 'duotone', 'earthen', 'muffled'], // Key
  'kind': ['rude', 'savage'], // Kind
  'kindness': ['apathy', 'cruelty', 'disdain', 'hatred', 'hostility', 'indifference', 'inferior', 'malice', 'neglect', 'ridicule', 'scorn'], // Kindness
  'kinetic': ['heavy'], // Kinetic
  'kitsch': ['elegant', 'minimal', 'refined', 'sophisticated', 'subtle'], // Kitsch
  'knowledge': ['foolishness', 'ignorance', 'naivety', 'premium'], // Knowledge
  'knowledgeable': ['clueless', 'illiterate'], // Knowledgeable
  'known': ['anonymous', 'forgotten', 'fugitive', 'hidden', 'ignored', 'investigative', 'neglected', 'obscure', 'unfamiliar', 'unknown'], // known
  'labeled': ['ambiguous', 'chaotic', 'diffuse', 'general', 'non-textual', 'random', 'uncertain', 'unlabeled', 'vague'], // Labeled
  'labor': ['snacks'], // Labor
  'laborious': ['easy'], // Laborious
  'labyrinthine': ['clear', 'direct', 'linear', 'obvious', 'plain', 'simple', 'simplistic', 'static', 'straight'], // Labyrinthine
  'lack': ['abundance', 'affluence', 'art', 'bounty', 'catering', 'full', 'fullness', 'materials', 'merchandise', 'might', 'need', 'plenty', 'richness', 'saturation', 'unleash', 'vibrancy', 'wealth'], // Lack
  'lacking': ['fertile', 'filled'], // Lacking
  'lackluster': ['captivating', 'watches'], // Lackluster
  'laid-back': ['anxious', 'tense'], // Laid-back
  'lame': ['bold', 'colorful', 'coolness', 'dynamic', 'engaging', 'exciting', 'lively', 'stimulating', 'vibrant'], // Lame
  'land': ['marine', 'nautical', 'oceanic', 'soar', 'yachting'], // Land
  'land-based': ['marine'], // Land-Based
  'landscape': ['interior'], // Landscape
  'language': ['premium'], // Language
  'languid': ['propulsive'], // Languid
  'large': ['micro', 'miniature', 'petite', 'small'], // Large
  'lasting': ['evanescent', 'fleeting', 'momentary'], // Lasting
  'lattice': ['chaos', 'disorder', 'randomness', 'simplicity', 'solidity'], // Lattice
  'launch': ['finale', 'stop'], // Launch
  'laundry': ['cooking', 'technology'], // Laundry
  'lavish': ['basic', 'cheap', 'dull', 'frugal', 'meager', 'modest', 'plain', 'simple', 'sparse', 'sparsity', 'unadorned'], // Lavish
  'layered': ['empty', 'fibrous', 'flat', 'fluid', 'null', 'planar', 'simplify'], // Layered
  'layering': ['detachment', 'dispersal', 'erasing', 'flatness', 'flattening', 'minimalism', 'simplicity', 'simplify', 'unify'], // Layering
  'layers': ['flat', 'simple', 'single'], // Layers
  'layoffs': ['recruitment'], // Layoffs
  'layout': ['estate', 'jumble', 'text'], // Layout
  'laziness': ['active', 'ambition', 'diligent', 'driven', 'energetic', 'engaged', 'gym', 'motivated', 'productive', 'zeal'], // laziness
  'lazy': ['active', 'athlete', 'busy', 'driven', 'dynamic', 'energetic', 'enthusiastic', 'ingenuity', 'motivated', 'vibrant'], // lazy
  'leak': ['block', 'complete', 'firm', 'full', 'intact', 'seal', 'secure', 'solid'], // leak
  'lean': ['plump'], // Lean
  'leather': ['plastic', 'synthetic'], // Leather
  'leave': ['remain'], // Leave
  'led': ['blind', 'capture', 'chaotic', 'cinematography', 'collage', 'compositing', 'curation', 'detail', 'digital', 'drawing', 'dreamlike', 'exhibition', 'filmic', 'filtering', 'game', 'generation', 'generative', 'graffiti', 'graphics', 'iconography', 'imaging', 'interface', 'lens', 'manipulation', 'masking', 'modeling', 'photoreal', 'photorealistic', 'process', 'projection', 'render', 'retouching', 'schematic', 'shading', 'simulation', 'sketching', 'staging', 'styling', 'typeset', 'typesetting', 'typographic', 'ui-ux', 'vector', 'video', 'volumetrics', 'web'], // Led
  'legacy': ['disposability', 'ephemerality', 'fintech', 'novelty', 'obsolescence', 'transience'], // Legacy
  'legal': ['artistic', 'creative', 'illegal', 'unlawful'], // Legal
  'leisure': ['demand', 'drudgery', 'duty', 'grind', 'gym', 'hustle', 'motorsport', 'obligation', 'rush', 'stress', 'work'], // Leisure
  'leisurely': ['busy', 'chaotic', 'demanding', 'frantic', 'hectic', 'intense', 'speed', 'stressful', 'urgent'], // leisurely
  'leisurely-flow': ['rushed', 'staccato'], // Leisurely-Flow
  'lengthy': ['brevity', 'brief', 'instant', 'quick', 'short'], // Lengthy
  'lens': ['illustration', 'led'], // Lens
  'lessen': ['amplify', 'intensify', 'magnify', 'overpower'], // Lessen
  'letgo': ['hold'], // Letgo
  'lethargic': ['activating', 'active', 'athlete', 'bold', 'bright', 'bustling', 'dynamic', 'energetic', 'lively', 'stimulating', 'swift', 'vibrant'], // Lethargic
  'lethargy': ['activating', 'alertness', 'ambition', 'invigoration', 'vigor', 'zeal', 'zesty'], // Lethargy
  'level': ['arch', 'chaotic', 'diagonal', 'disordered', 'dome', 'fragmented', 'haphazard', 'raised', 'random', 'scattered', 'uneven'], // level
  'levelness': ['verticality'], // levelness
  'levity': ['burden', 'gravity', 'intensity', 'restraint', 'seriousness', 'sorrow', 'tension', 'weight', 'weightiness'], // Levity
  'liberate': ['hinder'], // Liberate
  'liberated': ['confining'], // Liberated
  'liberating': ['suppressing'], // Liberating
  'liberation': ['binding', 'bondage', 'captivity', 'confinement', 'control', 'deprivation', 'imposition', 'limitation', 'oppression', 'restriction', 'subjugation', 'suppression'], // Liberation
  'liberty': ['constraint', 'dependence', 'government', 'regulation', 'restriction'], // Liberty
  'lie': ['fact'], // Lie
  'life': ['coldness', 'death', 'dormancy', 'end', 'fall', 'futility', 'nonexist', 'stillness', 'void'], // Life
  'lifeless': ['alive', 'animated', 'colorful', 'dynamic', 'energetic', 'exciting', 'liveliness', 'lively', 'stimulating', 'vibrant', 'vibration', 'vital', 'zest'], // Lifeless
  'lifestyle': ['conformity', 'detachment', 'rigidity', 'stagnation', 'uniformity'], // Lifestyle
  'lift': ['drag', 'plunge'], // Lift
  'light': ['abyss', 'arduous', 'blackout', 'blocky', 'boxy', 'burdened', 'burdensome', 'buzz', 'challenging', 'composition', 'concrete', 'cumbersome', 'dark', 'darkness', 'death', 'dusk', 'eclipse', 'ember', 'flood', 'gothic', 'graphite', 'grim', 'heavy', 'obscured', 'pain', 'pessimism', 'pessimistic', 'ponderous', 'serious', 'shade', 'stern', 'stiff', 'stone', 'strenuous', 'sturdy', 'thick', 'viscous', 'weight', 'weighty', 'wire'], // Light
  'lighten': ['plunge'], // Lighten
  'lighthearted': ['solemn'], // lighthearted
  'lightmode': ['darkmode'], // lightmode
  'lightness': ['burden', 'darkness', 'dimness', 'fog', 'gravitas', 'gravity', 'heavy', 'imposition', 'mass', 'pressure', 'strain'], // Lightness
  'lightweight': ['burdensome', 'complex', 'dense', 'freight', 'heavy', 'intricate', 'monolithic-depth', 'robust', 'solid', 'strenuous'], // Lightweight
  'like': ['composition', 'contrast', 'dislike', 'dismiss', 'distrust'], // Like
  'limbo': ['certainty', 'clarity', 'completion', 'resolve'], // Limbo
  'liminality': ['certainty', 'completeness', 'concreteness', 'finality', 'permanence', 'stability'], // Liminality
  'limit': ['beyond', 'boundless', 'chaotic-abundance', 'endless', 'expand', 'expansive', 'freedom', 'freeness', 'infinite', 'limitless', 'overflow', 'portal', 'threshold', 'unlimited', 'vast'], // Limit
  'limitation': ['boundless', 'boundless-exploration', 'expanse', 'expansion', 'freedom', 'growth', 'infinity', 'liberation', 'limitless', 'openness', 'opportunity', 'possibility', 'potential', 'vastness'], // Limitation
  'limited': ['boundless', 'capable', 'earthen', 'emerald', 'endless', 'endlessness', 'eternal', 'infinite', 'infinity', 'limitless', 'restless', 'ubiquitous', 'unbound', 'unconfined', 'vast'], // Limited
  'limitless': ['bounded', 'confined', 'constrained', 'finite', 'limit', 'limitation', 'limited', 'narrowed', 'restricted', 'shroud', 'stifled'], // Limitless
  'line': ['blob', 'chaos', 'circle', 'curve', 'dot', 'form', 'loop', 'polyhedron', 'sphere', 'surface', 'volume'], // Line
  'linear': ['3d', 'arch', 'blockchain', 'braided', 'branching', 'bump', 'carousel', 'centrifugal', 'circuitous', 'circular', 'coil', 'curvilinear', 'curvy', 'globe', 'jagged', 'kaleidoscopic', 'labyrinthine', 'loop', 'oblique', 'octagonal', 'radial', 'round', 'serpentine', 'spherical', 'spiral', 'tangential', 'topography', 'tubular', 'twist', 'twisted', 'wavy'], // Linear
  'linear-path': ['circuitous'], // Linear-Path
  'linearity': ['convolution', 'curvature', 'editorial', 'harmony', 'jumbled'], // Linearity
  'lingering': ['brief', 'ephemeral', 'fleeting', 'hasty', 'instant', 'instant-delivery', 'momentary', 'quick', 'transient'], // Lingering
  'linkage': ['detachment', 'disconnection', 'dispersal'], // Linkage
  'liquefaction': ['crystallization'], // Liquefaction
  'liquefying': ['solidifying'], // Liquefying
  'liquid': ['fixed', 'frozen', 'heat', 'powder', 'rigid', 'solid'], // Liquid
  'literacy': ['confused', 'illiterate', 'premium'], // Literacy
  'literal': ['abstraction', 'conceptual', 'cubism', 'dreamlike', 'fable', 'fictional', 'figurative', 'imaginary', 'imagination', 'intangible', 'mystic', 'oblique', 'symbolic', 'symbolism'], // Literal
  'literal-interpretation': ['symbolic'], // Literal-Interpretation
  'literalism': ['interpretation'], // Literalism
  'literary': ['brutal', 'chaos', 'crude', 'disorder', 'distrust'], // Literary
  'literate': ['illiterate'], // Literate
  'live': ['album', 'dead', 'expire', 'inactive', 'memorial', 'past', 'stagnant', 'still'], // live
  'liveliness': ['bleakness', 'dead', 'dimness', 'drab', 'dull', 'dullness', 'flat', 'lifeless', 'mundane', 'quiet', 'still'], // Liveliness
  'lively': ['bland', 'bore', 'boring', 'cold', 'desolate', 'dismal', 'drab', 'drag', 'drain', 'drained', 'dreary', 'dull', 'dullard', 'idle', 'lame', 'lethargic', 'lifeless', 'monotonous', 'plain', 'sluggish', 'sober', 'somber', 'stale', 'sterile', 'stifled', 'stuffy', 'tedious', 'tired', 'weary', 'withering'], // Lively
  'loading': ['composition', 'contrast', 'finished', 'instant'], // Loading
  'local': ['alien', 'e-commerce', 'ecommerce', 'external', 'foreign', 'freight', 'global', 'globe', 'planetary', 'premium', 'remote'], // Local
  'localism': ['globalism', 'globalization', 'monotony', 'standardization', 'uniformity'], // localism
  'lock': ['access', 'expose', 'free', 'invite', 'loose', 'open', 'release', 'scroll', 'unblock'], // Lock
  'lofty': ['common', 'grounded', 'lowly', 'mundane', 'ordinary', 'simple'], // lofty
  'logic': ['chaos', 'emotion', 'foolishness', 'intuition', 'irrationality', 'myth', 'paradox', 'subjectivity'], // Logic
  'logical': ['chaotic', 'confused', 'disordered', 'emotionalist', 'illiterate', 'illogical', 'irrational', 'random', 'unfocused', 'vague'], // Logical
  'logistics': ['chaos', 'isolation', 'residential', 'stagnation', 'waste'], // Logistics
  'loneliness': ['closeness', 'intimacy', 'togetherness'], // Loneliness
  'lonely': ['collaborative', 'shared'], // Lonely
  'longevity': ['decay', 'fleeting'], // Longevity
  'loop': ['angle', 'break', 'broken', 'disrupt', 'end', 'finite', 'gap', 'line', 'linear', 'sharp', 'static', 'stop'], // Loop
  'loose': ['bind', 'binding', 'bound', 'buzz', 'concentrated', 'consolidate', 'constrained', 'constrict', 'controlled', 'exact', 'fixed', 'hold', 'lock', 'narrow', 'restrained', 'restrictive', 'rigid', 'root', 'rooted', 'serious', 'stiff', 'strict', 'sturdy', 'tense', 'tight', 'wire'], // Loose
  'loosen': ['bound', 'compact', 'dense', 'fixed', 'narrow', 'rigid', 'stack', 'structured', 'tight'], // loosen
  'loosened': ['tightened'], // Loosened
  'loosening': ['compressing'], // Loosening
  'lore': ['premium'], // Lore
  'loss': ['ascendancy', 'bounty', 'gift', 'merchandise', 'payments', 'peak', 'present', 'produce', 'profit', 'prosperity', 'recruitment', 'victory'], // Loss
  'lost': ['anchored', 'certain', 'clear', 'competence', 'defined', 'found', 'present', 'secure', 'stable'], // Lost
  'loud': ['calm', 'dimming', 'discretion', 'faint', 'gentle', 'humble', 'hushing', 'introverted', 'muffle', 'muffled', 'mute', 'muted', 'muting', 'pale', 'paused', 'quiet', 'reserved', 'shy', 'soft', 'subduing', 'subtle', 'timid', 'whisper'], // Loud
  'love': ['cruelty', 'malice'], // Love
  'low': ['ascend', 'elevate', 'elevated', 'flood', 'high', 'premium', 'rise', 'stratosphere', 'summit', 'superior', 'top', 'up', 'vertex'], // low
  'low-tech': ['deeptech'], // Low-Tech
  'lower': ['above', 'ascend', 'elevate', 'elevated', 'higher', 'peak', 'raise', 'rise', 'top', 'up', 'upper'], // Lower
  'lowered': ['raised'], // Lowered
  'lowly': ['apex', 'lofty'], // Lowly
  'loyal': ['fickle'], // Loyal
  'lucid': ['confused'], // Lucid
  'lucidity': ['chaos', 'complexity', 'confusion', 'darkness', 'heaviness', 'mist', 'muddiness', 'obscurity', 'vagueness'], // lucidity
  'luck': ['misfortune'], // Luck
  'luddism': ['techno-culture'], // luddism
  'lumen': ['dimness', 'obscurity', 'shade'], // Lumen
  'luminance': ['darkness', 'dimness', 'nocturn', 'obscurity', 'shadow'], // Luminance
  'luminescence': ['dimness', 'dullness', 'obscurity'], // Luminescence
  'luminescent': ['dull', 'matte', 'murky', 'opaque', 'shadowy'], // Luminescent
  'luminosity': ['editorial', 'harmony'], // Luminosity
  'luminous': ['blind', 'darkmode', 'matt', 'repellent', 'rusty'], // Luminous
  'lunar': ['day', 'solar', 'terrestrial'], // Lunar
  'lush': ['arid', 'barren', 'bleak', 'dry', 'shrivel', 'skeletal'], // Lush
  'lush-abundance': ['meager'], // Lush-Abundance
  'lustrous': ['bland', 'dull', 'flat', 'matte', 'rough'], // Lustrous
  'luxe': ['base', 'crude', 'disorder', 'drab', 'mundane', 'shabby'], // Luxe
  'luxurious': ['composition', 'contrast', 'shabby'], // Luxurious
  'luxury': ['casualdining', 'cheap', 'grocery', 'hunger', 'streetfood'], // Luxury
  'machinery': ['toys', 'watches'], // Machinery
  'macro': ['basic', 'bland', 'dull', 'flat', 'micro', 'simple', 'subtle', 'vague'], // Macro
  'macrocosm': ['microcosm'], // Macrocosm
  'madness': ['rationality', 'sanity'], // Madness
  'magazine': ['composition', 'contrast'], // Magazine
  'magnify': ['compress', 'diminish', 'flatten', 'lessen', 'minimize', 'reduce', 'shrink', 'simplify'], // Magnify
  'main': ['fragmented', 'marginal', 'minor', 'peripheral', 'scattered', 'secondary', 'sidebar', 'subordinate'], // main
  'main-course': ['condiments', 'dessert'], // main-course
  'mainstream': ['alternative', 'artsy', 'counterculture', 'eccentric', 'experimental', 'indie', 'irregular', 'niche', 'obscure', 'offbeat', 'uncommon', 'underground'], // Mainstream
  'majestic': ['common', 'insignificant', 'mundane', 'ordinary', 'simple'], // Majestic
  'malice': ['benevolence', 'care', 'charity', 'goodness', 'honesty', 'innocence', 'kindness', 'love', 'trust'], // malice
  'malleable': ['brittle', 'firm', 'fixed', 'hard', 'inflexible', 'rigid', 'solid', 'stiff', 'unyielding'], // malleable
  'malnutrition': ['nutrition'], // Malnutrition
  'man-made': ['natura'], // Man-Made
  'manifest': ['concealed', 'disappear', 'invisible'], // Manifest
  'manifestation': ['negation', 'rejection', 'suppression'], // Manifestation
  'manifesting': ['disband', 'disperse', 'dissipate', 'halt', 'neglect', 'repel', 'suppress', 'vanishing', 'void'], // manifesting
  'manipulation': ['genuine', 'illustration', 'led'], // Manipulation
  'manmade': ['environment'], // manmade
  'manual': ['automated', 'automotive', 'cybernetic', 'digitalization', 'edtech', 'fintech', 'postdigital', 'robotics', 'technographic', 'xr'], // manual
  'manual-labor': ['motorsport'], // Manual-Labor
  'manufacture': ['toys'], // Manufacture
  'manufacturing': ['agriculture', 'catering', 'craft', 'retail', 'service'], // Manufacturing
  'marble': ['frayed', 'matte', 'organic', 'rough', 'soft', 'temporary'], // Marble
  'margin': ['core'], // margin
  'marginal': ['centric', 'main'], // Marginal
  'marginalization': ['empowerment', 'privilege'], // marginalization
  'marine': ['aerospace', 'continental', 'inland', 'land', 'land-based', 'terrestrial', 'urban'], // Marine
  'marked': ['erased'], // Marked
  'marketing': ['absence', 'chaos', 'confusion', 'disinterest', 'disorder', 'indifference', 'neglect', 'operations', 'research', 'secrecy', 'silence'], // Marketing
  'masculine': ['feminine'], // masculine
  'mask': ['uncover', 'unveiling'], // Mask
  'masked': ['clear', 'exposed', 'identity', 'overlook', 'revealed', 'unveiled', 'visible'], // Masked
  'masking': ['illustration', 'led', 'unveiling'], // Masking
  'masonry': ['based', 'grid'], // Masonry
  'mass': ['airiness', 'boutique', 'fluidity', 'lightness', 'particle', 'petiteness', 'point', 'simplicity', 'void', 'watchmaking', 'yachting'], // Mass
  'mass-market': ['boutique'], // Mass-Market
  'mass-produced': ['artisanal'], // mass-produced
  'massing': ['outlining'], // Massing
  'massive': ['diminutive', 'miniature', 'petite', 'small', 'thin', 'tiny'], // Massive
  'massproduced': ['artisanal', 'bespoke', 'crafted', 'handcrafted-goods', 'individual', 'intentional', 'personal', 'specific', 'unique'], // massproduced
  'mastered': ['fumbled'], // Mastered
  'masterful': ['amateur'], // Masterful
  'mastery': ['chaos', 'disorder', 'failure', 'fumbled', 'ignorance', 'incompetence'], // Mastery
  'matched': ['disparate'], // Matched
  'material': ['astral', 'disembodiment', 'intangible', 'metaverse'], // Material
  'materiality': ['virtualization'], // Materiality
  'materialize': ['disappear'], // Materialize
  'materials': ['absence', 'depletion', 'emptiness', 'invisibility', 'lack', 'nothing', 'scarcity', 'void'], // Materials
  'matrix': ['chaos', 'disorder', 'fluidity', 'randomness', 'simplicity'], // Matrix
  'matt': ['bright', 'glossy', 'iridescent', 'luminous', 'phosphor', 'polished', 'reflective', 'shiny', 'smooth', 'vivid'], // Matt
  'matte': ['glassy', 'glazed', 'gleaming', 'hard', 'luminescent', 'lustrous', 'marble', 'reflectivity', 'scrolling', 'sheen', 'shimmer', 'shiny'], // Matte
  'matter': ['psyche', 'spirit'], // matter
  'mature': ['childlike', 'children-s'], // Mature
  'maturity': ['childhood', 'youthfulness'], // Maturity
  'maximalism': ['cleanliness', 'minimalism', 'order', 'simplicity', 'subtlety'], // Maximalism
  'maximalist': ['brutalist', 'glassmorphism', 'minimal', 'minimalistic'], // Maximalist
  'maximize': ['minimize'], // Maximize
  'meager': ['abundant', 'extravagant', 'exuberant', 'generous', 'lavish', 'lush-abundance', 'opulent', 'plentiful', 'rich'], // Meager
  'meals': ['snacks'], // meals
  'meaning': ['absurdity', 'ambiguity', 'chaos', 'confusion', 'empty', 'foolishness', 'insignificance', 'narrative-absence', 'nonsense', 'trivial', 'vague'], // Meaning
  'meaningful': ['forgettable', 'frivolous', 'futile', 'irrelevant', 'petty', 'pointless', 'superficial', 'trivial', 'useless', 'worthless'], // Meaningful
  'meaninglessness': ['significance'], // meaninglessness
  'measure': ['ambiguity', 'chaos', 'disorder', 'fluidity', 'imprecision'], // Measure
  'measured': ['hasty'], // Measured
  'measurement': ['composition', 'contrast'], // Measurement
  'mechanic': ['artistic', 'chaotic', 'fluid', 'freeform', 'handcrafted', 'improvised', 'natural', 'organic', 'spontaneous'], // Mechanic
  'mechanical': ['acoustic', 'artistic', 'behavioral', 'bio', 'biomorphic', 'biophilic', 'botanical', 'chaotic', 'eco-design', 'fluid', 'free', 'handwritten', 'natural', 'organic', 'soft', 'soulful', 'spontaneous'], // Mechanical
  'mechanism': ['animalism', 'chaos', 'fluidity', 'instinct', 'organic', 'spontaneity'], // Mechanism
  'media': ['corporate', 'finance'], // Media
  'medicine': ['supplements'], // medicine
  'mediocre': ['aspiration', 'bold', 'dynamic', 'elite', 'exceptional', 'exciting', 'ideal', 'innovative', 'original', 'unique', 'vibrant'], // Mediocre
  'mediocrity': ['artistry', 'excellence'], // Mediocrity
  'meekness': ['assertiveness'], // Meekness
  'melancholy': ['exuberance', 'playful', 'whimsical'], // Melancholy
  'mellow': ['agitated', 'blazing', 'chaotic', 'harsh', 'intense', 'strident', 'tense'], // Mellow
  'melodic': ['discordant'], // Melodic
  'melody': ['cacophony', 'disorder', 'silence'], // Melody
  'melt': ['chill', 'cool', 'firm', 'freeze', 'frost', 'hard', 'solid', 'solidify', 'stiff', 'still'], // melt
  'melting': ['solidifying'], // Melting
  'memorable': ['forgettable'], // Memorable
  'memorial': ['celebration', 'dismissal', 'disregard', 'forgetfulness', 'live', 'neglect'], // Memorial
  'memory': ['disconnection', 'forgetting', 'neglect', 'oblivion'], // Memory
  'memphis': ['classicism', 'minimalism', 'monochrome'], // Memphis
  'menu': ['composition', 'contrast', 'freestyle'], // Menu
  'merchandise': ['absence', 'discard', 'empty', 'essentials', 'experiences', 'free', 'intellectual property', 'intellectual-property', 'lack', 'loss', 'services', 'spare', 'void'], // Merchandise
  'merge': ['detach', 'divide', 'isolate', 'separate', 'split'], // Merge
  'merged': ['disjoint', 'dispersed', 'distinct', 'isolated', 'separate'], // merged
  'merging': ['dividing'], // Merging
  'merriment': ['heavy'], // Merriment
  'mesh': ['serif'], // Mesh
  'mess': ['beauty', 'catering', 'clarity', 'clean', 'engineering', 'harmony', 'method', 'neat', 'order', 'outlining', 'portfolio', 'sightful', 'simplicity', 'structure', 'tidy', 'typecraft', 'whisper'], // Mess
  'messaging': ['confusion', 'detachment', 'disconnection', 'ignorance', 'silence'], // Messaging
  'messiness': ['aesthetics'], // Messiness
  'messy': ['adulting', 'basis', 'calm', 'clean', 'cleanliness', 'composition', 'crisp', 'cultivate', 'definition', 'docs', 'flawless', 'formality', 'formed', 'harmonic', 'neat', 'orderly', 'organized', 'perfect', 'precise', 'prime', 'scholarly', 'simplifying', 'spotless', 'steadfast', 'sterile', 'structured', 'tidy', 'untouched', 'wash'], // Messy
  'metal': ['cardboard', 'ceramic', 'flesh', 'paper', 'wood'], // Metal
  'metallic': ['fibrous', 'fluid', 'paperlike'], // Metallic
  'metamorphosis': ['constancy', 'stagnation'], // Metamorphosis
  'metaphysics': ['geology'], // metaphysics
  'metaverse': ['absence', 'analog', 'disconnection', 'isolation', 'material', 'onsite', 'physical', 'realism', 'simplicity', 'solidity', 'stagnation', 'tangibility'], // Metaverse
  'method': ['chaos', 'confusion', 'deliberate-chaos', 'disorder', 'haphazard', 'improvisation', 'mess', 'random', 'spontaneity'], // Method
  'methodical': ['arbitrary', 'chaotic', 'disorderly', 'disorganized', 'erratic', 'haphazard', 'impromptu', 'random', 'scatterbrained', 'scrawl', 'spontaneous', 'unplanned'], // Methodical
  'meticulous': ['negligent'], // Meticulous
  'metropolitan': ['rural'], // Metropolitan
  'micro': ['broad', 'expansive', 'large', 'macro', 'vast'], // Micro
  'microcosm': ['chaos', 'emptiness', 'grandeur', 'infinity', 'isolation', 'macrocosm', 'simplicity', 'stagnation', 'uniformity', 'vastness', 'void'], // Microcosm
  'might': ['absence', 'deficiency', 'despair', 'dullness', 'emptiness', 'lack', 'perceived-weakness', 'sadness', 'void', 'weakness'], // might
  'mild': ['harsh', 'spicy'], // Mild
  'milestone': ['anonymity', 'disregard', 'failure', 'neglect', 'obscurity'], // Milestone
  'mindful': ['careless', 'distracted', 'mindless', 'oblivious'], // Mindful
  'mindless': ['aware', 'conscious', 'engaged', 'mindful', 'thoughtful'], // mindless
  'mineral': ['abstract', 'ethereal', 'fluid', 'immaterial', 'organic'], // Mineral
  'miniature': ['full-scale', 'gigantic', 'grandiose', 'huge', 'large', 'massive', 'monumental'], // Miniature
  'minimal': ['3d-rendering', 'accent', 'arcade', 'atmospheric', 'camp', 'caps', 'chunky', 'cinematic', 'comic', 'elaborate', 'excessive', 'flood', 'folk', 'homely', 'indulgent', 'industrial', 'kitsch', 'maximalist', 'noir', 'ornamental', 'overwrought', 'painterly', 'paneled', 'performative', 'spectacle', 'sticker', 'textural', 'volume'], // Minimal
  'minimalism': ['baroque', 'cartoon', 'cluttered', 'complex', 'consumerism', 'deco', 'deconstructivism', 'exaggeration', 'excess', 'excessive', 'layering', 'maximalism', 'memphis', 'postmodernism', 'skeuomorphism'], // Minimalism
  'minimalist': ['botanical', 'kawaii', 'neoclassical', 'psychedelic', 'techno'], // Minimalist
  'minimalistic': ['adorned', 'carousel', 'chiaroscuro', 'clustering', 'cluttered', 'complex', 'composition', 'contrast', 'convolution', 'crude', 'decorated', 'dense', 'excessive', 'maximalist'], // Minimalistic
  'minimize': ['chaos', 'complexity', 'contrast', 'diversity', 'emphasize', 'expansion', 'magnify', 'maximize', 'overline', 'scale', 'variety'], // Minimize
  'mining': ['bakery', 'winery'], // Mining
  'minor': ['main'], // Minor
  'minuscule': ['vast'], // Minuscule
  'minutiae': ['immensity'], // minutiae
  'mirth': ['heavy', 'weight'], // Mirth
  'misery': ['euphoria', 'pleasure', 'well-being'], // Misery
  'misfortune': ['blessing', 'fortune', 'happiness', 'joy', 'luck', 'prosperity', 'serendipity', 'success', 'wealth'], // misfortune
  'misleading': ['honest', 'informative'], // Misleading
  'mismatch': ['accuracy', 'alignment', 'clarity', 'coherence', 'consistency', 'harmony', 'homogeneity', 'precision', 'sameness', 'unity'], // Mismatch
  'misrepresentation': ['truth'], // misrepresentation
  'mist': ['brightness', 'clarity', 'definition', 'lucidity', 'openness', 'transparency'], // Mist
  'misunderstanding': ['insight', 'understanding'], // misunderstanding
  'mixed': ['mono'], // Mixed
  'mixed-media': ['monomedia', 'single-medium'], // Mixed-media
  'mobile': ['fixed', 'immobile', 'rigid', 'settled', 'static', 'stationary', 'still', 'unmoving'], // Mobile
  'mobility': ['anchored', 'bound', 'fixed', 'fixity', 'immobility', 'rigid', 'stability', 'stagnation', 'stasis', 'static', 'stationary'], // Mobility
  'mockery': ['respect', 'sincerity', 'support'], // Mockery
  'modal': ['composition', 'contrast'], // Modal
  'modeling': ['illustration', 'led'], // Modeling
  'modelling': ['chaos', 'chaotic', 'disorder', 'disorderly', 'haphazard', 'improvised', 'random', 'rough', 'spontaneous', 'unstructured'], // Modelling
  'moderation': ['excess'], // Moderation
  'modern': ['ancient', 'archaic', 'artifact', 'ascii', 'classicism', 'composition', 'contrast', 'folk', 'gothic', 'historical', 'obsolete', 'primitive', 'retro', 'rural', 'timeless', 'traditional', 'vintage'], // Modern
  'modernism': ['baroque', 'postmodernism'], // modernism
  'modernist': ['neoclassical'], // modernist
  'modernity': ['obsolescence', 'youth'], // Modernity
  'modest': ['excessive', 'flamboyant', 'gaudy', 'greed', 'imposing', 'indulgent', 'lavish', 'pretentious'], // Modest
  'modular': ['fixed', 'integral', 'integrated', 'monolithic', 'solid', 'unified', 'whole'], // Modular
  'modularity': ['flow'], // Modularity
  'module': ['chaos', 'disorder', 'fragment'], // Module
  'moist': ['arid', 'baked'], // moist
  'molecular': ['abstract', 'amorphous', 'chaos', 'random', 'void'], // Molecular
  'molten': ['calm', 'cold', 'cool', 'frozen', 'solid', 'stable', 'stagnant', 'still'], // Molten
  'moment': ['continuity', 'eternity', 'stagnation'], // Moment
  'momentary': ['endless', 'endlessness', 'enduring', 'eternal', 'lasting', 'lingering', 'perpetual', 'perpetuity', 'timeless'], // momentary
  'momentum': ['inertia', 'stasis', 'stillness'], // Momentum
  'mono': ['abundant', 'chaotic', 'complex', 'diverse', 'dynamic', 'mixed', 'poly', 'varied'], // Mono
  'monochromatic': ['cool', 'coolness'], // Monochromatic
  'monochrome': ['binary', 'chromatic', 'colorful', 'colorfulness', 'cool', 'coolness', 'diverse', 'graded', 'kaleidoscopic', 'memphis', 'murals', 'vibrant'], // Monochrome
  'monochrome-palette': ['kaleidoscope'], // Monochrome-Palette
  'monoculture': ['chaos', 'complexity', 'contrast', 'difference', 'diversity', 'individuality', 'uniqueness', 'variety'], // monoculture
  'monolith': ['strata'], // Monolith
  'monolithic': ['diverse', 'fragmented', 'granular', 'hybrid', 'modular', 'particulate', 'scattered', 'segmented', 'variable', 'varied'], // Monolithic
  'monolithic-depth': ['lightweight'], // Monolithic-Depth
  'monologue': ['dialogue', 'interaction'], // Monologue
  'monomedia': ['mixed-media'], // monomedia
  'monopoly': ['chaos', 'collaboration', 'competition', 'decentralization', 'disorder', 'diversity', 'freedom', 'openness', 'variety'], // monopoly
  'monospace': ['composition', 'contrast'], // Monospace
  'monotone': ['relief'], // monotone
  'monotonous': ['boutique', 'colorful', 'diverse', 'dynamic', 'eclectic', 'energetic', 'exciting', 'lively', 'reactive', 'stimulating', 'variant', 'varied', 'vibrant'], // Monotonous
  'monotony': ['adaptability', 'creativity', 'customization', 'event', 'exuberance', 'flotilla', 'interplay', 'kaleidoscopic', 'localism', 'passion'], // Monotony
  'monumental': ['editorial', 'fleeting', 'harmony', 'insignificant', 'miniature', 'petite', 'trivial'], // Monumental
  'morning': ['darkness', 'dusk', 'evening', 'night', 'sleep'], // morning
  'morph': ['constant', 'fixed', 'rigid', 'solid', 'stable', 'static'], // Morph
  'mortality': ['endlessness', 'eternity', 'immortality', 'infinity', 'perpetuity'], // Mortality
  'mosaic': ['chaos', 'disorder', 'empty', 'fragment', 'simple', 'singular', 'singular-style', 'uniform', 'void'], // Mosaic
  'motherhood': ['childless', 'petcare'], // Motherhood
  'motion': ['slowness', 'stuck'], // Motion
  'motivate': ['bore', 'dampen', 'discourage', 'stagnate'], // motivate
  'motivated': ['laziness', 'lazy'], // Motivated
  'motorsport': ['calm', 'gentle', 'leisure', 'manual-labor', 'mundane', 'pedestrian', 'quiet', 'simple', 'slow', 'slow-paced', 'static'], // Motorsport
  'mourning': ['celebration'], // mourning
  'move': ['halt', 'stop'], // Move
  'moved': ['unmoved'], // Moved
  'movement': ['calm', 'dormancy', 'stasis', 'stillness'], // Movement
  'moving': ['dormant', 'paused', 'stopped'], // Moving
  'muddiness': ['lucidity'], // Muddiness
  'muddle': ['clarity', 'coherence', 'design', 'focus', 'order', 'precision', 'shape', 'simplicity', 'structure'], // muddle
  'muddy': ['bright', 'clean', 'clear', 'cyanic', 'dry', 'fresh', 'gleaming', 'neat', 'pure', 'smooth'], // Muddy
  'muffle': ['amplify', 'clarify', 'enhance', 'expose', 'express', 'loud', 'project', 'reveal', 'signal'], // muffle
  'muffled': ['bold', 'bright', 'clear', 'defined', 'distinct', 'key', 'loud', 'sharp', 'vivid'], // Muffled
  'multi': ['blank', 'plain', 'simple', 'single', 'singular-tone', 'solo', 'uniform'], // Multi
  'multiple': ['single'], // Multiple
  'multiplicity': ['singularity'], // multiplicity
  'multiply': ['deplete'], // Multiply
  'mundane': ['adventurous', 'aether', 'alien', 'alluring', 'art', 'artistic', 'attractive', 'bold', 'captivating', 'celestial', 'cinematic', 'cosmic', 'crystalline', 'dreamlike', 'dynamic', 'elevated', 'enchanted', 'enchanting', 'epic', 'ethereal', 'evocative', 'exciting', 'exotic', 'experimental', 'extraordinary', 'fanciful', 'festive', 'fi', 'gamified', 'glamour', 'gourmet', 'groovy', 'ingenuity', 'innovative', 'inventive', 'liveliness', 'lofty', 'luxe', 'majestic', 'motorsport', 'mystic', 'mythic', 'personalized', 'propulsive', 'provocative', 'retrofuturism', 'roars', 'spectacle', 'stellar', 'sublime', 'surprise', 'symbolic', 'techno-futurism', 'transcendence', 'unique', 'uniqueness', 'vanguard', 'vibrant', 'xr', 'yachting', 'zesty'], // Mundane
  'mundane-spectacle': ['forgettable'], // Mundane-Spectacle
  'mundanity': ['grandeur'], // mundanity
  'murals': ['bland', 'digital art', 'digital-art', 'dull', 'empty', 'fine art', 'fine-art', 'invisible', 'monochrome', 'plain', 'sculpture', 'silent', 'small-scale art', 'small-scale-art', 'sterile'], // Murals
  'murky': ['bright', 'calm', 'clean', 'clear', 'crystalline', 'luminescent', 'serene', 'smooth', 'stable', 'tranquil'], // murky
  'museum': ['absence', 'chaos', 'contemporary', 'destruction', 'disorder', 'dissonance', 'ephemeral', 'ignorance', 'neglect', 'retail', 'void'], // Museum
  'music': ['centered', 'composition'], // Music
  'mutable': ['archival', 'constant', 'enduring', 'fixed', 'immutable', 'permanent', 'rigid', 'stable', 'steady', 'unchanging'], // mutable
  'mute': ['amplify', 'bold', 'bright', 'colorful', 'flamboyant', 'intense', 'loud', 'overpower', 'tones', 'unleash', 'vibrant', 'vivid'], // Mute
  'muted': ['authoritative', 'blaring', 'blasts', 'blinding', 'brash', 'brilliant', 'colorful', 'confident', 'cool', 'coolness', 'dazzling', 'emissive', 'flare', 'flashy', 'garish', 'garnish', 'glare', 'ignited', 'loud', 'neon', 'overt', 'punchy', 'screaming', 'shine', 'shouted', 'strident', 'vibrancy', 'vibrant', 'vibration'], // Muted
  'muted-ambiance': ['strident'], // Muted-Ambiance
  'muted-emotion': ['explosive'], // Muted-Emotion
  'muting': ['amplifying', 'emphasizing', 'highlighting', 'loud'], // Muting
  'mysterious': ['clear', 'familiar', 'obvious'], // Mysterious
  'mystery': ['blatant', 'heavy', 'revelation'], // Mystery
  'mystic': ['common', 'concrete', 'literal', 'mundane', 'ordinary'], // Mystic
  'mystique': ['heavy'], // Mystique
  'myth': ['certainty', 'clarity', 'evidence', 'fact', 'logic', 'reality', 'reason', 'truth'], // Myth
  'mythic': ['common', 'mundane', 'ordinary'], // Mythic
  'mythos': ['fact', 'reality', 'truth'], // Mythos
  'naive': ['academia', 'adulting', 'apex', 'complex', 'critical', 'cynical', 'deeptech', 'jaded', 'pragmatic', 'skeptical', 'sophisticated', 'worldly'], // naive
  'naivety': ['cynicism', 'experience', 'expertise', 'intelligence', 'knowledge', 'pragmatism', 'realism', 'scholarship', 'skepticism', 'sophistication', 'wisdom', 'worldliness'], // naivety
  'naked': ['adorned', 'caps', 'curtained', 'shield', 'shielded'], // Naked
  'narrative-absence': ['context', 'meaning'], // Narrative-Absence
  'narrow': ['curvy', 'loose', 'loosen', 'vast'], // Narrow
  'narrowed': ['limitless'], // Narrowed
  'narrowing': ['broadening', 'expanding', 'expansion', 'filling', 'flowing', 'growing', 'opening', 'stretching', 'unfolding'], // Narrowing
  'narrowness': ['clarity', 'ease', 'emptiness', 'expanse', 'expansion', 'freedom', 'globalization', 'openness', 'vastness', 'vista', 'width'], // narrowness
  'native': ['alien', 'foreign'], // Native
  'natura': ['artificial', 'man-made', 'synthetic', 'urban'], // Natura
  'natural': ['ai', 'artifice', 'artificial', 'automated', 'automotive', 'cgi', 'coded', 'computational', 'concrete', 'cosmetics', 'cybernetic', 'engineered', 'eyewear', 'fabricated', 'factory', 'industrial', 'mechanic', 'mechanical', 'plastic', 'polluted', 'post-process', 'pretentious', 'prosthetics', 'racket', 'robotic', 'robotics', 'simulated', 'staged', 'steel', 'stilted', 'technic', 'techno', 'techno-futurism', 'technographic', 'techwear', 'toxic', 'urban', 'wire', 'wrought'], // Natural
  'natural-flow': ['stilted'], // Natural-Flow
  'naturalism': ['premium', 'regulated', 'stylization'], // Naturalism
  'naturalistic': ['abstract', 'artificial', 'contrived', 'geometric', 'synthetic'], // Naturalistic
  'nature': ['artifice', 'industry', 'pollution', 'synthetic', 'urban'], // Nature
  'nautical': ['desert', 'domestic', 'inland', 'land', 'urban'], // Nautical
  'near': ['descent', 'distant'], // Near
  'neat': ['blotchy', 'chaotic', 'cluttered', 'complexity', 'disarrayed', 'disheveled', 'disorderly', 'disorganized', 'distressed', 'frayed', 'haphazard', 'imperfect', 'jumbled', 'mess', 'messy', 'muddy', 'ragged', 'random', 'rough', 'scrappy', 'scratched', 'scrawl', 'shabby', 'sloppy', 'spill', 'splat', 'splotchy', 'sprawl', 'sprawled', 'tangle', 'wash'], // neat
  'neatness': ['filth', 'jumble', 'scribble', 'sloppiness', 'squalor'], // Neatness
  'nebula': ['clarity', 'finite', 'order', 'void'], // Nebula
  'nebulous': ['certain', 'clear', 'defined', 'definite', 'distinct', 'focused', 'precise', 'sharp', 'typographic'], // Nebulous
  'necessary': ['extraneous', 'irrelevant'], // Necessary
  'necessities': ['souvenirs'], // necessities
  'need': ['affluence', 'disinterest', 'emptiness', 'lack', 'privilege', 'sufficiency', 'surplus', 'want'], // need
  'negate': ['construct'], // negate
  'negation': ['acceptance', 'affirmation', 'assertion', 'calm', 'connection', 'creation', 'engagement', 'expansion', 'integration', 'manifestation', 'object', 'reassurance'], // negation
  'negative': ['admire', 'editorial', 'harmony', 'positive'], // Negative
  'neglect': ['accept', 'admiring', 'advertising', 'advocacy', 'attention', 'branding', 'catering', 'cherish', 'childcare', 'completion', 'conservation', 'craft', 'cultivate', 'cultivation', 'demand', 'dentistry', 'eco-consciousness', 'eco-friendliness', 'education', 'edutainment', 'encourage', 'engage', 'engrave', 'evaluation', 'fame', 'fandom', 'favor', 'fixation', 'fulfillment', 'grasp', 'healthcare', 'healthtech', 'hospitality', 'impact', 'involvement', 'kindness', 'manifesting', 'marketing', 'memorial', 'memory', 'milestone', 'museum', 'nourish', 'nurture', 'nurturing', 'observation', 'participation', 'present', 'preservation', 'privilege', 'produce', 'promotion', 'protection', 'publishing', 'recognition', 'recruitment', 'regard', 'remembrance', 'respect', 'self-care', 'selfcare', 'sightful', 'skincare', 'stewardship', 'support', 'sustenance', 'utopia', 'value', 'valuing', 'veneration', 'watchmaking', 'wellness'], // Neglect
  'neglected': ['cultivated', 'embraced', 'known'], // Neglected
  'neglectful': ['user-centric'], // Neglectful
  'neglecting': ['cherishing'], // Neglecting
  'negligence': ['accountability', 'analytics', 'attention', 'awareness', 'care', 'consideration', 'craftsmanship', 'diligence', 'discipline', 'eco-conscious', 'engagement', 'focus', 'health-conscious', 'intention', 'remembrance', 'vigilance'], // negligence
  'negligent': ['careful', 'diligent', 'focused', 'imaging', 'intentional', 'meticulous', 'orderly', 'structured', 'thorough'], // Negligent
  'neo-grotesque': ['art-deco', 'gothic', 'grunge', 'retro'], // Neo-Grotesque
  'neoclassical': ['minimalist', 'modernist'], // Neoclassical
  'neon': ['cool', 'coolness', 'muted', 'pastel'], // Neon
  'network': ['dispersal', 'isolation', 'separation'], // Network
  'neumorphic': ['bold', 'clear', 'contrasting', 'defined', 'flat', 'harsh', 'rigid', 'sharp', 'solid', 'vibrant'], // Neumorphic
  'neumorphism': ['futurism', 'futurist', 'jarring'], // Neumorphism
  'neurodiversity': ['premium'], // Neurodiversity
  'neutral': ['accent', 'chromatic', 'fiery', 'flamboyant', 'heated', 'ochre', 'statement'], // Neutral
  'new': ['aftermath', 'ancient', 'classic', 'familiar', 'historical', 'old', 'outdated', 'patina', 'rusty', 'stale', 'traditional', 'worn'], // New
  'nexus': ['cluttered', 'detached', 'disband', 'disconnection', 'disorder', 'dispersal'], // Nexus
  'niche': ['global', 'mainstream', 'ubiquitous'], // Niche
  'night': ['awake', 'dawn', 'day', 'morning', 'seed', 'solar', 'sun'], // Night
  'nihility': ['cosmos'], // nihility
  'noble': ['petty'], // Noble
  'nocturn': ['brightness', 'clarity', 'colorful', 'daylight', 'diurnus', 'luminance', 'radiance', 'transparency', 'vivid'], // Nocturn
  'nocturne': ['earthen', 'emerald'], // Nocturne
  'nodes': ['chaos', 'dispersal', 'isolation'], // Nodes
  'noir': ['bright', 'minimal', 'vibrant'], // Noir
  'noise': ['signal', 'silence', 'silent', 'stillness', 'whisper', 'zen'], // Noise
  'noisy': ['calm', 'clear', 'focused', 'objective', 'quiet', 'serene', 'simple', 'subdued'], // noisy
  'nomadic': ['anchored', 'fixed', 'rooted', 'settled', 'static'], // Nomadic
  'non-alcoholic': ['alcohol', 'whiskey', 'wine'], // Non-Alcoholic
  'non-monetary': ['payments'], // Non-Monetary
  'non-profit': ['business', 'commercial', 'corporate', 'for', 'for-profit', 'greed', 'profit', 'selfish', 'wealth'], // Non-Profit
  'non-representation': ['depiction', 'symbolism'], // Non-Representation
  'non-representational': ['depictive', 'figurative'], // Non-Representational
  'non-textual': ['labeled', 'verbal'], // Non-Textual
  'non-visual': ['sightful'], // Non-Visual
  'nonbeing': ['being'], // nonbeing
  'nonconform': ['conform'], // Nonconform
  'nonconformist': ['compliant'], // Nonconformist
  'nonconformity': ['conformity', 'tradition', 'uniformity'], // Nonconformity
  'nonexist': ['being', 'exist', 'existence', 'life', 'presence', 'reality', 'substance', 'vitality'], // nonexist
  'nonlinear': ['axial'], // nonlinear
  'nonprofit': ['commercial', 'cool', 'coolness', 'greed', 'profit', 'wealth'], // Nonprofit
  'nonsense': ['meaning', 'sense'], // Nonsense
  'nonverbal': ['articulate', 'communicative', 'expressive', 'spoken', 'textuality', 'verbal', 'vocal'], // Nonverbal
  'nordic': ['chaotic', 'eclectic', 'ornate'], // Nordic
  'normal': ['abnormal', 'chaotic', 'eccentric', 'extraordinary', 'irregular', 'odd', 'strange', 'surrealist-vision', 'unusual', 'wild'], // Normal
  'normalcy': ['abnormal', 'anomaly', 'chaos', 'disorder', 'divergent', 'fantasy', 'irregular', 'peculiar', 'risk', 'unusual'], // normalcy
  'norms': ['counterculture'], // Norms
  'nostalgia': ['future', 'heavy', 'nowhere', 'playful', 'present'], // Nostalgia
  'notable': ['forgettable', 'forgotten', 'insignificant'], // Notable
  'noted': ['disregarded'], // Noted
  'nothing': ['existence', 'globe', 'materials'], // Nothing
  'nothingness': ['being'], // nothingness
  'notice': ['forget', 'ignore'], // Notice
  'noticed': ['ignored'], // Noticed
  'nourish': ['blight', 'deplete', 'diminish', 'neglect', 'starve', 'waste'], // Nourish
  'nourishment': ['deprivation', 'disorder', 'emptiness', 'starvation', 'waste'], // Nourishment
  'nouveau': ['archaic', 'brutal', 'classic'], // Nouveau
  'novel': ['ancient', 'artifact', 'common', 'dull', 'familiar', 'historical', 'old', 'ordinary', 'repetitive', 'stale', 'standard', 'tainted', 'traditional'], // Novel
  'novelty': ['legacy', 'obsolescence', 'premium', 'roots'], // Novelty
  'now': ['past'], // Now
  'nowhere': ['aware', 'certain', 'clear', 'defined', 'found', 'nostalgia', 'present', 'somewhere', 'visible'], // nowhere
  'nuanced': ['blatant', 'rudimentary'], // Nuanced
  'nucleus': ['absence', 'chaos', 'disorder', 'fragment', 'periphery', 'scatter', 'void'], // Nucleus
  'null': ['active', 'appearing', 'being', 'complex', 'dynamic', 'filled', 'generation', 'layered', 'rich', 'structured', 'vibrant'], // Null
  'nullity': ['existence', 'identity', 'presence', 'significance', 'substance'], // Nullity
  'numb': ['alive', 'clear', 'comfortable', 'excited', 'perceptive', 'pure', 'sensitive', 'sharp', 'vivid'], // numb
  'numbness': ['tingle'], // numbness
  'nurture': ['abandon', 'damage', 'disregard', 'exploitation', 'harm', 'hinder', 'neglect'], // Nurture
  'nurturing': ['abandon', 'destroy', 'detachment', 'dismiss', 'disregard', 'neglect', 'selfish'], // Nurturing
  'nutraceuticals': ['chemicals', 'fast food', 'junk food', 'toxins'], // Nutraceuticals
  'nutrition': ['malnutrition', 'toxicity', 'unhealthiness'], // Nutrition
  'obedience': ['anarchy', 'chaos', 'defiance', 'disobedience', 'freedom', 'independence', 'rebellion', 'resistance'], // obedience
  'obedient': ['chaotic', 'defiant', 'disobedient', 'independent', 'rebel', 'rebellious', 'uncontrolled', 'unruly', 'wild'], // obedient
  'object': ['absence', 'negation', 'void'], // Object
  'objective': ['noisy', 'subjective'], // Objective
  'objectivist': ['subjective'], // Objectivist
  'objectivity': ['ambiguity', 'bias', 'confusion', 'distortion', 'emotion', 'opinion', 'partiality', 'subjectivity'], // objectivity
  'obligation': ['freetime', 'hobby', 'leisure'], // Obligation
  'oblique': ['clear', 'direct', 'even', 'flat', 'linear', 'literal', 'simple', 'straight', 'uniform'], // Oblique
  'obliterate': ['engrave'], // Obliterate
  'obliterating': ['building', 'cohesion', 'completing', 'creating', 'forming', 'integrating', 'sculpting', 'solidifying', 'uniting'], // Obliterating
  'obliteration': ['accumulation', 'clarity', 'creation', 'existence', 'intactness', 'presence', 'rebirth', 'unity', 'wholeness'], // obliteration
  'oblivion': ['awareness', 'clarity', 'creation', 'discovery', 'existence', 'identity', 'memory', 'presence', 'remembrance', 'significance'], // oblivion
  'oblivious': ['alert', 'attentive', 'aware', 'conscious', 'engaged', 'focused', 'mindful', 'perceptive', 'present'], // oblivious
  'obscure': ['blatant', 'famous', 'highlight', 'honest', 'informative', 'known', 'mainstream', 'overt', 'straightforward', 'trace', 'uncover', 'unveiling', 'visible'], // Obscure
  'obscured': ['accessible', 'apparent', 'centralized', 'clear', 'covered', 'directness', 'light', 'visible'], // Obscured
  'obscuring': ['bright', 'clear', 'defined', 'exposed', 'focused', 'highlighting', 'illuminated', 'revealing', 'visible'], // Obscuring
  'obscurity': ['attention', 'aura', 'aurora', 'branding', 'celebrity', 'clarity', 'discovery', 'exposure', 'fame', 'gesture', 'glimpse', 'identity', 'illumination', 'insight', 'interpretation', 'lucidity', 'lumen', 'luminance', 'luminescence', 'milestone', 'publicity', 'radiance', 'recognition', 'revelation', 'signal', 'statement', 'transparency', 'unveiling', 'visibility', 'vision', 'vista', 'visualization'], // Obscurity
  'observant': ['distracted'], // Observant
  'observation': ['absence', 'blindness', 'detachment', 'disregard', 'invisibility', 'neglect'], // Observation
  'observe': ['ignore'], // Observe
  'obsolescence': ['clarity', 'essential', 'evolution', 'freshness', 'future', 'legacy', 'modernity', 'novelty', 'redefinition', 'relevance', 'renewal', 'utility', 'vitality'], // obsolescence
  'obsolete': ['active', 'current', 'development', 'eco-tech', 'edtech', 'essential', 'innovative', 'modern', 'relevance', 'relevant', 'timely', 'trend', 'vibrant', 'wearables', 'youth'], // obsolete
  'obstacle': ['access', 'clarity', 'ease', 'flow', 'freedom', 'openness', 'path', 'pathway', 'solutions', 'support'], // obstacle
  'obstacles': ['solutions'], // Obstacles
  'obstruction': ['access', 'catalyst', 'conduit', 'pathway', 'stream'], // Obstruction
  'obtainable': ['abstract', 'distant', 'elusive', 'impossible', 'inaccessible', 'remote', 'unattainable', 'unreachable'], // Obtainable
  'obtrusive': ['discreet', 'introspective', 'quiet', 'soft', 'subtle'], // obtrusive
  'obvious': ['ambiguous', 'complex', 'concealed', 'concealing', 'covert', 'discretion', 'enigmatic', 'hidden', 'illusory', 'intrigue', 'investigative', 'invisible', 'labyrinthine', 'mysterious', 'strange', 'subtle', 'symbolic', 'uncertain', 'unclear', 'unknown'], // obvious
  'obviousness': ['discretion'], // Obviousness
  'occupied': ['vacancy', 'vacant'], // Occupied
  'occupy': ['vacate'], // Occupy
  'oceanic': ['arid', 'barren', 'dry', 'land', 'stale'], // Oceanic
  'ochre': ['bright', 'clean', 'cool', 'dark', 'neutral', 'pale', 'soft', 'vivid'], // Ochre
  'octagonal': ['circular', 'fluid', 'irregular', 'linear', 'spherical'], // Octagonal
  'odd': ['normal'], // Odd
  'odorless': ['aromatherapy'], // odorless
  'offbeat': ['centered', 'conventional', 'expected', 'mainstream', 'ordinary', 'predictable', 'standard', 'traditional', 'uniform'], // Offbeat
  'offer': ['consume'], // Offer
  'office': ['hotels', 'residential'], // Office
  'official': ['casual', 'informal'], // Official
  'old': ['composition', 'contrast', 'new', 'novel', 'renew', 'youthfulness'], // Old
  'ominous': ['bright', 'cheerful', 'hopeful', 'inviting', 'joyful', 'uplifting'], // Ominous
  'ongoing': ['final', 'finished'], // Ongoing
  'online': ['postal'], // Online
  'onsite': ['metaverse'], // Onsite
  'opacity': ['reflectivity', 'transparency'], // Opacity
  'opaque': ['bright', 'clear', 'crystal', 'crystalline', 'emissive', 'glassy', 'gleaming', 'iridescent', 'luminescent', 'phosphor', 'porous', 'sheer', 'shimmer', 'translucency', 'translucent', 'transparent', 'visible'], // Opaque
  'open': ['accordion', 'armored', 'bind', 'block', 'bondage', 'bound', 'bounded', 'burdened', 'cloistered', 'closed', 'cloudy', 'concealed', 'concealing', 'confining', 'constrict', 'contained', 'corridor', 'covert', 'curtained', 'deadend', 'deceptive', 'doctrinal', 'encapsulated', 'enclosed', 'end', 'final', 'finish', 'finished', 'folded', 'fortified', 'fraudulent', 'guarded', 'hiding', 'insincere', 'intimate', 'lock', 'predefined', 'predetermined', 'private', 'restricted', 'restrictive', 'sealed', 'shielded', 'shroud', 'shrouded', 'shy', 'stopped', 'stuffy', 'subsurface', 'suppressed', 'veiled', 'withholding'], // Open
  'open-crowns': ['veiled'], // Open-Crowns
  'open-top': ['enclosed', 'sealed'], // Open-Top
  'opening': ['closing', 'finale', 'narrowing'], // Opening
  'openness': ['barrier', 'burden', 'captivity', 'closed', 'closure', 'confinement', 'constraint', 'containment', 'disguise', 'distrust', 'encapsulation', 'encasement', 'enclosure', 'envelopment', 'exclusivity', 'finality', 'fog', 'guarded', 'interference', 'isolation', 'limitation', 'mist', 'monopoly', 'narrowness', 'obstacle', 'restriction', 'seclusion', 'shield', 'tunnel'], // Openness
  'operations': ['marketing'], // Operations
  'ophthalmology': ['orthodontics'], // Ophthalmology
  'opinion': ['objectivity'], // Opinion
  'opportunity': ['closure', 'limitation', 'restriction'], // Opportunity
  'oppose': ['support'], // Oppose
  'opposition': ['advocacy'], // Opposition
  'oppression': ['empowerment', 'liberation'], // Oppression
  'oppressive': ['empowering'], // Oppressive
  'optimism': ['cynicism', 'defeat', 'despair', 'gloom', 'pessimism'], // Optimism
  'optimistic': ['bleak', 'cynical', 'despairing', 'dystopic', 'gloomy', 'pessimistic'], // Optimistic
  'optimization': ['chaos', 'disorder', 'inefficiency'], // Optimization
  'opulent': ['cheap', 'meager'], // Opulent
  'orbit': ['chaos', 'dispersal', 'stillness'], // Orbit
  'order': ['absurdity', 'anomaly', 'blurb', 'cacophony', 'chaos', 'clamor', 'complexity', 'confusion', 'convolution', 'deconstructivism', 'deconstructivist', 'din', 'disorder', 'disruption', 'distortion', 'exaggeration', 'filth', 'flux', 'fuzz', 'glitch', 'jumble', 'maximalism', 'mess', 'muddle', 'nebula', 'overflow', 'paradox', 'racket', 'randomness', 'rebellion', 'scribble', 'sloppiness', 'squalor', 'surrealism', 'tangle', 'tumult', 'turbulence', 'turmoil', 'vortex', 'war', 'whirlwind', 'wilderness', 'wildness'], // Order
  'ordered': ['arbitrary', 'cluttered', 'deconstructed', 'deconstructivism', 'freeform', 'frenzy', 'jumbled', 'rambling', 'random', 'terrain', 'undefined', 'untamed'], // Ordered
  'orderly': ['anarchic', 'anti', 'brushstroke', 'clatter', 'crooked', 'disarrayed', 'disheveled', 'disorderly', 'disorganized', 'distorted', 'distressed', 'feral', 'freestyle', 'fumbled', 'haphazard', 'harried', 'illogical', 'messy', 'negligent', 'ragged', 'raucous', 'rebel', 'reckless', 'scrap', 'scrappy', 'scrawl', 'shabby', 'shifty', 'sloppy', 'spill', 'splat', 'sprawl', 'squiggly', 'twisted', 'unruly', 'unsteady', 'wild'], // Orderly
  'ordinariness': ['celebrity', 'customization', 'excellence', 'fantasy', 'grandeur', 'idiosyncrasy'], // Ordinariness
  'ordinary': ['alien', 'attractive', 'captivating', 'cinematic', 'colorful', 'cosmic', 'deeptech', 'distinctive', 'dreamlike', 'dynamic', 'elevated', 'elite', 'enchanted', 'enchanting', 'epic', 'exceptional', 'excessive', 'exotic', 'extraordinary', 'fame', 'famous', 'fanciful', 'flamboyant', 'garnish', 'inventive', 'lofty', 'majestic', 'mystic', 'mythic', 'novel', 'offbeat', 'propulsive', 'provocative', 'rare', 'remarkable', 'retrofuturism', 'roars', 'singular', 'stellar', 'surrealism', 'symbolic', 'transcendence', 'uncommon', 'unfamiliar', 'unhinged', 'unique', 'uniqueness', 'vanguard', 'vivid', 'xr'], // Ordinary
  'organic': ['ai', 'artifact', 'automated', 'automotive', 'based', 'blocky', 'boxy', 'cgi', 'circuit', 'clinical', 'coded', 'columnar', 'computational', 'concrete', 'crystal', 'cubist', 'cybernetic', 'engineered', 'factory', 'geometric', 'grid', 'industrial', 'marble', 'mechanic', 'mechanical', 'mechanism', 'mineral', 'pixel', 'plastic', 'polluted', 'rectangle', 'rectangular', 'robotic', 'robotics', 'staged', 'steel', 'sterile', 'structural', 'technic', 'techno', 'techno-futurist', 'technographic'], // Organic
  'organization': ['disorder'], // Organization
  'organize': ['discard'], // Organize
  'organized': ['cluttered', 'confusing', 'disarrayed', 'disorderly', 'disorganized', 'disregarded', 'messy', 'scatterbrained', 'shifty', 'sprawl', 'sprawled', 'unformed', 'unplanned'], // Organized
  'origin': ['absence', 'aftermath', 'eclipse', 'end', 'void'], // Origin
  'original': ['banal', 'fake', 'mediocre', 'simulacrum', 'tainted'], // Original
  'ornamental': ['minimal', 'plain'], // Ornamental
  'ornamentation': ['base', 'editorial', 'harmony'], // Ornamentation
  'ornate': ['bauhaus', 'brutalism', 'functionalism', 'functionalist', 'nordic', 'plain', 'utilitarian'], // Ornate
  'orthodontics': ['cardiology', 'dermatology', 'ophthalmology', 'podiatry'], // Orthodontics
  'orthodoxy': ['counterculture'], // Orthodoxy
  'ostentatious': ['humble'], // Ostentatious
  'otherworldly': ['earthiness'], // Otherworldly
  'outdated': ['new', 'trendsetting'], // Outdated
  'outerwear': ['footwear'], // outerwear
  'outgoing': ['introverted', 'shy'], // Outgoing
  'outlining': ['ambiguity', 'blending', 'blurring', 'chaos', 'confusion', 'disorder', 'improvisation', 'massing', 'mess', 'random', 'shading', 'spontaneity'], // Outlining
  'outspoken': ['discretion'], // Outspoken
  'outward': ['ambiguous', 'introspection', 'inward', 'sensitive', 'soft', 'uncertain', 'vague'], // outward
  'over': ['under'], // Over
  'overflow': ['constrict', 'contain', 'control', 'filtering', 'focus', 'limit', 'order', 'restrict', 'scarcity', 'steady'], // Overflow
  'overlapping': ['distinction', 'grainy'], // Overlapping
  'overline': ['minimize'], // Overline
  'overload': ['heavy'], // Overload
  'overlook': ['buried', 'covert', 'diminished', 'hidden', 'ignore', 'masked', 'regard', 'subtle', 'under', 'underline', 'valuing'], // Overlook
  'overpower': ['diminish', 'fade', 'gentle-influence', 'lessen', 'mute', 'reduce', 'soften', 'subdue', 'weaken'], // Overpower
  'oversized': ['petite'], // Oversized
  'overt': ['covert', 'discreet', 'hidden', 'muted', 'obscure', 'quiet', 'reserved', 'subtextual', 'subtle'], // Overt
  'overwhelm': ['selfcare'], // Overwhelm
  'overwhelming': ['simplifying'], // Overwhelming
  'overwrought': ['calm', 'minimal', 'plain', 'quiet', 'simple', 'simplistic', 'soft', 'subtle', 'understated'], // Overwrought
  'ownership': ['abandon'], // Ownership
  'page': ['composition', 'contrast'], // Page
  'pain': ['bliss', 'comfort', 'delight', 'dentistry', 'ease', 'happiness', 'hope', 'joy', 'light', 'pleasure', 'satisfied', 'selfcare', 'well-being', 'wellbeing'], // pain
  'painterly': ['clean', 'flat', 'graphic', 'minimal', 'sleek'], // Painterly
  'painting': ['detail', 'digital', 'engraving', 'erasure'], // Painting
  'pale': ['blazing', 'burnt', 'carmine', 'garish', 'loud', 'ochre'], // Pale
  'palette': ['earthen', 'emerald'], // Palette
  'paneled': ['flat', 'minimal', 'plain', 'simple', 'smooth'], // Paneled
  'panelled': ['flat', 'plain', 'smooth'], // Panelled
  'panic': ['calm', 'comfort', 'composure', 'contentment', 'ease', 'peace', 'relaxation', 'serenity', 'tranquility'], // panic
  'panorama': ['glimpse'], // Panorama
  'paper': ['fabric', 'glass', 'metal', 'plastic', 'stone'], // Paper
  'paper-craft': ['digital', 'photographic'], // Paper-craft
  'paperlike': ['metallic', 'plastic'], // Paperlike
  'paradox': ['certainty', 'clarity', 'coherence', 'consistency', 'logic', 'order', 'simplicity', 'truth', 'uniformity'], // Paradox
  'parallax': ['flat', 'static', 'uniform'], // Parallax
  'parametric': ['chaotic', 'fixed', 'random', 'rigid', 'simple'], // Parametric
  'parched': ['juiciness'], // Parched
  'part': ['whole'], // Part
  'partial': ['absolute', 'cast', 'complete', 'entire', 'full', 'full-realization', 'solid', 'total', 'unified', 'whole'], // Partial
  'partiality': ['objectivity'], // Partiality
  'participation': ['apathy', 'detachment', 'disengagement', 'disinterest', 'indifference', 'isolation', 'neglect', 'passivity', 'rejection'], // participation
  'particle': ['mass', 'unity', 'whole'], // Particle
  'particulate': ['flat', 'homogeneous', 'monolithic', 'smooth', 'uniform'], // Particulate
  'passage': ['closure', 'stasis', 'stillness'], // Passage
  'passenger': ['freight'], // Passenger
  'passion': ['apathy', 'boredom', 'coldness', 'detachment', 'disinterest', 'impression', 'indifference', 'monotony', 'passivity', 'stagnation'], // Passion
  'passionate': ['apathetic', 'disinterested', 'disjoint', 'dispassionate', 'downcast', 'resigned', 'stoic'], // Passionate
  'passive': ['activating', 'active', 'activity', 'aggressive', 'assertive', 'catalyst', 'defiant', 'driven', 'dynamic', 'energetic', 'engaged', 'forceful', 'gym', 'involvement', 'present', 'propulsive', 'reactive', 'rebel', 'statement', 'vibrant'], // passive
  'passivity': ['action', 'activity', 'agency', 'assertion', 'assertiveness', 'drive', 'engagement', 'gesture', 'initiative', 'participation', 'passion', 'stimulation'], // passivity
  'past': ['advance', 'develop', 'emerge', 'future', 'live', 'now', 'present', 'progress', 'retrofuturism'], // past
  'pastel': ['carmine', 'cool', 'coolness', 'neon', 'vibrant'], // Pastel
  'pastoral': ['chaotic', 'harsh', 'industrial', 'sterile', 'urban'], // Pastoral
  'path': ['deadend', 'obstacle'], // Path
  'pathway': ['deadend', 'disorder', 'dispersal', 'obstacle', 'obstruction'], // Pathway
  'patina': ['bright', 'clean', 'fresh', 'new', 'plain', 'shiny', 'smooth', 'solid'], // Patina
  'pattern': ['chaos', 'disorder', 'randomness', 'simplicity', 'uniformity'], // Pattern
  'pause': ['day', 'premium', 'repeat', 'rush', 'trajectory', 'velocity', 'voyage'], // Pause
  'paused': ['active', 'busy', 'dynamic', 'intense', 'loud', 'moving', 'scrolling', 'urgent', 'vibrant'], // paused
  'payments': ['barter', 'chaos', 'debt', 'disorder', 'donation', 'failure', 'free', 'loss', 'non-monetary', 'poverty', 'receipts', 'void'], // Payments
  'peace': ['agitation', 'agony', 'chaotic', 'conflict', 'confront', 'din', 'energetic', 'fear', 'heavy', 'panic', 'playful', 'scream', 'shouting', 'storm', 'stress', 'strife', 'struggle', 'torment', 'turbulence', 'turmoil', 'war'], // Peace
  'peaceful': ['aggressive', 'agitated', 'anxious', 'blaring', 'blasts', 'boisterous', 'chaotic', 'dystopic', 'energetic', 'erupt', 'explosive', 'feral', 'frantic', 'frenzied', 'harsh', 'heated', 'heavy', 'joy', 'raucous', 'screaming', 'strenuous', 'uneasy', 'unruly', 'unsettled'], // Peaceful
  'peak': ['absence', 'base', 'bottom', 'decline', 'dip', 'drop', 'loss', 'lower', 'pit', 'void'], // Peak
  'peculiar': ['normalcy'], // Peculiar
  'pedestrian': ['automotive', 'bold', 'distinct', 'dynamic', 'exceptional', 'extraordinary', 'innovative', 'motorsport', 'unique', 'vibrant'], // pedestrian
  'penalties': ['rewards'], // penalties
  'penalty': ['rewards'], // Penalty
  'penetration': ['detachment', 'exclusion', 'rejection', 'separation', 'shield', 'withdrawal'], // Penetration
  'perceived-weakness': ['might', 'valor'], // Perceived-Weakness
  'perception': ['blindness', 'ignorance', 'illusion', 'reality'], // Perception
  'perceptive': ['clumsy', 'distracted', 'ignorant', 'numb', 'oblivious', 'unaware'], // Perceptive
  'perfect': ['basic', 'chaotic', 'distressed', 'dull', 'flawed', 'glitch', 'imperfect', 'messy', 'rough', 'scratched', 'subpar'], // Perfect
  'perfection': ['flaw', 'glitch', 'imperfection'], // Perfection
  'perforated': ['dense', 'solid'], // Perforated
  'performative': ['introverted', 'invisible', 'minimal', 'reserved', 'static', 'subdued'], // Performative
  'peril': ['ehs'], // Peril
  'peripheral': ['central', 'centric', 'certain', 'dominant', 'exclusive', 'focused', 'main', 'primary', 'singular'], // Peripheral
  'periphery': ['centrality', 'core', 'nucleus'], // Periphery
  'perishable': ['eternal'], // Perishable
  'permanence': ['closing', 'flux', 'impermanence', 'liminality', 'transience'], // Permanence
  'permanent': ['changeable', 'disposable', 'ephemeral', 'evanescent', 'fleeting', 'folding', 'mutable', 'tangential', 'temporary', 'transient', 'unstable'], // permanent
  'perpetual': ['brief', 'ephemeral', 'finite', 'fleeting', 'momentary', 'temporary', 'transient', 'transitory-experience', 'volatile'], // Perpetual
  'perpetuity': ['ephemerality', 'finite', 'fleeting', 'momentary', 'mortality', 'temporary', 'transience', 'unstable', 'vanishing'], // perpetuity
  'persist': ['resign'], // Persist
  'persistence': ['ephemerality', 'instability', 'suddenness', 'transience'], // Persistence
  'personable': ['faceless'], // Personable
  'personal': ['external', 'impersonal', 'interstitial', 'massproduced'], // Personal
  'personalcare': ['automotive', 'industrial'], // PersonalCare
  'personalization': ['premium'], // Personalization
  'personalized': ['basic', 'bland', 'common', 'generic', 'impersonal', 'mundane', 'standard', 'uniform'], // Personalized
  'perspective': ['editorial', 'harmony'], // Perspective
  'pessimism': ['hope', 'hopeful', 'joy', 'light', 'optimism'], // pessimism
  'pessimistic': ['bright', 'cheerful', 'hopeful', 'joyful', 'light', 'optimistic', 'positive', 'upbeat'], // pessimistic
  'petcare': ['motherhood'], // petcare
  'petite': ['bulky', 'grand', 'heavy', 'large', 'massive', 'monumental', 'oversized'], // Petite
  'petiteness': ['amplitude', 'bigness', 'bulk', 'expansiveness', 'grandeur', 'immensity', 'mass', 'vastness'], // petiteness
  'petty': ['cosmic', 'elevated', 'grand', 'important', 'meaningful', 'noble', 'significant', 'valuable', 'vast'], // petty
  'pharmaceutical': ['food', 'technology'], // Pharmaceutical
  'philanthropy': ['exploitation', 'premium', 'selfish'], // Philanthropy
  'phony': ['genuine'], // Phony
  'phosphor': ['bland', 'dark', 'dead', 'dim', 'dull', 'flat', 'matt', 'opaque', 'unlit'], // Phosphor
  'photographic': ['brushstroke', 'paper-craft'], // Photographic
  'photography': ['cinematography', 'compositing'], // Photography
  'photoreal': ['illustration', 'impression', 'led'], // Photoreal
  'photorealistic': ['illustration', 'led'], // Photorealistic
  'physical': ['behavioral', 'e-commerce', 'ecommerce', 'metaverse', 'spirit', 'virtual', 'xr'], // Physical
  'physicality': ['intangible', 'virtualization'], // Physicality
  'pictorial': ['abstract', 'conceptual', 'data-driven', 'textual'], // Pictorial
  'piece': ['whole'], // Piece
  'pillow': ['cold', 'hard', 'rough', 'stiff', 'uncomfortable'], // Pillow
  'pinnacle': ['base', 'decline', 'descent'], // Pinnacle
  'pit': ['apex', 'peak', 'vertex'], // Pit
  'pixel': ['continuous', 'fluid', 'organic', 'smooth', 'vector', 'vector-graphics'], // Pixel
  'pixelated': ['continuous', 'fluid', 'polished', 'refined', 'smooth'], // Pixelated
  'pixelation': ['clarity', 'clear', 'defined', 'detail', 'detailed', 'fluid', 'polished', 'realism', 'realistic', 'sharp', 'smooth', 'smoothness'], // Pixelation
  'plain': ['accent', 'adorned', 'apex', 'bold', 'bump', 'bumpy', 'caps', 'checkered', 'chiaroscuro', 'colorful', 'complex', 'cosmetics', 'crowned', 'dazzling', 'decorated', 'dynamic', 'elaborate', 'emblematic', 'embossing', 'excess', 'excessive', 'exotic', 'figurative', 'flamboyant', 'flashy', 'garnish', 'gaudy', 'graded', 'ignited', 'indulgent', 'labyrinthine', 'lavish', 'lively', 'multi', 'murals', 'ornamental', 'ornate', 'overwrought', 'paneled', 'panelled', 'patina', 'plump', 'relief', 'rich', 'scaly', 'speckled', 'statement', 'sticker', 'strange', 'sweet', 'symbolic', 'textural', 'textured', 'twisted', 'unique', 'variant', 'veiled', 'vibrant', 'wave', 'wavy', 'woven', 'wrought', 'yielding'], // Plain
  'plains': ['jungle'], // plains
  'planar': ['3d', 'curved', 'cylindrical', 'dimensional', 'layered', 'spherical', 'textured', 'voluminous'], // Planar
  'plane': ['arch', 'cylinder', 'dome', 'dot', 'sphere'], // Plane
  'planetary': ['finite', 'grounded', 'local', 'static', 'terrestrial'], // Planetary
  'planned': ['chaotic', 'disordered', 'fumbled', 'haphazard', 'improvised', 'impulsive', 'postlude', 'random', 'spontaneity', 'spontaneous', 'unplanned', 'unpredictable'], // Planned
  'planning': ['chaos', 'disorder', 'improvisation', 'randomness', 'spontaneity'], // Planning
  'plasma': ['calm', 'dense', 'fixed', 'quiet', 'solid', 'stable', 'static', 'still'], // Plasma
  'plastic': ['cardboard', 'ceramic', 'flesh', 'leather', 'natural', 'organic', 'paper', 'paperlike', 'stone', 'textile', 'wood'], // Plastic
  'play': ['dramatic', 'duotone', 'serious'], // Play
  'playful': ['awe', 'corporate', 'cumbersome', 'gothic', 'hope', 'melancholy', 'nostalgia', 'peace', 'ponderous', 'professional', 'serenity', 'serious', 'shy', 'solemn', 'stern', 'stiff', 'wonder'], // Playful
  'playfulness': ['drudgery', 'gravitas'], // Playfulness
  'pleasant': ['arduous', 'bland', 'challenging', 'chaotic', 'dull', 'gloomy', 'harsh', 'jarring', 'repelling-hues', 'ugly', 'unpleasant'], // Pleasant
  'pleased': ['annoyed', 'bored', 'discontent', 'displeased', 'dissatisfied', 'frustrated', 'sad', 'unhappy'], // pleased
  'pleasure': ['anguish', 'aversion', 'burden', 'displeasure', 'dissatisfaction', 'frustration', 'misery', 'pain', 'sorrow'], // Pleasure
  'plentiful': ['meager', 'rare'], // Plentiful
  'plenty': ['depletion', 'hunger', 'lack', 'scarcity', 'starve'], // Plenty
  'plummet': ['ascend', 'climb', 'elevate', 'elevation', 'float', 'gain', 'increase', 'rise', 'soar', 'surge'], // plummet
  'plump': ['bare', 'dry', 'flat', 'lean', 'plain', 'skeletal', 'slim', 'smooth', 'thin'], // plump
  'plunge': ['ascend', 'elevate', 'expand', 'float', 'hover', 'lift', 'lighten', 'rise'], // Plunge
  'plural': ['singular'], // Plural
  'plurality': ['simplicity', 'singularity', 'uniformity'], // Plurality
  'plush': ['abrasive', 'coarse', 'harsh', 'rough', 'stiff'], // Plush
  'podiatry': ['orthodontics'], // Podiatry
  'poetic': ['brutal', 'cluttered', 'disorder'], // Poetic
  'point': ['absence', 'blob', 'chaos', 'circle', 'disperse', 'gap', 'mass', 'spread', 'void'], // point
  'pointed': ['blunt', 'circular', 'flat', 'round', 'rounded', 'smooth', 'soft', 'wide'], // pointed
  'pointless': ['effective', 'essential', 'functional', 'impactful', 'meaningful', 'purposeful', 'significant', 'utility-driven', 'valuable'], // Pointless
  'poise': ['awkwardness'], // Poise
  'poised': ['heavy', 'shaky'], // Poised
  'polish': ['editorial', 'harmony'], // Polish
  'polished': ['amateur', 'awkward', 'brushed', 'brushstroke', 'brushwork', 'chipped', 'clumsy', 'coarse', 'corrugated', 'cracked', 'craggy', 'crude', 'dirt', 'disheveled', 'distress', 'distressed', 'dust', 'flawed', 'frumpy', 'grained', 'grime', 'grotesque', 'grungy', 'janky', 'matt', 'pixelated', 'pixelation', 'pulp', 'ragged', 'rocky', 'roughness', 'rudimentary', 'rugged', 'rusty', 'scrappy', 'scratched', 'shabby', 'shaky', 'sloppy', 'splotchy', 'tacky', 'tarnished', 'vulgar'], // Polished
  'polite': ['cheeky', 'rude'], // Polite
  'pollute': ['eco-tech'], // Pollute
  'polluted': ['clean', 'clear', 'fresh', 'natural', 'organic', 'pristine', 'pure', 'purity', 'untouched'], // polluted
  'polluting': ['eco-friendly', 'eco-tech'], // Polluting
  'pollution': ['clarity', 'cleansing', 'ecology', 'freshness', 'harmony', 'nature', 'purity', 'serenity', 'vitality', 'wholeness'], // pollution
  'poly': ['mono', 'simple', 'single', 'uniform'], // Poly
  'polygon': ['chaos', 'curve', 'fluid'], // Polygon
  'polygonal': ['cylindrical'], // polygonal
  'polyhedron': ['line', 'surface', 'void'], // Polyhedron
  'ponderous': ['breezy', 'dynamic', 'light', 'playful', 'swift', 'vibrant'], // Ponderous
  'poor': ['fertile', 'healthy'], // Poor
  'pop': ['earthen', 'emerald', 'jazz'], // Pop
  'pop-art': ['classicism', 'realism'], // Pop-Art
  'pop-culture': ['classical', 'subculture', 'traditional'], // Pop-Culture
  'popular': ['indie'], // Popular
  'popularity': ['scholarship'], // Popularity
  'populated': ['vacancy'], // Populated
  'porous': ['compact', 'dense', 'filled', 'impermeable', 'opaque', 'rigid', 'solid', 'stiff', 'thick', 'tight'], // Porous
  'portal': ['barrier', 'closure', 'limit'], // Portal
  'portfolio': ['composition', 'contrast', 'flaw', 'mess'], // Portfolio
  'portrait': ['editorial', 'harmony'], // Portrait
  'positive': ['bleak', 'dark', 'discourage', 'doubtful', 'dystopic', 'gloomy', 'negative', 'pessimistic', 'sad'], // Positive
  'possibility': ['certainty', 'finality', 'limitation'], // Possibility
  'post-process': ['immediate', 'natural', 'raw', 'simple', 'unrefined'], // Post-Process
  'postal': ['digital', 'electronic', 'online'], // Postal
  'postdigital': ['analog', 'manual', 'simple', 'static', 'traditional'], // Postdigital
  'posthuman': ['premium'], // Posthuman
  'postlude': ['calm', 'clarity', 'consistent', 'controlled', 'exact', 'planned', 'prelude', 'stable'], // Postlude
  'postmodernism': ['classicism', 'coherent', 'minimalism', 'modernism'], // Postmodernism
  'potency': ['heavy', 'impotence', 'vacancy', 'weakness'], // Potency
  'potential': ['failure', 'limitation', 'stagnation'], // Potential
  'poverty': ['abundance', 'affluence', 'bounty', 'finance', 'payments', 'profit', 'prosperity', 'richness', 'wealth', 'winery'], // Poverty
  'powder': ['coarse', 'dense', 'liquid', 'smooth', 'solid'], // Powder
  'power': ['impotence', 'ineffectiveness', 'powerlessness', 'submissiveness', 'vulnerability', 'weakness'], // Power
  'powerful': ['cool', 'gentle', 'weak'], // Powerful
  'powerless': ['empowering', 'strength'], // Powerless
  'powerlessness': ['power'], // powerlessness
  'practical': ['abstract', 'ambiguous', 'chaotic', 'conceptual', 'disordered', 'fanciful', 'fashion', 'imaginary', 'impractical', 'ineffective', 'interstitial', 'irrational', 'random', 'theoretical', 'vague', 'wasteful'], // Practical
  'practical-function': ['useless'], // Practical-Function
  'practicality': ['aesthetics'], // Practicality
  'pragmatic': ['naive', 'retrofuturism'], // Pragmatic
  'pragmatic-visuals': ['disorganized', 'illogical'], // Pragmatic-Visuals
  'pragmatism': ['naivety'], // Pragmatism
  'precise': ['blobby', 'blotchy', 'brushstroke', 'careless', 'doodle', 'freestyle', 'fumbled', 'fuzzy', 'haphazard', 'hazy', 'illiterate', 'imprecise', 'improvised', 'messy', 'nebulous', 'regress', 'scrawl', 'sloppy', 'smeared', 'splat', 'unfocused', 'vague'], // Precise
  'precision': ['blurb', 'fuzz', 'impression', 'impressionist', 'mismatch', 'muddle', 'scribble', 'sloppiness'], // Precision
  'predefined': ['chaotic', 'flexible', 'fluid', 'generative', 'improvised', 'open', 'random', 'spontaneous', 'variable'], // Predefined
  'predetermined': ['chaotic', 'fluid', 'free', 'instinct', 'open', 'random', 'spontaneous', 'unpredictable', 'variable'], // predetermined
  'predictability': ['anomaly', 'fluke', 'idiosyncrasy', 'risk', 'whirlwind'], // Predictability
  'predictable': ['adventurous', 'chaotic', 'dragged', 'eclectic', 'erratic', 'exotic', 'exploratory', 'fickle', 'inventive', 'offbeat', 'random', 'reactive', 'spontaneous', 'squiggly', 'subjective', 'surprise', 'surprising', 'uncommon', 'unhinged', 'unplanned', 'unpredictable', 'unreliable', 'unusual', 'variable', 'volatile', 'wild'], // Predictable
  'prelude': ['closure', 'coda', 'conclusion', 'end', 'endgame', 'finale', 'postlude'], // Prelude
  'premeditated': ['careless', 'chaotic', 'haphazard', 'impromptu-display', 'impulsive', 'random', 'spontaneous', 'unplanned'], // Premeditated
  'premiere': ['finale'], // Premiere
  'premium': ['accessible', 'adaptation', 'anonymity', 'anonymous', 'authorship', 'automation', 'avatar', 'awareness', 'bespoke', 'biophilia', 'care', 'cheap', 'chronicle', 'cognition', 'communal', 'communication', 'community', 'computing', 'connectivity', 'conscientious', 'convenience', 'critique', 'culture', 'curatorial', 'data', 'digitization', 'domestic', 'ecology', 'escapism', 'european', 'gathering', 'heritage', 'hidden', 'icon', 'immersion', 'inclusion', 'independence', 'individualism', 'influence', 'infrastructure', 'isolation', 'knowledge', 'language', 'literacy', 'local', 'lore', 'low', 'naturalism', 'neurodiversity', 'novelty', 'pause', 'personalization', 'philanthropy', 'posthuman', 'privacy', 'readiness', 'refinement', 'representation', 'scrappy', 'status', 'subversion', 'surveillance', 'survival', 'sustain', 'sustainability', 'synergy', 'technology', 'text', 'utility', 'visibility', 'wanderlust', 'welfare'], // Premium
  'presence': ['abandon', 'abandonment', 'absence', 'closing', 'detachment', 'diminution', 'disappear', 'disembodied', 'disembodiment', 'disempowerment', 'disorder', 'distrust', 'erasure', 'escape', 'fleeing', 'nonexist', 'nullity', 'obliteration', 'oblivion', 'remnant', 'vacuum', 'virtualization', 'void'], // Presence
  'present': ['absence', 'absent', 'disappear', 'distant', 'erased', 'expire', 'forget', 'forgotten', 'hidden', 'loss', 'lost', 'neglect', 'nostalgia', 'nowhere', 'oblivious', 'passive', 'past', 'shadow', 'unknown', 'vacant', 'void'], // present
  'presented': ['disregarded'], // Presented
  'presentism': ['historical'], // Presentism
  'preservation': ['abandonment', 'destruction', 'deterioration', 'dispersal', 'neglect'], // Preservation
  'preserve': ['deconstruct', 'destroy', 'discard', 'disperse', 'dissolve', 'erode'], // Preserve
  'pressure': ['absence', 'breeze', 'clarity', 'emptiness', 'flow', 'freedom', 'lightness', 'release', 'relief', 'smooth'], // pressure
  'prestige': ['awkwardness', 'base', 'cluttered', 'crude', 'disorder', 'inferior'], // Prestige
  'pretend': ['real'], // Pretend
  'pretense': ['authenticity', 'sincerity'], // Pretense
  'pretentious': ['authentic', 'casual', 'casual-chic', 'genuine', 'humble', 'modest', 'natural', 'simple', 'unassuming'], // pretentious
  'pride': ['shame'], // Pride
  'primal': ['artificial', 'cultivated', 'refined', 'sophisticated', 'synthetic'], // Primal
  'primary': ['earthen', 'emerald', 'peripheral', 'tangential'], // Primary
  'prime': ['basic', 'chaotic', 'common', 'flawed', 'footer', 'imprecise', 'inferior', 'messy', 'random'], // Prime
  'primitive': ['academia', 'advanced', 'automotive', 'cgi', 'complex', 'cybernetic', 'engineered', 'innovative', 'modern', 'refined', 'sophisticated', 'techno-futurism', 'technographic', 'techwear'], // primitive
  'principle': ['ambiguity', 'anarchy', 'chaos', 'disorder', 'fluke', 'fumble', 'randomness'], // Principle
  'print': ['signage'], // print
  'printed': ['handwritten'], // printed
  'prison': ['freeness'], // Prison
  'pristine': ['cluttered', 'crude', 'disheveled', 'disorder', 'distress', 'distressed', 'excessive', 'flawed', 'polluted', 'scrappy', 'shabby', 'tainted', 'tarnished', 'worn'], // Pristine
  'privacy': ['premium', 'publicity'], // Privacy
  'private': ['accessible', 'common', 'exhibition', 'exposed', 'external', 'global', 'open', 'public', 'publishing', 'shared', 'transparent', 'visible'], // Private
  'privilege': ['deprivation', 'disadvantage', 'exclusion', 'marginalization', 'need', 'neglect'], // Privilege
  'pro': ['anti'], // Pro
  'problems': ['solutions'], // Problems
  'procedural': ['arbitrary', 'chaotic', 'disordered', 'haphazard', 'improvised', 'random', 'spontaneous', 'unstructured'], // Procedural
  'process': ['illustration', 'led'], // Process
  'processed': ['healthy'], // Processed
  'procrastination': ['productivity'], // procrastination
  'produce': ['consume', 'deficit', 'destruction', 'drought', 'failure', 'loss', 'neglect', 'scarcity', 'waste'], // Produce
  'product': ['composition', 'contrast'], // Product
  'product-centric': ['user-centric'], // Product-Centric
  'production': ['consumption'], // Production
  'productive': ['laziness', 'slacker'], // Productive
  'productivity': ['chaos', 'disorder', 'idleness', 'inefficiency', 'procrastination', 'slacker'], // Productivity
  'professional': ['amateur', 'edutainment', 'gamification', 'gaming', 'playful', 'wellbeing'], // Professional
  'profit': ['debt', 'deficit', 'drought', 'failure', 'loss', 'non-profit', 'nonprofit', 'poverty', 'scarcity', 'waste'], // Profit
  'profit-driven': ['disregarded', 'unvalued'], // Profit-Driven
  'profound': ['frivolous', 'shallow', 'superficial', 'trivial'], // Profound
  'progress': ['backward', 'deadend', 'decline', 'halt', 'past', 'regress', 'regression', 'stagnation', 'stuck'], // Progress
  'progression': ['regression'], // Progression
  'project': ['muffle'], // Project
  'projection': ['illustration', 'led', 'reflection', 'retreat'], // Projection
  'proliferation': ['reduction'], // Proliferation
  'prolonged': ['immediate'], // prolonged
  'prominence': ['insignificance'], // Prominence
  'prominent': ['insignificant'], // Prominent
  'promote': ['hinder'], // Promote
  'promotion': ['disregard', 'neglect', 'recession', 'silence', 'suppression'], // Promotion
  'prompt': ['delay', 'delayed'], // Prompt
  'proportion': ['asymmetry', 'chaos', 'clutter', 'disorder', 'excess'], // Proportion
  'propulsive': ['dull', 'heavy', 'languid', 'mundane', 'ordinary', 'passive', 'simple', 'slow', 'stagnant', 'static'], // Propulsive
  'prosper': ['wilt', 'wither'], // Prosper
  'prospering': ['withering'], // Prospering
  'prosperity': ['blight', 'decline', 'deprivation', 'despair', 'deterioration', 'failure', 'fall', 'inferior', 'loss', 'misfortune', 'poverty', 'ruin', 'sorrow', 'struggle'], // Prosperity
  'prosthetics': ['natural', 'unassisted'], // Prosthetics
  'protected': ['tarnished', 'vulnerable'], // Protected
  'protection': ['abandonment', 'exposure', 'neglect', 'risk', 'vulnerability'], // Protection
  'provocative': ['bland', 'mundane', 'ordinary', 'reserved', 'subdued'], // Provocative
  'proximity': ['distance'], // Proximity
  'prudence': ['heavy'], // Prudence
  'prudent': ['foolish'], // Prudent
  'psyche': ['body', 'fleshless', 'form', 'husk', 'matter', 'shell'], // Psyche
  'psychedelic': ['conservative', 'minimalist'], // Psychedelic
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
  'purposeful': ['aimless', 'futile', 'pointless', 'useless', 'wasteful', 'worthless'], // Purposeful
  'pursue': ['retreat'], // Pursue
  'pursuit': ['abandon', 'idleness', 'rest', 'stagnation'], // Pursuit
  'pyramid': ['chaos', 'disperse', 'flat', 'sphere', 'void'], // Pyramid
  'qualitative': ['analytics'], // Qualitative
  'quench': ['ignite'], // Quench
  'quenched': ['thirst'], // Quenched
  'quest': ['apathy', 'completion', 'conformity', 'stagnation', 'surrender'], // Quest
  'quick': ['lengthy', 'lingering', 'slow'], // Quick
  'quickness': ['slowness'], // Quickness
  'quiet': ['activating', 'agitation', 'amplify', 'arcade', 'blaring', 'blasts', 'blinding', 'boisterous', 'brash', 'bustling', 'buzz', 'clatter', 'din', 'erupt', 'explosive', 'fierce', 'frantic', 'frenzy', 'hover', 'kaleidoscopic', 'liveliness', 'loud', 'motorsport', 'noisy', 'obtrusive', 'overt', 'overwrought', 'plasma', 'racket', 'raucous', 'restless', 'screaming', 'shouted', 'shouting', 'shouts', 'splash', 'strident', 'tense', 'thunders', 'unleash', 'uproarious', 'urban', 'vibration', 'volatile', 'zesty'], // Quiet
  'quietude': ['din', 'racket'], // Quietude
  'racket': ['authentic', 'calm', 'genuine', 'natural', 'order', 'quiet', 'quietude', 'silence', 'simple'], // racket
  'radial': ['axial', 'flat', 'linear', 'static'], // Radial
  'radial-break': ['consolidate'], // Radial-Break
  'radiance': ['blackout', 'darkness', 'dim', 'dimness', 'drab', 'dull', 'eclipse', 'nocturn', 'obscurity', 'shadow'], // Radiance
  'radiant': ['cold', 'desolate', 'dimming', 'dismal', 'drab', 'drain', 'dreary', 'grim', 'stifled', 'withering'], // Radiant
  'radiate': ['wither'], // Radiate
  'ragged': ['clean-cut', 'elegant', 'full', 'neat', 'orderly', 'polished', 'refined', 'rich', 'smooth'], // Ragged
  'rainbow': ['cool', 'coolness'], // Rainbow
  'raise': ['decline', 'decrease', 'diminish', 'drop', 'fall', 'flatness', 'lower', 'reduce', 'sink'], // raise
  'raised': ['depressed', 'dropped', 'flat', 'flat-plane', 'level', 'lowered', 'recessed', 'stagnant', 'sunken'], // raised
  'rambling': ['brevity', 'clear', 'concise', 'focused', 'ordered'], // rambling
  'random': ['align', 'automated', 'axial', 'axis', 'behavioral', 'calculated', 'charted', 'circuit', 'coherent', 'columnar', 'composition', 'concentrated', 'consequence', 'constant', 'context', 'decisive', 'definite', 'deliberate', 'depictive', 'doctrinal', 'exact', 'fixity', 'formed', 'grading', 'labeled', 'level', 'logical', 'method', 'methodical', 'modelling', 'molecular', 'neat', 'ordered', 'outlining', 'parametric', 'planned', 'practical', 'predefined', 'predetermined', 'predictable', 'premeditated', 'prime', 'procedural', 'rational', 'regression', 'regulated', 'repetitive', 'robotics', 'rows', 'scheduled', 'scholarly', 'script', 'sequential', 'serious', 'solidify', 'specific', 'square', 'steadfast', 'storyful', 'strategic', 'structured', 'symbolism', 'symphonic', 'synchronized', 'systematic', 'typecraft', 'uniform'], // Random
  'randomness': ['analytics', 'catalog', 'climate', 'constellation', 'consulting', 'cubism', 'engineering', 'flowchart', 'horology', 'lattice', 'matrix', 'order', 'pattern', 'planning', 'principle', 'purpose', 'synchronicitic', 'synchronicitical', 'synchronicity', 'watchmaking'], // Randomness
  'rapid': ['gradual', 'slow'], // Rapid
  'rare': ['abundant', 'commodity', 'common', 'everyday', 'frequent', 'ordinary', 'plentiful', 'standard', 'typical', 'ubiquitous', 'usual'], // Rare
  'raster': ['vector-graphics'], // raster
  'rational': ['chaotic', 'disorderly', 'emotional', 'emotional-design', 'foolish', 'haphazard', 'impulsive', 'irrational', 'random', 'unpredictable'], // Rational
  'rationality': ['madness'], // rationality
  'raucous': ['calm', 'gentle', 'orderly', 'peaceful', 'quiet', 'serene', 'soft', 'subdued', 'vulnerable-silence'], // raucous
  'raw': ['baked', 'bakery', 'burnished', 'cgi', 'cosmetics', 'cultivated', 'engineered', 'figurative', 'filtered', 'fine', 'glamour', 'glazed', 'post-process', 'publishing', 'shielded', 'staged', 'tame', 'watches', 'wrought'], // Raw
  'reachable': ['ambiguous', 'impossible', 'inaccessible', 'indeterminate', 'remote', 'unattainable', 'unclear', 'unreachable', 'vague'], // Reachable
  'reactive': ['consistent', 'fixed', 'monotonous', 'passive', 'predictable', 'stable', 'static', 'stoic', 'uniform', 'unresponsive'], // Reactive
  'readiness': ['hesitation', 'premium'], // Readiness
  'real': ['artificial', 'avatar', 'deceptive', 'disembodiment', 'fabricated', 'fake', 'false', 'fictional', 'illusory', 'imaginary', 'insincere', 'pretend', 'simulacrum', 'simulated', 'superficial'], // real
  'realism': ['cartoon', 'impressionist', 'metaverse', 'naivety', 'pixelation', 'pop-art', 'stylization', 'surrealism'], // Realism
  'realistic': ['2d', 'dreamlike', 'impractical', 'irrational', 'pixelation', 'vr'], // Realistic
  'reality': ['denial', 'disillusion', 'dream', 'fable', 'facade', 'falsehood', 'fantasy', 'illusion', 'imagination', 'impression', 'myth', 'mythos', 'nonexist', 'perception', 'virtual'], // Reality
  'realm': ['chaos', 'disorder', 'dissolution', 'fragment', 'void'], // Realm
  'reason': ['instinct', 'myth'], // Reason
  'reassurance': ['heavy', 'negation', 'warning'], // Reassurance
  'reassuring': ['anxious', 'chaotic', 'doubtful', 'fearful', 'hostile', 'tense', 'uncertain', 'unstable'], // Reassuring
  'rebel': ['ch-teau-style', 'conformist', 'docile', 'obedient', 'orderly', 'passive', 'submissive', 'traditional', 'uniform'], // Rebel
  'rebellion': ['authority', 'compliance', 'conformity', 'harmony', 'obedience', 'order', 'stability', 'submission'], // Rebellion
  'rebellious': ['compliant', 'heavy', 'obedient'], // Rebellious
  'rebirth': ['death', 'destruction', 'obliteration', 'stagnation'], // Rebirth
  'receipts': ['payments'], // Receipts
  'reception': ['expulsion'], // Reception
  'receptive': ['dismissive'], // Receptive
  'recessed': ['raised'], // Recessed
  'recession': ['promotion'], // Recession
  'reckless': ['calm', 'careful', 'caution', 'cautious', 'discretion', 'orderly'], // reckless
  'recognition': ['anonymity', 'dismissal', 'disregard', 'failure', 'indifference', 'neglect', 'obscurity'], // recognition
  'recognize': ['forget', 'ignore'], // Recognize
  'recognized': ['ignored', 'unvalued'], // Recognized
  'recreation': ['ehs'], // recreation
  'recruitment': ['absence', 'attrition', 'automation', 'disinterest', 'dismissal', 'failure', 'layoffs', 'loss', 'neglect', 'rejection', 'retention', 'withdrawal'], // Recruitment
  'rectangle': ['circle', 'curve', 'fluid', 'organic', 'sphere', 'twist'], // Rectangle
  'rectangular': ['curvilinear', 'curvy', 'fluid', 'organic'], // Rectangular
  'rectilinear': ['asymmetry', 'chaos', 'curvature'], // Rectilinear
  'recyclability': ['disposability', 'exhaustion', 'irreversibility'], // Recyclability
  'redefinition': ['conformity', 'definition', 'obsolescence', 'stagnation'], // Redefinition
  'reduce': ['amplify', 'expand', 'intensify', 'magnify', 'overpower', 'raise', 'scale'], // Reduce
  'reduction': ['abundance', 'accumulation', 'amplification', 'ascension', 'augmentation', 'expansion', 'growth', 'increase', 'intensification', 'proliferation', 'surplus'], // Reduction
  'refine': ['regress'], // Refine
  'refined': ['amateur', 'artless', 'brutal', 'brutalism', 'cheap', 'chipped', 'chunky', 'clumsy', 'clunky', 'coarse', 'crude', 'dirt', 'disheveled', 'distressed', 'dust', 'feral', 'frumpy', 'fussy', 'gaudy', 'grime', 'grotesque', 'grungy', 'imperfect', 'janky', 'kitsch', 'pixelated', 'primal', 'primitive', 'pulp', 'ragged', 'rude', 'rudimentary', 'rugged', 'scrappy', 'scratched', 'shabby', 'sloppy', 'streetwear', 'tacky', 'vulgar'], // Refined
  'refinement': ['awkwardness', 'brutality', 'premium'], // Refinement
  'reflection': ['action', 'engagement', 'projection', 'refraction'], // Reflection
  'reflective': ['blunt', 'heavy', 'matt'], // Reflective
  'reflectivity': ['absorption', 'darkness', 'dullness', 'matte', 'opacity'], // Reflectivity
  'refraction': ['absorption', 'convergence', 'reflection', 'unbroken'], // Refraction
  'refreshed': ['tired'], // Refreshed
  'refreshing': ['draining', 'heavy', 'tiring'], // Refreshing
  'refuse': ['accept', 'adopt', 'yield'], // Refuse
  'refute': ['affirm'], // Refute
  'regard': ['disdain', 'dismiss', 'disregard', 'ignore', 'neglect', 'overlook', 'reject', 'scorn', 'snub'], // Regard
  'regress': ['advance', 'ascend', 'attract', 'elevate', 'evolve', 'expand', 'precise', 'progress', 'refine'], // regress
  'regression': ['advancement', 'chaotic', 'dispersed', 'dynamic', 'evolution', 'fluid', 'fragmented', 'improvement', 'progress', 'progression', 'random', 'unpredictable'], // regression
  'regular': ['uneven'], // Regular
  'regularity': ['anomaly', 'asymmetry'], // Regularity
  'regulated': ['anarchic', 'chaotic', 'disorderly', 'free', 'naturalism', 'random', 'spontaneous', 'unbounded', 'unruly', 'wild'], // regulated
  'regulation': ['anarchy', 'chaos', 'disorder', 'freedom', 'liberty'], // Regulation
  'reinvention': ['conformity', 'repetition', 'stagnation', 'tradition', 'uniformity'], // Reinvention
  'reject': ['accept', 'adopt', 'affirm', 'embrace', 'regard', 'support', 'valuing'], // Reject
  'rejected': ['embraced'], // Rejected
  'rejecting': ['accepting', 'affirm', 'appreciate', 'approval', 'embrace', 'embracing', 'favor', 'support', 'welcome'], // rejecting
  'rejection': ['absorption', 'adoption', 'approval', 'attraction', 'demand', 'favor', 'manifestation', 'participation', 'penetration', 'recruitment'], // Rejection
  'rejuvenation': ['decay', 'depletion', 'exhaustion'], // Rejuvenation
  'relatable': ['abstract', 'alien', 'complex', 'distant', 'unfamiliar'], // Relatable
  'relax': ['heavy'], // Relax
  'relaxation': ['agitation', 'anxiety', 'chaos', 'discomfort', 'friction', 'gym', 'panic', 'strain', 'stress', 'tension', 'turmoil', 'vigilance'], // Relaxation
  'relaxed': ['agitated', 'anxious', 'formality', 'grind', 'harried', 'restless', 'rushed', 'strenuous', 'tense', 'tightened', 'uneasy'], // Relaxed
  'release': ['bind', 'bondage', 'burden', 'captivity', 'confinement', 'constraint', 'constrict', 'containment', 'deprivation', 'envelopment', 'fixation', 'grasp', 'hold', 'lock', 'pressure', 'strain', 'strife', 'stuck', 'suppression'], // Release
  'released': ['bound', 'suppressed'], // Released
  'releasing': ['compressing'], // Releasing
  'relevance': ['arbitrary', 'disorder', 'distraction', 'insignificance', 'irrelevant', 'obsolescence', 'obsolete'], // Relevance
  'relevant': ['irrelevant', 'obsolete'], // Relevant
  'reliability': ['fickle', 'fluke', 'heavy', 'unstable', 'volatile'], // Reliability
  'reliable': ['capricious', 'erratic', 'fickle', 'fraudulent', 'inconsistent', 'unreliable', 'unstable', 'useless', 'volatile'], // Reliable
  'relief': ['flat', 'flatness', 'monotone', 'plain', 'pressure', 'smooth', 'uniform'], // Relief
  'remain': ['abandon', 'cease', 'depart', 'disappear', 'escape', 'exit', 'fade', 'leave', 'vanish'], // remain
  'remarkable': ['insignificant', 'ordinary'], // Remarkable
  'remember': ['forget'], // Remember
  'remembered': ['forgotten'], // Remembered
  'remembering': ['forgetting'], // Remembering
  'remembrance': ['forgetfulness', 'forgetting', 'neglect', 'negligence', 'oblivion'], // Remembrance
  'remnant': ['presence', 'unity', 'whole'], // Remnant
  'remote': ['chaotic', 'disorderly', 'local', 'obtainable', 'reachable', 'uncertain', 'urban'], // remote
  'remoteness': ['closeness'], // Remoteness
  'removal': ['engraving'], // Removal
  'remove': ['engrave'], // Remove
  'render': ['disrupt', 'illustration', 'led'], // Render
  'rendering': ['capture', 'cinematography'], // Rendering
  'renew': ['decay', 'deteriorate', 'expire', 'old', 'spent', 'stagnate', 'used', 'waste', 'worn'], // Renew
  'renewal': ['decay', 'destruction', 'deterioration', 'obsolescence', 'stagnation'], // Renewal
  'renewed': ['tarnished'], // Renewed
  'repair': ['damage', 'destroy', 'destruction'], // Repair
  'repeat': ['break', 'cease', 'disrupt', 'end', 'halt', 'innovate', 'pause', 'stop', 'vary'], // repeat
  'repel': ['manifesting'], // Repel
  'repelled': ['embraced'], // Repelled
  'repellent': ['absorbent', 'appealing', 'attractive', 'bright', 'engaging', 'inviting', 'luminous', 'vibrant', 'welcoming'], // Repellent
  'repelling': ['appealing', 'attracting', 'captivating', 'charming', 'engaging', 'enticing', 'inviting', 'welcoming'], // Repelling
  'repelling-hues': ['attracting', 'pleasant'], // Repelling-Hues
  'repetition': ['disorder', 'diversity', 'invention', 'reinvention', 'singularity', 'uniqueness', 'variation'], // Repetition
  'repetitive': ['diverse', 'dynamic', 'exciting', 'innovative', 'novel', 'random', 'singular', 'spontaneous', 'unique', 'varied', 'variety'], // Repetitive
  'replicate': ['innovate'], // replicate
  'representation': ['disguise', 'premium'], // Representation
  'repulsion': ['attraction'], // Repulsion
  'repulsive': ['alluring', 'attractive', 'captivating'], // Repulsive
  'research': ['marketing'], // Research
  'reserve': ['self-expression'], // Reserve
  'reserved': ['active', 'boisterous', 'bold', 'brash', 'bright', 'chaotic', 'dynamic', 'expressive', 'flamboyant', 'loud', 'overt', 'performative', 'provocative', 'silly', 'vivid'], // Reserved
  'residential': ['boarding', 'commercial', 'hotels', 'industrial', 'logistics', 'office'], // Residential
  'resign': ['accept', 'agree', 'aspire', 'commit', 'embrace', 'join', 'persist', 'support', 'welcome'], // resign
  'resignation': ['ambition', 'anticipation'], // resignation
  'resigned': ['active', 'aspirant', 'assertive', 'determined', 'engaged', 'hopeful', 'joyful', 'passionate', 'vibrant'], // resigned
  'resilience': ['breakdown', 'failure', 'fragility', 'instability', 'vulnerability', 'weakness'], // Resilience
  'resilient': ['brittle', 'delicate', 'fragile', 'sensitive', 'soft', 'unstable', 'vulnerable', 'weak'], // Resilient
  'resist': ['adopt', 'yield'], // Resist
  'resistance': ['acceptance', 'adaptation', 'agreement', 'catalyst', 'compliance', 'conformity', 'obedience', 'submission', 'support', 'unity'], // resistance
  'resistant': ['compliant'], // Resistant
  'resolution': ['suspension'], // resolution
  'resolve': ['ambiguity', 'chaos', 'confusion', 'disorder', 'inconsistency', 'indecision', 'limbo', 'uncertainty', 'vacillation'], // resolve
  'resolved': ['ambiguous', 'chaotic', 'conflicted', 'delay', 'delayed', 'disordered', 'fluid', 'indecisive', 'uncertain', 'unfinished-thought', 'unstable', 'vague'], // Resolved
  'resonance': ['cacophony', 'cluttered', 'detached', 'disorder', 'dispersal'], // Resonance
  'resource': ['waste'], // Resource
  'resourceful': ['wasteful'], // Resourceful
  'respect': ['apathy', 'contempt', 'dismissal', 'disregard', 'disrespect', 'hatred', 'indifference', 'mockery', 'neglect', 'ridicule', 'scorn'], // respect
  'respectful': ['cheeky', 'irreverent', 'rude'], // Respectful
  'responsibility': ['childhood'], // Responsibility
  'responsive': ['apathetic', 'complacent', 'fixed', 'inflexible', 'rigid', 'serif', 'stagnant', 'static', 'unmoved'], // Responsive
  'rest': ['action', 'active', 'agitation', 'busy', 'chaotic', 'day', 'drive', 'energetic', 'force', 'grind', 'gym', 'hustle', 'pursuit', 'rush', 'stimulation', 'trajectory', 'voyage', 'work'], // rest
  'restaurant': ['catering'], // Restaurant
  'restless': ['calm', 'content', 'contented', 'focused', 'limited', 'quiet', 'relaxed', 'settled', 'static'], // restless
  'restlessness': ['composure'], // Restlessness
  'restore': ['break', 'damage', 'destroy', 'erode', 'harm', 'tear'], // Restore
  'restrain': ['unleash'], // Restrain
  'restrained': ['camp', 'chaotic', 'exuberant', 'flexible', 'free', 'loose', 'spontaneous', 'uninhibited', 'wild'], // restrained
  'restraint': ['chaos', 'exaggeration', 'excess', 'exuberance', 'freedom', 'levity', 'temptation'], // Restraint
  'restrict': ['emit', 'expand', 'innovate', 'overflow'], // Restrict
  'restricted': ['blockchain', 'boundless', 'flexible', 'free', 'global', 'limitless', 'open', 'spontaneous', 'unbound', 'unbounded', 'uninterrupted', 'unrestricted', 'untamed'], // Restricted
  'restricting': ['empowering', 'unfolding'], // Restricting
  'restriction': ['access', 'chaos', 'expansion', 'expansive-freedom', 'flexibility', 'freedom', 'freeness', 'liberation', 'liberty', 'openness', 'opportunity', 'self-expression', 'vastness'], // restriction
  'restrictive': ['endless', 'ergonomic', 'expansive', 'flexible', 'fluid', 'free', 'loose', 'open', 'unbound', 'unrestricted'], // restrictive
  'retail': ['catering', 'hotels', 'manufacturing', 'museum'], // Retail
  'retain': ['discard', 'forget'], // Retain
  'retention': ['emission', 'recruitment'], // Retention
  'retirement': ['gym'], // Retirement
  'retouching': ['flawed', 'illustration', 'led', 'untamed'], // Retouching
  'retreat': ['advance', 'assert', 'attack', 'charge', 'confront', 'engage', 'invade', 'projection', 'pursue'], // Retreat
  'retro': ['forward', 'futuristic', 'heavy', 'modern', 'neo-grotesque', 'techno-futurism', 'techno-futurist'], // Retro
  'retrofuture': ['youth'], // Retrofuture
  'retrofuturism': ['actual', 'avant-garde', 'basic', 'classic', 'contemporary', 'mundane', 'ordinary', 'past', 'pragmatic', 'simple', 'static', 'traditional'], // Retrofuturism
  'retrogression': ['advancement'], // retrogression
  'reveal': ['disguise', 'envelop', 'evade', 'hide', 'muffle', 'shield', 'shroud'], // Reveal
  'revealed': ['concealed', 'covered', 'covert', 'curtained', 'guarded', 'masked', 'sealed', 'shrouded', 'veiled'], // Revealed
  'revealing': ['concealing', 'hiding', 'obscuring', 'suppressing', 'veiling', 'withholding'], // Revealing
  'revelation': ['ambiguity', 'concealment', 'ignorance', 'mystery', 'obscurity', 'veiling'], // Revelation
  'reverence': ['heavy', 'ridicule', 'scorn'], // Reverence
  'reverent': ['irreverent'], // Reverent
  'revival': ['deterioration'], // Revival
  'revolutionary': ['conventional', 'traditional'], // Revolutionary
  'rewards': ['cost', 'fines', 'penalties', 'penalty'], // Rewards
  'rhythm': ['chaos', 'silence', 'stasis'], // Rhythm
  'rich': ['barren', 'bland', 'bleak', 'drab', 'drain', 'drained', 'dry', 'dull', 'empty', 'foul', 'insipid', 'meager', 'null', 'plain', 'ragged', 'shallow', 'skeletal', 'starve', 'sterile', 'superficial', 'trivial', 'weak'], // Rich
  'richness': ['barren', 'bland', 'bleakness', 'chaos', 'depletion', 'dullness', 'emptiness', 'flattening', 'fleshless', 'hunger', 'husk', 'lack', 'poverty', 'scarcity', 'simple', 'sparsity', 'void'], // Richness
  'ridicule': ['acceptance', 'admiration', 'celebration', 'kindness', 'respect', 'reverence', 'support', 'understanding', 'validation'], // ridicule
  'right': ['corrupt'], // Right
  'rigid': ['amorphous', 'aqueous', 'biomorphic', 'bistro', 'coil', 'curvilinear', 'curvy', 'fable', 'fabric', 'flex', 'freeform', 'freestyle', 'groovy', 'humanist', 'informal', 'liquid', 'loose', 'loosen', 'malleable', 'mobile', 'mobility', 'morph', 'mutable', 'neumorphic', 'parametric', 'porous', 'responsive', 'serpentine', 'skillful', 'slack', 'spiral', 'stackability', 'stackable', 'supple', 'tubular', 'twist', 'undulating', 'undulation', 'wave', 'wavy', 'wobbly', 'woven', 'yielding'], // Rigid
  'rigidity': ['adaptability', 'creativity', 'flexibility', 'lifestyle'], // Rigidity
  'ripple': ['flatness', 'stagnation', 'stillness'], // Ripple
  'rise': ['deadend', 'decline', 'decrease', 'descend', 'descent', 'diminish', 'down', 'drop', 'drown', 'end', 'fall', 'flatten', 'low', 'lower', 'plummet', 'plunge', 'sink', 'slump', 'stop'], // Rise
  'risk': ['assurance', 'calm', 'certainty', 'control', 'insurance', 'normalcy', 'predictability', 'protection', 'safety', 'security', 'stability'], // Risk
  'ritual': ['chaos', 'freedom', 'spontaneity'], // Ritual
  'roars': ['calm', 'mundane', 'ordinary', 'whispers'], // Roars
  'robotic': ['chaotic', 'fluid', 'human', 'humanist', 'natural', 'organic', 'soft', 'spontaneous', 'warm'], // Robotic
  'robotics': ['biological', 'chaotic', 'craft', 'human', 'manual', 'natural', 'organic', 'random', 'simple', 'slow', 'unstructured'], // Robotics
  'robust': ['brittle', 'doubtful', 'fragile', 'insecure', 'lightweight', 'shaky', 'uncertain', 'unstable', 'vulnerable', 'weak'], // Robust
  'robustness': ['fragility'], // robustness
  'rocky': ['fluid', 'polished', 'sleek', 'smooth', 'soft'], // Rocky
  'role': ['gender'], // role
  'romantic': ['brutal', 'clinical', 'cold', 'harsh', 'sterile'], // Romantic
  'root': ['aerial', 'detached', 'drift', 'ephemeral', 'floating', 'loose', 'shallow', 'surface', 'transient'], // root
  'rooted': ['chaotic', 'fluid', 'free', 'loose', 'nomadic', 'shifting', 'transient', 'transit', 'unbound', 'ungrounded', 'vague', 'wild'], // rooted
  'rooting': ['detached', 'detaching', 'dispersing', 'drifting', 'ephemeral', 'floating', 'scattering'], // Rooting
  'roots': ['abstract', 'detachment', 'dispersal', 'future', 'novelty'], // Roots
  'rough': ['aerodynamic', 'cgi', 'cosmetics', 'creamy', 'crisp', 'crystal', 'crystalline', 'figurative', 'fine', 'flawless', 'glassy', 'glazed', 'lustrous', 'marble', 'modelling', 'neat', 'perfect', 'pillow', 'plush', 'seamless', 'sheen', 'shiny', 'silk', 'skincare', 'slick', 'spotless', 'sterile', 'supple', 'sweet', 'velvet'], // Rough
  'roughness': ['calm', 'clear', 'fine', 'gentle', 'polished', 'serene', 'silkiness', 'simple', 'slick', 'smooth', 'smoothness', 'soft'], // Roughness
  'round': ['angular', 'angular-form', 'flat', 'hexagonal', 'jagged', 'linear', 'pointed', 'sharp', 'square', 'uneven'], // round
  'rounded': ['angularity', 'pointed'], // Rounded
  'roundness': ['angular', 'sharpness'], // Roundness
  'routine': ['adventurous', 'anomaly', 'exploratory', 'freetime', 'hobby', 'invention', 'uncommon'], // Routine
  'rows': ['asymmetry', 'chaos', 'disorder', 'fluid', 'irregular', 'random', 'scatter', 'scattered', 'vertical'], // Rows
  'rude': ['courteous', 'gentle', 'gentle-expression', 'gracious', 'kind', 'polite', 'refined', 'respectful'], // Rude
  'rudimentary': ['complex', 'detailed', 'elaborate', 'intricacy', 'intricate', 'nuanced', 'polished', 'refined', 'sophisticated'], // Rudimentary
  'rugged': ['cute', 'delicate', 'polished', 'refined', 'smooth', 'soft'], // Rugged
  'ruin': ['cleanliness', 'creation', 'flourish', 'integrity', 'prosperity', 'purity', 'strength', 'vitality', 'wholeness'], // Ruin
  'rupture': ['climate', 'continuity', 'unity', 'wholeness'], // Rupture
  'rural': ['busy', 'chaotic', 'concrete', 'crowded', 'industrial', 'metropolitan', 'modern', 'urban'], // rural
  'rural-serenity': ['hustle'], // Rural-Serenity
  'rush': ['calm', 'delay', 'leisure', 'pause', 'rest', 'slow', 'slowness', 'still'], // rush
  'rushed': ['calm', 'leisurely-flow', 'relaxed', 'slow', 'steady', 'unhurried'], // rushed
  'rustic': ['high-tech', 'techno', 'techno-futurist', 'technographic', 'techwear'], // Rustic
  'rusty': ['bright', 'clean', 'fresh', 'luminous', 'new', 'polished', 'sheen', 'smooth', 'vibrant'], // rusty
  'saas': ['text'], // Saas
  'sacrifice': ['greed', 'selfcare'], // Sacrifice
  'sad': ['jovial', 'pleased', 'positive'], // Sad
  'sadness': ['euphoria', 'exuberance', 'might'], // Sadness
  'safe': ['adventurous', 'fugitive', 'toxic'], // Safe
  'safety': ['anxiety', 'chaos', 'danger', 'exposure', 'fear', 'risk', 'suspense', 'threat', 'uncertainty', 'vulnerability', 'warning'], // safety
  'sameness': ['adaptability', 'chaos', 'clash', 'contrast', 'customization', 'distinct', 'diversity', 'mismatch', 'variety', 'vivid'], // Sameness
  'sanctuary': ['chaos', 'disorder', 'exile', 'exposure', 'hostility', 'street', 'vulnerability'], // Sanctuary
  'sane': ['anti', 'chaotic', 'confused', 'crazy', 'eerie', 'irrational', 'unhinged'], // sane
  'sanity': ['madness'], // Sanity
  'sans': ['serif'], // sans
  'satiate': ['starve'], // Satiate
  'satiation': ['thirst'], // Satiation
  'satisfaction': ['disapproval', 'disillusion', 'displeasure', 'dissatisfaction', 'frustration', 'hunger', 'thirst', 'yearning'], // Satisfaction
  'satisfied': ['discontent', 'displeased', 'dissatisfied', 'failure', 'pain', 'unhappy'], // satisfied
  'saturated': ['colorless', 'washed'], // Saturated
  'saturating': ['diluting', 'fading'], // Saturating
  'saturation': ['complementary', 'cool', 'depletion', 'drain', 'lack', 'wash'], // Saturation
  'savage': ['calm', 'culture', 'gentle', 'kind', 'soft'], // savage
  'savory': ['bakery', 'confectionery', 'dessert'], // Savory
  'scaffold': ['collapse', 'deconstruct', 'disassemble', 'dismantle', 'disperse'], // Scaffold
  'scale': ['diminish', 'diminutive', 'minimize', 'reduce', 'tiny'], // Scale
  'scaly': ['plain', 'simple', 'sleek', 'smooth', 'soft'], // Scaly
  'scandinavian': ['baroque', 'victorian'], // Scandinavian
  'scarce': ['ubiquitous'], // Scarce
  'scarcity': ['abundance', 'affluence', 'bounty', 'catering', 'excess', 'food', 'fullness', 'materials', 'overflow', 'plenty', 'produce', 'profit', 'richness', 'wealth'], // Scarcity
  'scatter': ['align', 'bubble', 'bundle', 'center', 'cluster', 'consolidate', 'corner', 'gather', 'imprint', 'integrate', 'nucleus', 'rows', 'stack', 'synthesize', 'unite'], // Scatter
  'scatterbrained': ['cerebral', 'clear', 'focused', 'methodical', 'organized'], // scatterbrained
  'scattered': ['aggregate', 'axis', 'centralized', 'clustered', 'coherent', 'concentrated', 'enclosed', 'intact', 'integrated', 'level', 'main', 'monolithic', 'rows', 'sequential', 'unified', 'whole'], // Scattered
  'scattering': ['envelopment', 'rooting'], // Scattering
  'schedule': ['freetime'], // Schedule
  'scheduled': ['chaotic', 'disordered', 'immediate', 'impromptu-gathering', 'irregular', 'random', 'spontaneous', 'unplanned', 'unpredictable'], // Scheduled
  'schematic': ['illustration', 'led', 'tangle'], // Schematic
  'scholarly': ['chaotic', 'dull', 'ignorant', 'informal-knowledge', 'messy', 'random', 'simple'], // scholarly
  'scholarship': ['anarchy', 'chaos', 'confusion', 'disorder', 'ignorance', 'naivety', 'popularity', 'simplicity', 'stupidity', 'superficiality'], // Scholarship
  'scientific': ['artistic', 'chaotic', 'emotional', 'intuitive', 'subjective'], // Scientific
  'scorn': ['admiration', 'affection', 'appreciate', 'approval', 'compassion', 'kindness', 'regard', 'respect', 'reverence', 'support', 'trust', 'veneration'], // scorn
  'scrap': ['cohesive', 'complete', 'defined', 'orderly', 'solid', 'structured', 'whole', 'wholeness'], // scrap
  'scrappy': ['elegant', 'neat', 'orderly', 'polished', 'premium', 'pristine', 'refined', 'sleek', 'smooth'], // scrappy
  'scratched': ['brushed', 'clear', 'intact', 'neat', 'perfect', 'polished', 'refined', 'smooth', 'unblemished'], // Scratched
  'scrawl': ['clear', 'defined', 'focused', 'methodical', 'neat', 'orderly', 'precise', 'structured', 'typeset'], // Scrawl
  'scream': ['calm', 'peace', 'silence', 'whisper'], // scream
  'screaming': ['calm', 'gentle', 'muted', 'peaceful', 'quiet', 'soft', 'subdued', 'subtle-hues', 'whispering'], // Screaming
  'screen': ['centered', 'centrality'], // Screen
  'scribble': ['clarity', 'design', 'font', 'formality', 'neatness', 'order', 'precision', 'structure', 'symmetry'], // Scribble
  'script': ['chaos', 'fluid', 'improv', 'random', 'unscripted'], // Script
  'scroll': ['centralized', 'centric', 'halt', 'hold', 'lock', 'stop'], // Scroll
  'scrolling': ['fibrous', 'fluid', 'glossy', 'grainy', 'halted', 'matte', 'paused', 'stopped'], // Scrolling
  'sculpt': ['destroy', 'disassemble', 'dismantle', 'erase', 'flatten'], // Sculpt
  'sculpted': ['blobby', 'sprawled'], // Sculpted
  'sculpting': ['dissolving', 'erasing', 'flattening', 'obliterating'], // Sculpting
  'sculptural': ['dispersed', 'flat', 'void'], // Sculptural
  'sculpture': ['murals'], // Sculpture
  'seal': ['leak'], // Seal
  'sealed': ['absorbent', 'certain', 'clear', 'exposed', 'free', 'open', 'open-top', 'pure', 'revealed', 'visible'], // Sealed
  'seamless': ['chaotic', 'disjointed', 'fragmented', 'glitch', 'imprecise', 'inconsistent', 'jarring', 'rough', 'segmented', 'uneven'], // Seamless
  'seasons': ['constant', 'eternal', 'static', 'timeless', 'unchanging', 'uniform'], // Seasons
  'seclusion': ['exposure', 'openness'], // seclusion
  'secondary': ['main'], // Secondary
  'secrecy': ['marketing', 'publicity', 'unveiling'], // Secrecy
  'secret': ['public'], // Secret
  'section': ['whole'], // Section
  'secure': ['anxious', 'doubtful', 'heavy', 'leak', 'lost', 'shaky', 'spill', 'uneasy', 'ungrounded', 'unreliable', 'unsettled', 'unstable', 'unsteady', 'vulnerable', 'wavering'], // Secure
  'security': ['doubt', 'risk', 'warning'], // Security
  'sedentary': ['gym'], // Sedentary
  'seed': ['night'], // Seed
  'seen': ['ignored'], // Seen
  'segmented': ['cohesive', 'continuous', 'fluid', 'integrated', 'monolithic', 'seamless', 'smooth', 'solid', 'unified', 'whole'], // Segmented
  'segregated': ['aggregate', 'combined', 'connected', 'harmonious', 'inclusive', 'integrated', 'interconnection', 'unified', 'whole'], // segregated
  'segregation': ['fusion', 'globalization', 'inclusivity', 'togetherness'], // Segregation
  'selection': ['detachment', 'dismiss', 'disorder', 'dispersal', 'distrust'], // Selection
  'self': ['dependence'], // Self
  'self-care': ['apathy', 'neglect'], // Self-care
  'self-expression': ['apathy', 'concealment', 'conformity', 'detachment', 'inhibition', 'reserve', 'restriction', 'silence', 'stagnation', 'suppression', 'uniformity'], // Self-Expression
  'self-reliance': ['collectivism'], // Self-Reliance
  'selfcare': ['burden', 'burnout', 'chaos', 'disarray', 'neglect', 'overwhelm', 'pain', 'sacrifice', 'selflessness', 'stress', 'suffering'], // Selfcare
  'selfish': ['attentive', 'caring', 'considerate', 'empathetic', 'generous', 'inclusive', 'non-profit', 'nurturing', 'philanthropy', 'selfless', 'user-centric'], // selfish
  'selfishness': ['humanism'], // Selfishness
  'selfless': ['greed', 'selfish'], // Selfless
  'selflessness': ['selfcare'], // Selflessness
  'senior': ['babyproducts'], // senior
  'sense': ['absurdity', 'ambiguity', 'chaos', 'confusion', 'disorder', 'emptiness', 'foolishness', 'irrationality', 'nonsense', 'vagueness'], // sense
  'sensible': ['faceless', 'foolish', 'impractical', 'irrational'], // Sensible
  'sensitive': ['numb', 'outward', 'resilient'], // Sensitive
  'sensory': ['dispassionate'], // Sensory
  'sensory-grounded': ['theoretical'], // Sensory-Grounded
  'separate': ['align', 'binding', 'blend', 'cohere', 'collaborative', 'combine', 'connect', 'consolidate', 'integrate', 'integrated', 'interlink', 'interlock', 'interwoven', 'join', 'merge', 'merged', 'shared', 'stack', 'synthesize', 'unify', 'unite', 'united'], // separate
  'separated': ['clustered'], // separated
  'separation': ['assemblage', 'assembly', 'attachment', 'belonging', 'closeness', 'companion', 'connect', 'continuum', 'convergence', 'embrace', 'envelopment', 'fusion', 'integrity', 'interaction', 'interfacing', 'intertwined', 'interwoven', 'intimacy', 'network', 'penetration', 'superimposition', 'togetherness', 'unison'], // Separation
  'sepia': ['cool', 'coolness', 'gleaming'], // Sepia
  'sequential': ['chaotic', 'disordered', 'haphazard', 'irregular', 'random', 'scattered', 'spontaneous', 'unstructured'], // Sequential
  'serendipity': ['misfortune'], // Serendipity
  'serene': ['aggressive', 'agitated', 'arcade', 'bustling', 'chaotic', 'discordant', 'energetic', 'frantic', 'frenzied', 'frenzy', 'harried', 'haunting', 'heavy', 'joy', 'murky', 'noisy', 'raucous', 'roughness', 'uproarious'], // Serene
  'serenity': ['agitation', 'agony', 'anger', 'anguish', 'anxiety', 'apprehension', 'breakdown', 'clamor', 'discomfort', 'guilt', 'heavy', 'panic', 'playful', 'pollution', 'squalor', 'stimulation', 'stress', 'torment', 'tumult', 'turmoil', 'war'], // Serenity
  'serif': ['based', 'condensed', 'estate', 'mesh', 'responsive', 'sans', 'squiggly'], // Serif
  'serious': ['camp', 'carefree', 'chaotic', 'childlike', 'comic', 'fable', 'faddish', 'fanciful', 'flighty', 'flippant', 'frivolous', 'funny', 'gamified', 'informal', 'irreverent', 'light', 'loose', 'play', 'playful', 'random', 'silly', 'wacky'], // Serious
  'seriousness': ['cartoon', 'childhood', 'levity', 'youthfulness'], // Seriousness
  'serpentine': ['clear', 'fixed', 'linear', 'rigid', 'simple', 'stable', 'straight', 'straight-dynamics', 'uniform'], // serpentine
  'service': ['freight', 'manufacturing', 'winery'], // Service
  'services': ['engineering', 'merchandise'], // Services
  'setback': ['victory'], // Setback
  'settle': ['aspire', 'chaos', 'disorder', 'disrupt', 'instability', 'soar', 'uncertainty', 'wander'], // settle
  'settled': ['anticipation', 'chaotic', 'conflicted', 'disordered', 'dissatisfied', 'frontier', 'fugitive', 'hover', 'insecure', 'mobile', 'nomadic', 'restless', 'shifting', 'uncertain', 'unsettled', 'unstable', 'wandering'], // settled
  'settling': ['fleeing'], // Settling
  'sex': ['gender'], // sex
  'shabby': ['elegant', 'luxe', 'luxurious', 'neat', 'orderly', 'polished', 'pristine', 'refined', 'smooth'], // shabby
  'shade': ['brightness', 'exposure', 'light', 'lumen', 'shine', 'solar'], // Shade
  'shading': ['blinding', 'illustration', 'led', 'outlining'], // Shading
  'shadow': ['beacon', 'earthen', 'emerald', 'glare', 'highlight', 'illumination', 'luminance', 'present', 'radiance'], // Shadow
  'shadowy': ['luminescent'], // shadowy
  'shakiness': ['stability'], // Shakiness
  'shaky': ['consistent', 'poised', 'polished', 'robust', 'secure', 'simple', 'smooth', 'solid', 'stable', 'steady'], // shaky
  'shallow': ['alert', 'aware', 'deep', 'deeptech', 'engaged', 'fresh', 'immerse', 'intense', 'introspection', 'profound', 'rich', 'root', 'vivid'], // shallow
  'sham': ['genuine'], // Sham
  'shame': ['acceptance', 'approval', 'celebration', 'confidence', 'contentment', 'dignity', 'honor', 'joy', 'pride'], // shame
  'shape': ['chaos', 'flat', 'muddle', 'void'], // Shape
  'shaped': ['formless', 'unformed'], // Shaped
  'shaping': ['destruction', 'detachment', 'disorder', 'dispersal', 'dissolution'], // Shaping
  'share': ['consume', 'isolate'], // Share
  'shared': ['divided', 'fragmented', 'isolated', 'lonely', 'private', 'separate', 'solitary'], // shared
  'sharing': ['greed', 'withholding'], // Sharing
  'sharp': ['blended', 'blobby', 'blunt', 'blur', 'bokeh', 'brushstroke', 'cloudy', 'clueless', 'curvy', 'diffused', 'dull', 'fading', 'frayed', 'fuzzy', 'gentle', 'hazy', 'imprecise', 'loop', 'muffled', 'nebulous', 'neumorphic', 'numb', 'pixelation', 'round', 'smeared', 'smooth', 'soft', 'supple', 'sweet', 'unfocused', 'veiling', 'wash'], // Sharp
  'sharpness': ['blurb', 'fuzz', 'haze', 'roundness'], // Sharpness
  'shatter': ['wholeness'], // shatter
  'sheen': ['blunt', 'dull', 'flat', 'matte', 'rough', 'rusty'], // Sheen
  'sheer': ['dense', 'heavy', 'opaque', 'solid', 'thick', 'weighty'], // Sheer
  'shell': ['psyche'], // shell
  'shell-like': ['angular', 'edgy'], // Shell-like
  'shelter': ['abandonment', 'exposure', 'uncover', 'vulnerability'], // Shelter
  'shield': ['exposure', 'fragility', 'naked', 'openness', 'penetration', 'reveal', 'transparency', 'uncover', 'vulnerability', 'weakness'], // Shield
  'shielded': ['bare', 'defenseless', 'exposed', 'naked', 'open', 'raw', 'unprotected', 'vulnerability', 'vulnerable'], // shielded
  'shift': ['constant', 'fixed', 'immobile', 'stable', 'states', 'static', 'steady', 'unchanging', 'uniform'], // Shift
  'shifting': ['anchored', 'fixed', 'fixity', 'rooted', 'settled', 'solid', 'stable', 'static', 'steady', 'unchanging'], // Shifting
  'shifty': ['clean', 'clear', 'defined', 'honest', 'orderly', 'organized', 'solid', 'stable', 'trustworthy'], // shifty
  'shimmer': ['bland', 'dull', 'flat', 'matte', 'opaque'], // Shimmer
  'shine': ['bland', 'dark', 'darkness', 'dim', 'drown', 'dull', 'eclipse', 'flat', 'muted', 'shade'], // Shine
  'shining': ['dimming'], // Shining
  'shiny': ['bland', 'dark', 'dull', 'flat', 'halted', 'matt', 'matte', 'patina', 'rough'], // shiny
  'short': ['lengthy'], // Short
  'shout': ['whisper'], // Shout
  'shouted': ['calm', 'gentle', 'hushed', 'muted', 'quiet', 'soft', 'subdued', 'whispered', 'whispered-shades'], // Shouted
  'shouting': ['calm', 'peace', 'quiet', 'silence', 'silent', 'still', 'whisper'], // shouting
  'shouts': ['calm', 'hushed', 'quiet', 'silence', 'soft', 'stillness', 'subdued', 'whispers'], // Shouts
  'show': ['hide'], // Show
  'showing': ['concealing', 'hiding'], // Showing
  'showy': ['invisible'], // Showy
  'shrink': ['amplify', 'enhance', 'expand', 'grow', 'growth', 'increase', 'inflate', 'magnify', 'stretch'], // shrink
  'shrivel': ['alive', 'bloom', 'expand', 'flourish', 'hydrate', 'lush', 'thrive', 'vibrant', 'vivid'], // shrivel
  'shroud': ['clear', 'display', 'expose', 'freedom', 'limitless', 'open', 'reveal', 'transparency', 'uncover', 'unveiling'], // Shroud
  'shrouded': ['bright', 'clear', 'exposed', 'open', 'revealed', 'transparent', 'uncovered', 'visible'], // shrouded
  'shunning': ['acceptance', 'affection', 'connection', 'embrace', 'embracing', 'engagement', 'inclusion', 'unity', 'welcome'], // shunning
  'shy': ['assertive', 'bold', 'brash', 'confident', 'extroverted', 'loud', 'open', 'outgoing', 'playful'], // shy
  'sickly': ['healthy'], // Sickly
  'sidebar': ['center', 'focus', 'main'], // Sidebar
  'sight': ['blindness'], // Sight
  'sighted': ['blind'], // Sighted
  'sightful': ['blind', 'chaos', 'disdain', 'disorder', 'ignorant', 'mess', 'neglect', 'non-visual', 'vulgar'], // Sightful
  'signage': ['digital', 'print'], // Signage
  'signal': ['chaos', 'confusion', 'muffle', 'noise', 'obscurity', 'silence'], // Signal
  'significance': ['emptiness', 'insignificance', 'meaninglessness', 'nullity', 'oblivion', 'triviality'], // Significance
  'significant': ['forgettable', 'futile', 'insignificant', 'irrelevant', 'petty', 'pointless', 'trivial', 'useless', 'worthless'], // Significant
  'silence': ['activity', 'advertising', 'beat', 'buzz', 'cacophony', 'clamor', 'dialogue', 'din', 'echo', 'event', 'expression', 'expressiveness', 'gesture', 'interaction', 'marketing', 'melody', 'messaging', 'noise', 'promotion', 'publishing', 'pulse', 'racket', 'rhythm', 'scream', 'self-expression', 'shouting', 'shouts', 'signal', 'sound', 'statement', 'stimulation', 'story', 'telecommunications'], // Silence
  'silent': ['acoustic', 'blaring', 'cacophony', 'clamor', 'murals', 'noise', 'shouting', 'verbal'], // Silent
  'silhouette': ['clarity', 'definition', 'detail'], // Silhouette
  'silk': ['brittle', 'coarse', 'hard', 'rough', 'stiff'], // Silk
  'silkiness': ['graininess', 'roughness'], // Silkiness
  'silliness': ['gravitas'], // Silliness
  'silly': ['earnest', 'formal', 'grave', 'intelligent', 'reserved', 'serious', 'sober', 'solemn', 'stern'], // silly
  'silver': ['earthen', 'emerald'], // Silver
  'similar': ['disparate', 'diverse'], // Similar
  'simple': ['adulting', 'arch', 'arduous', 'brash', 'burdened', 'burdensome', 'catering', 'cellular', 'cgi', 'challenging', 'circuitous', 'cluttered', 'complex', 'conflicted', 'confused', 'confusing', 'cosmetics', 'crooked', 'crowned', 'cumbersome', 'deconstructivism', 'decorated', 'deeptech', 'depictive', 'elaborate', 'elite', 'enigmatic', 'excessive', 'exotic', 'extraneous', 'fabricated', 'fame', 'fanciful', 'figurative', 'fintech', 'flamboyant', 'flashy', 'fussy', 'fuzzy', 'gamified', 'garnish', 'gaudy', 'glamour', 'gothic', 'grind', 'grungy', 'hybrid', 'incomplete', 'indulgent', 'jumbled', 'kaleidoscopic', 'labyrinthine', 'lavish', 'layers', 'lofty', 'macro', 'majestic', 'mosaic', 'motorsport', 'multi', 'noisy', 'oblique', 'overwrought', 'paneled', 'parametric', 'poly', 'post-process', 'postdigital', 'pretentious', 'propulsive', 'racket', 'retrofuturism', 'richness', 'robotics', 'roughness', 'scaly', 'scholarly', 'serpentine', 'shaky', 'smoky', 'squiggly', 'storyful', 'strange', 'strata', 'strenuous', 'symbolic', 'symphonic', 'tangle', 'techno-futurism', 'technographic', 'theoretical', 'topography', 'twist', 'twisted', 'unhinged', 'vanguard', 'variable', 'variant', 'veiled', 'veiling', 'viscous', 'wacky', 'wealth', 'wearables', 'wrought', 'xr', 'yachting'], // Simple
  'simplicity': ['analysis', 'anatomy', 'apex', 'artifice', 'baroque', 'blurb', 'branding', 'celebrity', 'challenge', 'clamor', 'complexity', 'complication', 'confusion', 'consumerism', 'contradiction', 'corner', 'craft', 'cubism', 'deco', 'editorial', 'exaggeration', 'excess', 'filth', 'finance', 'fussy', 'fuzz', 'glitch', 'grandeur', 'harmony', 'hassle', 'hud', 'idiosyncrasy', 'imposition', 'jumble', 'lattice', 'layering', 'mass', 'matrix', 'maximalism', 'mess', 'metaverse', 'microcosm', 'muddle', 'paradox', 'pattern', 'plurality', 'scholarship', 'subjectivity', 'superimposition', 'surrealism', 'tumult', 'typecraft', 'verbosity', 'watches', 'watchmaking'], // Simplicity
  'simplification': ['augmentation', 'convolution', 'editorial', 'harmony'], // Simplification
  'simplify': ['busy', 'chaotic', 'cluttered', 'complex', 'complicate', 'dense', 'engrave', 'innovate', 'intricate', 'layered', 'layering', 'magnify'], // simplify
  'simplifying': ['chaotic', 'cluttered', 'complicating', 'confusing', 'conglomerating', 'disordered', 'intricate', 'messy', 'overwhelming'], // Simplifying
  'simplistic': ['graded', 'labyrinthine', 'overwrought'], // Simplistic
  'simulacrum': ['authentic', 'genuine', 'original', 'real', 'truth'], // Simulacrum
  'simulated': ['authentic', 'genuine', 'natural', 'real'], // Simulated
  'simulation': ['authenticity', 'illustration', 'led'], // Simulation
  'sincere': ['deceptive', 'fake', 'falsehood', 'heavy', 'hollow', 'insincere', 'irreverent'], // Sincere
  'sincerity': ['deceit', 'dishonesty', 'distrust', 'duplicity', 'falsehood', 'fraudulence', 'hypocrisy', 'insincerity', 'mockery', 'pretense'], // sincerity
  'single': ['album', 'checkered', 'complex', 'crowded', 'fluid', 'hybrid', 'layers', 'multi', 'multiple', 'poly', 'strata', 'tiered'], // Single
  'single-medium': ['mixed-media'], // single-medium
  'singular': ['collective', 'common', 'generic', 'hybrid', 'mosaic', 'ordinary', 'peripheral', 'plural', 'repetitive', 'standard', 'typical', 'uniform', 'variety'], // Singular
  'singular-style': ['mosaic'], // Singular-Style
  'singular-tone': ['multi'], // Singular-Tone
  'singularity': ['complexity', 'continuum', 'cycle', 'dispersal', 'diversity', 'duality', 'flotilla', 'fragmentation', 'multiplicity', 'plurality', 'repetition'], // Singularity
  'sink': ['float', 'raise', 'rise', 'soar', 'uplift'], // sink
  'skeletal': ['dense', 'full', 'lush', 'plump', 'rich', 'solid'], // Skeletal
  'skeptical': ['naive'], // Skeptical
  'skepticism': ['belief', 'naivety'], // Skepticism
  'sketching': ['final', 'illustration', 'led'], // Sketching
  'skeuomorphic': ['surreal'], // Skeuomorphic
  'skeuomorphism': ['abstraction', 'flat', 'minimalism'], // Skeuomorphism
  'skilled': ['amateur'], // Skilled
  'skillful': ['awkward', 'clumsy', 'empty', 'incompetence', 'incompetent', 'rigid', 'stiff', 'unskilled', 'weak'], // skillful
  'skincare': ['damage', 'dirt', 'haircare', 'harm', 'neglect', 'rough'], // Skincare
  'sky': ['basement', 'depth', 'earth', 'ground', 'terrain', 'void'], // Sky
  'skyward': ['below', 'doubting', 'earthbound', 'grounded', 'subterranean'], // Skyward
  'slack': ['active', 'driven', 'dynamic', 'focused', 'intense', 'rigid', 'strict', 'urgent'], // slack
  'slacker': ['active', 'ambitious', 'disciplined', 'driven', 'dynamic', 'engaged', 'focused', 'productive', 'productivity'], // slacker
  'sleek': ['brushed', 'chunky', 'clunky', 'coarse', 'frumpy', 'fussy', 'grained', 'janky', 'painterly', 'pulp', 'rocky', 'scaly', 'scrappy', 'textural'], // Sleek
  'sleekness': ['disheveled', 'editorial', 'harmony'], // Sleekness
  'sleep': ['day', 'morning'], // Sleep
  'sleeping': ['awakening'], // Sleeping
  'slender': ['bulky', 'heavy', 'thick', 'wide'], // Slender
  'slick': ['absorbent', 'bumpy', 'coarse', 'rough', 'roughness', 'textured', 'uneven'], // Slick
  'slim': ['plump', 'thick'], // Slim
  'sloppiness': ['attention', 'carefulness', 'clarity', 'craftsmanship', 'design', 'efficiency', 'focus', 'neatness', 'order', 'precision'], // Sloppiness
  'sloppy': ['clean', 'elegant', 'neat', 'orderly', 'polished', 'precise', 'refined', 'structured'], // Sloppy
  'sloth': ['action', 'drive', 'energy', 'focus', 'gym', 'hurry', 'initiative', 'speed', 'vigor'], // sloth
  'slow': ['aerodynamic', 'brisk', 'fast', 'hasty', 'immediate', 'instant', 'motorsport', 'propulsive', 'quick', 'rapid', 'robotics', 'rush', 'rushed', 'sudden', 'swift', 'urgent', 'volatile'], // slow
  'slow-paced': ['motorsport'], // Slow-Paced
  'slowness': ['acceleration', 'activity', 'haste', 'motion', 'quickness', 'rush', 'speed', 'urgency', 'velocity'], // slowness
  'sluggish': ['activating', 'active', 'alert', 'athlete', 'bright', 'bustling', 'dynamic', 'energetic', 'energy', 'lively', 'swift', 'vibrant'], // sluggish
  'slumber': ['awakening'], // Slumber
  'slump': ['rise'], // Slump
  'small': ['colossal', 'epic', 'expansive', 'grand', 'huge', 'immense', 'large', 'massive', 'vast'], // small
  'small-scale art': ['murals'], // small-scale art
  'small-scale-art': ['murals'], // Small-Scale art
  'smeared': ['clean', 'clear', 'defined', 'distinct', 'focused', 'precise', 'sharp', 'structured', 'typography'], // Smeared
  'smoky': ['bright', 'clear', 'crisp', 'defined', 'pure', 'simple', 'smooth', 'solid', 'static'], // Smoky
  'smooth': ['absorbent', 'agitated', 'angularity', 'arduous', 'awkward', 'bitter', 'blobby', 'blocky', 'blotchy', 'braided', 'brushed', 'brushstroke', 'brushwork', 'bump', 'bumpy', 'challenging', 'chipped', 'clatter', 'coarse', 'corrugated', 'cracked', 'craggy', 'crooked', 'dirt', 'disjointed', 'distorted', 'distress', 'distressed', 'dragged', 'dust', 'erupt', 'explosive', 'faceted', 'flaky', 'flicker', 'foamy', 'folded', 'fracture', 'frayed', 'fussy', 'fuzzy', 'grained', 'granular', 'graphite', 'grime', 'grotesque', 'grungy', 'halted', 'harried', 'harsh', 'jagged', 'janky', 'jarring', 'matt', 'muddy', 'murky', 'paneled', 'panelled', 'particulate', 'patina', 'pixel', 'pixelated', 'pixelation', 'plump', 'pointed', 'powder', 'pressure', 'pulp', 'ragged', 'relief', 'rocky', 'roughness', 'rugged', 'rusty', 'scaly', 'scrappy', 'scratched', 'segmented', 'shabby', 'shaky', 'sharp', 'smoky', 'speckled', 'splat', 'splotchy', 'staccato', 'sticker', 'stilted', 'stone', 'strenuous', 'stuffy', 'tangle', 'tense', 'terrain', 'textural', 'tightened', 'topography', 'twisted', 'uneven', 'unruly', 'viscous', 'wave', 'wire', 'worn', 'woven'], // Smooth
  'smoothness': ['bumpiness', 'bumpy', 'coarseness', 'crunch', 'hassle', 'jaggedness', 'jumble', 'pixelation', 'roughness', 'textured', 'uneven'], // Smoothness
  'snacks': ['beverages', 'labor', 'meals'], // Snacks
  'snub': ['regard'], // Snub
  'soar': ['decline', 'descend', 'drop', 'fall', 'land', 'plummet', 'settle', 'sink'], // Soar
  'sober': ['camp', 'chaotic', 'colorful', 'extravagant', 'frenzied', 'frivolous', 'garish', 'lively', 'silly', 'vibrant', 'wild'], // sober
  'sobriety': ['alcohol'], // sobriety
  'social': ['heavy', 'introverted'], // Social
  'socialism': ['capitalism'], // socialism
  'soda': ['wine'], // Soda
  'soft': ['aggressive', 'angularity', 'armored', 'backward', 'bitter', 'blaring', 'blasts', 'blazing', 'blinding', 'blocky', 'boisterous', 'brash', 'brittle', 'brutal', 'brutalism', 'burnt', 'buzz', 'cast', 'challenging', 'coarse', 'concrete', 'craggy', 'crisp', 'fibrous', 'fierce', 'fiery', 'fluid', 'frozen', 'garish', 'glare', 'gothic', 'graphite', 'halted', 'hard', 'harsh', 'heat', 'heated', 'humble', 'industrial', 'loud', 'marble', 'mechanical', 'obtrusive', 'ochre', 'outward', 'overwrought', 'pointed', 'punchy', 'raucous', 'resilient', 'robotic', 'rocky', 'roughness', 'rugged', 'savage', 'scaly', 'screaming', 'sharp', 'shouted', 'shouts', 'solidity', 'steel', 'sterile', 'stern', 'stiff', 'stone', 'strident', 'sturdy', 'technic', 'tense', 'thunders', 'weight', 'weighty', 'wire'], // Soft
  'soften': ['overpower', 'solidify'], // Soften
  'softness': ['crispness', 'crunch', 'editorial', 'harmony', 'harsh', 'strength'], // Softness
  'software': ['bakery', 'winery'], // Software
  'solar': ['darkness', 'lunar', 'night', 'shade', 'void'], // Solar
  'solemn': ['cheerful', 'exuberant', 'flippant', 'irreverent', 'jovial', 'joyful', 'lighthearted', 'playful', 'silly'], // Solemn
  'solemnity': ['flippant'], // Solemnity
  'solid': ['2d', 'aero', 'aether', 'airiness', 'amorphous', 'aqueous', 'beverage', 'blobby', 'blotchy', 'broken', 'cellular', 'checkered', 'cloud', 'cloudy', 'coil', 'disembodied', 'disembodiment', 'erode', 'ethereal', 'evanescent', 'fabric', 'flaky', 'flawed', 'flexibility', 'flicker', 'flighty', 'flood', 'fluke', 'foamy', 'folding', 'fracture', 'frayed', 'hazy', 'hollow', 'impotence', 'intangible', 'interstitial', 'leak', 'lightweight', 'liquid', 'malleable', 'melt', 'modular', 'molten', 'morph', 'neumorphic', 'partial', 'patina', 'perforated', 'plasma', 'porous', 'powder', 'scrap', 'segmented', 'shaky', 'sheer', 'shifting', 'shifty', 'skeletal', 'smoky', 'spill', 'splash', 'splotchy', 'steam', 'strata', 'stratosphere', 'tear', 'thaw', 'translucency', 'translucent', 'tubular', 'undulating', 'unformed', 'unfounded', 'vague', 'vapor', 'vapour', 'viscous', 'wave', 'waver', 'wavering', 'wavy', 'wire', 'wobbly', 'y2k'], // Solid
  'solid-color': ['splotchy'], // Solid-Color
  'solidarity': ['dissipation', 'disunity'], // Solidarity
  'solidify': ['bleed', 'chaos', 'collapse', 'dissolve', 'fluid', 'informal', 'melt', 'random', 'soften', 'vague'], // Solidify
  'solidifying': ['diluting', 'dissolving', 'fluid', 'liquefying', 'melting', 'obliterating', 'vanishing'], // solidifying
  'solidity': ['abstract', 'chaotic', 'disordered', 'fluid', 'fragility', 'lattice', 'metaverse', 'soft', 'temporary', 'uncertain', 'vague', 'whirlwind'], // solidity
  'solipsism': ['dependence'], // Solipsism
  'solitary': ['collaborative', 'collective', 'public', 'shared', 'urban'], // Solitary
  'solitude': ['collectivism', 'community', 'companion', 'companionship', 'connection', 'dependence', 'dialogue', 'embrace', 'engagement', 'flotilla', 'interaction', 'togetherness'], // Solitude
  'solo': ['multi', 'team-building'], // Solo
  'solutions': ['challenges', 'chaos', 'complication', 'confusion', 'disorder', 'failure', 'frustration', 'inefficiency', 'obstacle', 'obstacles', 'problems'], // Solutions
  'somber': ['bright', 'cheerful', 'festive', 'joyful', 'lively', 'vibrant'], // Somber
  'somewhere': ['nowhere'], // Somewhere
  'somnolent': ['stimulating'], // Somnolent
  'soothing': ['jarring'], // Soothing
  'sophisticated': ['artless', 'cheap', 'childlike', 'comic', 'composition', 'contrast', 'crude', 'faddish', 'folk', 'frivolous', 'kitsch', 'naive', 'primal', 'primitive', 'rudimentary', 'tacky', 'vulgar', 'wacky'], // Sophisticated
  'sophistication': ['cartoon', 'naivety'], // Sophistication
  'sorrow': ['aether', 'bliss', 'celebration', 'comfort', 'delight', 'euphoria', 'happiness', 'hope', 'joy', 'levity', 'pleasure', 'prosperity'], // sorrow
  'sorrowful': ['jovial'], // Sorrowful
  'soulful': ['bland', 'cold', 'detached', 'mechanical', 'sterile'], // Soulful
  'sound': ['silence'], // sound
  'sour': ['bakery', 'sweet'], // Sour
  'source': ['absence', 'chaos', 'dispersal', 'end', 'void'], // Source
  'sourness': ['sweetness'], // Sourness
  'souvenirs': ['disposal', 'essentials', 'necessities', 'trash'], // Souvenirs
  'sovereignty': ['anarchy', 'control', 'dependence', 'subjugation', 'subordination'], // Sovereignty
  'space': ['composition', 'contrast'], // Space
  'spacious': ['composition', 'constrict', 'contrast', 'dense'], // Spacious
  'spare': ['merchandise'], // Spare
  'spark': ['dull', 'stagnant', 'static'], // Spark
  'sparse': ['adorned', 'clustering', 'elaborate', 'excessive', 'filled', 'full', 'fullness', 'indulgent', 'lavish', 'volume'], // Sparse
  'sparse-elegance': ['garnish'], // Sparse-Elegance
  'sparsity': ['abundance', 'chaos', 'complexity', 'crowded', 'density', 'fullness', 'lavish', 'richness', 'textured-abundance'], // Sparsity
  'spatial': ['editorial', 'harmony'], // Spatial
  'special': ['common', 'ubiquitous'], // Special
  'specific': ['abstracted', 'abstraction', 'aggregate', 'ambiguous', 'broad', 'diffuse', 'general', 'imprecise', 'indistinct', 'interstitial', 'massproduced', 'random', 'ubiquitous', 'unclear', 'ungendered', 'vague'], // Specific
  'speckled': ['plain', 'smooth', 'uniform'], // Speckled
  'spectacle': ['minimal', 'mundane', 'subtle'], // Spectacle
  'speculation': ['diagnostics'], // speculation
  'speed': ['gradual', 'leisurely', 'sloth', 'slowness', 'stasis', 'stillness'], // Speed
  'spent': ['renew'], // Spent
  'sphere': ['boxy', 'cone', 'cube', 'line', 'plane', 'pyramid', 'rectangle'], // Sphere
  'spherical': ['angular', 'cubical', 'flat', 'irregular', 'linear', 'octagonal', 'planar'], // Spherical
  'spicy': ['bland', 'mild'], // Spicy
  'spill': ['contain', 'containment', 'fixed', 'hold', 'neat', 'orderly', 'secure', 'solid', 'stable'], // spill
  'spiral': ['flat', 'linear', 'rigid', 'static', 'straight'], // Spiral
  'spirit': ['concrete', 'earth', 'matter', 'physical', 'tangible'], // Spirit
  'spirited': ['weary'], // Spirited
  'spirits': ['cider'], // Spirits
  'spirituality': ['geology'], // spirituality
  'splash': ['absorb', 'calm', 'clear', 'dry', 'flat', 'quiet', 'solid', 'still', 'typeset'], // Splash
  'splat': ['clean', 'controlled', 'focused', 'neat', 'orderly', 'precise', 'smooth', 'subtle', 'typesetting'], // Splat
  'split': ['align', 'bond', 'combine', 'connect', 'harmony', 'integrate', 'interlink', 'join', 'merge', 'unify', 'unite', 'wholeness'], // split
  'splotchy': ['clear', 'consistent', 'even', 'neat', 'polished', 'smooth', 'solid', 'solid-color', 'uniform'], // Splotchy
  'spoken': ['nonverbal'], // Spoken
  'spontaneity': ['academia', 'algorithm', 'architecture', 'captivity', 'coding', 'cubism', 'discipline', 'editorial', 'engineering', 'grind', 'harmony', 'imposition', 'mechanism', 'method', 'outlining', 'planned', 'planning', 'ritual'], // Spontaneity
  'spontaneous': ['adulting', 'analytical', 'automated', 'behavioral', 'calculated', 'coded', 'computational', 'deliberate', 'doctrinal', 'engineered', 'fabricated', 'factory', 'formality', 'mechanic', 'mechanical', 'methodical', 'modelling', 'planned', 'predefined', 'predetermined', 'predictable', 'premeditated', 'procedural', 'regulated', 'repetitive', 'restrained', 'restricted', 'robotic', 'scheduled', 'sequential', 'staged', 'stilted', 'strategic'], // Spontaneous
  'sports': ['cool', 'coolness', 'idle', 'unfocused'], // Sports
  'spotless': ['chaotic', 'dirty', 'flawed', 'imperfect', 'messy', 'rough', 'stained', 'tattered', 'worn'], // Spotless
  'sprawl': ['cohesive', 'compact', 'dashboard', 'dense', 'neat', 'orderly', 'organized', 'structured', 'uniform'], // sprawl
  'sprawled': ['cohesive', 'compact', 'focused', 'grounded', 'neat', 'organized', 'sculpted', 'stable', 'structured'], // Sprawled
  'spread': ['block', 'centralized', 'compact', 'constricted', 'contained', 'focused', 'point', 'tight'], // spread
  'spreading': ['compressing'], // Spreading
  'spring': ['fall'], // Spring
  'squalor': ['brightness', 'cleanliness', 'elegance', 'harmony', 'idyll', 'neatness', 'order', 'purity', 'serenity', 'utopia'], // squalor
  'square': ['chaotic', 'circle', 'curved', 'fluid', 'random', 'round'], // Square
  'squiggly': ['orderly', 'predictable', 'serif', 'simple', 'standard', 'straight', 'uniform'], // squiggly
  'stability': ['breakdown', 'chaos', 'chaotic', 'disorder', 'disruption', 'drift', 'flexibility', 'fluke', 'flux', 'fragility', 'impermanence', 'instability', 'liminality', 'mobility', 'rebellion', 'risk', 'shakiness', 'transience', 'turbulence', 'turmoil', 'uncertainty', 'verticality', 'whirlwind'], // Stability
  'stabilize': ['bleed', 'disrupt'], // Stabilize
  'stable': ['anarchic', 'broken', 'cellular', 'deconstructivism', 'disruptive', 'evanescent', 'explosive', 'faddish', 'fickle', 'flawed', 'fleeting', 'flicker', 'flighty', 'folding', 'fugitive', 'lost', 'molten', 'morph', 'murky', 'mutable', 'plasma', 'postlude', 'reactive', 'serpentine', 'shaky', 'shift', 'shifting', 'shifty', 'spill', 'sprawled', 'tangential', 'temporary', 'transient', 'undulating', 'ungrounded', 'unhinged', 'unsettled', 'unstable', 'unsteady', 'vague', 'variable', 'volatile', 'wave', 'waver', 'wavering', 'wobbly'], // Stable
  'staccato': ['calm', 'continuous', 'fluid', 'gentle', 'leisurely-flow', 'smooth', 'steady'], // staccato
  'stack': ['disperse', 'dissolve', 'divide', 'flatten', 'loosen', 'scatter', 'separate'], // Stack
  'stackability': ['fixed', 'rigid'], // Stackability
  'stackable': ['fixed', 'rigid'], // Stackable
  'staged': ['candid', 'chaotic', 'dynamic', 'fluid', 'genuine', 'natural', 'organic', 'raw', 'spontaneous'], // Staged
  'staging': ['illustration', 'led'], // Staging
  'stagnant': ['aerodynamic', 'alive', 'beat', 'catalyst', 'forward', 'innovative', 'inventive', 'live', 'molten', 'propulsive', 'raised', 'responsive', 'spark', 'steam', 'swift', 'vanguard'], // Stagnant
  'stagnate': ['evolve', 'flourish', 'innovate', 'motivate', 'renew', 'thrive', 'yield'], // Stagnate
  'stagnation': ['acceleration', 'activity', 'adaptability', 'advancement', 'awakening', 'catalyst', 'creativity', 'day', 'development', 'dialogue', 'discovery', 'dream', 'education', 'emergence', 'energy', 'event', 'evolution', 'expression', 'flotilla', 'freshness', 'future', 'growth', 'improvement', 'interplay', 'invention', 'lifestyle', 'logistics', 'metamorphosis', 'metaverse', 'microcosm', 'mobility', 'moment', 'passion', 'potential', 'progress', 'pursuit', 'quest', 'rebirth', 'redefinition', 'reinvention', 'renewal', 'ripple', 'self-expression', 'stream', 'transformation', 'vigor', 'vitality', 'watches', 'wind'], // Stagnation
  'stain': ['wash'], // Stain
  'stained': ['spotless'], // Stained
  'stale': ['beverage', 'bistro', 'bold', 'breezy', 'bright', 'colorful', 'cool', 'dynamic', 'exciting', 'fable', 'fresh', 'groovy', 'lively', 'new', 'novel', 'oceanic', 'vibrant', 'youth', 'youthfulness'], // Stale
  'staleness': ['freshness'], // staleness
  'stamina': ['weakness'], // Stamina
  'standard': ['anomaly', 'boutique', 'exotic', 'extraordinary', 'improvised', 'novel', 'offbeat', 'personalized', 'rare', 'singular', 'squiggly', 'subjective', 'uncommon', 'unfamiliar', 'unique', 'uniqueness', 'variant'], // Standard
  'standardization': ['customization', 'idiosyncrasy', 'localism'], // Standardization
  'standardize': ['disrupt'], // Standardize
  'stark': ['aqueous', 'bistro', 'earthen', 'emerald', 'sweet'], // Stark
  'start': ['closed', 'end', 'ended', 'endgame', 'expire', 'final', 'finale', 'finish', 'stop'], // Start
  'startup': ['cool', 'coolness'], // Startup
  'starvation': ['nourishment'], // Starvation
  'starve': ['abundance', 'feed', 'full', 'nourish', 'plenty', 'rich', 'satiate', 'thrive'], // starve
  'stasis': ['becoming', 'flux', 'journey', 'mobility', 'momentum', 'movement', 'passage', 'pulse', 'rhythm', 'speed', 'time', 'trajectory', 'velocity', 'voyage'], // Stasis
  'stately': ['frenzied', 'heavy'], // Stately
  'statement': ['ambiguity', 'confusion', 'disregard', 'invisibility', 'neutral', 'obscurity', 'passive', 'plain', 'silence', 'subtle', 'uncertainty'], // Statement
  'states': ['composition', 'contrast', 'shift'], // States
  'static': ['3d-rendering', 'accordion', 'acoustic', 'activating', 'active', 'adventurous', 'animated', 'arcade', 'automotive', 'beat', 'becoming', 'biomorphic', 'breezy', 'brushstroke', 'carousel', 'catalyst', 'cellular', 'cinematic', 'cloud', 'composition', 'cybernetic', 'cycle', 'digitalization', 'driven', 'evolution', 'experiential', 'exploratory', 'explosive', 'fi', 'fintech', 'fleeting', 'flex', 'flexibility', 'folding', 'forward', 'frontier', 'gamified', 'globe', 'graded', 'groovy', 'interactive', 'kaleidoscopic', 'labyrinthine', 'loop', 'mobile', 'mobility', 'morph', 'motorsport', 'nomadic', 'parallax', 'performative', 'planetary', 'plasma', 'postdigital', 'propulsive', 'radial', 'reactive', 'responsive', 'restless', 'retrofuturism', 'seasons', 'shift', 'shifting', 'smoky', 'spark', 'spiral', 'strata', 'streak', 'stream', 'swirl', 'techno-futurism', 'thrive', 'thunders', 'transient', 'trend', 'twist', 'undulating', 'undulation', 'vanguard', 'variable', 'variant', 'vr', 'wave', 'wavy', 'wearables', 'xr', 'youthfulness'], // Static
  'stationary': ['carousel', 'hover', 'mobile', 'mobility', 'wandering', 'watches', 'wearables', 'yachting'], // Stationary
  'stationery': ['digital', 'virtual'], // Stationery
  'statuary': ['dynamic', 'ephemeral', 'fluid', 'temporary', 'transient'], // Statuary
  'status': ['ignored', 'premium'], // Status
  'statusquo': ['counterculture'], // Statusquo
  'staying': ['fleeing'], // Staying
  'steadfast': ['chaotic', 'fickle', 'messy', 'random', 'transitory-visuals', 'unstable', 'volatile'], // Steadfast
  'steady': ['anxious', 'bumpy', 'clatter', 'dragged', 'fickle', 'flashy', 'flicker', 'flighty', 'frantic', 'harried', 'hasty', 'mutable', 'overflow', 'rushed', 'shaky', 'shift', 'shifting', 'staccato', 'sudden', 'suddenness', 'uncertain', 'uneven', 'unreliable', 'unsettled', 'unstable', 'unsteady', 'volatile', 'wavering'], // Steady
  'steam': ['calm', 'dry', 'solid', 'stagnant', 'still'], // Steam
  'steampunk': ['techno-futurism'], // Steampunk
  'steel': ['brittle', 'flexible', 'flora', 'fluid', 'natural', 'organic', 'soft', 'warm'], // Steel
  'stellar': ['banal', 'common', 'dull', 'earthbound', 'earthly', 'grounded', 'mundane', 'ordinary', 'terrestrial'], // Stellar
  'sterile': ['atmospheric', 'biophilic', 'bistro', 'chaotic', 'earthiness', 'fertile', 'foliage', 'gritty', 'homely', 'lively', 'messy', 'murals', 'organic', 'pastoral', 'rich', 'romantic', 'rough', 'soft', 'soulful', 'verdant', 'vibrant', 'warm', 'worn'], // Sterile
  'stern': ['cheerful', 'easy', 'flexible', 'gentle', 'light', 'playful', 'silly', 'soft', 'warm'], // stern
  'stewardship': ['abandon', 'disregard', 'dissipation', 'neglect', 'waste'], // Stewardship
  'sticker': ['bare', 'empty', 'minimal', 'plain', 'smooth', 'void'], // Sticker
  'stiff': ['casual', 'dynamic', 'easy', 'flexibility', 'flexible', 'fluid', 'foamy', 'groovy', 'informal', 'light', 'loose', 'malleable', 'melt', 'pillow', 'playful', 'plush', 'porous', 'silk', 'skillful', 'soft', 'supple', 'vapour', 'velvet', 'yielding'], // Stiff
  'stiffen': ['thaw'], // Stiffen
  'stiffness': ['flexibility'], // Stiffness
  'stifle': ['encourage'], // Stifle
  'stifled': ['bold', 'dynamic', 'expressive', 'freed', 'limitless', 'lively', 'radiant', 'unsettled', 'vibrant'], // Stifled
  'stifling': ['empowering'], // Stifling
  'still': ['activating', 'blaring', 'blasts', 'boisterous', 'burst', 'bustling', 'buzz', 'erupt', 'flood', 'frenzy', 'hover', 'hustle', 'live', 'liveliness', 'melt', 'mobile', 'molten', 'plasma', 'rush', 'shouting', 'splash', 'steam', 'streak', 'unleash', 'uproarious', 'vibration', 'wave'], // Still
  'stillness': ['action', 'activity', 'agitation', 'beat', 'bounce', 'chaos', 'clamor', 'day', 'din', 'energy', 'flotilla', 'flux', 'force', 'gym', 'life', 'momentum', 'movement', 'noise', 'orbit', 'passage', 'pulse', 'ripple', 'shouts', 'speed', 'stimulation', 'stream', 'trajectory', 'turbulence', 'velocity', 'vortex', 'voyage', 'whirl', 'whirlwind', 'wind'], // Stillness
  'stillness-tone': ['vibration'], // Stillness-Tone
  'stilted': ['dynamic', 'easy', 'flowing', 'fluid', 'free', 'natural', 'natural-flow', 'smooth', 'spontaneous'], // Stilted
  'stimulate': ['bore'], // Stimulate
  'stimulated': ['bored', 'unmoved'], // Stimulated
  'stimulating': ['bland', 'boring', 'drab', 'draining', 'dull', 'flat', 'idle', 'insipid', 'lame', 'lethargic', 'lifeless', 'monotonous', 'somnolent', 'tedious', 'tiring', 'uninspiring'], // Stimulating
  'stimulation': ['apathy', 'boredom', 'calm', 'dullness', 'inactivity', 'passivity', 'rest', 'serenity', 'silence', 'stillness'], // Stimulation
  'stoic': ['chaotic', 'comic', 'elaborate', 'emotional', 'expressive', 'fervent', 'passionate', 'reactive', 'unstable', 'volatile', 'vulnerable', 'zesty'], // Stoic
  'stoicism': ['ebullience'], // Stoicism
  'stone': ['flesh', 'fluid', 'light', 'paper', 'plastic', 'smooth', 'soft', 'translucent'], // Stone
  'stop': ['active', 'flow', 'fresh', 'go', 'launch', 'loop', 'move', 'repeat', 'rise', 'scroll', 'start'], // Stop
  'stopped': ['active', 'continuous', 'dynamic', 'flowing', 'fluid', 'moving', 'open', 'scrolling', 'unstoppable'], // stopped
  'storm': ['breeze', 'calm', 'clear', 'peace', 'sunny'], // storm
  'story': ['absence', 'silence', 'void'], // Story
  'storyful': ['abstract-non-narrative', 'bland', 'chaotic', 'dull', 'flat', 'random', 'simple', 'unstructured', 'vague'], // Storyful
  'straight': ['circuitous', 'circular', 'coil', 'crooked', 'curvilinear', 'curvy', 'diagonal', 'distorted', 'labyrinthine', 'oblique', 'serpentine', 'spiral', 'squiggly', 'swirl', 'tangle', 'twist', 'twisted', 'undulating', 'wavy', 'wobbly'], // Straight
  'straight-dynamics': ['serpentine', 'wobbly'], // Straight-Dynamics
  'straightforward': ['ambiguous', 'complex', 'confusing', 'enigmatic', 'indirect', 'obscure', 'strange', 'uncertain', 'vague', 'wobbly'], // straightforward
  'strain': ['comfort', 'ease', 'flow', 'freedom', 'joy', 'lightness', 'relaxation', 'release'], // strain
  'strange': ['clear', 'easy', 'familiar', 'familiarity', 'normal', 'obvious', 'plain', 'simple', 'straightforward'], // strange
  'strata': ['flat', 'monolith', 'simple', 'single', 'solid', 'static', 'surface', 'unified', 'uniform'], // Strata
  'strategic': ['chaotic', 'disorganized', 'impulsive', 'random', 'spontaneous'], // Strategic
  'stratosphere': ['chaos', 'dense', 'earth', 'flat', 'ground', 'heavy', 'low', 'solid', 'substance', 'void'], // Stratosphere
  'stratum': ['base', 'surface', 'void'], // Stratum
  'streak': ['fade', 'static', 'still'], // Streak
  'stream': ['blockage', 'obstruction', 'stagnation', 'static', 'stillness'], // Stream
  'streaming': ['vinyl'], // streaming
  'streamline': ['awkwardness', 'cluttered', 'complex'], // Streamline
  'streamlined': ['chunky', 'clunky', 'fussy'], // Streamlined
  'street': ['enclosure', 'interior', 'sanctuary'], // Street
  'streetfood': ['finedining', 'luxury', 'upscale'], // Streetfood
  'streetwear': ['classic', 'elegant', 'formal', 'refined', 'traditional'], // Streetwear
  'strength': ['breakdown', 'collapse', 'damage', 'deterioration', 'disempowerment', 'failure', 'fragility', 'futility', 'impotence', 'insecurity', 'powerless', 'ruin', 'softness', 'vulnerability', 'waver', 'weakness'], // strength
  'strengthen': ['break', 'collapse', 'erode'], // Strengthen
  'strengthened': ['weakened'], // Strengthened
  'strengthening': ['dissolving'], // Strengthening
  'strenuous': ['calm', 'easy', 'effortless', 'gentle', 'light', 'lightweight', 'peaceful', 'relaxed', 'simple', 'smooth'], // strenuous
  'stress': ['breeze', 'calm', 'comfort', 'ease', 'harmony', 'joy', 'leisure', 'peace', 'relaxation', 'selfcare', 'serenity', 'tranquility'], // stress
  'stressful': ['easy', 'leisurely'], // Stressful
  'stretch': ['shrink'], // Stretch
  'stretching': ['narrowing'], // Stretching
  'strict': ['cool', 'coolness', 'freeform', 'loose', 'slack'], // Strict
  'strident': ['calm', 'faint', 'gentle', 'mellow', 'muted', 'muted-ambiance', 'quiet', 'soft', 'subdued'], // Strident
  'strife': ['abundance', 'ease', 'flow', 'freedom', 'harmony', 'joy', 'peace', 'release'], // strife
  'striking': ['dull', 'faint', 'forgettable'], // Striking
  'strip': ['envelop'], // strip
  'strong': ['vulnerable', 'weak'], // Strong
  'structural': ['chaotic', 'fluid', 'organic'], // Structural
  'structuralism': ['deconstructivism'], // Structuralism
  'structure': ['blurb', 'disorder', 'flux', 'fuzz', 'impressionist', 'jumble', 'mess', 'muddle', 'scribble', 'tumult', 'wilderness'], // Structure
  'structured': ['amorphous', 'anarchic', 'anti', 'arbitrary', 'artless', 'biomorphic', 'blobby', 'disarrayed', 'disheveled', 'disorderly', 'disorganized', 'doodle', 'feral', 'formless', 'freeform', 'freestyle', 'haphazard', 'improvised', 'impure', 'informal', 'jumbled', 'loosen', 'messy', 'negligent', 'null', 'random', 'scrap', 'scrawl', 'sloppy', 'smeared', 'sprawl', 'sprawled', 'terrain', 'unconfined', 'undefined', 'unformed', 'unfounded', 'ungendered', 'unplanned', 'untamed', 'unvalued', 'wild'], // Structured
  'struggle': ['calm', 'comfort', 'ease', 'harmony', 'joy', 'peace', 'prosperity', 'success', 'thrive', 'victory'], // struggle
  'stuck': ['advance', 'dynamic', 'escape', 'flow', 'free', 'motion', 'progress', 'release'], // stuck
  'studious': ['carefree', 'chaotic', 'disorderly', 'distracted', 'frivolous'], // Studious
  'stuffy': ['casual-chic', 'clear', 'dynamic', 'fluid', 'fresh', 'lively', 'open', 'smooth', 'vibrant'], // stuffy
  'stupid': ['ingenuity'], // Stupid
  'stupidity': ['clarity', 'education', 'insight', 'intelligence', 'scholarship', 'wisdom'], // stupidity
  'sturdy': ['brittle', 'fragile', 'light', 'loose', 'soft', 'thin', 'translucency', 'unstable', 'vapor', 'weak'], // sturdy
  'styled': ['untouched'], // Styled
  'styling': ['illustration', 'led'], // Styling
  'stylish': ['frumpy', 'tacky'], // Stylish
  'stylization': ['naturalism', 'realism', 'unembellished', 'verisimilitude'], // Stylization
  'subculture': ['pop-culture'], // Subculture
  'subdue': ['amplify', 'burst', 'erupt', 'highlight', 'intensify', 'overpower', 'unleash'], // Subdue
  'subdued': ['accent', 'arcade', 'blaring', 'blasts', 'blazing', 'boisterous', 'brilliant', 'camp', 'emissive', 'erupt', 'excess', 'excessive', 'explosive', 'faddish', 'fiery', 'flamboyant', 'flare', 'ignited', 'indulgent', 'noisy', 'performative', 'provocative', 'punchy', 'raucous', 'screaming', 'shouted', 'shouts', 'strident', 'uproarious', 'wacky'], // Subdued
  'subdued-illumination': ['dazzling'], // Subdued-Illumination
  'subduing': ['assertive', 'bold', 'clear', 'distinct', 'dynamic', 'highlighting', 'intensifying', 'loud', 'vibrant'], // Subduing
  'subjective': ['analytical', 'analytics', 'certain', 'conventional', 'external', 'fixed', 'functionalism', 'objective', 'objectivist', 'predictable', 'scientific', 'standard', 'uniform', 'universal'], // Subjective
  'subjectivity': ['algorithm', 'analytics', 'clarity', 'consensus', 'detachment', 'logic', 'objectivity', 'simplicity', 'universality'], // Subjectivity
  'subjugation': ['autonomy', 'empowerment', 'liberation', 'sovereignty'], // Subjugation
  'sublime': ['banal', 'mundane', 'trivial'], // Sublime
  'submerge': ['float', 'hover'], // Submerge
  'submerged': ['aerial'], // Submerged
  'submersion': ['ascendancy'], // Submersion
  'submission': ['assertion', 'autonomy', 'control', 'defiance', 'dominance', 'freedom', 'independence', 'rebellion', 'resistance'], // submission
  'submissive': ['defiant', 'empowering', 'rebel'], // Submissive
  'submissiveness': ['assertiveness', 'power'], // Submissiveness
  'subordinate': ['main'], // Subordinate
  'subordination': ['agency', 'sovereignty'], // Subordination
  'subpar': ['elite', 'ideal', 'perfect'], // Subpar
  'subside': ['intensify'], // Subside
  'substance': ['absence', 'ephemera', 'facade', 'fleshless', 'husk', 'illusion', 'nonexist', 'nullity', 'stratosphere', 'transience', 'void'], // Substance
  'substantial': ['frivolous', 'intangible', 'superficial'], // Substantial
  'subsurface': ['clear', 'exposed', 'open', 'surface', 'visible'], // Subsurface
  'subterranean': ['celestial', 'skyward'], // Subterranean
  'subtext': ['explicit'], // Subtext
  'subtextual': ['overt'], // Subtextual
  'subtle': ['blatant', 'blinding', 'brash', 'burnt', 'fierce', 'flashy', 'foreground', 'fussy', 'garish', 'garnish', 'gaudy', 'imposing', 'janky', 'jarring', 'kitsch', 'loud', 'macro', 'obtrusive', 'obvious', 'overlook', 'overt', 'overwrought', 'spectacle', 'splat', 'statement', 'thunders', 'visible', 'vulgar', 'weighty'], // Subtle
  'subtle-hues': ['screaming'], // Subtle-Hues
  'subtlety': ['authoritative', 'cartoon', 'exaggeration', 'exuberance', 'gesture', 'maximalism'], // Subtlety
  'subversion': ['premium'], // Subversion
  'success': ['decline', 'defeat', 'difficulty', 'discontent', 'emptiness', 'failure', 'futility', 'humility', 'insecurity', 'misfortune', 'struggle'], // success
  'successful': ['defeated', 'fumbled'], // Successful
  'sudden': ['anticipation', 'calm', 'constant', 'delayed', 'gradual', 'slow', 'steady'], // sudden
  'suddenness': ['constant', 'delayed', 'gradual', 'persistence', 'steady'], // suddenness
  'suffering': ['selfcare', 'well-being'], // Suffering
  'sufficiency': ['need'], // Sufficiency
  'summit': ['absence', 'abyss', 'base', 'bottom', 'depth', 'flat', 'low', 'valley', 'void'], // summit
  'sun': ['night'], // Sun
  'sunken': ['raised'], // Sunken
  'sunny': ['cloudy', 'cold', 'storm'], // Sunny
  'sunrise': ['dusk'], // Sunrise
  'superficial': ['authentic', 'deep', 'earnest', 'genuine', 'genuineness', 'immerse', 'meaningful', 'profound', 'real', 'rich', 'substantial', 'thoughtful'], // superficial
  'superficiality': ['scholarship'], // Superficiality
  'superimposition': ['clarity', 'disjointed', 'isolation', 'separation', 'simplicity'], // Superimposition
  'superior': ['inferior', 'low'], // Superior
  'supple': ['brittle', 'coarse', 'hard', 'harsh', 'rigid', 'rough', 'sharp', 'stiff'], // Supple
  'supplements': ['food', 'inadequacy', 'medicine'], // Supplements
  'supply': ['deplete'], // Supply
  'support': ['abandon', 'block', 'cruelty', 'disapproval', 'dislike', 'dismiss', 'exploitation', 'harm', 'hinder', 'ignore', 'mockery', 'neglect', 'obstacle', 'oppose', 'reject', 'rejecting', 'resign', 'resistance', 'ridicule', 'scorn'], // Support
  'supportive': ['burdensome'], // Supportive
  'suppress': ['amplify', 'emit', 'manifesting', 'unveiling'], // Suppress
  'suppressed': ['bold', 'clear', 'dynamic', 'empowered', 'expressed', 'free', 'open', 'released', 'visible'], // suppressed
  'suppressing': ['amplifying', 'emphasizing', 'expressing', 'freeing', 'highlighting', 'liberating', 'revealing', 'unleashing'], // Suppressing
  'suppression': ['emanation', 'emergence', 'expansion', 'expression', 'flow', 'freedom', 'growth', 'liberation', 'manifestation', 'promotion', 'release', 'self-expression'], // suppression
  'surface': ['3d', 'core', 'disappear', 'dome', 'dot', 'line', 'polyhedron', 'root', 'strata', 'stratum', 'subsurface', 'tunnel'], // Surface
  'surge': ['drown', 'heavy', 'plummet'], // Surge
  'surplus': ['deplete', 'depletion', 'hunger', 'need', 'reduction'], // Surplus
  'surprise': ['anticipation', 'boring', 'familiar', 'mundane', 'predictable'], // surprise
  'surprising': ['predictable'], // Surprising
  'surreal': ['hyperreal', 'skeuomorphic'], // Surreal
  'surrealism': ['clarity', 'conformity', 'order', 'ordinary', 'realism', 'simplicity'], // Surrealism
  'surrealist-vision': ['normal'], // Surrealist-Vision
  'surrender': ['confront', 'grasp', 'quest', 'victory'], // Surrender
  'surveillance': ['premium'], // Surveillance
  'survival': ['premium'], // Survival
  'suspense': ['heavy', 'safety'], // Suspense
  'suspension': ['action', 'completion', 'resolution'], // Suspension
  'sustain': ['consume', 'expire', 'premium'], // Sustain
  'sustainability': ['consumerism', 'premium', 'wasteful'], // Sustainability
  'sustainable': ['disposable', 'wasteful'], // Sustainable
  'sustenance': ['abandonment', 'deprivation', 'neglect'], // Sustenance
  'sweet': ['bitter', 'bland', 'brutal', 'dry', 'edgy', 'harsh', 'plain', 'rough', 'sharp', 'sour', 'stark'], // Sweet
  'sweetness': ['acridity', 'bitterness', 'harshness', 'sourness'], // Sweetness
  'swift': ['clumsy', 'heavy', 'inactive', 'lethargic', 'ponderous', 'slow', 'sluggish', 'stagnant'], // swift
  'swirl': ['center', 'static', 'straight'], // Swirl
  'swiss': ['brutal', 'chaotic', 'excessive'], // Swiss
  'symbiosis': ['conflict', 'detachment', 'disorder', 'dominance'], // Symbiosis
  'symbolic': ['clear', 'direct', 'literal', 'literal-interpretation', 'mundane', 'obvious', 'ordinary', 'plain', 'simple'], // Symbolic
  'symbolism': ['ambiguous', 'chaotic', 'literal', 'non-representation', 'random'], // Symbolism
  'symmetry': ['asymmetrical', 'asymmetry', 'clustering', 'curvature', 'deconstructivist', 'scribble'], // Symmetry
  'symphonic': ['bland', 'chaotic', 'discordant', 'dissonant', 'dry', 'isolated', 'random', 'simple'], // Symphonic
  'synchronicitic': ['chaos', 'disconnection', 'disorder', 'fragmentation', 'randomness'], // Synchronicitic
  'synchronicitical': ['chaos', 'detachment', 'disorder', 'isolation', 'randomness'], // Synchronicitical
  'synchronicity': ['asynchrony', 'disconnect', 'discord', 'randomness'], // Synchronicity
  'synchronized': ['asynchronous', 'chaotic', 'disjointed', 'fragmented', 'fragmented-visions', 'isolated', 'random', 'uncoordinated', 'uneven'], // Synchronized
  'synergy': ['disunity', 'premium'], // Synergy
  'synthesis': ['curation', 'deconstruction', 'detail', 'divide'], // Synthesis
  'synthesize': ['break', 'deconstruct', 'disperse', 'dissolve', 'divide', 'fragment', 'isolate', 'scatter', 'separate'], // Synthesize
  'synthetic': ['artifact', 'artisanal', 'bio', 'biomorphic', 'botanical', 'cottagecore', 'earthiness', 'environment', 'fibrous', 'flora', 'fluid', 'fruity', 'leather', 'natura', 'naturalistic', 'nature', 'primal', 'wholesomeness'], // Synthetic
  'synthetics': ['wine'], // Synthetics
  'system-centric': ['user-centric'], // System-Centric
  'systematic': ['arbitrary', 'disarrayed', 'disorderly', 'disorganized', 'haphazard', 'random', 'unplanned'], // Systematic
  'systemic': ['heavy'], // Systemic
  'systems': ['chaos', 'disorder', 'fragmentation'], // Systems
  'tabs': ['carousel', 'cluttered', 'complex', 'detached', 'dispersal'], // Tabs
  'tacky': ['alluring', 'artistry', 'chic', 'classy', 'elegant', 'polished', 'refined', 'sophisticated', 'stylish', 'tasteful'], // tacky
  'tail': ['header'], // Tail
  'tainted': ['clear', 'fresh', 'innovative', 'novel', 'original', 'pristine', 'pure', 'unexpected'], // Tainted
  'tame': ['bold', 'captivating', 'chaotic', 'disorderly', 'feral', 'fierce', 'free', 'raw', 'untamed', 'uproarious', 'vivid', 'wild', 'wildness', 'zesty'], // tame
  'tamed': ['untamed'], // Tamed
  'tameness': ['wildness'], // Tameness
  'tangential': ['central', 'constant', 'direct', 'focused', 'linear', 'permanent', 'primary', 'stable'], // Tangential
  'tangibility': ['abstract', 'disembodied', 'ethereal', 'immaterial', 'intangible', 'metaverse', 'vacuum', 'virtualization'], // Tangibility
  'tangible': ['2d', 'abstraction', 'astral', 'behavioral', 'digitalization', 'disembodied', 'disembodiment', 'e-commerce', 'ecommerce', 'ethereal', 'illusory', 'intangible', 'spirit', 'virtual', 'vr'], // Tangible
  'tangle': ['aligned', 'calm', 'clear', 'neat', 'order', 'schematic', 'simple', 'smooth', 'straight'], // Tangle
  'tangled': ['untouched-space'], // Tangled
  'tarnished': ['calm', 'flourishing', 'polished', 'pristine', 'protected', 'renewed', 'thriving', 'vibrant'], // tarnished
  'task': ['freetime', 'hobby'], // Task
  'tasteful': ['gaudy', 'tacky', 'vulgar'], // Tasteful
  'tattered': ['spotless'], // Tattered
  'tea': ['coffee'], // tea
  'team-building': ['individual', 'solo'], // Team-building
  'tear': ['build', 'complete', 'connect', 'heal', 'restore', 'solid', 'union', 'weave', 'whole'], // tear
  'technic': ['amateur', 'fluid', 'free', 'natural', 'organic', 'soft'], // Technic
  'techno': ['minimalist', 'natural', 'organic', 'rustic', 'traditional'], // Techno
  'techno-culture': ['antiquity', 'luddism'], // Techno-culture
  'techno-futurism': ['ancient', 'artnouveau', 'chaotic', 'gothic', 'mundane', 'natural', 'primitive', 'retro', 'simple', 'static', 'steampunk', 'traditional'], // Techno-Futurism
  'techno-futurist': ['art-nouveau', 'organic', 'retro', 'rustic'], // Techno-futurist
  'technographic': ['analog', 'artisanal', 'basic', 'chaotic', 'hand-drawn', 'manual', 'natural', 'organic', 'primitive', 'rustic', 'simple'], // Technographic
  'technology': ['homegoods', 'laundry', 'pharmaceutical', 'premium'], // Technology
  'techwear': ['basic', 'chaotic', 'heritage', 'informal', 'natural', 'primitive', 'rustic', 'traditional', 'unstructured', 'vintage'], // Techwear
  'tedious': ['colorful', 'convenience', 'dynamic', 'engaging', 'exciting', 'fresh', 'lively', 'stimulating', 'vibrant'], // tedious
  'telecommunications': ['isolation', 'silence'], // Telecommunications
  'temporal': ['endless'], // Temporal
  'temporary': ['endless', 'endlessness', 'enduring', 'eternal', 'eternity', 'infinity', 'marble', 'permanent', 'perpetual', 'perpetuity', 'solidity', 'stable', 'statuary', 'timeless'], // temporary
  'temptation': ['discipline', 'restraint'], // Temptation
  'tense': ['calm', 'chill', 'easy', 'gentle', 'laid-back', 'loose', 'mellow', 'quiet', 'reassuring', 'relaxed', 'smooth', 'soft'], // tense
  'tension': ['breeze', 'editorial', 'equilibrium', 'harmony', 'levity', 'relaxation'], // Tension
  'tentativeness': ['decisive'], // Tentativeness
  'terrain': ['abstract', 'artificial', 'civilized', 'cultivated', 'flat', 'ordered', 'sky', 'smooth', 'structured', 'urban', 'void', 'water'], // Terrain
  'terrestrial': ['aether', 'alien', 'aquatic', 'astral', 'astronomical', 'avian', 'celestial', 'cosmic', 'ethereal', 'heavenly', 'lunar', 'marine', 'planetary', 'stellar', 'yachting'], // Terrestrial
  'text': ['authoritative', 'corporate', 'gesture', 'layout', 'premium', 'saas'], // Text
  'textile': ['electronics', 'plastic'], // Textile
  'textual': ['pictorial'], // Textual
  'textuality': ['nonverbal'], // Textuality
  'textural': ['flat', 'minimal', 'plain', 'sleek', 'smooth'], // Textural
  'texture': ['editorial', 'flattening', 'harmony'], // Texture
  'textured': ['flat', 'glassy', 'plain', 'planar', 'slick', 'smoothness'], // Textured
  'textured-abundance': ['sparsity'], // Textured-Abundance
  'thaw': ['crisp', 'expand', 'freeze', 'grow', 'harden', 'solid', 'stiffen', 'thicken'], // thaw
  'theoretical': ['applied', 'concrete', 'empirical', 'experiential', 'functional', 'intuitive', 'practical', 'sensory-grounded', 'simple'], // Theoretical
  'therapy': ['avoidance', 'denial'], // Therapy
  'thick': ['delicate', 'fine', 'fragile', 'light', 'porous', 'sheer', 'slender', 'slim', 'thin', 'translucency'], // thick
  'thicken': ['thaw'], // Thicken
  'thin': ['broad', 'bulky', 'chunky', 'dense', 'filled', 'full', 'heavy', 'massive', 'plump', 'sturdy', 'thick', 'viscous', 'weighty', 'wide'], // Thin
  'thirst': ['abundance', 'fullness', 'quenched', 'satiation', 'satisfaction'], // thirst
  'thorough': ['negligent'], // Thorough
  'thoughtful': ['careless', 'foolish', 'frivolous', 'hasty', 'heavy', 'mindless', 'superficial'], // Thoughtful
  'threat': ['safety'], // Threat
  'threshold': ['boundary', 'end', 'limit'], // Threshold
  'thrifty': ['wasteful'], // Thrifty
  'thrill': ['heavy'], // Thrill
  'thrive': ['dead', 'decay', 'decline', 'drown', 'dull', 'fail', 'halt', 'harm', 'husk', 'shrivel', 'stagnate', 'starve', 'static', 'struggle', 'wilt', 'wither'], // Thrive
  'thriving': ['desolate', 'tarnished', 'withering'], // Thriving
  'thunders': ['calm', 'dull', 'flat', 'gentle', 'quiet', 'soft', 'static', 'subtle', 'whispers'], // Thunders
  'tidy': ['disarrayed', 'disheveled', 'disorganized', 'mess', 'messy'], // Tidy
  'tiered': ['flat', 'single', 'uniform'], // Tiered
  'tight': ['extraneous', 'loose', 'loosen', 'porous', 'spread'], // Tight
  'tightened': ['calm', 'connected', 'easy', 'fluid', 'gentle', 'loosened', 'relaxed', 'smooth', 'unraveled'], // Tightened
  'time': ['eternity', 'stasis', 'timelessness'], // Time
  'timeless': ['disposable', 'ephemeral', 'faddish', 'fleeting', 'modern', 'momentary', 'seasons', 'temporary', 'transient', 'trend'], // Timeless
  'timelessness': ['chronos', 'ephemeral', 'fleeting', 'time', 'transient', 'trendiness'], // Timelessness
  'timeline': ['composition', 'contrast'], // Timeline
  'timely': ['obsolete'], // Timely
  'timid': ['assertive', 'bold', 'brave', 'confident', 'dynamic', 'energetic', 'loud', 'vivid'], // timid
  'timidity': ['assertiveness', 'valor'], // Timidity
  'tingle': ['dullness', 'numbness'], // Tingle
  'tiny': ['colossal', 'enormous', 'gargantuan', 'huge', 'immense', 'massive', 'scale', 'tremendous', 'vast'], // tiny
  'tired': ['active', 'alert', 'dynamic', 'energized', 'lively', 'refreshed', 'vibrant', 'youthfulness'], // Tired
  'tiring': ['energizing', 'engaging', 'exciting', 'invigorating', 'refreshing', 'stimulating'], // Tiring
  'togetherness': ['alienation', 'detachment', 'disconnection', 'distance', 'disunity', 'division', 'isolation', 'loneliness', 'segregation', 'separation', 'solitude'], // togetherness
  'tones': ['complementary', 'coolness', 'mute'], // Tones
  'tools': ['jewelry', 'toys'], // Tools
  'top': ['base', 'below', 'bottom', 'down', 'low', 'lower'], // Top
  'topography': ['flat', 'linear', 'simple', 'smooth', 'uniform'], // Topography
  'torment': ['bliss', 'calm', 'comfort', 'ease', 'harmony', 'joy', 'peace', 'serenity'], // torment
  'torpor': ['vigor'], // torpor
  'total': ['partial'], // Total
  'touched': ['untouched'], // Touched
  'toxic': ['clean', 'clear', 'eco-tech', 'fresh', 'healthy', 'natural', 'pure', 'safe', 'wholesome'], // toxic
  'toxicity': ['nutrition'], // Toxicity
  'toxin': ['beverage'], // Toxin
  'toxins': ['nutraceuticals'], // Toxins
  'toys': ['machinery', 'manufacture', 'tools', 'weapons'], // Toys
  'trace': ['conceal', 'erase', 'obscure'], // Trace
  'tradition': ['counterculture', 'future', 'invention', 'nonconformity', 'reinvention'], // Tradition
  'traditional': ['3d-printed', 'brutalist', 'conceptual', 'cryptocurrency', 'deconstructivism', 'deeptech', 'digitalization', 'disruptive', 'edtech', 'faddish', 'fintech', 'gamified', 'glassmorphism', 'informal', 'innovative', 'irreverent', 'modern', 'new', 'novel', 'offbeat', 'pop-culture', 'postdigital', 'rebel', 'retrofuturism', 'revolutionary', 'streetwear', 'techno', 'techno-futurism', 'techwear', 'vanguard', 'wacky'], // Traditional
  'trajectory': ['inertia', 'pause', 'rest', 'stasis', 'stillness'], // Trajectory
  'tranquil': ['agitated', 'din', 'frantic', 'frenzied', 'frenzy', 'murky'], // Tranquil
  'tranquility': ['agitation', 'anguish', 'cacophony', 'chaos', 'discomfort', 'disorder', 'draining', 'dynamism', 'hassle', 'panic', 'stress', 'tumult', 'turmoil', 'whirlwind'], // Tranquility
  'transcendence': ['base', 'geology', 'mundane', 'ordinary'], // Transcendence
  'transcendent': ['chthonic'], // transcendent
  'transformation': ['constancy', 'fixity', 'stagnation', 'uniformity'], // Transformation
  'transience': ['constancy', 'endurance', 'legacy', 'permanence', 'perpetuity', 'persistence', 'stability', 'substance'], // Transience
  'transient': ['archival', 'artifact', 'enduring', 'eternal', 'eternity', 'fixed', 'lingering', 'permanent', 'perpetual', 'root', 'rooted', 'stable', 'static', 'statuary', 'timeless', 'timelessness', 'unchanging'], // Transient
  'transit': ['heavy', 'rooted'], // Transit
  'transition': ['unchanged'], // Transition
  'transitory-experience': ['perpetual'], // Transitory-Experience
  'transitory-visuals': ['steadfast'], // Transitory-Visuals
  'translucency': ['dense', 'heavy', 'opaque', 'solid', 'sturdy', 'thick'], // Translucency
  'translucent': ['dense', 'opaque', 'solid', 'stone'], // Translucent
  'transparency': ['clutter', 'concealed', 'discretion', 'disguise', 'distrust', 'encasement', 'facade', 'fog', 'haze', 'mist', 'nocturn', 'obscurity', 'opacity', 'shield', 'shroud'], // Transparency
  'transparent': ['concealing', 'covert', 'deceptive', 'fibrous', 'fluid', 'fraudulent', 'graphite', 'insincere', 'investigative', 'opaque', 'private', 'shrouded'], // Transparent
  'trash': ['souvenirs'], // Trash
  'travel': ['boarding', 'cool', 'coolness'], // Travel
  'treasure': ['waste'], // Treasure
  'tremendous': ['tiny'], // Tremendous
  'trend': ['obsolete', 'static', 'timeless'], // Trend
  'trendiness': ['classic', 'dated', 'timelessness'], // Trendiness
  'trendsetting': ['following', 'imitation', 'outdated'], // Trendsetting
  'trendy': ['ancient', 'historical'], // Trendy
  'triadic': ['cool', 'coolness'], // Triadic
  'trim': ['frumpy'], // Trim
  'triumph': ['failure', 'heavy'], // Triumph
  'triumphant': ['defeated'], // Triumphant
  'trivial': ['complex', 'elevated', 'epic', 'important', 'meaning', 'meaningful', 'monumental', 'profound', 'rich', 'significant', 'sublime', 'valuable'], // Trivial
  'triviality': ['grandeur', 'gravitas', 'immensity', 'significance'], // Triviality
  'truce': ['war'], // Truce
  'true': ['fake', 'false', 'fictional', 'insincere'], // True
  'trust': ['corruption', 'deceit', 'disguise', 'distrust', 'doubt', 'doubting', 'fear', 'guilt', 'malice', 'scorn', 'warning'], // Trust
  'trusting': ['doubtful'], // Trusting
  'trustworthy': ['corrupt', 'deceit', 'deceptive', 'dishonest', 'distrust', 'fraudulent', 'insincere', 'shifty', 'unreliable'], // Trustworthy
  'truth': ['ambiguity', 'artifice', 'deceit', 'deception', 'denial', 'disillusion', 'fable', 'facade', 'falsehood', 'illusion', 'illusory', 'impression', 'misrepresentation', 'myth', 'mythos', 'paradox', 'simulacrum'], // Truth
  'tubular': ['angular', 'blocky', 'flat', 'linear', 'rigid', 'solid'], // Tubular
  'tumult': ['calm', 'clarity', 'harmonious-order', 'harmony', 'order', 'serenity', 'simplicity', 'structure', 'tranquility'], // Tumult
  'tundra': ['jungle'], // Tundra
  'tunnel': ['brightness', 'expansion', 'exposure', 'openness', 'surface'], // Tunnel
  'turbulence': ['calm', 'order', 'peace', 'stability', 'stillness'], // turbulence
  'turmoil': ['balance', 'calm', 'composure', 'harmony', 'order', 'peace', 'relaxation', 'serenity', 'stability', 'tranquility'], // turmoil
  'twilight': ['dawn'], // twilight
  'twist': ['clear', 'flat', 'linear', 'rectangle', 'rigid', 'simple', 'static', 'straight', 'uniform'], // twist
  'twisted': ['clear', 'directness', 'flat', 'linear', 'orderly', 'plain', 'simple', 'smooth', 'straight'], // Twisted
  'type': ['authoritative', 'corporate'], // Type
  'typecraft': ['amateur', 'automation', 'chaos', 'default', 'disorder', 'generative', 'generic', 'ignorance', 'mess', 'random', 'simplicity'], // Typecraft
  'typed': ['handwritten'], // typed
  'typeset': ['illustration', 'led', 'scrawl', 'splash'], // Typeset
  'typesetting': ['blurb', 'illustration', 'led', 'splat'], // Typesetting
  'typical': ['extraordinary', 'rare', 'singular', 'uncommon', 'unfamiliar', 'unique', 'uniqueness'], // Typical
  'typographic': ['led', 'nebulous'], // Typographic
  'typography': ['detail', 'digital', 'smeared'], // Typography
  'ubiquitous': ['exclusive', 'isolated', 'limited', 'niche', 'rare', 'scarce', 'special', 'specific', 'unique'], // Ubiquitous
  'ugliness': ['aesthetics', 'beauty'], // Ugliness
  'ugly': ['attractive', 'flawless', 'pleasant'], // Ugly
  'ui': ['composition', 'contrast'], // UI
  'ui-ux': ['illustration', 'led'], // UI/UX
  'unable': ['capable'], // Unable
  'unadorned': ['cosmetics', 'crowned', 'decorated', 'emblematic', 'flamboyant', 'garnish', 'lavish', 'yielding'], // Unadorned
  'unadorned-truth': ['fabricated'], // Unadorned-Truth
  'unanchored': ['anchored'], // unanchored
  'unappealing': ['alluring', 'attractive', 'captivating'], // Unappealing
  'unassisted': ['prosthetics'], // unassisted
  'unassuming': ['imposing', 'pretentious'], // Unassuming
  'unattainable': ['achievable', 'obtainable', 'reachable'], // Unattainable
  'unaware': ['awake', 'awakening', 'perceptive'], // Unaware
  'unawareness': ['health-conscious'], // unawareness
  'unbalanced': ['centered'], // Unbalanced
  'unblemished': ['scratched'], // Unblemished
  'unblock': ['lock'], // Unblock
  'unbound': ['bind', 'bondage', 'bound', 'burdened', 'confined', 'confining', 'constrained', 'constraint', 'enclosed', 'limited', 'restricted', 'restrictive', 'rooted'], // unbound
  'unbounded': ['bottom', 'bounded', 'contained', 'editorial', 'harmony', 'regulated', 'restricted'], // Unbounded
  'unbroken': ['refraction'], // unbroken
  'uncertain': ['accept', 'cast', 'certain', 'charted', 'clear', 'concentrated', 'confident', 'conquer', 'constant', 'corner', 'decisive', 'definite', 'evident', 'explicit', 'fixed', 'fortified', 'identified', 'instant', 'labeled', 'obvious', 'outward', 'reassuring', 'remote', 'resolved', 'robust', 'settled', 'solidity', 'steady', 'straightforward'], // uncertain
  'uncertainty': ['approval', 'belief', 'captivity', 'certain', 'consensus', 'consequence', 'constancy', 'finality', 'fixity', 'fortitude', 'hopeful', 'resolve', 'safety', 'settle', 'stability', 'statement'], // Uncertainty
  'unchanged': ['certain', 'chaotic', 'clear', 'colorful', 'dynamic', 'evolving', 'transition', 'variable', 'vibrant'], // Unchanged
  'unchanging': ['changeable', 'dynamic', 'evolving', 'fluid', 'mutable', 'seasons', 'shift', 'shifting', 'transient', 'variable'], // unchanging
  'uncharted-terrain': ['charted'], // Uncharted-Terrain
  'unclad': ['footwear'], // Unclad
  'unclear': ['explicit', 'obvious', 'reachable', 'specific'], // Unclear
  'uncomfortable': ['pillow'], // Uncomfortable
  'uncommon': ['common', 'everyday-eats', 'familiar', 'mainstream', 'ordinary', 'predictable', 'routine', 'standard', 'typical', 'usual'], // Uncommon
  'unconfined': ['bound', 'confined', 'contained', 'fixed', 'formed', 'formulated-limits', 'gendered', 'limited', 'structured'], // unconfined
  'unconscious': ['conscious'], // unconscious
  'uncontrolled': ['cultivated', 'obedient'], // Uncontrolled
  'uncooked': ['baked'], // uncooked
  'uncoordinated': ['synchronized'], // Uncoordinated
  'uncover': ['cloak', 'conceal', 'cover', 'envelop', 'hide', 'mask', 'obscure', 'shelter', 'shield', 'shroud'], // uncover
  'uncovered': ['covered', 'shrouded'], // Uncovered
  'undefended': ['armored'], // Undefended
  'undefined': ['defined', 'definite', 'formed', 'ordered', 'structured'], // Undefined
  'under': ['above', 'header', 'higher', 'over', 'overlook', 'up', 'upper'], // Under
  'underground': ['conventional', 'mainstream'], // Underground
  'underline': ['carousel', 'composition', 'ignore', 'overlook'], // Underline
  'understanding': ['ambiguity', 'confusion', 'disorder', 'ignorance', 'misunderstanding', 'ridicule'], // Understanding
  'understated': ['confident', 'cool', 'coolness', 'flashy', 'garish', 'gaudy', 'overwrought'], // Understated
  'understated-tranquility': ['clatter'], // Understated-Tranquility
  'understatement': ['exaggeration'], // Understatement
  'understood': ['confused'], // Understood
  'undocumented': ['annotation'], // Undocumented
  'undulating': ['fixed', 'flat', 'rigid', 'solid', 'stable', 'static', 'straight', 'uniform'], // Undulating
  'undulation': ['flat', 'rigid', 'static'], // Undulation
  'uneasy': ['calm', 'comfortable', 'confident', 'content', 'contented', 'easy', 'peaceful', 'relaxed', 'secure'], // uneasy
  'unembellished': ['stylization'], // Unembellished
  'uneven': ['balanced', 'consistent', 'even', 'harmonious', 'level', 'regular', 'round', 'seamless', 'slick', 'smooth', 'smoothness', 'steady', 'synchronized', 'uniform'], // uneven
  'unexpected': ['tainted'], // Unexpected
  'unfamiliar': ['common', 'familiar', 'known', 'ordinary', 'relatable', 'standard', 'typical', 'usual'], // Unfamiliar
  'unfashionable': ['watches'], // Unfashionable
  'unfavor': ['favor'], // Unfavor
  'unfeeling': ['empathetic'], // Unfeeling
  'unfettered': ['bound', 'contained'], // Unfettered
  'unfiltered': ['filtered'], // Unfiltered
  'unfinished': ['finished', 'glazed'], // Unfinished
  'unfinished-thought': ['resolved'], // Unfinished-Thought
  'unfit': ['capable'], // Unfit
  'unfocus': ['fixation'], // Unfocus
  'unfocused': ['clear', 'crisp', 'defined', 'distinct', 'focused', 'logical', 'precise', 'sharp', 'sports', 'vivid'], // Unfocused
  'unfold': ['closed', 'hold'], // Unfold
  'unfolded': ['folded'], // Unfolded
  'unfolding': ['clamping', 'closing', 'compressing', 'concealing', 'confining', 'endgame', 'folding', 'narrowing', 'restricting'], // Unfolding
  'unformed': ['baked', 'bound', 'confined', 'defined', 'formed', 'organized', 'shaped', 'solid', 'structured'], // unformed
  'unfounded': ['based', 'bound', 'certain', 'confined', 'defined', 'established', 'founded', 'solid', 'structured'], // unfounded
  'ungendered': ['defined', 'gender', 'gendered', 'specific', 'structured'], // ungendered
  'ungrounded': ['bound', 'centered', 'defined', 'defined-space', 'fixed', 'grounded', 'rooted', 'secure', 'stable'], // Ungrounded
  'unhappiness': ['euphoria'], // Unhappiness
  'unhappy': ['pleased', 'satisfied'], // Unhappy
  'unhealthiness': ['nutrition'], // unhealthiness
  'unhealthy': ['healthy'], // Unhealthy
  'unhinged': ['calm', 'clear', 'familiar', 'grounded', 'ordinary', 'predictable', 'sane', 'simple', 'stable'], // unhinged
  'unhurried': ['burdened', 'chaotic', 'compressed', 'confined', 'fast', 'hasty', 'instant-delivery', 'rushed', 'urgent'], // Unhurried
  'unified': ['broken', 'chaotic', 'clatter', 'confined', 'conflicted', 'discordant', 'disjointed', 'disorderly', 'dispersed', 'distributed', 'divided', 'fracture', 'fragmented', 'individual', 'interrupted', 'isolated', 'modular', 'partial', 'scattered', 'segmented', 'segregated', 'strata'], // Unified
  'uniform': ['artisanal', 'asymmetry', 'blotchy', 'boutique', 'brushstroke', 'brushwork', 'bump', 'bumpy', 'cellular', 'chaotic', 'chiaroscuro', 'cracked', 'deconstructivism', 'disparate', 'distinction', 'diverse', 'faceted', 'flaky', 'flicker', 'graded', 'grading', 'grained', 'granular', 'handwritten', 'hybrid', 'improvised', 'jagged', 'kaleidoscopic', 'mosaic', 'multi', 'oblique', 'offbeat', 'parallax', 'particulate', 'personalized', 'poly', 'random', 'reactive', 'rebel', 'relief', 'seasons', 'serpentine', 'shift', 'singular', 'speckled', 'splotchy', 'sprawl', 'squiggly', 'strata', 'subjective', 'tiered', 'topography', 'twist', 'undulating', 'uneven', 'unique', 'uniqueness', 'variable', 'variant', 'varied', 'xr'], // Uniform
  'uniform-brightness': ['flicker'], // Uniform-Brightness
  'uniformity': ['adaptability', 'anomaly', 'artistry', 'asymmetry', 'counterculture', 'creativity', 'customization', 'discovery', 'distinctness', 'diversity', 'editorial', 'emergence', 'fluke', 'harmony', 'idiosyncrasy', 'invention', 'jumble', 'lifestyle', 'localism', 'microcosm', 'nonconformity', 'paradox', 'pattern', 'plurality', 'reinvention', 'self-expression', 'transformation'], // Uniformity
  'unify': ['chaos', 'collapse', 'conflict', 'detach', 'disassemble', 'disorder', 'disrupt', 'dissonance', 'divide', 'fragment', 'layering', 'separate', 'split'], // unify
  'unifying': ['divisive'], // Unifying
  'unimpeded': ['interference'], // Unimpeded
  'uninhibited': ['restrained'], // Uninhibited
  'uninquisitive': ['investigative'], // Uninquisitive
  'uninspired': ['evocative'], // uninspired
  'uninspiring': ['alluring', 'stimulating'], // Uninspiring
  'uninsured': ['insurance'], // uninsured
  'unintentional': ['involvement'], // Unintentional
  'uninterrupted': ['bounded', 'chaotic', 'cluttered', 'confined', 'disrupted', 'fragmented', 'interrupted', 'restricted'], // uninterrupted
  'uninviting': ['bistro'], // Uninviting
  'uninvolved': ['engaged'], // Uninvolved
  'union': ['tear'], // Union
  'unique': ['aggregate', 'banal', 'commodity', 'common', 'conform', 'everyday', 'factory', 'generic', 'impersonal', 'massproduced', 'mediocre', 'mundane', 'ordinary', 'pedestrian', 'plain', 'repetitive', 'standard', 'typical', 'ubiquitous', 'uniform'], // Unique
  'uniqueness': ['average', 'common', 'conformity', 'generic', 'homogeneity', 'monoculture', 'mundane', 'ordinary', 'repetition', 'standard', 'typical', 'uniform'], // Uniqueness
  'unison': ['chaos', 'contrast', 'discord', 'dissonance', 'division', 'fractured-harmony', 'fragmentation', 'isolation', 'separation'], // Unison
  'unite': ['break', 'destroy', 'disband', 'disconnect', 'divide', 'fragment', 'isolate', 'scatter', 'separate', 'split'], // unite
  'united': ['divided', 'fragmented', 'isolated', 'separate'], // united
  'uniting': ['dissolving', 'dividing', 'obliterating'], // Uniting
  'units': ['chaos', 'disorder', 'dispersal', 'fragmentation', 'indeterminacy'], // Units
  'unity': ['alienation', 'breakdown', 'complication', 'conflict', 'contradiction', 'contrast', 'curvature', 'deceit', 'deconstruction', 'destruction', 'disconnect', 'disempowerment', 'disorder', 'displeasure', 'dissipation', 'distance', 'disunity', 'divergence', 'duality', 'exile', 'exploitation', 'fragment', 'fragmentation', 'juxtaposition', 'mismatch', 'obliteration', 'particle', 'remnant', 'resistance', 'rupture', 'shunning', 'unruly', 'war'], // Unity
  'universal': ['subjective'], // Universal
  'universality': ['exclusivity', 'subjectivity'], // universality
  'unknown': ['celebrity', 'certain', 'clear', 'defined', 'familiar', 'famous', 'identified', 'known', 'obvious', 'present', 'visible'], // unknown
  'unlabeled': ['annotation', 'labeled'], // Unlabeled
  'unlawful': ['legal'], // Unlawful
  'unleash': ['dull', 'empty', 'lack', 'mute', 'quiet', 'restrain', 'still', 'subdue'], // Unleash
  'unleashing': ['suppressing'], // Unleashing
  'unlimited': ['finite', 'limit'], // Unlimited
  'unlit': ['ignited', 'phosphor'], // Unlit
  'unmark': ['branding'], // unmark
  'unmoved': ['active', 'affected', 'animated', 'dynamic', 'electrified', 'engaged', 'moved', 'responsive', 'stimulated'], // unmoved
  'unmoving': ['mobile'], // Unmoving
  'unmuted': ['withholding'], // Unmuted
  'unnoticed': ['fame', 'famous'], // Unnoticed
  'unobservant': ['investigative'], // Unobservant
  'unpackaged': ['canning'], // unpackaged
  'unplanned': ['deliberate', 'deliberate-composition', 'intentional', 'methodical', 'organized', 'planned', 'predictable', 'premeditated', 'scheduled', 'structured', 'systematic'], // Unplanned
  'unpleasant': ['pleasant'], // Unpleasant
  'unpolished': ['burnished'], // unpolished
  'unpredictable': ['approval', 'behavioral', 'planned', 'predetermined', 'predictable', 'rational', 'regression', 'scheduled'], // Unpredictable
  'unprotected': ['guarded', 'shielded'], // Unprotected
  'unravel': ['construct', 'weave'], // unravel
  'unraveled': ['tightened'], // Unraveled
  'unreachable': ['obtainable', 'reachable'], // Unreachable
  'unreal': ['fact'], // Unreal
  'unrealistic': ['achievable'], // Unrealistic
  'unreality': ['earth'], // Unreality
  'unrefined': ['cgi', 'cosmetics', 'cultivated', 'post-process'], // Unrefined
  'unreliable': ['certain', 'consistent', 'dependable', 'predictable', 'reliable', 'secure', 'steady', 'trustworthy'], // unreliable
  'unremarkable': ['dazzling', 'enchanting', 'exceptional'], // Unremarkable
  'unresponsive': ['reactive'], // Unresponsive
  'unrest': ['composure'], // Unrest
  'unrestricted': ['contained', 'restricted', 'restrictive'], // Unrestricted
  'unruly': ['authoritative', 'calm', 'compliant', 'controlled', 'gentle', 'harmony', 'obedient', 'orderly', 'peaceful', 'regulated', 'smooth', 'unity'], // unruly
  'unscented': ['aromatherapy'], // unscented
  'unscripted': ['script'], // unscripted
  'unseen': ['advertising', 'apparent', 'appearing', 'exposed', 'visible'], // Unseen
  'unsettled': ['anchored', 'calm', 'certain', 'fixed', 'peaceful', 'secure', 'settled', 'stable', 'steady', 'stifled'], // unsettled
  'unskilled': ['skillful'], // Unskilled
  'unstable': ['calm', 'consistent', 'controlled', 'decisive', 'definite', 'fixed', 'fortified', 'permanent', 'perpetuity', 'reassuring', 'reliability', 'reliable', 'resilient', 'resolved', 'robust', 'secure', 'settled', 'stable', 'steadfast', 'steady', 'stoic', 'sturdy'], // unstable
  'unsteady': ['calm', 'certain', 'confined', 'fixed', 'orderly', 'secure', 'stable', 'steady'], // unsteady
  'unstoppable': ['stopped'], // Unstoppable
  'unstructured': ['axis', 'formed', 'modelling', 'procedural', 'robotics', 'sequential', 'storyful', 'techwear'], // Unstructured
  'unsustainable': ['eco-tech'], // Unsustainable
  'untamed': ['confined', 'controlled', 'cultivated', 'formed', 'interrupted', 'ordered', 'restricted', 'retouching', 'structured', 'tame', 'tamed'], // Untamed
  'untouched': ['altered', 'busy', 'cluttered', 'covered', 'decorated', 'messy', 'polluted', 'styled', 'touched', 'worn'], // Untouched
  'untouched-space': ['tangled'], // Untouched-Space
  'unusual': ['normal', 'normalcy', 'predictable'], // Unusual
  'unvalued': ['appreciated', 'defined', 'established', 'formed', 'profit-driven', 'recognized', 'structured', 'validated', 'valued'], // Unvalued
  'unveiled': ['masked'], // Unveiled
  'unveiled-truth': ['false'], // Unveiled-Truth
  'unveiling': ['conceal', 'concealment', 'envelop', 'hide', 'mask', 'masking', 'obscure', 'obscurity', 'secrecy', 'shroud', 'suppress', 'veil'], // Unveiling
  'unwavering': ['hesitant'], // Unwavering
  'unwelcoming': ['hotels'], // Unwelcoming
  'unwieldy': ['aerodynamic'], // Unwieldy
  'unwritten': ['publishing'], // Unwritten
  'unyielding': ['malleable'], // Unyielding
  'up': ['below', 'bottom', 'descent', 'down', 'low', 'lower', 'under'], // Up
  'upbeat': ['downcast', 'pessimistic'], // Upbeat
  'uplift': ['drag', 'dragged', 'drown', 'harm', 'heavy', 'hinder', 'inferior', 'sink'], // Uplift
  'uplifted': ['dreary', 'grim'], // Uplifted
  'uplifting': ['burdensome', 'despairing', 'dismal', 'draining', 'ominous'], // Uplifting
  'uplifting-contrast': ['dreary'], // Uplifting-Contrast
  'upper': ['beneath', 'bottom', 'descend', 'footer', 'lower', 'under'], // Upper
  'uproarious': ['calm', 'dull', 'gentle', 'quiet', 'serene', 'still', 'subdued', 'tame', 'vulnerable-silence'], // uproarious
  'upscale': ['streetfood'], // Upscale
  'urban': ['botanical', 'coastal', 'cottagecore', 'environment', 'flora', 'interior', 'marine', 'natura', 'natural', 'nature', 'nautical', 'pastoral', 'quiet', 'remote', 'rural', 'solitary', 'terrain', 'wilderness'], // Urban
  'urban-distopia': ['utopia'], // Urban-Distopia
  'urbanization': ['gardening'], // urbanization
  'urgency': ['delay', 'heavy', 'slowness'], // Urgency
  'urgent': ['calm', 'complacency', 'delayed', 'leisurely', 'paused', 'slack', 'slow', 'unhurried'], // urgent
  'usable': ['impractical'], // Usable
  'used': ['renew'], // Used
  'useless': ['essential', 'functional', 'meaningful', 'practical-function', 'purposeful', 'reliable', 'significant', 'valuable', 'vibrant'], // Useless
  'user-centric': ['alienated', 'detached', 'developer-centric', 'disconnected', 'impersonal', 'isolated', 'neglectful', 'product-centric', 'selfish', 'system-centric'], // User-Centric
  'usual': ['rare', 'uncommon', 'unfamiliar'], // Usual
  'utilitarian': ['artistic', 'chaotic', 'cosmetics', 'extravagant', 'impractical', 'jewelry', 'ornate'], // Utilitarian
  'utility': ['aesthetics', 'futile', 'obsolescence', 'premium', 'yachting'], // Utility
  'utility-design': ['artless'], // Utility-Design
  'utility-driven': ['pointless'], // Utility-Driven
  'utopia': ['blight', 'chaos', 'despair', 'disorder', 'dystopia', 'failure', 'neglect', 'squalor', 'urban-distopia'], // Utopia
  'utopian': ['bleak', 'chaotic', 'desolate', 'dystopian', 'dystopic', 'grim'], // Utopian
  'utopic': ['dystopic'], // Utopic
  'vacancy': ['active', 'alive', 'crowded', 'dynamic', 'filled', 'hotels', 'occupied', 'populated', 'potency', 'vibrant'], // vacancy
  'vacant': ['assertive', 'certain', 'complete', 'complete-manifestation', 'confident', 'filled', 'full', 'occupied', 'present'], // Vacant
  'vacate': ['assert', 'clarify', 'commit', 'define', 'dwelling', 'engage', 'focus', 'integrate', 'occupy'], // vacate
  'vacillation': ['resolve'], // Vacillation
  'vacuum': ['abundance', 'accumulation', 'certainty', 'chaos', 'clarity', 'context', 'fullness', 'presence', 'purity', 'tangibility'], // vacuum
  'vague': ['bounded', 'certain', 'charted', 'clear', 'concentrated', 'concrete', 'concreteness', 'decisive', 'definite', 'depictive', 'directness', 'distinct', 'exact', 'explicit', 'fixed', 'fixity', 'foreground', 'genuineness', 'hyperreal', 'identified', 'imprint', 'informative', 'labeled', 'logical', 'macro', 'meaning', 'outward', 'practical', 'precise', 'reachable', 'resolved', 'rooted', 'solid', 'solidify', 'solidity', 'specific', 'stable', 'storyful', 'straightforward', 'visible'], // Vague
  'vagueness': ['definition', 'depiction', 'lucidity', 'sense'], // Vagueness
  'valid': ['fake'], // Valid
  'validated': ['unvalued'], // Validated
  'validation': ['ridicule'], // Validation
  'valley': ['summit'], // Valley
  'valor': ['cowardice', 'doubt', 'fear', 'hesitation', 'insecurity', 'perceived-weakness', 'timidity', 'vulnerability', 'weakness'], // valor
  'valuable': ['futile', 'irrelevant', 'petty', 'pointless', 'trivial', 'useless', 'wasteful', 'worthless'], // Valuable
  'value': ['damage', 'dismiss', 'disregard', 'insignificance', 'insipid', 'neglect', 'waste', 'worthless', 'worthlessness'], // Value
  'valued': ['dismissive', 'disposable', 'disregarded', 'ignored', 'unvalued'], // Valued
  'valuing': ['devalue', 'disdainful', 'dismiss', 'disregard', 'ignore', 'neglect', 'overlook', 'reject'], // valuing
  'vanguard': ['common', 'conservative', 'conventional', 'mundane', 'ordinary', 'simple', 'stagnant', 'static', 'traditional'], // Vanguard
  'vanish': ['remain'], // Vanish
  'vanishing': ['appearing', 'emerging', 'manifesting', 'perpetuity', 'solidifying'], // Vanishing
  'vapor': ['dense', 'solid', 'sturdy', 'weighty'], // Vapor
  'vapour': ['dense', 'solid', 'stiff'], // Vapour
  'variability': ['captivity', 'constancy', 'finality'], // Variability
  'variable': ['consistent', 'constant', 'fixed', 'fixed-horizon', 'monolithic', 'predefined', 'predetermined', 'predictable', 'simple', 'stable', 'static', 'unchanged', 'unchanging', 'uniform'], // Variable
  'variant': ['archetype', 'constant', 'fixed', 'monotonous', 'plain', 'simple', 'standard', 'static', 'uniform'], // variant
  'variation': ['archetype', 'repetition'], // variation
  'varied': ['earthen', 'emerald', 'mono', 'monolithic', 'monotonous', 'repetitive', 'uniform'], // Varied
  'variety': ['editorial', 'harmony', 'minimize', 'monoculture', 'monopoly', 'repetitive', 'sameness', 'singular'], // Variety
  'vary': ['repeat'], // Vary
  'vast': ['confined', 'confining', 'diminutive', 'finite', 'insignificant', 'limit', 'limited', 'micro', 'minuscule', 'narrow', 'petty', 'small', 'tiny'], // Vast
  'vastness': ['closure', 'confinement', 'limitation', 'microcosm', 'narrowness', 'petiteness', 'restriction'], // Vastness
  'vector': ['ascii', 'illustration', 'led', 'pixel'], // Vector
  'vector-graphics': ['bitmap', 'pixel', 'raster'], // Vector Graphics
  'veil': ['unveiling'], // Veil
  'veiled': ['blatant', 'clear', 'direct', 'exposed', 'open', 'open-crowns', 'plain', 'revealed', 'simple', 'visible'], // Veiled
  'veiling': ['clear', 'defined', 'direct', 'exposed', 'flat', 'revealing', 'revelation', 'sharp', 'simple'], // veiling
  'velocity': ['calm', 'pause', 'slowness', 'stasis', 'stillness'], // Velocity
  'velvet': ['brittle', 'coarse', 'harsh', 'rough', 'stiff'], // Velvet
  'veneration': ['apathy', 'aversion', 'contempt', 'disdain', 'dismissal', 'indifference', 'irreverence', 'neglect', 'scorn'], // veneration
  'veracity': ['falsehood'], // Veracity
  'verbal': ['abstract', 'non-textual', 'nonverbal', 'silent', 'visual'], // Verbal
  'verbosity': ['brevity', 'clarity', 'conciseness', 'simplicity'], // verbosity
  'verdant': ['barren', 'bleak', 'desolate', 'dry', 'sterile'], // Verdant
  'verisimilitude': ['stylization'], // Verisimilitude
  'vertex': ['base', 'flat', 'horizontal', 'low', 'pit'], // Vertex
  'vertical': ['diagonal', 'rows'], // Vertical
  'verticality': ['flatness', 'groundedness', 'horizontality', 'levelness', 'stability'], // Verticality
  'viable': ['impractical'], // Viable
  'vibrance': ['bleakness'], // Vibrance
  'vibrancy': ['bleak', 'bleakness', 'boredom', 'coldness', 'dimness', 'drab', 'drudgery', 'dull', 'faded', 'gloom', 'lack', 'muted'], // Vibrancy
  'vibrant': ['apathetic', 'banal', 'barren', 'bland', 'bleak', 'blunt', 'bore', 'bored', 'boring', 'cool', 'coolness', 'darkmode', 'desolate', 'despairing', 'dismal', 'dispassionate', 'dormant', 'downcast', 'drab', 'drag', 'drain', 'drained', 'draining', 'dreary', 'dry', 'dull', 'dullard', 'expire', 'foul', 'glacial', 'halt', 'halted', 'haunting', 'idle', 'insipid', 'introverted', 'lame', 'lazy', 'lethargic', 'lifeless', 'mediocre', 'monochrome', 'monotonous', 'mundane', 'mute', 'muted', 'neumorphic', 'noir', 'null', 'obsolete', 'passive', 'pastel', 'paused', 'pedestrian', 'plain', 'ponderous', 'repellent', 'resigned', 'rusty', 'shrivel', 'sluggish', 'sober', 'somber', 'stale', 'sterile', 'stifled', 'stuffy', 'subduing', 'tarnished', 'tedious', 'tired', 'unchanged', 'useless', 'vacancy', 'weak', 'weary', 'wilt', 'withering'], // Vibrant
  'vibration': ['bland', 'dull', 'flat', 'inactive', 'lifeless', 'muted', 'quiet', 'still', 'stillness-tone'], // Vibration
  'vice': ['innocence'], // vice
  'victorian': ['scandinavian'], // victorian
  'victorious': ['defeated'], // Victorious
  'victory': ['collapse', 'defeat', 'failure', 'loss', 'setback', 'struggle', 'surrender', 'weakness'], // victory
  'video': ['frozen', 'illustration', 'led'], // Video
  'vigilance': ['carefree', 'complacency', 'negligence', 'relaxation'], // Vigilance
  'vigilant': ['complacent'], // Vigilant
  'vigor': ['apathy', 'inertia', 'lethargy', 'sloth', 'stagnation', 'torpor', 'weakness'], // Vigor
  'vintage': ['futuristic', 'heavy', 'joy', 'modern', 'techwear'], // Vintage
  'vinyl': ['digital', 'streaming'], // Vinyl
  'violet': ['amber'], // violet
  'virtual': ['concrete', 'physical', 'reality', 'stationery', 'tangible'], // Virtual
  'virtualization': ['materiality', 'physicality', 'presence', 'tangibility'], // Virtualization
  'virtuous': ['corrupt'], // Virtuous
  'visceral': ['heavy'], // Visceral
  'viscous': ['airy', 'clear', 'crisp', 'dry', 'fluid', 'gaseous', 'light', 'simple', 'smooth', 'solid', 'thin'], // Viscous
  'visibility': ['eclipse', 'erasure', 'obscurity', 'premium'], // Visibility
  'visible': ['blind', 'blurred', 'concealed', 'covert', 'dim', 'distant', 'erased', 'faint', 'false', 'forgotten', 'fugitive', 'hidden', 'hiding', 'invisible', 'isolating', 'masked', 'nowhere', 'obscure', 'obscured', 'obscuring', 'opaque', 'private', 'sealed', 'shrouded', 'subsurface', 'subtle', 'suppressed', 'unknown', 'unseen', 'vague', 'veiled'], // Visible
  'vision': ['blindness', 'confusion', 'darkness', 'ignorance', 'obscurity'], // Vision
  'vista': ['confinement', 'narrowness', 'obscurity'], // Vista
  'visual': ['acoustic', 'verbal'], // Visual
  'visualization': ['ambiguity', 'concealment', 'confusion', 'disorder', 'invisibility', 'obscurity'], // Visualization
  'vital': ['insignificant', 'lifeless'], // Vital
  'vitality': ['blackout', 'blight', 'death', 'decay', 'deterioration', 'diminution', 'dormancy', 'fatigue', 'futility', 'husk', 'impotence', 'inertia', 'nonexist', 'obsolescence', 'pollution', 'ruin', 'stagnation'], // Vitality
  'vivid': ['artifact', 'blended', 'bokeh', 'cloudy', 'cold', 'colorless', 'cumbersome', 'dimming', 'dismissive', 'faceless', 'fading', 'faint', 'filtered', 'forgettable', 'frayed', 'frozen', 'grim', 'hushing', 'indistinct', 'matt', 'muffled', 'mute', 'nocturn', 'numb', 'ochre', 'ordinary', 'reserved', 'sameness', 'shallow', 'shrivel', 'tame', 'timid', 'unfocused', 'wash', 'washed', 'wither'], // Vivid
  'vividness': ['bleak', 'darkness', 'dim', 'drab', 'dull', 'faded', 'fog', 'haze'], // Vividness
  'vocal': ['nonverbal'], // Vocal
  'void': ['advertising', 'alive', 'atmosphere', 'aura', 'aurora', 'beacon', 'being', 'beverage', 'block', 'bubble', 'buzz', 'canvas', 'chronos', 'completion', 'conception', 'context', 'corner', 'corridor', 'cosmos', 'creation', 'cylinder', 'day', 'domain', 'dome', 'earth', 'echo', 'element', 'ember', 'energy', 'event', 'existence', 'expression', 'field', 'filled', 'flotilla', 'form', 'frame', 'full', 'fullness', 'genesis', 'gift', 'globe', 'horizon', 'impact', 'imprint', 'ingredients', 'life', 'manifesting', 'mass', 'materials', 'merchandise', 'microcosm', 'might', 'molecular', 'mosaic', 'museum', 'nebula', 'nucleus', 'object', 'origin', 'payments', 'peak', 'point', 'polyhedron', 'presence', 'present', 'publishing', 'pyramid', 'realm', 'richness', 'sculptural', 'shape', 'sky', 'solar', 'source', 'sticker', 'story', 'stratosphere', 'stratum', 'substance', 'summit', 'terrain', 'world'], // Void
  'void-spectrum': ['brilliant'], // Void-Spectrum
  'volatile': ['calm', 'consistent', 'dull', 'perpetual', 'predictable', 'quiet', 'reliability', 'reliable', 'slow', 'stable', 'steadfast', 'steady', 'stoic'], // volatile
  'volume': ['flat', 'flatness', 'flatten', 'flattening', 'fleshless', 'line', 'minimal', 'sparse', 'whisper'], // Volume
  'volumetrics': ['illustration', 'led'], // Volumetrics
  'voluminous': ['2d', 'planar'], // Voluminous
  'vortex': ['calm', 'dispersal', 'flat', 'order', 'stillness'], // Vortex
  'voyage': ['inertia', 'pause', 'rest', 'stasis', 'stillness'], // Voyage
  'vr': ['realistic', 'static', 'tangible'], // VR
  'vulgar': ['academia', 'cultured', 'elegant', 'graceful', 'polished', 'refined', 'sightful', 'sophisticated', 'subtle', 'tasteful'], // vulgar
  'vulgarity': ['dignity'], // Vulgarity
  'vulnerability': ['armored', 'cybersecurity', 'defiant', 'fortitude', 'power', 'protection', 'resilience', 'safety', 'sanctuary', 'shelter', 'shield', 'shielded', 'strength', 'valor'], // Vulnerability
  'vulnerable': ['armored', 'confident', 'defended', 'fortified', 'guarded', 'protected', 'resilient', 'robust', 'secure', 'shielded', 'stoic', 'strong'], // vulnerable
  'vulnerable-silence': ['boisterous', 'raucous', 'uproarious'], // Vulnerable-Silence
  'vulnerable-space': ['fortified'], // Vulnerable-Space
  'wacky': ['conceptual-formalism', 'elegant', 'serious', 'simple', 'sophisticated', 'subdued', 'traditional'], // Wacky
  'wander': ['anchor', 'arrive', 'focus', 'settle'], // Wander
  'wandering': ['anchored', 'fixed', 'focused', 'settled', 'stationary'], // wandering
  'wanderlust': ['premium'], // Wanderlust
  'want': ['affluence', 'bounty', 'need'], // Want
  'war': ['calm', 'cooperation', 'harmony', 'order', 'peace', 'serenity', 'truce', 'unity'], // war
  'warm': ['bitter', 'bleak', 'clinical', 'cold', 'cool', 'coolness', 'cyberpunk', 'distant', 'dramatic', 'frost', 'glacial', 'harsh', 'robotic', 'steel', 'sterile', 'stern'], // Warm
  'warmth': ['bleakness', 'coldness', 'cruelty', 'frost', 'glacial', 'impersonal'], // Warmth
  'warning': ['assurance', 'benefit', 'calm', 'comfort', 'ease', 'freedom', 'invitation', 'reassurance', 'safety', 'security', 'trust'], // Warning
  'wash': ['chaotic', 'dark', 'harsh', 'messy', 'neat', 'saturation', 'sharp', 'stain', 'vivid'], // Wash
  'washed': ['bold', 'indigo', 'intense', 'saturated', 'vivid'], // Washed
  'waste': ['clean', 'conservation', 'eco-tech', 'economy', 'efficacy', 'food', 'ingredients', 'logistics', 'nourish', 'nourishment', 'produce', 'profit', 'renew', 'resource', 'stewardship', 'treasure', 'value'], // Waste
  'wasteful': ['eco-tech', 'efficient', 'practical', 'purposeful', 'resourceful', 'sustainability', 'sustainable', 'thrifty', 'valuable'], // wasteful
  'wastefulness': ['eco-consciousness'], // wastefulness
  'watches': ['chaos', 'disorder', 'heavy', 'ignorance', 'inactivity', 'lackluster', 'machinery', 'raw', 'simplicity', 'stagnation', 'stationary', 'unfashionable'], // Watches
  'watchmaking': ['amateur', 'chaos', 'coarse', 'commodity', 'disorder', 'disposable', 'imprecision', 'inaccuracy', 'mass', 'neglect', 'randomness', 'simplicity'], // Watchmaking
  'water': ['fire', 'terrain', 'wine'], // Water
  'wave': ['dot', 'flat', 'plain', 'rigid', 'smooth', 'solid', 'stable', 'static', 'still'], // wave
  'waver': ['anchor', 'assert', 'certainty', 'commit', 'decide', 'focus', 'solid', 'stable', 'strength'], // Waver
  'wavering': ['based', 'clear', 'constant', 'firm', 'fixed', 'secure', 'solid', 'stable', 'steady'], // wavering
  'wavy': ['even', 'flat', 'linear', 'plain', 'rigid', 'solid', 'static', 'straight'], // Wavy
  'weak': ['armored', 'bold', 'capable', 'deep', 'dynamic', 'empowering', 'fierce', 'fortified', 'healthy', 'intense', 'powerful', 'resilient', 'rich', 'robust', 'skillful', 'strong', 'sturdy', 'vibrant'], // Weak
  'weaken': ['amplify', 'intensify', 'overpower'], // Weaken
  'weakened': ['empowered', 'fortified', 'invigorated', 'strengthened'], // weakened
  'weakness': ['assertiveness', 'conquer', 'force', 'fortitude', 'might', 'potency', 'power', 'resilience', 'shield', 'stamina', 'strength', 'valor', 'victory', 'vigor'], // weakness
  'wealth': ['basic', 'cheap', 'deficiency', 'depletion', 'humble', 'hunger', 'lack', 'misfortune', 'non-profit', 'nonprofit', 'poverty', 'scarcity', 'simple'], // Wealth
  'weapons': ['toys'], // weapons
  'wearables': ['basic', 'desktop', 'disconnected', 'dull', 'immobile', 'inanimate', 'installed', 'obsolete', 'simple', 'static', 'stationary'], // Wearables
  'weary': ['active', 'bright', 'dynamic', 'energized', 'fresh', 'invigorated', 'lively', 'spirited', 'vibrant', 'youthfulness'], // Weary
  'weave': ['break', 'detach', 'disperse', 'tear', 'unravel'], // Weave
  'web': ['illustration', 'led'], // Web
  'weight': ['airiness', 'breeze', 'ease', 'float', 'levity', 'light', 'mirth', 'soft'], // weight
  'weighted': ['flippant', 'weightless'], // Weighted
  'weightiness': ['airiness', 'freeness', 'levity'], // Weightiness
  'weightless': ['anchored', 'burdened', 'grounded', 'heavy', 'weighted'], // Weightless
  'weightlessness': ['grounded', 'heavy'], // Weightlessness
  'weighty': ['airy', 'delicate', 'feathery', 'fluid', 'light', 'sheer', 'soft', 'subtle', 'thin', 'vapor'], // Weighty
  'welcome': ['dismiss', 'expulsion', 'heavy', 'rejecting', 'resign', 'shunning'], // Welcome
  'welcoming': ['cool', 'coolness', 'repellent', 'repelling'], // Welcoming
  'welfare': ['premium'], // Welfare
  'well-being': ['distress', 'hardship', 'illness', 'misery', 'pain', 'suffering'], // Well-Being
  'wellbeing': ['pain', 'professional'], // Wellbeing
  'wellness': ['disease', 'illness', 'neglect'], // Wellness
  'wet': ['arid', 'dry', 'heat'], // Wet
  'whimsical': ['melancholy'], // Whimsical
  'whimsical-flow': ['boring'], // Whimsical-Flow
  'whimsy': ['analysis', 'heavy'], // Whimsy
  'whirl': ['calm', 'stillness'], // Whirl
  'whirlwind': ['calm', 'certainty', 'chronicle', 'order', 'predictability', 'solidity', 'stability', 'stillness', 'tranquility'], // whirlwind
  'whiskey': ['beer', 'non-alcoholic'], // Whiskey
  'whisper': ['blare', 'chaos', 'clutter', 'expose', 'loud', 'mess', 'noise', 'scream', 'shout', 'shouting', 'volume'], // whisper
  'whispered': ['shouted'], // Whispered
  'whispered-shades': ['shouted'], // Whispered-Shades
  'whispering': ['screaming'], // Whispering
  'whispers': ['blasts', 'roars', 'shouts', 'thunders'], // Whispers
  'whole': ['aftermath', 'broken', 'chipped', 'cracked', 'divided', 'dividing', 'divisive', 'folded', 'fracture', 'fragment', 'incomplete', 'modular', 'part', 'partial', 'particle', 'piece', 'remnant', 'scattered', 'scrap', 'section', 'segmented', 'segregated', 'tear'], // whole
  'wholeness': ['breakdown', 'damage', 'detachment', 'disempowerment', 'disorder', 'dispersal', 'duality', 'fragmentation', 'glimpse', 'incompleteness', 'obliteration', 'pollution', 'ruin', 'rupture', 'scrap', 'shatter', 'split'], // Wholeness
  'wholesale': ['boutique'], // Wholesale
  'wholesome': ['brutal', 'cluttered', 'dislike', 'disorder', 'dreary', 'toxic'], // Wholesome
  'wholesomeness': ['artificiality', 'synthetic'], // Wholesomeness
  'wickedness': ['innocence'], // wickedness
  'wide': ['pointed', 'slender', 'thin'], // Wide
  'width': ['narrowness'], // Width
  'wild': ['calm', 'controlled', 'cultivated', 'dentistry', 'formality', 'normal', 'obedient', 'orderly', 'predictable', 'regulated', 'restrained', 'rooted', 'sober', 'structured', 'tame'], // Wild
  'wilderness': ['boarding', 'civilization', 'cultivated', 'domestication', 'order', 'structure', 'urban'], // Wilderness
  'wildness': ['order', 'tame', 'tameness'], // Wildness
  'wilt': ['alive', 'bloom', 'flourish', 'fresh', 'grow', 'prosper', 'thrive', 'vibrant'], // wilt
  'wind': ['calm', 'stagnation', 'stillness'], // Wind
  'wine': ['beer', 'bitter', 'cider', 'grain', 'non-alcoholic', 'soda', 'synthetics', 'water'], // Wine
  'winemaking': ['brewing', 'distilling'], // Winemaking
  'winery': ['chaos', 'destruction', 'digital', 'factory', 'mining', 'poverty', 'service', 'software'], // Winery
  'winning': ['defeated'], // Winning
  'wire': ['airy', 'fabric', 'flexible', 'fluid', 'light', 'loose', 'natural', 'smooth', 'soft', 'solid', 'wood'], // Wire
  'wisdom': ['fleshless', 'foolishness', 'ignorance', 'naivety', 'stupidity'], // Wisdom
  'wise': ['foolish'], // Wise
  'withdrawal': ['penetration', 'recruitment'], // Withdrawal
  'wither': ['bloom', 'expand', 'flourish', 'germination', 'grow', 'prosper', 'radiate', 'thrive', 'vivid'], // wither
  'withering': ['blooming', 'flourishing', 'growing', 'growth', 'lively', 'prospering', 'radiant', 'thriving', 'vibrant'], // withering
  'withhold': ['yield'], // Withhold
  'withholding': ['embracing', 'expressing', 'free', 'full', 'giving', 'open', 'revealing', 'sharing', 'unmuted'], // withholding
  'within': ['beyond'], // Within
  'wobbly': ['definite', 'firm', 'fixed', 'rigid', 'solid', 'stable', 'straight', 'straight-dynamics', 'straightforward'], // wobbly
  'wonder': ['heavy', 'playful'], // Wonder
  'wood': ['concrete', 'fabric', 'glass', 'metal', 'plastic', 'wire'], // Wood
  'work': ['freetime', 'hobby', 'leisure', 'rest'], // Work
  'world': ['bubble', 'chaos', 'isolation', 'void'], // World
  'worldliness': ['naivety'], // Worldliness
  'worldly': ['naive'], // Worldly
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
  'zeal': ['apathy', 'boredom', 'complacency', 'disinterest', 'dullness', 'indifference', 'laziness', 'lethargy'], // Zeal
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