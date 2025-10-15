import { useEffect, useMemo, useRef, useState } from "react";
import { closestCenter, DndContext, type DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { type ChromeStyleTabType, TabItem } from "./tab";
import { NextSvg, PrevSvg } from "./tab-path";
import "./index.less";

export interface ChromeStyleTabsProps {
    /**
     * @description Custom class name for the component container
     */
    className?: string;

    /**
     * @description Inline style for the component container
     */
    style?: React.CSSProperties;

    /**
     * @description Default active tab key (for uncontrolled mode)
     */
    defaultActiveKey?: string | number;

    /**
     * @description Active tab key (for controlled mode)
     */
    activeKey?: string | number;

    /**
     * @description Data source for tabs
     */
    tabs: ChromeStyleTabType[];

    /**
     * @description Whether tabs can be dragged for sorting
     * @default true
     */
    draggable?: boolean;

    /**
     * @description Scroll distance when clicking the left/right navigation buttons
     */
    scrollStep?: number;

    /**
     * @description Callback when a tab is clicked
     * @param tab The currently clicked tab
     * @param index The index of the currently clicked tab
     * @returns void
     */
    onClick?: (tab: ChromeStyleTabType, index: number) => void;

    /**
     * @description Callback when a tab is closed
     * @param tab The currently closed tab
     * @param index The index of the currently closed tab
     * @param tabs A copy of the tab list after closing
     * @returns void
     */
    onClose?: (tab: ChromeStyleTabType, index: number, tabs: ChromeStyleTabType[]) => void;

    /**
     * @description Callback when the active tab is switched
     * @param key The key of the active tab
     * @returns void
     */
    onChange?: (key: string | number) => void;

    /**
     * @description Callback when tabs are reordered via dragging (requires draggable to be true; draggable defaults to true)
     * @param tabs The reordered tab list
     * @returns void
     */
    onDrag?: (tabs: ChromeStyleTabType[]) => void;

    /**
     * @description Callback before a tab is closed (for confirmation)
     * @param tab The tab to be closed
     * @param index The index of the tab to be closed
     * @returns Promise<boolean>; Return true to close the tab, false to prevent closing
     */
    onCloseBefore?: (tab: ChromeStyleTabType, index: number) => Promise<boolean>;

    /**
     * @description Callback when right-click context menu is triggered on a tab
     * @param event The mouse event object for the right-click
     * @param config Configuration containing the tab's id and index
     * @returns void
     */
    onContextMenu?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, config: { id: string | number; index: number }) => void;
}

function ChromeStyleTabs(props: ChromeStyleTabsProps) {
    const {
        tabs = [],
        activeKey,
        defaultActiveKey,
        scrollStep = 100,
        onClick,
        onClose,
        onChange,
        draggable = true,
        onDrag,
        className,
        style,
        onCloseBefore,
        onContextMenu,
    } = props;
    const [activeTabKey, setActiveTabKey] = useState(defaultActiveKey);

    const scrollStepNumber = useMemo(() => {
        if (scrollStep && typeof scrollStep === "number") {
            return scrollStep < 0 ? 100 : scrollStep;
        }
        return 100;
    }, [scrollStep]);

    const tabContainerRef = useRef<any>(null);
    const observerRef = useRef(null);

    const [prevAndNextBtnConfig, setPrevAndNextBtnConfig] = useState<Record<"prev" | "next", boolean>>({
        prev: false,
        next: false,
    });

    const onTabClose = (key: string | number) => {
        const index = tabs.findIndex((item) => item.key === key);
        const currentCloseTab = tabs[index];
        const afterTabs = tabs.filter((item) => item.key !== key);
        if (onClose) {
            onClose(currentCloseTab, index, afterTabs);
        }
        if (key === activeTabKey) {
            // has next tab
            const nextTab = tabs[index + 1];
            if (nextTab) {
                const nextActive = nextTab.key;
                setActiveTabKey(nextActive);
            } else {
                const nextActive = tabs[index - 1]?.key || "";
                setActiveTabKey(nextActive);
            }
        }
    };

    const onTabCloseBefore = (key: string | number) => {
        if (onClose) {
            if (onCloseBefore) {
                const index = tabs.findIndex((item) => item.key === key);
                const currentCloseTab = tabs[index];
                const result = onCloseBefore(currentCloseTab, index);
                if (result instanceof Promise) {
                    result.then((config) => {
                        if (config === true) {
                            onTabClose(key);
                        }
                    });
                }
            } else {
                onTabClose(key);
            }
        }
    };

    const onTabClick = (tab: ChromeStyleTabType, index: number) => {
        if (onClick) {
            onClick(tab, index);
        }
        if (activeTabKey !== tab.key) {
            setActiveTabKey(tab.key);
        }
    };

    const tabContainerWheel = (event) => {
        if (!tabContainerRef.current) return;
        tabContainerRef.current.scrollLeft += event.deltaY;
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        if (!draggable || !onDrag) return;
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = tabs.findIndex((item) => item.key === active.id);
            const newIndex = tabs.findIndex((item) => item.key === over.id);
            const afterTabs = arrayMove(tabs, oldIndex, newIndex);
            onDrag(afterTabs);
        }
    };

    const stepScrollTab = (delta: number) => {
        if (tabContainerRef.current) {
            tabContainerRef.current.scrollLeft += delta;
        }
    };

    const tabObserver = () => {
        const box = tabContainerRef.current;
        const firstTab = document.querySelector<HTMLDivElement>(".cst-first-tab"); // first tab
        const lastTab = document.querySelector<HTMLDivElement>(".cst-last-tab"); // last tab
        if (!box || (!firstTab && !lastTab)) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        const options = {
            root: box,
            rootMargin: "0px",
            threshold: 0.7,
        };

        // create Observer
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.target) {
                    const element = entry.target as HTMLDivElement;
                    if (element.dataset?.index === "first") {
                        const prev = !entry.isIntersecting;
                        setPrevAndNextBtnConfig((prevState) => ({ ...prevState, prev }));
                    } else if (element.dataset?.index === "last") {
                        const next = !entry.isIntersecting;
                        setPrevAndNextBtnConfig((prevState) => ({ ...prevState, next }));
                    }
                }
            });
        }, options);

        if (firstTab) {
            firstTab.dataset.index = "first";
            observerRef.current.observe(firstTab);
        }

        if (lastTab) {
            lastTab.dataset.index = "last";
            observerRef.current.observe(lastTab);
        }
    };

    useEffect(() => {
        setActiveTabKey(activeKey);
    }, [activeKey]);

    useEffect(() => {
        if (onChange) {
            onChange(activeTabKey);
        }
    }, [activeTabKey]);

    useEffect(() => {
        tabObserver();
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [tabs]);

    const memoTabs = useMemo(() => (tabs || []).map((item) => ({ ...item, id: item.key })), [tabs]);

    return (
        <div className={`cst-container cst-tabs ${className || ""}`} style={{ ...(style || {}) }}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToHorizontalAxis]}
                autoScroll={{ threshold: { x: 0.2, y: 0 } }}
            >
                <div className={`cst-prev-btn ${prevAndNextBtnConfig.prev ? "show" : "hide"}`} onClick={() => stepScrollTab(-scrollStepNumber)}>
                    <PrevSvg />
                </div>
                <SortableContext disabled={!draggable} items={memoTabs} strategy={horizontalListSortingStrategy}>
                    <div className="cst-box" ref={tabContainerRef} onWheel={tabContainerWheel}>
                        {tabs.map((item, index) => (
                            <TabItem
                                index={index}
                                key={item.key}
                                isActive={activeTabKey === item.key}
                                onClick={onTabClick}
                                onClose={onTabCloseBefore}
                                tab={item}
                                isFirstTab={!index}
                                isLastTab={tabs.length === index + 1}
                                onContextMenu={onContextMenu}
                            ></TabItem>
                        ))}
                    </div>
                </SortableContext>
                <div className={`cst-next-btn ${prevAndNextBtnConfig.next ? "show" : "hide"}`} onClick={() => stepScrollTab(scrollStepNumber)}>
                    <NextSvg />
                </div>
            </DndContext>
            <div className="cst-bottom-bar"></div>
        </div>
    );
}

export default ChromeStyleTabs;
