import styled from "styled-components";

export const StyledButton = styled.button`
    min-width: 50px;
    height: 30px;
    padding: 5px;
    margin: 3px;
    &:hover {
        opacity: 0.8;
    }
    background-color: ${props => props.theme["press-input"]};
`

export const StyleOption = styled.option`
    background-color: ${props => props.theme["press-input"]};
    &:hover {
        opacity: 0.8;
    }
    color: red;
`