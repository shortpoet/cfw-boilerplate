export interface UiState {
  alaCartePath: Ref<string>;
  otherPaths: ComputedRef<string[]>;
  setNewPath: (name: string) => void;
}
