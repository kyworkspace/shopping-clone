import Search from 'antd/lib/input/Search'
import React, { useState } from 'react'

function SearchFeatures(props) {
    const [SearchTerm, setSearchTerm] = useState('');
    const searchHandler = (e)=>{
        setSearchTerm(e.currentTarget.value)
        props.refreshFunction(e.currentTarget.value);
    }

    return (
        <div>
            <Search
            placeholder="input search text"
            style={{width:200}}
            onChange={searchHandler}
            value={SearchTerm}
            />
        </div>
    )
}

export default SearchFeatures
