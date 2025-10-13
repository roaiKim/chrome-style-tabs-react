import { useId, useState } from "react";
import { ItemParams, useContextMenu } from "react-contexify";
import { ChromeFilled } from "@ant-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { ContextMenu, ContextMenuType } from "./ContextMenu";
import { ChromeStyleTabs, ChromeStyleTabType } from "../src/index";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: "Example/chrome-style-tabs",
    component: ChromeStyleTabs,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
        docs: {
            // 👇 Enable Code panel for all stories in this file
            codePanel: true,
        },
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        // backgroundColor: { control: 'color' },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    args: { onClick: fn() },
} satisfies Meta<typeof ChromeStyleTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultTabs = new Array(15).fill(0).map((item, index) => ({
    key: "Chrome" + index,
    label: "Chrome " + index,
    icon: <ChromeFilled />,
    // disabled: index % 2 === 0,
}));

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Base: Story = {
    args: {
        tabs: defaultTabs,
    },
    render: function ChromeExample() {
        const [tabs, setTabs] = useState<ChromeStyleTabType[]>(
            new Array(15).fill(0).map((item, index) => ({
                key: "Chrome" + index,
                label: "Chrome " + index,
                icon: <ChromeFilled />,
                // disabled: index % 2 === 0,
            }))
        );
        const [activeKey] = useState("Chrome3");

        return (
            <div style={{ width: "calc(100vw - 100px)", height: "80vh", background: "#ccc", padding: 10 }}>
                <ChromeStyleTabs
                    tabs={tabs}
                    activeKey={activeKey}
                    onClose={(tab, index, tabs) => {
                        setTabs(tabs);
                    }}
                    onDrag={(tabs) => {
                        setTabs(tabs);
                    }}
                />
            </div>
        );
    },
};

export const WithCloseBefore: Story = {
    args: {
        tabs: defaultTabs,
    },
    render: function ChromeExample() {
        const [tabs, setTabs] = useState<ChromeStyleTabType[]>(
            new Array(15).fill(0).map((item, index) => ({
                key: "Chrome" + index,
                label: "Chrome " + index,
                icon: <ChromeFilled />,
                // disabled: index % 2 === 0,
            }))
        );
        const [activeKey] = useState("Chrome3");

        const onCloseBefore = (tab: ChromeStyleTabType, index: number): Promise<boolean> => {
            return new Promise((resolve) => {
                const confirm = window.confirm(`Are you sure you want to close the tag ${tab.label}?`);
                resolve(confirm);
            });
        };

        return (
            <div style={{ width: "calc(100vw - 100px)", height: "80vh", background: "#ccc", padding: 10 }}>
                <ChromeStyleTabs
                    tabs={tabs}
                    activeKey={activeKey}
                    onClose={(tab, index, tabs) => {
                        setTabs(tabs);
                    }}
                    onDrag={(tabs) => {
                        setTabs(tabs);
                    }}
                    onCloseBefore={onCloseBefore}
                />
            </div>
        );
    },
};

export const WithNoDrag: Story = {
    args: {
        tabs: defaultTabs,
    },
    render: function ChromeExample() {
        const [tabs, setTabs] = useState<ChromeStyleTabType[]>(
            new Array(15).fill(0).map((item, index) => ({
                key: "Chrome" + index,
                label: "Chrome " + index,
                icon: <ChromeFilled />,
                // disabled: index % 2 === 0,
            }))
        );
        const [activeKey] = useState("Chrome3");

        return (
            <div style={{ width: "calc(100vw - 100px)", height: "80vh", background: "#ccc", padding: 10 }}>
                <ChromeStyleTabs
                    tabs={tabs}
                    activeKey={activeKey}
                    onClose={(tab, index, tabs) => {
                        setTabs(tabs);
                    }}
                    draggable={false}
                    onDrag={(tabs) => {
                        setTabs(tabs);
                    }}
                />
            </div>
        );
    },
};

export const WithContextMenu: Story = {
    args: {
        tabs: defaultTabs,
    },
    render: function ChromeExample() {
        const [tabs, setTabs] = useState<ChromeStyleTabType[]>(
            new Array(15).fill(0).map((item, index) => ({
                key: "Chrome" + index,
                label: "Chrome " + index,
                icon: <ChromeFilled />,
                // disabled: index % 2 === 0,
            }))
        );
        const MENU_ID = useId();
        const [activeKey, setActiveKey] = useState("Chrome3");

        const { show } = useContextMenu({
            id: MENU_ID,
        });

        function handleContextMenu(event: React.MouseEvent<HTMLDivElement, MouseEvent>, config: { id: string | number; index: number }) {
            show({ event, props: config });
        }

        function handleItemClick({ event, props, triggerEvent, data }: ItemParams<any, any>) {
            switch (data) {
                case ContextMenuType.close:
                    // closeTab(props.id);
                    return;
                case ContextMenuType.refresh:
                    if (activeKey === props.id) {
                        // refreshAuto(props.id);
                    }
                    return;
                case ContextMenuType.closeOther:
                    // closeOtherTab(props.id);
                    return;
                case ContextMenuType.closeAll:
                    // closeAllTab();
                    return;
                case ContextMenuType.closeRight:
                    // closeRightTab(props.id);
                    return;
                case ContextMenuType.closeLeft:
                    // closeLeftTab(props.id);
                    return;
            }
        }

        return (
            <div style={{ width: "calc(100vw - 100px)", height: "80vh", background: "#ccc", padding: 10 }}>
                <ContextMenu contextMenuClick={handleItemClick} menuId={MENU_ID} />
                <ChromeStyleTabs
                    tabs={tabs}
                    activeKey={activeKey}
                    onClose={(tab, index, tabs) => {
                        setTabs(tabs);
                    }}
                    onDrag={(tabs) => {
                        setTabs(tabs);
                    }}
                    onContextMenu={handleContextMenu}
                />
            </div>
        );
    },
};
