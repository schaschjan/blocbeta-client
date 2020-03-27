import React, {useState, useEffect, useContext, Fragment} from 'react';
import {Loader} from "../../../components/Loader/Loader";
import {resolveBoulder} from "../../../Helpers";
import ApiClient from "../../../ApiClient";
import Grade from "../../../components/Grade/Grade";
import moment from "moment";
import HoldStyle from "../../../components/HoldStyle/HoldStyle";
import Paragraph from "../../../components/Paragraph/Paragraph";
import Icon from "../../../components/Icon/Icon";
import Ascent from "../../../components/Ascent/Ascent";
import "./Index.css";
import Button from "../../../components/Button/Button";
import Banner from "../../../components/Banner/Banner";
import classnames from "classnames";

import {
    IndeterminateCheckbox,
    TableHeader,
    TableHeaderCell,
    TableRow,
    TableCell,
    TableFooter
} from "../../../components/Table/Table";

import {usePagination, useTable, useGlobalFilter, useSortBy, useRowSelect, useFilters} from "react-table";
import Context from "../../../Context";
import {TagInput} from "../../../components/TagInput/TagInput";
import {Link} from "react-router-dom";
import {DrawerContext} from "../../../components/Drawer/Drawer";
import {Textarea} from "../../../components/Textarea/Textarea";
import Form from "../../../components/Form/Form";
import {Messages} from "../../../Messages";
import {toast} from "react-toastify";
import Input from "../../../components/Input/Input";
import {FilterDropdown} from "./components/FilterDropdown";
import {PageHeader} from "../../../components/PageHeader/PageHeader";
import Container from "../../../components/Container/Container";

const Bar = ({children}) => {
    return <div className="bar">
        {children}
    </div>
};

const Table = ({columns, data, editable = false}) => {
    const [tags, setTags] = useState([
        {
            id: 'ascent',
            value: 'todo'
        },
        // {
        //     id: 'start',
        //     value: 'logowand'
        // }
    ]);

    const [filtersDropped, setFiltersDropped] = useState(false);

    const removeTag = (id) => {
        setTags(tags.filter(tag => tag.id !== id));
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        nextPage,
        previousPage,
        selectedFlatRows,
        setFilter,
        setAllFilters,
        state: {
            pageIndex,
            pageSize,
        },

    } = useTable({
            columns,
            data,
            initialState: {pageIndex: 0, pageSize: 20},
            autoResetFilters: false,
            autoResetSortBy: false,
            autoResetPage: false
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination,
        useRowSelect
    );

    useEffect(() => {
        if (!tags) {
            setAllFilters({});
        }

        tags.map(tag => setFilter(tag.id, tag.value));
        setAllFilters(tags);
    }, [tags]);

    return <Fragment>
        <div className="filter">
            <Icon name="search" onClick={() => setFiltersDropped(true)}/>
            <TagInput tags={tags} onAdd={() => console.log('add')} onRemove={(id) => removeTag(id)}/>
            <Icon name="filtermenu" className="toggle-filter-dropdown"/>
        </div>

        <div>
            {filtersDropped && <FilterDropdown/>}
        </div>

        <div
            className={classnames('table', 'table--boulder', editable ? 'table--editable' : null)} {...getTableProps()}>
            <TableHeader headerGroups={headerGroups}/>

            <div className="table-content" {...getTableBodyProps()}>
                {page.map((row) => {
                    prepareRow(row);

                    return (
                        <TableRow>
                            {row.cells.map(cell => {
                                return <TableCell {...cell.getCellProps({className: cell.column.className})}>{cell.render('Cell')}</TableCell>
                            })}
                        </TableRow>
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

        {selectedFlatRows.length > 0 && (
            <Bar data={selectedFlatRows}>
                <div className="bar__summary">
                    <h2>Selected {selectedFlatRows.length} boulders:</h2>
                </div>

                <div className="bar__actions">
                    <Button text={true}>Deactivate</Button>
                    <Button text={true}>Prune Ascents</Button>
                </div>
            </Bar>
        )}
    </Fragment>
};

const Index = () => {
    const {
        setDrawerOpen,
        setDrawerLoading,
        setDrawerPages,
        setDrawerActivePage,
        setDrawerData
    } = useContext(DrawerContext);

    const [boulders, setBoulders] = useState(null);
    const [loading, setLoading] = useState(true);

    const showDetails = (boulderId) => {
        setDrawerOpen(true);
        setDrawerLoading(true);

        ApiClient.boulder.get(boulderId).then(data => {
            resolveBoulder(data);

            setDrawerData(data);
            setDrawerLoading(false);
            setDrawerActivePage("details");
        });
    };

    const selectionColumn = {
        Header: ({getToggleAllRowsSelectedProps}) => (
            <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
        ),
        id: 'selection',
        Cell: ({row}) => (
            <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
        ),
    };

    const columns = [
        {
            id: 'holdStyle',
            Header: 'holdStyle',
            accessor: 'holdStyle.name',
            Cell: ({cell}) => {
                return <HoldStyle name={cell.value}/>
            }
        },
        {
            id: 'grade',
            Header: 'Grade',
            accessor: 'grade.name',
            Cell: ({row}) => {
                return <Grade name={row.original.grade.name} color={row.original.grade.color}/>
            }
        },
        {
            id: 'points',
            Header: 'Points',
            accessor: 'points',
            Cell: ({cell}) => (
                <Paragraph>{cell.value} pts</Paragraph>
            )
        },
        {
            id: 'name',
            Header: 'Name',
            accessor: 'name',
            className: 'table-cell__name',
            Cell: ({cell, row}) => (
                <Fragment>
                    {Context.user.isAdmin() && (
                        <Link to={Context.getPath(`/boulder/${row.original.id}`)}> ✏</Link>
                    )}

                    <Button onClick={() => showDetails(row.original.id)}>
                        {cell.value} <Icon name="forward"/>
                    </Button>
                </Fragment>
            ),
        },
        {
            id: 'start',
            Header: 'Start',
            accessor: 'startWall.name',
            Cell: ({cell}) => {
                return <Paragraph>{cell.value}</Paragraph>
            }
        },
        {
            id: 'end',
            Header: 'End',
            accessor: 'endWall.name',
            Cell: ({cell}) => {
                return <Paragraph>{cell.value}</Paragraph>
            }
        },
        {
            id: 'date',
            Header: 'Date',
            accessor: 'createdAt',
            Cell: ({cell}) => {
                return (
                    <Paragraph>{moment(cell.value).format('l')}</Paragraph>
                )
            }
        },
        {
            id: 'ascent',
            Header: 'Ascent',
            accessor: (row) => {
                if (row.me) {
                    return row.me.type;
                }

                return "todo";
            },
            Cell: ({row}) => {
                const ascent = row.original.me;

                let flashed = false;
                let topped = false;
                let resigned = false;

                if (ascent && ascent.type === 'flash') {
                    flashed = true
                }

                if (ascent && ascent.type === 'top') {
                    topped = true
                }

                if (ascent && ascent.type === 'resignation') {
                    resigned = true
                }

                return (
                    <React.Fragment>
                        <Ascent type="flash"
                                disabled={!flashed && ascent}
                                checked={flashed}
                                handler={() => ascentHandler(row.original.id, "flash", ascent ? ascent.id : null)}/>

                        <Ascent type="top"
                                disabled={!topped && ascent}
                                checked={topped}
                                handler={() => ascentHandler(row.original.id, "top", ascent ? ascent.id : null)}/>

                        <Ascent type="resign"
                                disabled={!resigned && ascent}
                                checked={resigned}
                                handler={() => ascentHandler(row.original.id, "resignation", ascent ? ascent.id : null)}/>
                    </React.Fragment>
                )
            }
        }
    ];

    if (Context.user.isAdmin()) {
        columns.unshift(selectionColumn)
    }

    const onErrorSubmit = data => {
        ApiClient.boulder.reportError(data)
            .then(response => {
                toast.success("Doubt submitted!");
            })
            .catch(error => {
                toast.error(Messages.errors.general);
            });
    };

    const onDoubtSubmit = (data) => {
        ApiClient.ascent.doubt(data)
            .then(response => {
                toast.success("Doubt submitted!");
            })
            .catch(error => {
                toast.error("Oops, look like a slip.");
            });
    };

    const drawerPages = [
        {
            name: "details",
            header: (data) => {
                return (
                    <div className="header-detail">
                        <HoldStyle name={data.holdStyle.name}/>
                        <h3>{data.name}</h3>
                    </div>
                )
            },
            content: (data) => {
                return (
                    <div className="page-detail">
                        <div className="detail__list">
                            <h4>Ascents ({data.ascents.length ? data.ascents.length : 0})</h4>

                            {data.ascents.length > 0 && (
                                <ul>
                                    {data.ascents.map(ascent => {
                                        return <li>
                                            <Icon name={ascent.type}/>
                                            {ascent.user.username}

                                            <Button text={true} onClick={() => {
                                                setDrawerActivePage("doubt");
                                                setDrawerData({
                                                    user: ascent.user,
                                                    boulder: {
                                                        id: data.id,
                                                        name: data.name
                                                    }
                                                });
                                            }}>
                                                Doubt it
                                            </Button>
                                        </li>
                                    })}
                                </ul>
                            )}
                        </div>

                        <div className="detail__list">
                            <h4>Setters ({data.setters.length})</h4>
                            <ul>
                                {data.setters.map(setter => {
                                    return <li>
                                        {setter.username}
                                    </li>
                                })}
                            </ul>
                        </div>

                        {data.tags.length > 0 && (
                            <div className="detail__list">
                                <h4>Tags ({data.tags.length})</h4>

                                <ul>
                                    {data.tags.map(tag => {
                                        return <li>
                                            {tag.emoji} {tag.name}
                                        </li>
                                    })}
                                </ul>
                            </div>
                        )}

                        <Button text={true}
                                onClick={() => setDrawerActivePage("error")}
                                className="report-error">
                            Report error
                        </Button>
                    </div>
                )
            }
        },
        {
            name: "error",
            header: (data) => {
                return (
                    <div className="header-error">
                        <Icon name="backward" onClick={() => setDrawerActivePage("details")}/>
                        <h3>
                            <strong>Report error:</strong> {data.name}
                        </h3>
                    </div>
                )
            },
            content: (data) => {
                return <div className="page-error">
                    <h3>Message</h3>

                    <Form onSubmit={onErrorSubmit}>
                        <Textarea
                            name="message"
                            validate={{required: Messages.required}}
                            placeholder="Write something…"/>
                        <Button text={true}>Send Message</Button>
                    </Form>
                </div>
            }
        },
        {
            name: "doubt",
            header: (data) => {
                return (
                    <div className="header-doubt">
                        <Icon name="backward" onClick={() => setDrawerActivePage("details")}/>
                        <strong>Doubt {data.user.username}</strong> on {data.boulder.name}
                    </div>
                )
            },
            content: (data) => {
                return <div className="page-doubt">
                    <h3>Message</h3>

                    <Form onSubmit={onDoubtSubmit}>
                        <Textarea
                            name="message"
                            validate={{required: Messages.required}}
                            placeholder="Describe whats is wrong…"/>

                        <Input type="hidden" name="recipient" value={data.user.id}/>
                        <Input type="hidden" name="boulder" value={data.boulder.id}/>

                        <Button text={true} type="submit">Send Message</Button>
                    </Form>
                </div>
            }
        }
    ];

    useEffect(() => {
        async function getData() {
            const ascents = await ApiClient.location.ascents.activeBoulders().then(ascents => {
                return ascents.reduce((obj, item) => Object.assign(obj, {[item.boulderId]: item}), {});
            });

            const boulders = Context.storage.boulders.all();

            for (let boulder of boulders) {
                resolveBoulder(boulder);

                const ascentData = ascents[boulder.id];

                if (!ascentData) {
                    console.error(boulder.id + ' not found');
                    continue
                }

                boulder.points = ascentData.points;
                boulder.ascents = ascentData.ascents;
                boulder.me = ascentData.me;
            }

            return boulders
        }

        getData().then(data => {
            setBoulders(data);
            setLoading(false);
        });

        setDrawerPages(drawerPages);
        setDrawerActivePage("details");
    }, []);

    const ascentHandler = (boulderId, type, ascentId = null) => {
        const boulder = boulders.find(boulder => boulder.id === boulderId);

        if (!ascentId) {
            ApiClient.ascent.create({
                'boulder': boulderId,
                'type': type
            }).then(data => {
                boulder.me = data.me;
                setBoulders([...boulders]);
            });

        } else {
            ApiClient.ascent.delete(ascentId).then(() => {
                boulder.me = null;
                setBoulders([...boulders]);
            });
        }
    };

    if (loading) return <Loader/>;

    return (
        <Fragment>
            <Banner>
                <Paragraph>Logowand <strong>・NEW NEW NEW・</strong></Paragraph>
            </Banner>

            <Container>
                <PageHeader title={`Boulder (${boulders.length})`}>
                    {Context.user.isAdmin() && (
                        <Link to={Context.getPath(`/boulder/add`)}>
                            <Button text={true}>Add</Button>
                        </Link>
                    )}
                </PageHeader>

                <Table columns={columns} data={boulders} editable={Context.user.isAdmin()}/>
            </Container>
        </Fragment>
    )
};

export default Index;