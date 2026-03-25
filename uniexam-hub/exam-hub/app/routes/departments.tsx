export default function Departments() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-primary">Departments</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {["Medicine", "Computer Science", "Engineering", "Architecture", "Natural Sciences", "Social Sciences"].map((dept) => (
          <div key={dept} className="p-8 rounded-2xl border bg-card flex items-center justify-center text-center font-bold hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer">
            {dept}
          </div>
        ))}
      </div>
    </div>
  )
}
