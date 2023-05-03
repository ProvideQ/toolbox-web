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
import {
    RangeSetting,
    CheckboxSetting,
    TextSetting,
    SelectSetting,
    MetaSolverSetting,
    MetaSolverSettingType
} from "../../api/data-model/MetaSolverSettings";

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

    function replaceSetting<T extends MetaSolverSetting>(key: string, newValue: T): MetaSolverSetting[] {
        const index = settings.findIndex(setting => setting.name === key);
        if (index !== -1) {
            settings.splice(index, 1, newValue);
        }
        return settings;
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
                            let range = setting as RangeSetting;
                            let total = range.max - range.min;
                            let step = total < 100 ? total / 100 : 1;
                            let marks = 5;
                            let markStep = (total / (marks - 1));

                            settingView = (
                                <Slider key={setting.name}
                                        min={range.min} max={range.max}
                                        step={step}
                                        onChange={v => {
                                            const newSettings = replaceSetting<RangeSetting>(setting.name, {
                                                ...range,
                                                value: v
                                            });
                                            props.settingChanged(newSettings);
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
                            let checkbox = setting as CheckboxSetting;
                            settingView = <Checkbox key={checkbox.name}
                                                    defaultChecked={checkbox.state}
                                                    onChange={e => {
                                                        const newSettings = replaceSetting<CheckboxSetting>(setting.name, {
                                                            ...checkbox,
                                                            state: e.target.checked
                                                        });
                                                        props.settingChanged(newSettings);
                                                    }}/>;
                            break;
                        case MetaSolverSettingType.TEXT:
                            let text = setting as TextSetting;
                            settingView = <Textarea key={text.name}
                                                    defaultValue={text.text}
                                                    onChange={e => {
                                                        const newSettings = replaceSetting<TextSetting>(setting.name, {
                                                            ...text,
                                                            text: e.target.value
                                                        });
                                                        props.settingChanged(newSettings);
                                                    }}/>;
                            break;
                        case MetaSolverSettingType.SELECT:
                            let select = setting as SelectSetting;
                            settingView = (
                                <Select key={select.name}
                                        defaultValue={select.selectedOption}
                                        onChange={e => {
                                            const newSettings = replaceSetting<SelectSetting>(setting.name, {
                                                ...select,
                                                selectedOption: e.target.value
                                            });
                                            props.settingChanged(newSettings);
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