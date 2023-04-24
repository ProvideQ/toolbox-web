import {
    Container,
    Slider,
    Textarea,
    Checkbox,
    Select,
    SliderTrack,
    SliderFilledTrack,
    Text, SliderThumb, SliderMark, VStack, Box
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { fetchMetaSolverSettings } from "../../api/ToolboxAPI";

enum MetaSolverSettingType {
    RANGE = "RANGE",
    CHECKBOX = "CHECKBOX",
    TEXT = "TEXT",
    SELECT = "SELECT",
}

export interface MetaSolverSetting {
    name: string;
    type: MetaSolverSettingType;
}

export interface Range extends MetaSolverSetting {
    min: number;
    max: number;
    value: number;
}

export interface Checkbox extends MetaSolverSetting {
    state: boolean;
}

export interface Text extends MetaSolverSetting {
    text: string;
}

export interface Select extends MetaSolverSetting {
    options: string[];
    selectedOption: string;
}

interface SettingsViewProps {
    problemUrl: string;
    settingChanged: (newSettings: MetaSolverSetting[]) => void;
}

export const SettingsView = (props: SettingsViewProps) => {
    const [settings, setSettings] = useState<MetaSolverSetting[]>([]);

    useEffect(() => {
        fetchMetaSolverSettings(props.problemUrl)
            .then((settings: MetaSolverSetting[]) => setSettings(settings))
    }, [props.problemUrl]);

    if (settings.length == 0) {
        return null;
    }

    return (
        <Container>
            <Text>Settings:</Text>

            <Box margin={2} padding={2}
                 borderWidth="1px" borderRadius="lg">
                {settings.map(setting => {
                    let settingView;

                    switch (setting.type) {
                        case MetaSolverSettingType.RANGE:
                            let range = setting as Range;
                            let total = range.max - range.min;
                            let step = total < 100 ? total / 100 : 1;
                            let marks = 5;
                            let markStep = (total / (marks - 1));

                            settingView = (
                                <Slider key={setting.name}
                                        min={range.min} max={range.max}
                                        step={step}
                                        onChange={v => {
                                            range.value = v
                                            props.settingChanged(settings);
                                        }}>
                                    {Array.from({length: marks}, (_, i) => {
                                        return (
                                            <SliderMark key={i} value={i * markStep}>
                                                {i * markStep}
                                            </SliderMark>
                                        );
                                    })}
                                    <SliderTrack>
                                        <SliderFilledTrack/>
                                    </SliderTrack>

                                    <SliderThumb/>
                                </Slider>
                            );
                            break;
                        case MetaSolverSettingType.CHECKBOX:
                            let checkbox = setting as Checkbox;
                            settingView = <Checkbox key={checkbox.name}
                                                    defaultChecked={checkbox.state}
                                                    onChange={e => {
                                                        checkbox.state = e.target.checked;
                                                        props.settingChanged(settings);
                                                    }}/>;
                            break;
                        case MetaSolverSettingType.TEXT:
                            let text = setting as Text;
                            settingView = <Textarea key={text.name}
                                                    defaultValue={text.text}
                                                    onChange={e => {
                                                        text.text = e.target.value;
                                                        props.settingChanged(settings);
                                                    }}/>;
                            break;
                        case MetaSolverSettingType.SELECT:
                            let select = setting as Select;
                            settingView = (
                                <Select key={select.name}
                                        defaultValue={select.selectedOption}
                                        onChange={e => {
                                            select.selectedOption = e.target.value;
                                            props.settingChanged(settings);
                                        }}>
                                    {select.options.map(option => <option key={option}>{option}</option>)}
                                </Select>
                            );
                            break;
                        default:
                            return null;
                    }

                    return (
                        <VStack key={setting.name}
                                align="left"
                                paddingY="2">
                            <Text align="left">{setting.name}</Text>

                            {settingView}
                        </VStack>
                    );
                })}
            </Box>
        </Container>
    );
}