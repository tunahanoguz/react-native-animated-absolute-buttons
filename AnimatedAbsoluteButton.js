import React, {Fragment, useState, useEffect} from 'react';
import {Animated, Easing} from 'react-native';
import PropTypes from 'prop-types';
import styled, {css} from 'styled-components';

const AnimatedAbsoluteButton = ({buttonSize, buttonColor, buttonShape, buttonContent, direction, position, positionVerticalMargin, positionHorizontalMargin, time, easing, buttons}) => {
    const [isOpen, setIsOpen] = useState(false);

    const [animatedValues, setAnimatedValues] = useState([]);
    const [toValues, setToValues] = useState([]);
    const [animations, setAnimations] = useState([]);

    useEffect(() => {
        setAnimValues();
        setVals();
    }, []);

    useEffect(() => {
        if (animatedValues.length !== 0) {
            setAnimations([]);
            setAnims();
        }
    }, [animatedValues, isOpen]);

    const setAnimValues = () => {
        for (let i = 0; i < buttons.length; i++) {
            setAnimatedValues(value => [...value, new Animated.Value(0)]);
        }
    };

    const setVals = () => {
        for (let i = 0; i < buttons.length; i++) {
            if (direction === 'top') {
                setToValues(value => [...value, i === 0 ? -(buttonSize + positionVerticalMargin) : -positionVerticalMargin * (i + 1) - buttonSize * (i + 1)]);
            } else if (direction === 'bottom') {
                setToValues(value => [...value, i === 0 ? (buttonSize + positionHorizontalMargin) : positionHorizontalMargin * (i + 1) + buttonSize * (i + 1)]);
            } else if (direction === 'left') {
                setToValues(value => [...value, i === 0 ? -(buttonSize + positionHorizontalMargin) : -positionHorizontalMargin * (i + 1) - buttonSize * (i + 1)]);
            } else if (direction === 'right') {
                setToValues(value => [...value, i === 0 ? (buttonSize + positionHorizontalMargin) : positionHorizontalMargin * (i + 1) + buttonSize * (i + 1)]);
            }
        }
    };

    const setAnims = () => {
        for (let i = 0; i < buttons.length; i++) {
            setAnimations(value => [...value, Animated.timing(animatedValues[i], {
                toValue: isOpen ? 0 : toValues[i],
                duration: time,
                easing: Easing[easing],
                useNativeDriver: true,
            })]);
        }
    };

    const runAnimations = () => {
        setIsOpen(!isOpen);
        Animated.parallel(animations).start();
    };

    const style = (index) => {
        if (direction === 'top' || direction === 'bottom') {
            return {
                transform: [{translateY: animatedValues.length !== 0 ? animatedValues[index] : new Animated.Value(0)}],
            };
        } else {
            return {
                transform: [{translateX: animatedValues.length !== 0 ? animatedValues[index] : new Animated.Value(0)}],
            };
        }
    };

    return (
        <Fragment>
        {buttons.map((button, index) => {
            return (
                <Button
                    key={index}
                    size={buttonSize}
                    color={button.color}
                    shape={buttonShape}
                    style={style(index)}
                    onPress={() => button.action()}
                    position={position}
                    positionVerticalMargin={positionVerticalMargin}
                    positionHorizontalMargin={positionHorizontalMargin}
                >
                    {button.content}
                </Button>
            );
        })}

        <Button
            size={buttonSize}
            color={buttonColor}
            shape={buttonShape}
            onPress={() => runAnimations()}
            position={position}
            positionVerticalMargin={positionVerticalMargin}
            positionHorizontalMargin={positionHorizontalMargin}
            activeOpacity={0.6}
        >
            {buttonContent}
        </Button>
    </Fragment>
);
};

const Button = styled.TouchableOpacity`
    width: ${({size}) => size}px;
    height: ${({size}) => size}px;
    justify-content: center;
    align-items: center;
    position: absolute;
    background-color: ${({color}) => color};
    ${({shape}) => shape === 'circular' && css`
        border-radius: 100px;
    `};
    ${({shape}) => shape === 'rounded' && css`
        border-radius: 15px;
    `};
    ${({shape}) => shape === 'square' && css`
        border-radius: 0;
    `};
    ${({position}) => position === 'top-left' && css`
        top: ${({positionVerticalMargin}) => positionVerticalMargin}px;
        left: ${({positionHorizontalMargin}) => positionHorizontalMargin}px;
    `};
    ${({position}) => position === 'top-right' && css`
        top: ${({positionVerticalMargin}) => positionVerticalMargin}px;
        right: ${({positionHorizontalMargin}) => positionHorizontalMargin}px;
    `};
    ${({position}) => position === 'bottom-left' && css`
        bottom: ${({positionVerticalMargin}) => positionVerticalMargin}px;
        left: ${({positionHorizontalMargin}) => positionHorizontalMargin}px;
    `};
    ${({position}) => position === 'bottom-right' && css`
        bottom: ${({positionVerticalMargin}) => positionVerticalMargin}px;
        right: ${({positionHorizontalMargin}) => positionHorizontalMargin}px;
    `};
`;

AnimatedAbsoluteButton.defaultProps = {
    buttonSize: 50,
    buttonColor: 'indigo',
    buttonShape: 'circular',
    direction: 'top',
    position: 'bottom-right',
    positionVerticalMargin: 10,
    positionHorizontalMargin: 10,
    time: 500,
    easing: 'linear',
};

AnimatedAbsoluteButton.propTypes = {
    buttonSize: PropTypes.number,
    buttonColor: PropTypes.string,
    buttonShape: PropTypes.string,
    buttonContent: PropTypes.any.isRequired,
    direction: PropTypes.string,
    position: PropTypes.string,
    positionVerticalMargin: PropTypes.number,
    positionHorizontalMargin: PropTypes.number,
    time: PropTypes.number,
    easing: PropTypes.string,
    buttons: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string.isRequired,
        content: PropTypes.any.isRequired,
        action: PropTypes.func.isRequired,
    })).isRequired,
};

export default AnimatedAbsoluteButton;
