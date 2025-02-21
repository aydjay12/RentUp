import { XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import styles from "./PurchaseCancelPage.module.scss";

const PurchaseCancelPage = () => {
	return (
		<div className={styles.container}>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className={styles.card}
			>
				<div className={styles.iconWrapper}>
					<XCircle className={styles.icon} />
				</div>
				<h1 className={styles.title}>Purchase Cancelled</h1>
				<p className={styles.text}>Your order has been cancelled. No charges have been made.</p>

				<div className={styles.infoBox}>
					<p className={styles.infoText}>
						If you encountered any issues during the checkout process, please don&apos;t hesitate to contact
						our support team.
					</p>
				</div>

				<div className={styles.actions}>
					<Link to={"/"} className={styles.returnButton}>
						<ArrowLeft size={18} className={styles.buttonIcon} />
						Return
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default PurchaseCancelPage;
