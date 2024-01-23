import {
  Button,
  Divider,
  Heading,
  List,
  ListItem,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import { ProblemState } from "./ProgressHandler";

interface HistoryProps<T> {
  problemStates: ProblemState<T>[];

  onRequestRollback: (problemState: ProblemState<T>) => void;
}

export const History = <T extends {}>(props: HistoryProps<T>) => {
  if (props.problemStates.length == 0) return null;

  function reloadState(state: ProblemState<T>) {
    props.onRequestRollback(state);
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
              <Tooltip label={contentString}>
                <Button
                  width="200px"
                  overflow="hidden"
                  variant="link"
                  onClick={(_) => reloadState(x)}
                >
                  {contentString}
                </Button>
              </Tooltip>
              <Divider />
            </ListItem>
          );
        })}
      </List>
    </Stack>
  );
};
