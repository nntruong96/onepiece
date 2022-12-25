import React, { useEffect, useState } from 'react';

export default function HeroForm({
  item = {},
  onCancel,
  onSave,
  data,
  heroName,
} = {}) {
  const [name, setName] = useState(heroName || '');
  const [errorName, setErrorName] = useState(false);
  const [image, setImage] = useState(heroName ? item.image : '');
  const [children, setChildren] = useState(
    heroName ? item.children || [] : ['', '']
  );
  const [error, setError] = useState([]);
  useEffect(() => {
    if (heroName !== name) {
      setName(heroName);
      setErrorName(false);
      setImage(heroName ? item.iamge : '');
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
    children.forEach((item, index) => {
      if (!data[item]) {
        newError[index] = true;
      }
    });
    if (newError.length) {
      return setError(newError);
    }

    let hero = {
      image,
      children: children.map((item) => item.trim()),
    };
    onSave(newName, hero, heroName);
  };
  const isDisabled = () => {
    let childrenFill = children.some((item) => !item || !item.trim());
    return !name || childrenFill;
  };
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
              <div key={index}>
                <input
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
