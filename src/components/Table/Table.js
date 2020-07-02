import React, {useRef, forwardRef} from "react";
import "./Table.css";
import Paragraph from "../Paragraph/Paragraph";
import Icon from "../Icon/Icon";
import classnames from "classnames";

export const TableRow = ({children, ...rest}) => {
    return <div className="table-row" {...rest}>{children}</div>;
};

export const TableCell = ({children, className}) => {
    return <div className={classnames("table-cell", className)}>{children}</div>;
};

export const TableHeader = ({headerGroups}) => {
    return (
        <div className="table-header">
            {headerGroups.map(headerGroup => {

                return headerGroup.headers.map((column, index) => (
                    <TableHeaderCell{...column.getHeaderProps(column.getSortByToggleProps())} key={index}>
                        {column.render("Header")}
                            <span className="sort-indicator">
                                {column.isSorted ? (column.isSortedDesc ? (<Icon name="downward"/>) : (
                                <Icon name="upward"/>)) : ("")
                                }
                            </span>
                    </TableHeaderCell>
                ))
            })}
        </div>
    );
};

export const TableHeaderCell = ({children, ...rest}) => {
    return (
        <div className="table-header-cell" {...rest}>
            {children}
        </div>
    );
};

export const TableFooter = ({
                                pageIndex,
                                pageSize,
                                pageOptions,
                                canPreviousPage,
                                canNextPage,
                                previousPage,
                                nextPage,
                            }) => {
    return (
        <div className="table-footer">
            <div className="pager">
                <Paragraph className="pager-info">
                    {pageIndex * pageSize} - {(pageIndex + 1) * pageSize} of{" "}
                    {pageOptions.length * pageSize}
                </Paragraph>

                <span
                    onClick={() => previousPage()}
                    className={classnames(
                        "toggle-previous",
                        !canPreviousPage ? "toggle-previous--disabled" : null
                    )}
                >
          <Icon name="backward"/>
        </span>

                <span
                    onClick={() => nextPage()}
                    className={classnames(
                        "toggle-next",
                        !canNextPage ? "toggle-next--disabled" : null
                    )}
                >
          <Icon name="forward"/>
        </span>
            </div>
        </div>
    );
};

export const IndeterminateCheckbox = forwardRef(
    ({indeterminate, ...rest}, ref) => {
        const defaultRef = useRef();
        const resolvedRef = ref || defaultRef;

        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate;
        }, [resolvedRef, indeterminate]);

        return (
            <React.Fragment>
                <input type="checkbox" ref={resolvedRef} {...rest} />
            </React.Fragment>
        );
    }
);
