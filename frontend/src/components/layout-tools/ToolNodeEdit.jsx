import React, { useState, useEffect, memo } from "react";
import { useRecoilState } from "recoil";

// styling:
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";

// custom hooks:
import useRepeatLongPress from "../../hooks/useRepeatLongPress";

// styles:
import {
  ToolContainer,
  RotateCWControl,
  RotateCCWControl,
  Shape,
  IncreaseSize,
  DecreaseSize,
  HiddenHack,
  LabelInput,
} from "./ToolStyles";

import { ReactComponent as CircleShape } from "../../assets/shapes/circle.svg";
import { ReactComponent as HalfCircleShape } from "../../assets/shapes/half-circle.svg";
import { ReactComponent as TriangleShape } from "../../assets/shapes/triangle.svg";
import { ReactComponent as SquareShape } from "../../assets/shapes/square.svg";
import { ReactComponent as RectangleShape } from "../../assets/shapes/rectangle.svg";
import { ReactComponent as LshapeShape } from "../../assets/shapes/lshape.svg";

// icons:
import { BiRotateLeft, BiRotateRight } from "react-icons/bi";
import { MdAddCircleOutline, MdRemoveCircleOutline } from "react-icons/md";

// Node states and defaults:
import { FloorMapItems, DEFAULT_NODE_DATA } from "../../recoil/FloorMapItems";

const ToolNode = memo(
  ({
    id,
    type = "square",
    selected,
    data = DEFAULT_NODE_DATA,
    mode = "normal",
    info,
    rotateUnit = 15,
    sizeUnit = 20,
    shape = TriangleShape,
    ...props
  }) => {
    const [rotateAngle, setRotateAngle] = useState(data.rotateAngle);
    const [size, setSize] = useState(data.size);
    const [label, setLabel] = useState(data.label);
    const [items, setItems] = useRecoilState(FloorMapItems);

    useEffect(() => {
      // console.log("ToolNodeChanged", id, type, rotateAngle, data.rotateAngle);
    }, [rotateAngle, size, label]);

    // // partial data update
    // const updateNodeData = (dataUpdate) => {
    //   const deleteIndex = items.findIndex((item, i) => item.id === id);
    //   if (deleteIndex > -1) {
    //     const itemCopy = items[deleteIndex];

    //     const updatedItem = {
    //       ...itemCopy,
    //       data: { ...itemCopy.data, ...dataUpdate },
    //     };

    //     const updatedItems = [
    //       ...items.slice(0, deleteIndex),
    //       ...items.slice(deleteIndex + 1, items.length),
    //       updatedItem,
    //     ];
    //     setItems(updatedItems);
    //   }
    // };

    const updateNodeData = () => {
      const deleteIndex = items.findIndex((item, i) => item.id === id);

      if (deleteIndex > -1) {
        const itemCopy = items[deleteIndex];

        const updatedItem = {
          ...itemCopy,
          data: { ...itemCopy.data, rotateAngle, size, label },
        };

        const updatedItems = [
          ...items.slice(0, deleteIndex),
          ...items.slice(deleteIndex + 1, items.length),
          updatedItem,
        ];

        setItems(updatedItems);
      }
    };

    useEffect(() => {
      updateNodeData();
    }, [selected]);

    // useEffect(() => {
    //   updateNodeData();
    // }, [rotateAngle, size, label]);

    const rotateCW = () => {
      const newValue = rotateAngle + rotateUnit;
      setRotateAngle(newValue);
      // updateNodeData({ rotateAngle: newValue });
    };

    const rotateCCW = () => {
      const newValue = rotateAngle - rotateUnit;
      setRotateAngle(newValue);
      // updateNodeData({ rotateAngle: newValue });
    };

    const increaseSize = () => {
      const { height, width } = size;
      const newValue = { height: height + sizeUnit, width: width + sizeUnit };
      setSize(newValue);
      // updateNodeData({ size: newValue });
    };

    const decreaseSize = () => {
      const { height, width } = size;
      const newValue = { height: height - sizeUnit, width: width - sizeUnit };
      setSize(newValue);
      // updateNodeData({ size: newValue });
    };

    const cwLongPressAction = useRepeatLongPress(rotateCW, 200);
    const ccwLongPressAction = useRepeatLongPress(rotateCCW, 200);
    const increaseSizePressActions = useRepeatLongPress(increaseSize, 200);
    const decreaseSizePressActions = useRepeatLongPress(decreaseSize, 200);

    return (
      <ToolContainer {...props}>
        {/* <Shape size={size} rotateAngle={rotateAngle} type={type} info={info} /> */}
        <Shape
          className="shape"
          size={size}
          rotateAngle={rotateAngle}
          type={type}
          // info={info}
        >
          {React.createElement(shape)}
        </Shape>
        <LabelInput
          type="text"
          shapeType={type}
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
          }}
        />
        <HiddenHack selected={selected}>
          <IncreaseSize {...increaseSizePressActions}>
            <MdAddCircleOutline />
          </IncreaseSize>
          <DecreaseSize {...decreaseSizePressActions}>
            <MdRemoveCircleOutline />
          </DecreaseSize>
          <RotateCWControl {...cwLongPressAction}>
            <BiRotateRight />
          </RotateCWControl>
          <RotateCCWControl {...ccwLongPressAction}>
            <BiRotateLeft />
          </RotateCCWControl>
        </HiddenHack>
      </ToolContainer>
    );
  }
);

const Square = ({ selected, ...props }) => {
  return (
    <ToolNode
      {...props}
      selected={selected}
      shape={SquareShape}
      type="square"
    ></ToolNode>
  );
};

const Circle = ({ selected, ...props }) => {
  return (
    <ToolNode
      {...props}
      selected={selected}
      shape={CircleShape}
      type="circle"
    ></ToolNode>
  );
};

const HalfCircle = ({ selected, ...props }) => {
  return (
    <ToolNode
      {...props}
      selected={selected}
      shape={HalfCircleShape}
      type="halfCircle"
    ></ToolNode>
  );
};

const Lshape = ({ selected, ...props }) => {
  return (
    <ToolNode
      {...props}
      selected={selected}
      shape={LshapeShape}
      type="lshape"
    ></ToolNode>
  );
};

const Rectangle = ({ selected, ...props }) => {
  return (
    <ToolNode
      {...props}
      selected={selected}
      shape={RectangleShape}
      type="rectangle"
    ></ToolNode>
  );
};

const Triangle = ({ selected, ...props }) => {
  return (
    <ToolNode
      {...props}
      selected={selected}
      shape={TriangleShape}
      type="triangle"
    ></ToolNode>
  );
};

export default ToolNode;
export { Square, Circle, HalfCircle, Lshape, Rectangle, Triangle };
