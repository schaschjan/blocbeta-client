import React from 'react';
import './Table.css';
import {useExpanded, usePagination, useTable} from "react-table";
import Paragraph from "../Paragraph/Paragraph";
import Icon from "../Icon/Icon";
import classnames from "classnames";

const TableRow = ({children}) => {
	return (
		<div className="table-row">
			{children}
		</div>
	)
};

const TableCell = ({children, grow}) => {

	return (
		<div className={classnames('table-cell', grow ? 'table-cell--grow' : null)}>
			{children}
		</div>
	)
};

const TableHeader = ({children}) => {

	return (
		<div className="table-header">
			{children}
		</div>
	)
};

const TableHeaderRow = ({children}) => {

	return (
		<div className="table-header-row">
			{children}
		</div>
	)
};

const TableFooter = ({pageIndex, pageSize, pageOptions, canPreviousPage, canNextPage, previousPage, nextPage}) => {

	return (
		<div className="table-footer">
			<Paragraph>
				{pageIndex * pageSize} - {(pageIndex + 1) * pageSize} of {pageOptions.length * pageSize}
			</Paragraph>

			<span onClick={() => previousPage()}
						className={classnames('toggle-previous', !canPreviousPage ? 'toggle-previous--disabled' : null)}>
              <Icon name="back"/>
      </span>

			<span onClick={() => nextPage()}
						className={classnames('toggle-next', !canNextPage ? 'toggle-next--disabled' : null)}>
              <Icon name="forward"/>
        </span>
		</div>
	)
};

const Table = ({columns, data, renderRowSubComponent}) => {

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		page,
		prepareRow,
		flatColumns,
		canPreviousPage,
		canNextPage,
		pageOptions,
		nextPage,
		previousPage,
		state: {pageIndex, pageSize},
	} = useTable({
			columns,
			data,
			initialState: {pageIndex: 0},
		},
		useExpanded,
		usePagination
	);

	return (
		<React.Fragment>
			<div className="table" {...getTableProps()}>

				<TableHeader>
					{headerGroups.map(headerGroup => (
						<React.Fragment>
							{headerGroup.headers.map(column => (
								<TableHeaderRow {...column.getHeaderProps()}>
									{column.render('Header')}
								</TableHeaderRow>
							))}
						</React.Fragment>
					))}
				</TableHeader>

				<div className="table-content" {...getTableBodyProps()}>
					{page.map((row) => {
						prepareRow(row);

						return (
							<React.Fragment>
								<TableRow>
									{row.cells.map(cell => {
										return <TableCell {...cell.getCellProps({grow: cell.column.grow})}>{cell.render('Cell')}</TableCell>
									})}
								</TableRow>
								{row.isExpanded ? (
									<div>
										<div colSpan={flatColumns.length}>
											{renderRowSubComponent({row})}
										</div>
									</div>
								) : null}
							</React.Fragment>
						)
					})}
				</div>
			</div>

			<TableFooter
				pageIndex={pageIndex}
				pageSize={pageSize}
				pageOptions={pageOptions}

				canPreviousPage={canPreviousPage}
				canNextPage={canNextPage}

				previousPage={previousPage}
				nextPage={nextPage}
			/>
		</React.Fragment>
	)
};

export default Table