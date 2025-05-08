'use client';

export default function DebugStylesPage() {
  const containerStyle = {
    padding: '32px',
  };
  
  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: '16px',
  };
  
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    maxWidth: '500px',
    margin: '0 auto',
  };
  
  const subheadingStyle = {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    textAlign: 'center' as const,
  };
  
  const paragraphStyle = {
    color: '#4b5563',
    marginBottom: '16px',
  };
  
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  };
  
  const box1Style = {
    backgroundColor: '#dbeafe',
    padding: '16px',
    borderRadius: '8px',
    textAlign: 'center' as const,
  };
  
  const box2Style = {
    backgroundColor: '#d1fae5',
    padding: '16px',
    borderRadius: '8px',
    textAlign: 'center' as const,
  };
  
  const buttonStyle = {
    marginTop: '16px',
    width: '100%',
    padding: '8px',
    backgroundColor: '#8b5cf6',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
  };
  
  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Debug Styles Page</h1>
      
      <div style={cardStyle}>
        <h2 style={subheadingStyle}>This is a test component with inline styles</h2>
        <p style={paragraphStyle}>
          If you can see this with proper styling, inline styles are working correctly.
        </p>
        <div style={gridStyle}>
          <div style={box1Style}>Box 1</div>
          <div style={box2Style}>Box 2</div>
        </div>
        <button style={buttonStyle}>
          Test Button
        </button>
      </div>
    </div>
  );
} 