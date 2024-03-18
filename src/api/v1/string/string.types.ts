interface SimpleString {
  translation: string;
  authorId: string;
  comment: string | null;
  timestamp: ReturnType<typeof Date.UTC>;
}

enum Emotion {
  Simple = 'simple',
}

interface Approve {
  authorId: string;
  timestamp: ReturnType<typeof Date.UTC>;
}

type StringSuggestion = SimpleString;
type StringHistoryItem = SimpleString;

export interface TranslationString {
  /**
   * Dialog id. May not be unique.
   */
  edid: string;
  /**
   * String id. Unique.
   */
  stringId: string;
  /**
   * Original string.
   */
  source: string;
  /**
   * ???
   */
  rec: string;
  /**
   * Translated string
   */
  destination: string;
  /**
   * Fuz id. Need to link string to audio file.
   */
  fuzId: string | null;
  /**
   * Emotion for string. Parsed from FuzMap.
   */
  emotion: Emotion | null;
  /**
   * User id, who translate string. Default value is 'machine', which means generated translation.
   */
  authorId: 'machine' | string;
  /**
   * Is string completed and restricted to additional edits.
   */
  isCompleted: boolean;
  /**
   * Id of NPC, if this string belongs to him.
   */
  npcId: string | null;
  /**
   * Quest id, if this string is part of quest.
   */
  questId: string | null;
  /**
   * Type of string. This might be an unique NPC with different gender, generated NPC, player or part of UI.
   */
  type: 'male' | 'female' | 'generic' | 'player' | 'ui' | null;
  /**
   * List of user approves.
   */
  approves: Approve[] | null;
  /**
   * List of history items id. If user suggest translation and then somebody translate suggestion, older versions of translate are placed in collection and links to this attribute.
   */
  history: SimpleString[] | null;
  /**
   * List of suggestion items id. Users can suggest translation and then wait for its approve.
   */
  suggestions: SimpleString[] | null;
}

export interface StringFilters extends Pick<Partial<TranslationString>, 'edid' | 'stringId' | 'source' | 'destination'> {
  pageSize: number;
  page: number;
  isHistorySearch: boolean;
  isSuggestionsSearch: boolean;
  isCaseSensitive: boolean;
  author?: TranslationString['authorId'][];
  npc?: TranslationString['npcId'][];
  quest?: TranslationString['questId'][];
  type?: TranslationString['type'][];
}