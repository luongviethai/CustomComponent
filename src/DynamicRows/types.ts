export type Value = any[];

export type ChildrenItem = {
    item: any & { id: string; title: string };
    setFieldValue: (name: string, value: any) => void;
};

export type BaseProps = {
    actions?: React.ReactNode | React.ReactNode[];
    addTitle?: string;
    children: (childrenItem: ChildrenItem) => React.ReactNode | React.ReactNode[];
    className?: string;
    dataHook?: string;
    disableDelete?: boolean;
    disabled?: boolean;
    draggable?: boolean;
    dynamicTitle?: string[] | string;
    editable?: boolean;
    onAdd?: (data: object) => void;
    onDelete?: (id: string) => void;
    onDrop?: (item: any, index: number) => void;
    onDuplicate?: (id: string) => void;
    onEdit?: (id: string) => void;
    showSettings?: boolean;
    titlePrefix?: string;
};
