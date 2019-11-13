import React from 'react';
import {Table} from "../Helpers";
import moment from "moment";

const columns = (showUser) => {
    return [
        {
            Header: 'User',
            accessor: 'user.username',
            Filter: null,
            show: showUser
        },
        {
            Header: 'Score',
            accessor: 'score',
            Filter: null
        },
        {
            Header: 'Boulders',
            accessor: 'boulders',
            Filter: null
        },
        {
            Header: 'Flashes',
            accessor: 'flashes',
            Filter: null
        },
        {
            Header: 'Tops',
            accessor: 'tops',
            Filter: null
        },
        {
            Header: 'Last activity',
            accessor: 'user.lastActivity',
            Filter: null,
            Cell: ({row}) => {
                return moment(row.original.user.lastActivity, "YYYY-MM-DD hh:mm:ss.u").fromNow();
            }
        }
    ];
}

class CurrentRanking extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            data: null,
            showUser: true
        };
    }

    componentDidMount() {

        Promise.all([
            fetch('/ranking/current').then((response) => response.json()).then(response => {
                this.setState({data: response});
            })

        ]).then(() => {
            this.setState({loading: false})
        });

    }

    handleInputChange(value) {
        this.setState({ showUser: !this.state.showUser });
    }

    render() {
        const {data, loading, showUser} = this.state;

        if (loading) {
            return (<div>loading list</div>)
        }

        return (
            <div>
                <input
                    name="firstName"
                    type="checkbox"
                    checked={showUser}
                    onChange={this.handleInputChange.bind(this)}
                />

                <Table columns={columns(this.state.showUser)} data={data}/>
            </div>
        )
    }
}

export default CurrentRanking;