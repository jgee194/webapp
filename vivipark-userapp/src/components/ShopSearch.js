import React from 'react';
import usePlacesAutoComplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
import "@reach/combobox/styles.css";
import './shop-search.css';

export default function ShopSearch(props) {
    const {
        ready, 
        value, 
        suggestions: {status, data}, 
        setValue, 
        clearSuggestions
    } = usePlacesAutoComplete({
        requestOptions: {
            location: {lat: () => 25.052282, lng: () => 121.514258}, 
            radius: 100 * 1000
        }
    }); 

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            props.sortArray({
                lat: lat, 
                lng: lng
            })
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    return (
        <div className='plan-search'>
            <Combobox onSelect={handleSelect}>
                <ComboboxInput value={value} 
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                    disabled={!ready}
                    placeholder="請輸入最近停車場, 地標, 地址...."
                />
                <ComboboxPopover>
                    <ComboboxList>
                        { status === "OK" && data.map(({id, description}) => (
                            <ComboboxOption key={description} value={description} />
                        ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    )
}
