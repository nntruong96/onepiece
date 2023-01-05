import React, { useEffect, useState } from 'react';
import { InputSuggestions } from 'react-input-suggestions';
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';
export default function HeroForm({
  item = {},
  onCancel,
  onSave,
  data,
  heroName,
} = {}) {
  const [name, setName] = useState(heroName || '');
  const [code, setCode] = useState(heroName ? item.code : '');
  const [errorName, setErrorName] = useState(false);
  const [image, setImage] = useState(heroName ? item.image : '');
  const [children, setChildren] = useState(
    heroName ? item.children || [] : ['', '', '']
  );
  const [error, setError] = useState([]);
  useEffect(() => {
    if (heroName !== name) {
      setName(heroName);
      setErrorName(false);
      setImage(heroName ? item.image : '');
      setImage(heroName ? item.code : '');
      setChildren(heroName ? item.children || [] : ['', '']);
      setError([]);
    }
  }, [heroName]);
  const save = () => {
    let newName = name.trim();
    if (!heroName && data[newName]) {
      return setErrorName(true);
    }
    let newError = JSON.parse(JSON.stringify([]));
    let newChildren = children.map((item) => item.trim().replace('@', ''));
    newChildren.forEach((item, index) => {
      if (!data[item]) {
        newError[index] = true;
      }
    });
    if (newError.length) {
      return setError(newError);
    }

    let hero = {
      image,
      children: newChildren,
      code,
    };
    onSave(newName, hero, heroName);
  };
  const isDisabled = () => {
    let childrenFill = children.some((item) => !item || !item.trim());
    return !name || childrenFill;
  };
  console.log(children);
  return (
    <div className="hero-form">
      <div className="hero-form__header">
        <p>Hero Name</p>
        <input
          placeholder={'Herro name'}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrorName(false);
          }}
          className={errorName ? 'error' : ''}
          disabled={heroName}
        />
        <input
          value={image}
          onChange={(e) => {
            setImage(e.target.value);
          }}
          placeholder="Image"
        />
        <input
          placeholder={'Code'}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
          }}
        />
        <button
          onClick={() => {
            let newData = JSON.parse(JSON.stringify(children));
            newData.push('');
            setChildren(newData);
          }}
        >
          Add Children
        </button>
      </div>
      <div>
        <p>Children</p>
        <div className="children-list">
          {children.map((name, index) => {
            return (
              <div key={index} className="container-input">
                <TextInput
                  value={name}
                  onChange={(e) => {
                    console.log(e);
                    let newData = JSON.parse(JSON.stringify(children));
                    newData[index] = e;
                    setChildren(newData);
                    let newError = JSON.parse(JSON.stringify(error));
                    newError[index] = '';
                    setError(newError);
                  }}
                  placeholder="Name"
                  className={error[index] ? 'error' : ''}
                  options={Object.keys(data)}
                  spacer=""
                />
                {/* <input
                  value={name}
                  onChange={(e) => {
                    let newData = JSON.parse(JSON.stringify(children));
                    newData[index] = e.target.value;
                    setChildren(newData);
                    let newError = JSON.parse(JSON.stringify(error));
                    newError[index] = '';
                    setError(newError);
                  }}
                  placeholder="Name"
                  className={error[index] ? 'error' : ''}
                />
                <div className="suggest">
                  {Object.keys(data)
                    .filter((item) => (name ? item.indexOf(name) >= 0 : false))
                    .map((item) => {
                      return (
                        <p
                          onClick={() => {
                            let newData = JSON.parse(JSON.stringify(children));
                            newData[index] = item;
                            setChildren(newData);
                          }}
                        >
                          {item}
                        </p>
                      );
                    })}
                </div> */}
                <button
                  onClick={() => {
                    let newData = JSON.parse(JSON.stringify(children));
                    newData = newData.filter(
                      (item, _index) => _index !== index
                    );
                    setChildren(newData);
                  }}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="footer">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={save} className="button-save" disabled={isDisabled()}>
          Save
        </button>
      </div>
    </div>
  );
}
