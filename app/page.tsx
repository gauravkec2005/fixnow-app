<div style={styles.availabilityCard}>
  <h2>Live Contractor Supply</h2>

  {availability ? (
    <>
      {/* AVAILABLE NOW */}
      <div style={styles.section}>
        <h3>🟢 Available Now</h3>
        <div style={styles.row}>
          <div style={styles.box}>🧰 Plumbers<br /><b>{availability.now.plumbers}</b></div>
          <div style={styles.box}>⚡ Electricians<br /><b>{availability.now.electricians}</b></div>
          <div style={styles.box}>❄️ HVAC<br /><b>{availability.now.hvac}</b></div>
          <div style={styles.box}>🔧 Handyman<br /><b>{availability.now.handyman}</b></div>
        </div>
      </div>

      {/* FEW HOURS */}
      <div style={styles.section}>
        <h3>🟡 In a few hours</h3>
        <div style={styles.row}>
          <div style={styles.box}>🧰 Plumbers<br /><b>{availability.fewHours.plumbers}</b></div>
          <div style={styles.box}>⚡ Electricians<br /><b>{availability.fewHours.electricians}</b></div>
          <div style={styles.box}>❄️ HVAC<br /><b>{availability.fewHours.hvac}</b></div>
          <div style={styles.box}>🔧 Handyman<br /><b>{availability.fewHours.handyman}</b></div>
        </div>
      </div>

      {/* LATER TODAY */}
      <div style={styles.section}>
        <h3>🔵 Later today</h3>
        <div style={styles.row}>
          <div style={styles.box}>🧰 Plumbers<br /><b>{availability.today.plumbers}</b></div>
          <div style={styles.box}>⚡ Electricians<br /><b>{availability.today.electricians}</b></div>
          <div style={styles.box}>❄️ HVAC<br /><b>{availability.today.hvac}</b></div>
          <div style={styles.box}>🔧 Handyman<br /><b>{availability.today.handyman}</b></div>
        </div>
      </div>

      {/* TOTAL */}
      <p style={styles.smallText}>
        Total contractors: <b>{availability.total}</b>
      </p>
    </>
  ) : (
    <p>Loading live supply...</p>
  )}
</div>