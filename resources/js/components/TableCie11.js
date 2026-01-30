import React from 'react';

export default function TableCie11(props) {
    const { cies, handleEdition, handleEliminar } = props;

    return (
        <tbody>
            {Object.keys(cies).map((key) => (
                <tr key={key}>
                    <td>
                    </td>
                    <td>{cies[key]['codigo_cie10']}</td>
                    <td>{cies[key]['codigo_cie11']}</td>
                    <td>{cies[key]['titulo_cie11']}</td>
                    
                </tr>
            ))}
        </tbody>
    );
}