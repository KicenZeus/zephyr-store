export default function PaymentAccordion({ methods, openSection, setOpenSection, selectedPayment, setSelectedPayment }) {
  return (
    <section className="bg-[#18181b] border border-white/5 rounded-[2.5rem] overflow-hidden">
      <div className="bg-[#27272a] px-8 py-5 flex items-center gap-4">
        <span className="w-8 h-8 bg-primary text-black rounded-xl flex items-center justify-center font-black text-sm">3</span>
        <h2 className="text-sm font-black uppercase tracking-widest">Pembayaran</h2>
      </div>
      <div className="p-4 space-y-2">
        {methods.map((group) => (
          <div key={group.category} className="border border-white/5 rounded-[2rem] overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === group.category ? null : group.category)}
              className="w-full p-5 flex justify-between items-center bg-zinc-900/50"
            >
              <span className="text-[10px] font-black uppercase">{group.label}</span>
              <span className={openSection === group.category ? "rotate-180" : ""}>▼</span>
            </button>
            {openSection === group.category && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2 bg-zinc-900/20">
                {group.options.map((pay) => (
                  <button
                    key={pay.id}
                    onClick={() => setSelectedPayment(pay.id)}
                    className={`p-4 rounded-2xl border text-left flex justify-between items-center ${
                      selectedPayment === pay.id ? "border-primary bg-primary/5" : "border-white/5"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase">{pay.name}</span>
                    {selectedPayment === pay.id && <span className="w-2 h-2 bg-primary rounded-full" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}