import { useEffect } from "react";

const usePageTitle = (title) => {
    useEffect(() => {
        document.title = `BlogSphere | ${title}`;
    }, [title]);
};

export default usePageTitle;
