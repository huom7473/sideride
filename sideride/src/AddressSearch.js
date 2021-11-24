import React from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
import "@reach/combobox/styles.css";

export function AddressSearch({ select }) {
    const { ready, value, suggestions: { status, data }, setValue, clearSuggestions, } = usePlacesAutocomplete({
        requestOptions: {
            location: { lat: () => 34.069, lng: () => -118.445 },
            radius: 100 * 1000,
        },
    });
    const handleInput = (e) => {
        setValue(e.target.value);
    };
    const handleSelect = (description) => {
        setValue(description, false);
        clearSuggestions();
        getGeocode({ address: description })
            .then(results => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                select({ lat, lng, description });
            }).catch(error => {
            console.log(error);
        });
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSelect(value);
        }
    };

    return (<div className="search1">
        <Combobox onSelect={handleSelect} aria-labelledby="searchbox" onKeyPress={handleKeyPress}>
            <ComboboxInput value={value} onChange={handleInput} disabled={!ready} placeholder="Search for a place..." className="form-control"/>
            <ComboboxPopover className="suggestions">
                <ComboboxList>
                    {status === "OK" &&
                    data.map(({ id, description, structured_formatting: { main_text, secondary_text } }) => (<ComboboxOption key={description} value={description}>
                        <div>
                            <font size={3}><b>{main_text}</b> <small>{secondary_text}</small></font>
                        </div>
                    </ComboboxOption>))}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    </div>);
}