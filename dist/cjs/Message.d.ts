/// <reference types="react" />
type MessageProps = {
    children?: React.ReactNode;
    type: 'error' | 'loading' | 'no-data';
};
export default function Message({ children, type }: MessageProps): JSX.Element;
export {};
