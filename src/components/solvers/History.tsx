import {
  Button,
  Divider,
  Heading,
  List,
  ListItem,
  Stack,
} from "@chakra-ui/react";
import { ProblemState, ProblemTypeSolutionId } from "./ProgressHandler";

interface HistoryProps<T> {
  problemStates: ProblemState<T>[];

  setContent: (t: T) => void;
  loadSolution: (id: ProblemTypeSolutionId) => void;
}

export const History = <T extends {}>(props: HistoryProps<T>) => {
  if (props.problemStates.length == 0) return null;

  function reloadState(state: ProblemState<T>) {
    props.setContent(state.content);
    props.loadSolution(state.solutionIds);
  }

  return (
    <Stack>
      <Heading as="h3" size="md" textAlign="center">
        History
      </Heading>
      <List>
        {props.problemStates.map((x) => {
          let contentString = x.content.toString();
          return (
            <ListItem key={contentString}>
              <Button
                width="200px"
                overflow="hidden"
                variant="link"
                onClick={(_) => reloadState(x)}
              >
                {contentString}
              </Button>
              <Divider />
            </ListItem>
          );
        })}
      </List>
    </Stack>
  );
};
