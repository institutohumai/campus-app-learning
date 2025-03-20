import Tooltip from '../SharedComponents/Tooltip/Tooltip';
import './SubmitButton.css';


export const SubmitButton = ({handleSubmit, disabled, text = "Enviar", tooltipText, showTooltip})=> {
return (
  <button 
    className="submit-button"
    onClick={handleSubmit}
    disabled={disabled}
  >
    {text}
    {(tooltipText) && 
    <Tooltip
      text={tooltipText}
      isVisible={disabled && showTooltip}
      alignment='center'
    />
    }
  </button>
)
}