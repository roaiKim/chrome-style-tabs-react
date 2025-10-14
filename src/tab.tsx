import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ChromeStyleTabsProps } from "./chrome-style-tabs";
import { CloseSvg, TabBackageSvg } from "./tab-path";
export interface ChromeStyleTabType {
    /**
     * @description Icon displayed in the tab
     */
    icon?: React.ReactNode;

    /**
     * @description Title/label displayed in the tab
     */
    label: React.ReactNode;

    /**
     * @description Unique identifier for the tab
     */
    key: string | number;

    /**
     * @description Whether to show the close button
     * @default true
     */
    allowClose?: boolean;

    /**
     * @description Whether the tab is disabled (non-interactive)
     * @default false
     */
    disabled?: boolean;
}

type PickPropsOfChromeStyleTabs = "onContextMenu";

interface TabItemProps extends Pick<ChromeStyleTabsProps, PickPropsOfChromeStyleTabs> {
    index: number;
    tab: ChromeStyleTabType;
    isActive: boolean;
    onClose?: (active: string | number) => void;
    onClick?: (tab: ChromeStyleTabType, index: number) => void;
    isFirstTab: boolean;
    isLastTab: boolean;
}

export function TabItem(props: TabItemProps) {
    const { tab, isActive, onClose, onClick, index, isFirstTab, isLastTab, onContextMenu } = props;
    const { key, label, icon, disabled, allowClose = true } = tab;

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: key, disabled });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        display: "inline-block",
        zIndex: isDragging ? 101 : 100,
    };

    return (
        <div
            key={key}
            ref={setNodeRef}
            style={style}
            className={`cst-item ${isActive ? "active" : ""} ${isFirstTab ? "cst-first-tab" : isLastTab ? "cst-last-tab" : ""}`}
            {...attributes}
            {...listeners}
        >
            <div className="cst-bg">
                <TabBackageSvg />
            </div>
            <div
                className="cst-context"
                onClick={() => {
                    if (onClick) {
                        onClick(tab, index);
                    }
                }}
                {...(onContextMenu ? { onContextMenu: (event) => onContextMenu(event, { id: key, index }) } : {})}
            >
                <div className="cst-icon">{icon}</div>
                <div className="cst-text">{label}</div>
                {!!allowClose && (
                    <div
                        className="cst-close"
                        onClick={(event) => {
                            event.stopPropagation();
                            if (onClose) {
                                onClose(key);
                            }
                        }}
                    >
                        <CloseSvg />
                    </div>
                )}
            </div>
        </div>
    );
}
