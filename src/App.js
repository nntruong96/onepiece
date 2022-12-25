import './App.css';
import Constants from './Constants';
import { useEffect, useState } from 'react';
import HeroForm from './HeroForm';
const saveData = (data) => {
  localStorage.setItem('data', JSON.stringify(data));
};
const getData = () => {
  return localStorage.getItem('data');
};
const Name = (props) => {
  let { children, item, name } = props;
  let [open, setOpen] = useState(true);
  const onClick = () => {
    setOpen(!open);
  };
  return (
    <>
      <div onClick={onClick} className={'hero ' + (children ? 'pointer' : '')}>
        <div className="name">
          {children ? <p className="icon">{open ? '-' : '+'}</p> : null}{' '}
          <p>{name}</p>
          {item.image ? (
            <img className="img-hero" src={item.image} alt="hero" />
          ) : null}
        </div>
      </div>
      <div className={'children ' + (open ? 'active' : '')}>{children}</div>
    </>
  );
};
function App() {
  const [select, setSelect] = useState('');
  const [textSearch, setSearch] = useState('');
  const [data, setData] = useState(Constants);
  const [showHeroForm, setShow] = useState(false);
  const [edit, setEdit] = useState('');
  const renderChilren = (name) => {
    if (data[name]) {
      return (
        <div>
          <Name name={name} item={data[name]}>
            {data[name]?.children?.map((item) => renderChilren(item))}
          </Name>
        </div>
      );
    }
  };
  useEffect(() => {
    let _data = getData();
    if (!_data) {
      saveData(Constants);
    } else {
      _data = JSON.parse(_data);
      setData(_data);
    }
  }, []);
  const onSearch = (e) => {
    setSearch(e.target.value);
  };
  const save = (key, hero) => {
    let newData = JSON.parse(JSON.stringify(data));
    newData[key] = hero;
    setData(newData);
    setShow(false);
    saveData(newData);
  };
  return (
    <div className="App">
      <div className="header">
        <p>One Piece</p>
      </div>
      <div className="main">
        <div className="left">
          <div>
            <input onChange={onSearch} />
            <button>Export data</button>
            <button
              onClick={() => {
                setShow(true);
                setEdit('');
              }}
            >
              + Add Hero
            </button>
          </div>
          {Object.keys(data)
            .filter((item) =>
              textSearch ? item.indexOf(textSearch) >= 0 : true
            )
            .map((key) => {
              return (
                <div
                  key={key}
                  onClick={() => {
                    setSelect(key);
                  }}
                  className="container-hero"
                >
                  <Name name={key} item={data[key]} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEdit(key);
                      setShow(true);
                    }}
                  >
                    Edit
                  </button>
                  {/* <button>Copy name</button> */}
                </div>
              );
            })}
        </div>
        {showHeroForm ? (
          <HeroForm
            item={edit ? data[edit] : {}}
            onCancel={() => setShow(false)}
            data={data}
            onSave={save}
            heroName={edit}
          />
        ) : (
          <div className="right">{renderChilren(select)}</div>
        )}
      </div>
    </div>
  );
}

export default App;
