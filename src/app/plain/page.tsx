export default function PlainPage() {
  return (
    <div style={{
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '16px',
        color: '#4B5563'
      }}>
        Plain Page - No Tailwind
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        marginBottom: '20px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '12px',
          color: '#1F2937'
        }}>
          Welcome to Briefly
        </h2>
        <p style={{
          color: '#6B7280',
          marginBottom: '16px',
          lineHeight: 1.6
        }}>
          This is a test page to see if styles are working properly without Tailwind.
          If you can see proper styling on this page, then we know inline styles work.
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '16px'
        }}>
          <button style={{
            backgroundColor: '#4F46E5',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Test Button 1
          </button>
          <button style={{
            backgroundColor: 'white',
            color: '#4F46E5',
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #4F46E5',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Test Button 2
          </button>
        </div>
      </div>
    </div>
  );
} 