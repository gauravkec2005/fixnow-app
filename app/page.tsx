<div style={styles.availabilityCard}>
  <h2>Live Contractor Supply</h2>

  {/* NOW */}
  <h3>🟢 Available Now ({availability?.now.count})</h3>
  <p>
    {availability?.now.types?.length
      ? availability.now.types.join(" · ")
      : "No contractors"}
  </p>

  {/* FEW HOURS */}
  <h3>🟡 In a few hours ({availability?.fewHours.count})</h3>
  <p>
    {availability?.fewHours.types?.length
      ? availability.fewHours.types.join(" · ")
      : "No contractors"}
  </p>

  {/* TODAY */}
  <h3>🔵 Later today ({availability?.today.count})</h3>
  <p>
    {availability?.today.types?.length
      ? availability.today.types.join(" · ")
      : "No contractors"}
  </p>

  <p style={styles.smallText}>
    Total contractors: {availability?.total}
  </p>
</div>