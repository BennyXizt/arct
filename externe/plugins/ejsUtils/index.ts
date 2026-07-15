import { SetupComponent } from "./types/plugin.interface"

export const externe = {
    setupEJSComponent
}

function setupEJSComponent(component: SetupComponent) {
    let 
        thisClass = component.componentName,
	    blockClass = thisClass
	if(typeof component.block !== 'undefined' && component.block)
        blockClass = component.block
	

	if(typeof component.parent !== 'undefined' && component.parent)
        thisClass = `${component.parent}__${thisClass} ${blockClass}`
    else if(typeof component.class !== 'undefined' && component.class) {
		if(typeof component.class === 'string') 
            thisClass = `${component.class} ${blockClass}`
        else if(typeof component.class === 'object') 
            thisClass = `${component.class.join(' ')} ${blockClass}`
	} 
    else thisClass = blockClass

	let thisID = ''
	if(typeof component.id !== 'undefined' && component.id) {
		if(typeof component.id === 'string') 
            thisID = `id='${component.id}'`
		else if(typeof component.id === 'object') 
            thisID = `id='${component.id.join(' ')}'`
	}

	let thisTag = 'div'
	if(typeof component.tag !== 'undefined' && component.tag)
        thisTag = component.tag

	let thisStyles = undefined
	if(typeof component.style !== 'undefined' && component.style) {
		if(typeof component.style === 'string') 
            thisStyles = `style='${component.style}'`
        else if(typeof component.style === 'object') 
            thisStyles = `style='${component.style.join(' ')}'`
	}

	let thisDataAttributes = ''
	if(typeof component.dataAttribute !== 'undefined' && component.dataAttribute) {
		if(typeof component.dataAttribute === 'string')
		    thisDataAttributes += ' ' + component.dataAttribute
		else if(typeof component.dataAttribute === 'object')
		    thisDataAttributes += ' ' + component.dataAttribute.join(' ')
	}
	
    return {blockClass, thisClass, thisID, thisTag, thisStyles, thisDataAttributes}
}