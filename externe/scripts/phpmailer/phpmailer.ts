
export async function phpmailerOnSubmit(event: Event) {
    event.preventDefault()

    const element = event.target as HTMLFormElement
    if (!element) return

    const 
        body    = new FormData(element),
        method  = element.getAttribute('method') || 'POST',
        action  = element.getAttribute('action') || '/php/mail.php'

    try {
        const res = await fetch(action, {
            method,
            body
        })

        if (!res.ok) {
            console.warn(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        
        if (data.status === 'error') {
            console.warn('Server warning:', data.error || 'Unknown server error')
        }
        else console.log('Server response:', data)
    } catch (err) {
        console.warn('Fetch or JSON error:', err)
    }
}
