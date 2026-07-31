import { Divider, Flex, HStack, IconButton, Tooltip } from "@chakra-ui/react";
import { ComponentType, ReactNode, useState } from "react";
import { IconBaseProps } from "react-icons";
import {
  BsDatabaseFillGear,
  BsInfoCircle,
  BsSliders2Vertical,
} from "react-icons/bs";
import { FaCodeCompare } from "react-icons/fa6";
import { ProblemConfiguration } from "../../solvers/Graph/configuration/ProblemConfiguration";
import { Dummy } from "../../solvers/Graph/Dummy";
import { EquivalenceChecking } from "../../solvers/Graph/equivalence/EquivalenceChecking";
import { ProblemDetails } from "../../solvers/Graph/ProblemDetails";
import { useNodeDetails } from "../../solvers/Graph/state/useNodeDetails";
import { SolverConfiguration } from "../../solvers/SolverConfiguration";
import { PageLayout } from "./PageLayout";

const SIDEBAR_LOCATIONS = [
  "bottomLeft",
  "topLeft",
  "topRight",
  "bottomRight",
] as const;

type SidebarLocation = (typeof SIDEBAR_LOCATIONS)[number];
type ToolKey =
  | "dummy1"
  | "dummy2"
  | "dummy3"
  | "dummy4"
  | "dummy5"
  | "problemConfiguration"
  | "problemDetails"
  | "equivalenceChecking";

interface Tool {
  component: ReactNode;
  icon: ComponentType<IconBaseProps>;
  label: string;
  location: SidebarLocation;
}

type ToolConfig = Record<ToolKey, Tool>;
type SidebarConfig = Record<SidebarLocation, ToolKey | undefined>;

const INITIAL_SIDEBAR_CONFIG: SidebarConfig = {
  bottomLeft: undefined,
  topLeft: "problemConfiguration",
  topRight: "problemDetails",
  bottomRight: "equivalenceChecking",
};

interface MainPageProps {
  description: ReactNode;
}

export function MainPage({ description }: MainPageProps) {
  const [knapsackProblem, setKnapsackProblem] = useState("");
  const [sidebarConfig, setSidebarConfig] = useState<SidebarConfig>(
    INITIAL_SIDEBAR_CONFIG,
  );
  const nodeDetails = useNodeDetails();

  const toolConfig: ToolConfig = {
    problemConfiguration: {
      component: (
        <ProblemConfiguration
          description={description}
          knapsackProblem={knapsackProblem}
          setKnapsackProblem={setKnapsackProblem}
        />
      ),
      icon: BsSliders2Vertical,
      label: "Problem configuration",
      location: "topLeft",
    },
    problemDetails: {
      component: nodeDetails.problemDtos.map((problemDto) => (
        <div key={problemDto.id}>
          <ProblemDetails problemDto={problemDto} />
          <Divider />
        </div>
      )),
      icon: BsDatabaseFillGear,
      label: "Problem details",
      location: "topRight",
    },
    equivalenceChecking: {
      component: <EquivalenceChecking />,
      icon: FaCodeCompare,
      label: "Equivalence checking",
      location: "bottomRight",
    },
    dummy1: {
      component: <Dummy />,
      icon: BsInfoCircle,
      label: "Dummy 1",
      location: "bottomLeft",
    },
    dummy2: {
      component: <Dummy />,
      icon: BsInfoCircle,
      label: "Dummy 2",
      location: "bottomLeft",
    },
    dummy3: {
      component: <Dummy />,
      icon: BsInfoCircle,
      label: "Dummy 3",
      location: "topLeft",
    },
    dummy4: {
      component: <Dummy />,
      icon: BsInfoCircle,
      label: "Dummy 4",
      location: "topRight",
    },
    dummy5: {
      component: <Dummy />,
      icon: BsInfoCircle,
      label: "Dummy 5",
      location: "bottomRight",
    },
  };

  const sidebarContent = getSidebarContent(toolConfig, sidebarConfig);

  return (
    <PageLayout
      topbarContent={
        <ToolTopbar
          toolConfig={toolConfig}
          sidebarConfig={sidebarConfig}
          onToolClick={(toolKey) => {
            const location = toolConfig[toolKey].location;

            setSidebarConfig((currentConfig) => ({
              ...currentConfig,
              [location]:
                currentConfig[location] === toolKey ? undefined : toolKey,
            }));
          }}
        />
      }
      leftTopSidebarContent={sidebarContent.topLeft}
      leftBottomSidebarContent={sidebarContent.bottomLeft}
      rightTopSidebarContent={sidebarContent.topRight}
      rightBottomSidebarContent={sidebarContent.bottomRight}
    >
      <SolverConfiguration
        problemTypeId="Knapsack"
        problemInput={knapsackProblem}
      />
    </PageLayout>
  );
}

interface ToolTopbarProps {
  toolConfig: ToolConfig;
  sidebarConfig: SidebarConfig;
  onToolClick: (toolKey: ToolKey) => void;
}

function ToolTopbar({
  toolConfig,
  sidebarConfig,
  onToolClick,
}: ToolTopbarProps) {
  const toolGroups = SIDEBAR_LOCATIONS.map((location) => ({
    location,
    tools: (Object.entries(toolConfig) as [ToolKey, Tool][]).filter(
      ([, tool]) => tool.location === location,
    ),
  })).filter(({ tools }) => tools.length > 0);

  return (
    <Flex width="100%" justify="flex-end">
      <HStack spacing="2">
        {toolGroups.map(({ location, tools }, groupIndex) => (
          <HStack key={location} spacing="2">
            {groupIndex > 0 && (
              <Divider
                height="1.75rem"
                orientation="vertical"
                borderColor="gray.400"
              />
            )}

            {tools.map(([toolKey, tool]) => {
              const Icon = tool.icon;
              const isActive = sidebarConfig[location] === toolKey;

              return (
                <Tooltip key={toolKey} label={tool.label}>
                  <IconButton
                    aria-label={tool.label}
                    icon={<Icon />}
                    size="sm"
                    bg={isActive ? "white" : "transparent"}
                    _hover={{ bg: isActive ? "white" : "transparent" }}
                    _active={{ bg: isActive ? "white" : "transparent" }}
                    onClick={() => onToolClick(toolKey)}
                  />
                </Tooltip>
              );
            })}
          </HStack>
        ))}
      </HStack>
    </Flex>
  );
}

function getSidebarContent(
  toolConfig: ToolConfig,
  sidebarConfig: SidebarConfig,
): Record<SidebarLocation, ReactNode> {
  return Object.fromEntries(
    SIDEBAR_LOCATIONS.map((location) => {
      const activeToolKey = sidebarConfig[location];

      return [
        location,
        activeToolKey ? toolConfig[activeToolKey].component : undefined,
      ];
    }),
  ) as Record<SidebarLocation, ReactNode>;
}
