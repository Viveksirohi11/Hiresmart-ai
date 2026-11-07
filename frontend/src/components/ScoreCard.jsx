export default function ScoreCard({ score }) {
  const color = score >= 75 ? "#16a36a" : score >= 50 ? "#d58a16" : "#dc5252";
  return <div className="card p-6 text-center">
    <p className="text-sm text-slate-500 font-semibold">Estimated match</p>
    <div className="mx-auto my-4 grid h-36 w-36 place-items-center rounded-full" style={{background:`conic-gradient(${color} ${score*3.6}deg, #edf0f5 0deg)`}}>
      <div className="grid h-28 w-28 place-items-center rounded-full bg-white"><span className="text-4xl font-bold" style={{color}}>{score}%</span></div>
    </div>
    <p className="text-xs text-slate-500">AI-generated estimate, not an ATS score.</p>
  </div>;
}
