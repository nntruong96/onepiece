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
    if (props.onClick) {
      props.onClick();
    }
  };
  return (
    <>
      <div
        onClick={onClick}
        className={'hero ' + (children && children.length ? 'pointer' : '')}
      >
        <div className="name">
          {children && children.length ? (
            <p className="icon">{open ? '-' : '+'}</p>
          ) : null}{' '}
          <p>
            {name} {item.code ? `(${item.code})` : ''}
          </p>
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
  const [select, setStateSelect] = useState();
  const [textSearch, setSearch] = useState('');
  const [data, setData] = useState(Constants);
  const [showHeroForm, setShow] = useState(false);
  const [edit, setEdit] = useState('');
  let [tab, setTab] = useState(1);
  const setSelect = (name) => {
    if (select) {
      window.history.replaceState(null, select, name);
    } else {
      window.history.replaceState(null, '', name);
    }
    setStateSelect(name);
  };
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

  const renderCanBuild = (name) => {
    let keys = Object.keys(data);
    let parent = keys.map((key) => {
      return data[key]?.children?.includes(name) ? key : '';
    });

    if (data[name]) {
      return (
        <div>
          {parent.map((hero) =>
            hero ? (
              <Name
                key={hero}
                name={hero}
                item={data[hero]}
                onClick={() => setSelect(hero)}
              ></Name>
            ) : null
          )}
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
    let hero = decodeURIComponent(window.location.pathname.replace('/', ''));
    if (data[hero]) {
      setStateSelect(hero);
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

  const renderTab = () => {
    switch (tab) {
      case 1:
        return (
          <div className="container-how-to-build">
            <p> How to build</p>
            {renderChilren(select)}
          </div>
        );
      case 2:
        return (
          <div className="container-can-build">
            <p> Can Up</p>
            <Name name={select} item={data[select]} />
            Can Up:
            {renderCanBuild(select)}
          </div>
        );
      default:
        break;
    }
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
          <div className="list">
            {Object.keys(data)
              .filter((item) =>
                textSearch
                  ? item.toLowerCase().indexOf(textSearch.toLowerCase()) >= 0
                  : true
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
          <div className="right">
            {select ? (
              <div className="tab">
                <button onClick={() => setTab(1)}>How to build</button>
                <button onClick={() => setTab(2)}>Can up</button>
              </div>
            ) : null}
            {renderTab()}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
