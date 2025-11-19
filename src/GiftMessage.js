import { useState } from "react";

const GiftMessage = () =>{

    const [form, setForm] = useState({
        name: '',
        occasion: '',
        details: ''
    });

    const [result, setResult] = useState(''); // Added this state to hold generated message
    
    // Handle input value changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', form);
        // You can call API here to generate gift message & image
        try{
            const response = await fetch("http://localhost:8080/giftMessage/sendmessage",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await response.json();
            // Display the generated message
            setResult(data.generatedMessage);
        }catch(error){
            console.error("Error sending message:", error);
            alert("Message failed");
        }
    };
    return(
        <>
        <form onSubmit={handleSubmit} style={{ maxWidth: '350px', margin: '0 auto', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
            <h2>Gift Ordering Form</h2>
            <div>
                 <label>Name:</label><br />
                    <input type="text" name="name" value={form.name} onChange={handleChange} required
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
            </div>
            <div>
                <label>Occasion:</label><br />
                    <input type="text" name="occasion" value={form.occasion} onChange={handleChange} required
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
            </div>
            <div>
                <label>Additional Details:</label><br />
                    <textarea name="details" value={form.details} onChange={handleChange} rows={3}
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
            </div>
                <button type="submit" style={{ width: '100%', padding: '8px 0', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>Submit
                </button>
        </form>

        {result && (
        <div style={{ maxWidth: '350px', margin: '20px auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Generated Message:</h3>
          <p>{result}</p>
        </div>
      )}
    </>
    );
};
export default GiftMessage;