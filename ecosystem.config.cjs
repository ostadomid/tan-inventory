   module.exports = {
     apps: [
       {
         name: "Inventory",
         // خروجی پیش‌فرض TanStack Start (Vinxi/Nitro)
         script: "./.output/server/index.mjs",
         instances: "2",        // یا تعداد هسته‌های CPU دلخواه برای اجرای Cluster
         exec_mode: "fork",    // استفاده از تمام هسته‌ها
         autorestart: true,       // ریستارت خودکار در صورت کرش
         watch: false,            // در پروداکشن غیرفعال باشد
         max_memory_restart: "1G",// ریستارت در صورت نشت حافظه بیش از 1 گیگابایت
         env: {
           NODE_ENV: "production",
           PORT: 3000,
           HOST: "0.0.0.0",
         },
       },
     ],
   };
