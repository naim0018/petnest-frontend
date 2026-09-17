const WorkInProgress = ({ title }: { title: string }) => {
  return (
    <div className="w-full h-[70vh] flex items-center justify-center px-6">
      <h1 className="font-black uppercase text-center leading-tight tracking-widest text-2xl sm:text-4xl md:text-6xl lg:text-7xl text-slate-300 dark:text-slate-700 select-none">
        {title}
      </h1>
    </div>
  );
};

export default WorkInProgress;
