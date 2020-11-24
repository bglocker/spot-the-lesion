import { useUniqueRandomGenerator } from "../../components";
import { getFileIdRange } from "../../utils/GameUtils";
import useArrayGenerator from "../../components/useArrayGenerator";

/**
 * Custom hook for generating a new file id, either from the given difficulty,
 * or from the given array of challenge file ids
 *
 * @param difficulty       Game difficulty, setting the range for random file id generation
 * @param challengeFileIds Array of challenge file ids
 *
 * @return File id generator function
 */
const useFileIdGenerator = (
  difficulty: Difficulty,
  challengeFileIds: number[] | undefined
): (() => number) => {
  const getNewRandomFileId = useUniqueRandomGenerator(getFileIdRange(difficulty));
  const getNewChallengeFileId = useArrayGenerator(challengeFileIds || []);

  return () => {
    if (challengeFileIds) {
      return getNewChallengeFileId();
    }

    return getNewRandomFileId();
  };
};

export default useFileIdGenerator;
