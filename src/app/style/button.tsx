import styled from "styled-components";

export const StyledButton = styled.button<{$theme: "gray" | "blue"}>`
    background-color: ${
        props => props.$theme == "gray" ? 
            "gray" : "blue"
    };

    min-width: 50px;
    height: 30px;
    padding: 5px;
    margin: 3px;
    &:hover {
        opacity: 0.8;
    }
`