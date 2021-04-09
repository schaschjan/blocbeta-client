import React, { useEffect, useRef, useState } from "react";
import styles from "./Select.module.css";
import typography from "../../css/typography.module.css";
import { joinClassNames } from "../../helper/classNames";
import { Close } from "../Icon/Close";
import useClickOutside from "../../hooks/useClickOutside";
import useKeyDown from "../../hooks/useKeyDown";

const Select = ({ multiple = false, value = [], ...rest }) => {
  const [selected, setSelected] = useState(value);

  useEffect(() => {
    setSelected(value);

    if (!value) {
      setSelected("");
    }
  }, [value]);

  return (
    <div>
      <select multiple={multiple} value={selected} {...rest} />
    </div>
  );
};

function Tag({ children, onRemove, className }) {
  return (
    <span className={joinClassNames(styles.tag, className)}>
      {children}{" "}
      <span onClick={onRemove} className={styles.tagRemoveIcon}>
        <Close />{" "}
      </span>
    </span>
  );
}

const removeValue = (value, current) => {
  const index = current.findIndex((option) => option.value === value);
  current.splice(index, 1);

  return current;
};

function StyledSelect({
  value,
  searchable = true,
  multiple = false,
  clearable = true,
  name,
  onChange,
  children,
}) {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);

  const ref = useRef();

  const onSelect = ({ value, label }) => {
    let current = [...selected];

    if (!multiple) {
      setSearch("");
      setFocused(false);
      setSelected([{ label, value }]);
      return;
    }

    if (!current.find((option) => option.value === value)) {
      current.push({ label, value });
    } else {
      removeValue(value, current);
    }

    setSelected(current);
  };

  let options = React.Children.map(children, (option) => {
    return React.cloneElement(option, {
      ...option.props,
      onSelect,
      isSelected: selected.find(
        (selectedOption) => selectedOption.value === option.props.value
      ),
    });
  });

  options = options.filter((option) => {
    if (searchable && search.length > 0) {
      return option.props.label.toLowerCase().includes(search.toLowerCase());
    }

    return true;
  });

  useClickOutside(ref, () => {
    setFocused(false);
  });

  useEffect(() => {
    if (!value) {
      setSelected([]);
    }
  }, [value]);

  useEffect(() => {
    onChange({
      target: {
        name,
        type: multiple ? "styled-multiselect" : "styled-select",
        selected: selected,
      },
    });
  }, [selected]);

  useEffect(() => {
    if (!options) {
      return;
    }

    let selection = [];

    if (multiple && value.length) {
      value.map((item) => {
        const option = options.find((option) => option.props.value === item);

        if (option) {
          selection.push({
            label: option.props.label,
            value: option.props.value,
          });
        }
      });
    } else {
      const option = options.find((option) => option.props.value === value);

      if (option) {
        selection.push({
          label: option.props.label,
          value: option.props.value,
        });
      }
    }

    setSelected(selection);
  }, []);

  return (
    <div
      className={joinClassNames(styles.root)}
      ref={ref}
      onBlur={() => console.log("blur root")}
    >
      <div className={styles.header}>
        <div className={styles.headerInner}>
          {selected.length > 0 && (
            <>
              {multiple ? (
                <>
                  {selected.map(({ label, value }) => (
                    <Tag
                      children={label}
                      className={typography.eta}
                      onRemove={() =>
                        setSelected([...removeValue(value, selected)])
                      }
                    />
                  ))}
                </>
              ) : (
                <span className={typography.eta}>{selected[0].label}</span>
              )}
            </>
          )}

          <div className={joinClassNames(styles.search, typography.eta)}>
            <input
              placeholder={`search ${options.length} options…`}
              onFocus={() => setFocused(true)}
              className={styles.searchInput}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />

            {/*{search.length > 0 && (
                            <span className={styles.clearSearchButton} onClick={() => setSearch("")}><Close/></span>
                        )}*/}
          </div>
        </div>

        {selected.length > 0 && clearable && (
          <span
            className={joinClassNames(typography.eta, styles.clearButton)}
            onClick={() => setSelected([])}
          >
            Clear
          </span>
        )}
      </div>

      <ul
        className={styles.options}
        style={{
          display: focused ? "block" : "none",
        }}
      >
        {options}
      </ul>
    </div>
  );
}

function Option({ value, label, children, onSelect, isSelected }) {
  return (
    <li
      onClick={() => onSelect({ value, label })}
      className={joinClassNames(
        styles.option,
        typography.eta,
        isSelected ? styles.isSelectedOption : null
      )}
    >
      {children}
      <span className={styles.label}>{label}</span>
      {isSelected && <span className={styles.optionIndicator}>·</span>}
    </li>
  );
}

export { Select, StyledSelect, Option };
