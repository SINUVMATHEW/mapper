import React, { useEffect, useState } from 'react';
import { Button, TextField, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const Home = () => {
    const [data, setData] = useState<any>(null); // Store fetched data
    const [selectedNamespace, setSelectedNamespace] = useState('');
    const [selectedTable, setSelectedTable] = useState('');
    const [openPopup, setOpenPopup] = useState(false);

    useEffect(() => {
        fetch('public/schema.json')
            .then(response => response.json())
            .then(jsonData => {
                setData(jsonData);
                setSelectedNamespace(jsonData.namespaces[0]?.name);
                setSelectedTable(jsonData.namespaces[0]?.tables[0]?.name);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    if (!data) {
        return <div>Loading...</div>; // Handle loading state
    }

    const currentNamespace = data.namespaces.find((ns: any) => ns.name === selectedNamespace);
    const tables = currentNamespace ? currentNamespace.tables : [];
    const handleNamespaceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedNamespace(event.target.value as string);
        const namespace = data.namespaces.find((ns: any) => ns.name === event.target.value);
        if (namespace && namespace.tables.length > 0) {
            setSelectedTable(namespace.tables[0].name);
        }
    };

    const handleTableChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedTable(event.target.value as string);
    };

    const handleAddRelation = () => {
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    return (
        <div>
            {/* Namespace Dropdown */}
            <div>
                <Select value={selectedNamespace} onChange={handleNamespaceChange}>
                    {data.namespaces.map((ns: any) => (
                        <MenuItem key={ns.name} value={ns.name}>
                            {ns.name}
                        </MenuItem>
                    ))}
                </Select>
            </div>

            {/* Tables Section */}
            <div>
                <h3>Tables</h3>
                <Select value={selectedTable} onChange={handleTableChange}>
                    {tables.map((table: any) => (
                        <MenuItem key={table.name} value={table.name}>
                            {table.name}
                        </MenuItem>
                    ))}
                </Select>

                <Button variant="contained" color="primary">
                    Save changes
                </Button>
            </div>

            {/* Columns Section */}
            <div>
                <h3>Columns</h3>
                {tables
                    .find((table: any) => table.name === selectedTable)
                    ?.columns.map((col: any) => (
                        <div key={col.name}>
                            <TextField
                                label={col.name}
                                helperText={`Type: ${col.type}, Note: ${col.note}, Tag: ${col.tag}`}
                                fullWidth
                            />
                        </div>
                    ))}
            </div>

            {/* Primary Keys Section */}
            <div>
                <h3>Primary Keys</h3>
                {tables
                    .find((table: any) => table.name === selectedTable)
                    ?.primaryKeys.map((key: string) => (
                        <div key={key}>
                            <TextField label={key} fullWidth />
                        </div>
                        
                    ))}
            </div>

            {/* Relations Section */}
            <div>
                <h3>Relations</h3>
                {currentNamespace.relations.map((relation: any, index: number) => (
                    <div key={index}>
                        <p>
                            {relation.fromTable}.{relation.fromColumn} → {relation.toTable}.{relation.toColumn}
                        </p>
                    </div>
                ))}
            </div>

            {/* Button to Add Relation */}
            <Button variant="contained" color="secondary" onClick={handleAddRelation}>
                Add Relation
            </Button>

            {/* Popup for adding relations */}
            <Dialog open={openPopup} onClose={handleClosePopup}>
                <DialogTitle>Add Relation</DialogTitle>
                <DialogContent>
                    <Select value={selectedNamespace} onChange={handleNamespaceChange}>
                        {data.namespaces.map((ns: any) => (
                            <MenuItem key={ns.name} value={ns.name}>
                                {ns.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select value={selectedTable} onChange={handleTableChange}>
                        {tables.map((table: any) => (
                            <MenuItem key={table.name} value={table.name}>
                                {table.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {/* Add other fields for defining relations as necessary */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePopup} color="primary">
                        Close
                    </Button>
                    <Button onClick={handleClosePopup} color="primary">
                        Save changes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Home;
