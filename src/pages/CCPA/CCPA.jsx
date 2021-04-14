import React from 'react'

export default function CCPA() {
    React.useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (
        <div style={{background: 'transparent', padding: '10%', fontSize: '28px', lineHeight: '40px', minHeight: '100vh', fontFamily: 'Avenir Next'}}>
            <h1 style={{fontSize: '24px', color: 'white', textAlign: 'center', marginBottom: 50}}>CCPA Notice</h1>
            <p>All companies that serve California residents and have at least $25 million in annual revenue must comply with the law. In addition, companies of any size that have personal data on at least 50,000 people or that collect more than half of their revenues from the sale of personal data, also fall under the law. Companies don't have to be based in California or have a physical presence there to fall under the law. They don't even have to be based in the United States.</p>
 
<p>An amendment made in April exempts “insurance institutions, agents, and support organizations” as they are already subject to similar regulations under California’s Insurance Information and Privacy Protection Act (IIPPA).</p>
        </div>
    )
}
