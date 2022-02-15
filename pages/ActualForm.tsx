import * as React from 'react';
import { useState } from 'react';
import AppBar from '@/components/app-bar';

/**
 * @return {JSX.Element} a
 */
export default function MyForm() {
  const [inputs, setInputs] = useState({});
  const [myObject, setobject] = useState('object');

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
    setobject(event.target.value);
  };

  // checkbox CONFIGURATION
  // State with list of all checked item
  const [checked, setChecked] = useState([]);
  const checkList = [
    'Location',
    'Compass',
    'Accelerometer',
    'Temperature',
    'sound',
  ];

  // Add/Remove checked item from list
  const handleCheck = (event) => {
    let updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  };

  // Generate string of checked items
  const checkedItems = checked.length
    ? checked.reduce((total, item) => {
        return total + ', ' + item;
      })
    : '';

  // Return classes based on whether item is checked
  const isChecked = (item) =>
    checked.includes(item) ? 'checked-item' : 'not-checked-item';

  const styleObj = {
    fontSize: 14,
    // color: '#0070f3',
    color: 'white',
    textAlign: 'center',
    paddingTop: '100px',
    alignItems: 'center',
    backgroundColor: '#546e7a',
  };

  const styleHeadText = {
    fontSize: 14,

    textDecorationLine: 'underline',
  };

  const styleAdding = {
    paddingTop: '100px',
    border: '1px solid rgba(0, 0, 0, 0.05)',
  };

  const styleConfig = {
    paddingTop: '30px',
    border: '1px solid rgba(0, 0, 0, 0.05)',
  };

  const styleTextbox = {
    color: 'gray',
  };

  return (
    <>
      <AppBar />
      <main style={styleObj}>
        <div style={styleHeadText}>
          <h1>Adding/Configuration</h1>
          <p>Please add or configure your Microbit</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styleAdding}>
            <h3 style={styleHeadText}>Adding</h3>
            <div>
              Enter Microbit's Numbers:
              <input
                // style={styleTextbox}
                placeholder="eg 4753"
                type="text"
                name="Microbit"
                value={inputs.Microbit || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              Enter Object/Description:
              <input
                placeholder="eg Trolley"
                type="text"
                name="Object"
                value={inputs.Object || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              {' '}
              Preset Objects:
              <select value={myObject} onChange={handleChange}>
                <option value="object">Object</option>
                <option value="Human">Human</option>
                <option value="car">Car</option>
              </select>
            </div>
            <input type="submit" />
          </div>

          <div style={styleConfig}>
            <div>
              {' '}
              Preset Objects:
              <select value={myObject} onChange={handleChange}>
                <option value="Example">Example</option>
                <option value="Human">Human</option>
                <option value="car">Car</option>
              </select>
            </div>
            <div className="app">
              <div className="checkList">
                <h3 style={styleHeadText}>Configuration</h3>
                <div className="list-container">
                  {checkList.map((item, index) => (
                    <div key={index}>
                      <input
                        value={item}
                        type="checkbox"
                        onChange={handleCheck}
                      />
                      <span className={isChecked(item)}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>{`Test: ${checkedItems}`}</div>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
