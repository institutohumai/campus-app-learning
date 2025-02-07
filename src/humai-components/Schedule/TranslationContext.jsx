// TranslationContext.js
import React, { createContext, useContext, useEffect, useCallback } from 'react'

const TranslationContext = createContext({
    translateDaysToSpanish: text => text,
    translateDOM: () => {},
})

const dayNamesEnToEs = {
    Sunday: 'L',
    Monday: 'M',
    Tuesday: 'M',
    Wednesday: 'J',
    Thursday: 'V',
    Friday: 'S',
    Saturday: 'D',
}

const translateDaysToSpanish = text => {
    return text.replace(
        /\b(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\b/g,
        matched => dayNamesEnToEs[matched],
    )
}

const translateTextNodes = node => {
    if (node.nodeType === 3) {
        // Text node
        node.nodeValue = translateDaysToSpanish(node.nodeValue)
    } else if (node.nodeType === 1) {
        // Element node
        Array.from(node.childNodes).forEach(child => translateTextNodes(child))
    }
}

const TranslationProvider = ({ children }) => {
    const translateDOM = useCallback(() => {
        translateTextNodes(document.body)
    }, [])

    useEffect(() => {
        const observer = new MutationObserver(() => {
            translateDOM()
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        })

        return () => observer.disconnect()
    }, [translateDOM])

    return (
        <TranslationContext.Provider
            value={{ translateDaysToSpanish, translateDOM }}>
            {children}
        </TranslationContext.Provider>
    )
}

export const useTranslation = () => useContext(TranslationContext)

export default TranslationProvider
